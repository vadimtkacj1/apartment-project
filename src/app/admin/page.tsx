'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dayjs from 'dayjs';

import { Button } from '@/components/shadcn/button';
import { toast } from '@/components/shadcn/sonner';
import { useAdminI18n, useAdminMessages } from '@/lib/adminI18n';
import { dashboardMessages } from '@/lib/adminI18n/messages/dashboard';
import { boardMessages } from '@/lib/adminI18n/messages/board';
import WidgetBoard from '@/components/admin/board/WidgetBoard';
import AddWidgetDialog from '@/components/admin/board/AddWidgetDialog';
import { BoardControls, BoardHint, BoardStyles } from '@/components/admin/board/BoardChrome';
import { useWidgetLayout } from '@/components/admin/board/useWidgetLayout';

import {
  DASHBOARD_WIDGETS,
  DASHBOARD_WIDGETS_BY_ID,
  NOTIFICATIONS_WIDGET_ID,
  TEAM_WIDGET_ID,
  computeMetrics,
  computePortfolio,
  formatLongDate,
  type DashboardContext,
  type NotificationRow,
  type PropertyRow,
  type SeriesPoint,
  type Summary,
  type TeamMemberRow,
} from './dashboard-widgets';

const LAYOUT_STORAGE_KEY = 'admin-dashboard-layout-v1';

