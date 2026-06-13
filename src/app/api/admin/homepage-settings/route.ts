import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/require-admin';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'homepage-settings.json');

interface HomepageSettings {
  hotPropositionsMode: 'manual' | 'price';
  hotPropositionsMaxPrice?: number;
}

const DEFAULT_SETTINGS: HomepageSettings = {
  hotPropositionsMode: 'manual',
  hotPropositionsMaxPrice: undefined,
};

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readSettings(): Promise<HomepageSettings> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function writeSettings(settings: HomepageSettings): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading homepage settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();

    const settings: HomepageSettings = {
      hotPropositionsMode: body.hotPropositionsMode || 'manual',
      hotPropositionsMaxPrice: body.hotPropositionsMaxPrice,
    };

    await writeSettings(settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
