'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Hero background media. The <video> stays visible the whole time showing its
 * poster attribute, so the poster paints at ~FCP and settles LCP — hiding the
 * video behind opacity:0 (or an overlay img) makes its first visible frame,
 * seconds later, register as a new and much worse LCP.
 *
 * The video src is set at hydration rather than browser idle: the files are
 * small (0.2MB mobile / 0.9MB desktop), fetched at Low priority, and the
 * sooner the first frame paints the sooner LCP stops moving. (Lighthouse
 * measured idle-deferral pushing LCP from ~1.5s to 6–9s.)
 */
const HeroMedia: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;

    const tryPlay = () => {
      if (destroyed) return;
      video.muted = true;
      // If play fails (autoplay blocked, file missing), the poster simply stays.
      video.play().catch(() => {});
    };

    // The inline script below normally sets src at HTML parse time; this is
    // the fallback (e.g. client-side navigation, where the script doesn't run).
    if (!video.src) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      video.src = isMobile ? '/hero-mobile-v3.mp4' : '/hero-v3.mp4';
      video.load();
    }
    // Play as soon as the first frame is decodable (loadeddata / readyState 2),
    // not canplaythrough — that waits for ~the whole file to buffer, and the
    // first played frame is this page's LCP. The file is a tiny 5s loop, so a
    // mid-play stall is unlikely and harmless (it's a background ambiance).
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }

    return () => { destroyed = true; };
  }, []);

  return (
    <div className="hero-video-wrap">
      <video
        id="hero-bg-video"
        ref={videoRef}
        className="hero-video"
        loop
        muted
        playsInline
        preload="none"
        poster="/hero-poster.jpg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/* Kick off the video fetch at HTML parse time (~FCP) instead of at React
          hydration — the first video frame is this page's LCP, so every ms the
          fetch starts earlier moves LCP earlier. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var v=document.getElementById('hero-bg-video');if(!v||v.src)return;v.src=window.matchMedia('(max-width: 767px)').matches?'/hero-mobile-v3.mp4':'/hero-v3.mp4';v.load();})();",
        }}
      />
    </div>
  );
};

export default HeroMedia;
