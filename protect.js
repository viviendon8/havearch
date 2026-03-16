/**
 * HAVE Architecture — Content Protection
 * Lightweight front-end deterrents for casual downloading/scraping.
 * Drop <script src="protect.js"></script> before </body> on every page.
 */
(function () {
  'use strict';

  /* ─── 1. Disable right-click context menu ─────────────────── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  /* ─── 2. Prevent drag-and-drop of images / videos ─────────── */
  document.addEventListener('dragstart', function (e) {
    var t = e.target.tagName;
    if (t === 'IMG' || t === 'VIDEO' || t === 'SOURCE') e.preventDefault();
  });

  /* ─── 3. Disable text / image selection ───────────────────── */
  document.addEventListener('selectstart', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  /* ─── 4. Block keyboard shortcuts ─────────────────────────── */
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey;
    if (
      (ctrl && (e.key === 's' || e.key === 'S')) ||
      (ctrl && (e.key === 'u' || e.key === 'U')) ||
      (ctrl && (e.key === 'p' || e.key === 'P')) ||
      (ctrl && e.shiftKey && (e.key === 'i' || e.key === 'I')) ||
      (ctrl && e.shiftKey && (e.key === 'j' || e.key === 'J')) ||
      (ctrl && e.shiftKey && (e.key === 'c' || e.key === 'C')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  /* ─── 5. CSS protection (no overlays, no interaction blocking) */
  var style = document.createElement('style');
  style.textContent = [
    'img, video {',
    '  -webkit-user-select: none;',
    '  user-select: none;',
    '  -webkit-user-drag: none;',
    '  user-drag: none;',
    '  -webkit-touch-callout: none;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  /* ─── 6. Prevent video download button ────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var videos = document.querySelectorAll('video');
    videos.forEach(function (v) {
      v.setAttribute('controlslist', 'nodownload noplaybackrate');
      v.setAttribute('disablePictureInPicture', '');
    });
  });

  /* ─── 7. Console warning ──────────────────────────────────── */
  if (typeof console !== 'undefined') {
    console.log(
      '%c⚠ HAVE Architecture',
      'font-size:20px;font-weight:bold;color:#111;'
    );
    console.log(
      '%cAll content is protected by copyright. Unauthorized use is prohibited.',
      'font-size:13px;color:#666;'
    );
  }

})();