/* ===== page ===== */
export default function AdminDashboard() {
  const t = useAdminMessages(dashboardMessages);
  const board = useAdminMessages(boardMessages);
  const { data: session } = useSession();
  const userName = (session?.user as { name?: string; username?: string } | undefined)?.name
    ?? (session?.user as { username?: string } | undefined)?.username;

  // Time-of-day greeting. Computed after mount (client clock) so SSR/CSR never
  // disagree; until then the header shows the neutral page title.
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? t.greetingMorning : h < 18 ? t.greetingAfternoon : t.greetingEvening);
  }, [t]);
  const { dir, locale } = useAdminI18n();
  const [props, setProps] = useState<PropertyRow[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [propsLoading, setPropsLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [team, setTeam] = useState<TeamMemberRow[] | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[] | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Board customisation: block order / width / visibility (persisted locally).
  const {
    visibleItems, hiddenWidgets, isCustomized,
    moveWidget, setSpan, hideWidget, addWidget, resetLayout,
  } = useWidgetLayout(LAYOUT_STORAGE_KEY, DASHBOARD_WIDGETS);
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/admin/properties');
        const data = r.ok ? await r.json() : [];
        if (alive) setProps(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setProps([]);
      } finally {
        if (alive) setPropsLoading(false);
      }
    })();
    (async () => {
      try {
        // Single call — the summary carries the sparkline series and today's
        // views, so the dashboard never pulls the full views/clicks tables.
        const s = await fetch('/api/analytics/track?type=summary');
        if (alive && s.ok) setSummary(await s.json());
      } catch {
        /* analytics optional — blocks degrade to calm empty states */
      } finally {
        if (alive) setTrafficLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // The team block is optional, so its fetch only happens once it is on the board.
  const teamOnBoard = useMemo(() => visibleItems.some((i) => i.id === TEAM_WIDGET_ID), [visibleItems]);
  useEffect(() => {
    if (!teamOnBoard || team !== null) return;
    let alive = true;
    setTeamLoading(true);
    (async () => {
      try {
        const r = await fetch('/api/admin/team');
        const data = r.ok ? await r.json() : [];
        if (alive) setTeam(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setTeam([]);
      } finally {
        if (alive) setTeamLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [teamOnBoard, team]);

  // Same deal for the activity feed — the team card's bubble reads from it too.
  const notificationsOnBoard = useMemo(
    () => visibleItems.some((i) => i.id === NOTIFICATIONS_WIDGET_ID || i.id === TEAM_WIDGET_ID),
    [visibleItems]
  );
  useEffect(() => {
    if (!notificationsOnBoard || notifications !== null) return;
    let alive = true;
    setNotificationsLoading(true);
    (async () => {
      try {
        const r = await fetch('/api/admin/notifications?limit=20');
        const data = r.ok ? await r.json() : [];
        if (alive) setNotifications(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setNotifications([]);
      } finally {
        if (alive) setNotificationsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [notificationsOnBoard, notifications]);

  const p = useMemo(() => props ?? [], [props]);
  const portfolio = useMemo(() => computePortfolio(p, t), [p, t]);

  const series = useMemo<SeriesPoint[]>(
    () => (summary?.dailySeries ?? []).map((d) => ({ date: dayjs(d.date).format('DD/MM'), views: d.views, clicks: d.clicks })),
    [summary],
  );
  const metrics = useMemo(() => computeMetrics(summary, series), [summary, series]);

  // Everything the blocks render from — they are pure functions of this.
  const widgetCtx: DashboardContext = useMemo(() => ({
    t, locale, dir, summary, propsLoading, trafficLoading, portfolio, series, metrics,
    team: team ?? [],
    teamLoading: teamLoading || (teamOnBoard && team === null),
    notifications: notifications ?? [],
    notificationsLoading: notificationsLoading || (notificationsOnBoard && notifications === null),
  }), [
    t, locale, dir, summary, propsLoading, trafficLoading, portfolio, series, metrics,
    team, teamLoading, teamOnBoard, notifications, notificationsLoading, notificationsOnBoard,
  ]);

  const handleHide = useCallback((id: string) => {
    hideWidget(id);
    const def = DASHBOARD_WIDGETS_BY_ID[id];
    if (def) toast.success(board.blockHidden(def.title(widgetCtx)));
  }, [hideWidget, board, widgetCtx]);

  const handleAdd = useCallback((id: string) => {
    addWidget(id);
    const def = DASHBOARD_WIDGETS_BY_ID[id];
    if (def) toast.success(board.blockAdded(def.title(widgetCtx)));
  }, [addWidget, board, widgetCtx]);

  const handleResetLayout = useCallback(() => {
    resetLayout();
    toast.success(board.layoutReset);
  }, [resetLayout, board]);

  /* ===== render ===== */
  return (
    <div className="estate-console">
      {/* ── Page header — plain, on page bg. Title + faint date; quick actions and
              the board's customise control sit at the inline-end. ── */}
      <header className="ec-pagehead">
        <div>
          <h1 className="ec-h1">
            {greeting ? (userName ? `${greeting}, ${userName}` : greeting) : t.pageTitle}
          </h1>
          <p className="ec-subtitle">{formatLongDate(dayjs(), t)} · {t.pageTitle}</p>
        </div>
        <div className="ec-quick">
          <BoardControls
            editing={editing}
            onEdit={() => setEditing(true)}
            onDone={() => setEditing(false)}
            onAdd={() => setPickerOpen(true)}
            onReset={handleResetLayout}
            canReset={isCustomized}
            labels={board}
          />
          {!editing && (
            <>
              <a href="/" target="_blank" rel="noopener" className="ec-quick-ghost">
                <ExternalLink className="size-4" aria-hidden="true" />
                {t.quickViewSite}
              </a>
              <Link href="/admin/properties/new" className="ec-quick-primary">
                <Plus className="size-4" aria-hidden="true" />
                {t.quickAddProperty}
              </Link>
            </>
          )}
        </div>
      </header>

      <div style={{ marginBlockStart: 24 }}>
        {editing && <BoardHint labels={board} />}

        {/* The board — order, width and visibility come from the layout store */}
        <WidgetBoard
          items={visibleItems}
          widgets={DASHBOARD_WIDGETS}
          ctx={widgetCtx}
          labels={board}
          editing={editing}
          rtl={dir === 'rtl'}
          onMove={moveWidget}
          onSpanChange={setSpan}
          onHide={handleHide}
        />

        {visibleItems.length === 0 && (
          <div className="ec-card" style={{ padding: 24, textAlign: 'center' }}>
            <p className="m-0 text-sm text-muted-foreground">{board.emptyBoard}</p>
            <Button type="button" className="mt-4" onClick={() => { setEditing(true); setPickerOpen(true); }}>
              <Plus className="size-4" />
              {board.addBlock}
            </Button>
          </div>
        )}
      </div>

      {/* Block picker */}
      <AddWidgetDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        hidden={hiddenWidgets}
        onAdd={handleAdd}
        ctx={widgetCtx}
        labels={board}
      />

      <BoardStyles />
      <DashboardStyles />
    </div>
  );
}

/* ===== scoped styles — tokens only (var(--…)); RTL logical properties throughout ===== */
function DashboardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
/* Page header */
.estate-console .ec-pagehead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.estate-console .ec-h1{font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-.01em;color:var(--text-ink);}
.estate-console .ec-subtitle{font-size:13px;line-height:1.4;color:var(--text-muted);margin-block-start:4px;}

/* Quick actions at the header's inline-end */
.estate-console .ec-quick{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.estate-console .ec-quick-primary,.estate-console .ec-quick-ghost{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 16px;border-radius:var(--r-control);font-size:13.5px;font-weight:600;line-height:1;text-decoration:none;transition:background-color .15s ease,border-color .15s ease,color .15s ease;white-space:nowrap;}
.estate-console .ec-quick-primary{background:var(--brand);color:#fff;}
.estate-console .ec-quick-primary:hover{background:var(--brand-deep,#2c3ea6);}
.estate-console .ec-quick-ghost{background:var(--surface);color:var(--text-soft,#333e66);border:1px solid var(--border);}
.estate-console .ec-quick-ghost:hover{border-color:rgba(53,74,196,.4);color:var(--brand);}
.estate-console .ec-kpi-tile .delta.ec-delta-flat{color:var(--text-muted);}

/* Focal hero — the one dark premium card on the light page (Runey cashflow-card move) */
.estate-console .ec-focal{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;background:#051150;border-radius:var(--r-hero);box-shadow:var(--shadow-hero);padding:22px 26px;}
.estate-console .ec-focal::after{content:"";position:absolute;inset-block-start:-60%;inset-inline-end:-8%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(85,148,241,.28) 0%,rgba(85,148,241,0) 70%);pointer-events:none;}
.estate-console .ec-focal-main{position:relative;z-index:1;min-width:0;}
.estate-console .ec-focal-label{display:block;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.55);}
.estate-console .ec-focal-value{display:block;font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1;color:#fff;margin-block-start:4px;font-variant-numeric:tabular-nums;}
.estate-console .ec-focal-sub{display:block;font-size:13px;color:rgba(255,255,255,.72);margin-block-start:8px;}
.estate-console .ec-focal-side{position:relative;z-index:1;display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
.estate-console .ec-focal-stats{display:flex;gap:26px;}
.estate-console .ec-focal-stats>div{display:flex;flex-direction:column;gap:3px;}
.estate-console .ec-focal-stats .fk{font-size:12px;color:rgba(255,255,255,.5);}
.estate-console .ec-focal-stats .fv{font-size:15px;font-weight:600;color:#fff;font-variant-numeric:tabular-nums;}
.estate-console .ec-focal-cta{display:inline-flex;align-items:center;gap:7px;background:#5594f1;color:#051150;font-weight:700;font-size:13px;line-height:1;padding:9px 16px;border-radius:var(--r-pill);text-decoration:none;white-space:nowrap;transition:filter .15s ease;}
.estate-console .ec-focal-cta:hover{filter:brightness(1.08);}
@media (max-width:640px){.estate-console .ec-focal-value{font-size:28px;}.estate-console .ec-focal-stats{gap:18px;}}

/* Cards — quiet by default (hairline + soft shadow); ONE hero variant */
.estate-console .ec-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-card);box-shadow:var(--shadow-card);}
.estate-console .ec-card--hero{border-radius:var(--r-hero);box-shadow:var(--shadow-hero);}
.estate-console .ec-card-head{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:18px 22px 0;}
.estate-console .ec-card--hero .ec-card-head{align-items:flex-start;}
.estate-console .ec-card-body{padding:22px;}
.estate-console .ec-card-subtitle{font-size:12.5px;line-height:1.4;color:var(--text-muted);margin-block-start:3px;}

/* Chart card tools (legend + link) + honest rate foot */
.estate-console .ec-chart-tools{display:inline-flex;align-items:center;gap:16px;flex-wrap:wrap;}
.estate-console .ec-spark-legend{display:inline-flex;align-items:center;gap:14px;font-size:12px;color:var(--text-muted);}
.estate-console .ec-legend-item{display:inline-flex;align-items:center;}
.estate-console .ec-chart-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-block-start:16px;padding-block-start:14px;border-block-start:1px solid var(--divider);font-size:12.5px;color:var(--text-muted);}

/* Composition — horizontal stacked bar (data marks keep brand) */
.estate-console .ec-splitbar{display:flex;block-size:12px;border-radius:6px;overflow:hidden;background:var(--surface-sunken);}
.estate-console .ec-bar-fill{block-size:100%;transition:inline-size .8s cubic-bezier(.22,1,.36,1);}
.estate-console .ec-dot{display:inline-block;inline-size:8px;block-size:8px;border-radius:50%;margin-inline-end:6px;vertical-align:middle;}
.estate-console .ec-comp-legend{display:inline-flex;align-items:center;color:var(--text-body);font-weight:600;font-size:13px;font-variant-numeric:tabular-nums;}
.estate-console .ec-typerow{display:flex;align-items:center;justify-content:space-between;padding-block:8px;border-block-end:1px solid var(--divider);}
.estate-console .ec-typerow:last-child{border-block-end:none;}
.estate-console .ec-typelabel{color:var(--text-body);font-size:13.5px;}
.estate-console .ec-countbadge{background:var(--surface-sunken);color:var(--text-body);font-weight:600;font-size:12.5px;min-inline-size:26px;text-align:center;padding:1px 9px;border-radius:var(--r-pill);font-variant-numeric:tabular-nums;}
.estate-console .ec-citychip{display:inline-flex;align-items:center;background:var(--surface-sunken);border:1px solid var(--divider);border-radius:var(--r-tile);padding:4px 10px;font-size:12.5px;color:var(--text-body);}

/* Rows (attention / listings) — full-bleed hover, hairline separators, no zebra */
.estate-console .ec-row{transition:background .15s ease;}
.estate-console .ec-row:hover{background:var(--surface-hover);}
.estate-console .ec-attrow{display:flex;align-items:center;gap:10px;padding:12px 22px;margin-inline:-22px;text-decoration:none;border-block-end:1px solid var(--divider);}
.estate-console .ec-attrow:last-child{border-block-end:none;}
.estate-console .ec-attdot{inline-size:9px;block-size:9px;border-radius:50%;flex-shrink:0;}
.estate-console .ec-attlabel{flex:1;font-size:14px;}
.estate-console .ec-att-count{background:var(--surface-sunken);color:var(--text-body);font-weight:600;font-size:12.5px;min-inline-size:24px;text-align:center;padding:2px 9px;border-radius:var(--r-pill);font-variant-numeric:tabular-nums;}
.estate-console .ec-att-clear{color:var(--text-muted);font-size:13px;}
.estate-console .ec-att-chev{color:var(--text-faint);opacity:0;flex-shrink:0;transition:opacity .15s ease;}
.estate-console .ec-attrow:hover .ec-att-chev,.estate-console .ec-attrow:focus-visible .ec-att-chev{opacity:1;}

/* Recent listings — calm 64px rows */
.estate-console .ec-listrow{display:flex;align-items:center;gap:14px;min-block-size:64px;padding:11px 22px;margin-inline:-22px;text-decoration:none;border-block-end:1px solid var(--divider);}
.estate-console .ec-listrow:last-child{border-block-end:none;}
.estate-console .ec-thumb{inline-size:56px;block-size:42px;border-radius:8px;object-fit:cover;flex-shrink:0;background:var(--surface-sunken);}
.estate-console .ec-thumb-empty{display:inline-flex;align-items:center;justify-content:center;background:var(--surface-sunken);}
.estate-console .ec-listtitle{font-weight:600;color:var(--text-ink);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.estate-console .ec-listmeta{font-size:12.5px;color:var(--text-muted);margin-block-start:2px;}
.estate-console .ec-listprice{font-weight:600;color:var(--text-ink);font-size:14px;font-variant-numeric:tabular-nums;}
.estate-console .ec-dealpill{font-size:11.5px;font-weight:600;padding:3px 11px;border-radius:var(--r-pill);white-space:nowrap;}
.estate-console .ec-dealpill.sale{background:var(--brand-tint);color:var(--brand);}
.estate-console .ec-dealpill.rent{background:#e8f1fe;color:#2f6fd0;}

/* Team preview — profile chips in a row, wrapping on narrow widths. The one
   highlighted member carries a notification bubble above the avatar. */
.estate-console .ec-team-row{display:flex;flex-wrap:wrap;gap:14px;}
.estate-console .ec-team-card{position:relative;flex:1 1 150px;min-inline-size:140px;max-inline-size:210px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:16px 12px 14px;border:1px solid var(--divider);border-radius:var(--r-card);background:var(--surface-sunken);transition:border-color .15s ease,box-shadow .15s ease;}
.estate-console .ec-team-card:hover{border-color:rgba(53,74,196,.35);box-shadow:var(--shadow-card);}
.estate-console .ec-team-card.is-highlight{margin-block-start:26px;border-color:rgba(53,74,196,.45);background:var(--brand-tint,#eef1fb);}
.estate-console .ec-team-avatar{inline-size:56px;block-size:56px;border-radius:50%;object-fit:cover;background:var(--surface);border:2px solid var(--surface);box-shadow:0 4px 12px -6px rgba(5,17,80,.35);}
.estate-console .ec-team-avatar--empty{display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:var(--brand);background:var(--brand-tint,#eef1fb);}
.estate-console .ec-team-name{font-size:13.5px;font-weight:600;color:var(--text-ink);max-inline-size:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.estate-console .ec-team-role{font-size:12px;color:var(--text-muted);max-inline-size:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.estate-console .ec-team-stats{font-size:11.5px;color:var(--text-faint,#8b93b5);font-variant-numeric:tabular-nums;}
.estate-console .ec-team-bubble{position:absolute;inset-block-start:-24px;inset-inline-start:50%;transform:translateX(-50%);max-inline-size:190px;padding:7px 11px;border-radius:12px;background:var(--surface);border:1px solid rgba(53,74,196,.25);box-shadow:0 10px 22px -12px rgba(5,17,80,.45);font-size:11.5px;font-weight:700;line-height:1.35;color:var(--brand);white-space:normal;}
.estate-console .ec-team-bubble::after{content:"";position:absolute;inset-block-end:-5px;inset-inline-start:50%;margin-inline-start:-5px;inline-size:9px;block-size:9px;background:var(--surface);border-inline-end:1px solid rgba(53,74,196,.25);border-block-end:1px solid rgba(53,74,196,.25);transform:rotate(45deg);}
[dir="rtl"] .estate-console .ec-team-bubble{transform:translateX(50%);}

/* Activity feed rows — unread carries a filled brand dot */
.estate-console .ec-noti-row{display:flex;align-items:center;gap:10px;padding-block:10px;border-block-end:1px solid var(--divider);}
.estate-console .ec-noti-row:last-child{border-block-end:none;}
.estate-console .ec-noti-dot{inline-size:8px;block-size:8px;border-radius:50%;flex-shrink:0;background:var(--text-faint,#8b93b5);}
.estate-console .ec-noti-dot.is-unread{background:var(--brand);box-shadow:0 0 0 3px rgba(53,74,196,.14);}
.estate-console .ec-noti-text{flex:1;min-width:0;font-size:13.5px;color:var(--text-body);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.estate-console .ec-noti-when{font-size:11.5px;color:var(--text-muted);white-space:nowrap;font-variant-numeric:tabular-nums;}

/* Links / CTAs — brand is allowed here */
.estate-console .ec-viewall{color:var(--brand);font-weight:600;font-size:13px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;}
.estate-console .ec-viewall:hover{color:var(--brand-hover);}

@media (prefers-reduced-motion: reduce){
  .estate-console .ec-bar-fill{transition:none;}
}
`,
      }}
    />
  );
}
