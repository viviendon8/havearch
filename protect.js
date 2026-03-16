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
    // allow selection inside form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  /* ─── 4. Block keyboard shortcuts ─────────────────────────── */
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey; // metaKey for Mac Cmd
    if (
      (ctrl && (e.key === 's' || e.key === 'S')) || // Save
      (ctrl && (e.key === 'u' || e.key === 'U')) || // View Source
      (ctrl && (e.key === 'p' || e.key === 'P')) || // Print
      (ctrl && e.shiftKey && (e.key === 'i' || e.key === 'I')) || // DevTools
      (ctrl && e.shiftKey && (e.key === 'j' || e.key === 'J')) || // Console
      (ctrl && e.shiftKey && (e.key === 'c' || e.key === 'C')) || // Element picker
      e.key === 'F12'
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  /* ─── 5. Prevent copy of page content ─────────────────────── */
  document.addEventListener('copy', function (e) {
    e.preventDefault();
  });

  /* ─── 6. Transparent overlay on all project images ────────── */
  //  Adds an invisible div on top of every <img> inside content areas
  //  so right-click "Save Image As" targets the overlay, not the img.
  function addOverlays() {
    var imgs = document.querySelectorAll('img:not([data-no-protect]):not(.logo-img)');
    imgs.forEach(function (img) {
      if (img.dataset.protected) return;
      var parent = img.parentElement;
      // ensure parent is positioned
      var pos = getComputedStyle(parent).position;
      if (pos === 'static') parent.style.position = 'relative';
      var overlay = document.createElement('div');
      overlay.style.cssText =
        'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;' +
        'background:transparent;pointer-events:auto;cursor:default;';
      overlay.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      parent.insertBefore(overlay, img.nextSibling);
      img.dataset.protected = '1';
    });
  }

  /* ─── 7. Prevent video download via controls ──────────────── */
  function protectVideos() {
    var videos = document.querySelectorAll('video');
    videos.forEach(function (v) {
      v.setAttribute('controlslist', 'nodownload noplaybackrate');
      v.setAttribute('disablePictureInPicture', '');
      v.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
  }

  /* ─── 8. Global CSS injection ─────────────────────────────── */
  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = [
      '/* Content protection */',
      'img, video {',
      '  -webkit-user-select: none;',
      '  user-select: none;',
      '  -webkit-user-drag: none;',
      '  user-drag: none;',
      '  -webkit-touch-callout: none;', // iOS long-press
      '}',
      'body {',
      '  -webkit-user-select: none;',
      '  user-select: none;',
      '}',
      'input, textarea {',
      '  -webkit-user-select: text;',
      '  user-select: text;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ─── 9. Lazy-load images with referrer protection ────────── */
  function applyLazyLoad() {
    var imgs = document.querySelectorAll('img[src*="media.havearch.com"]');
    imgs.forEach(function (img) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('referrerpolicy')) {
        img.setAttribute('referrerpolicy', 'no-referrer');
      }
    });
  }

  /* ─── 10. Console warning ─────────────────────────────────── */
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

  /* ─── Init ────────────────────────────────────────────────── */
  injectCSS();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      addOverlays();
      protectVideos();
      applyLazyLoad();
    });
  } else {
    addOverlays();
    protectVideos();
    applyLazyLoad();
  }

  // Re-run for dynamically loaded content
  var observer = new MutationObserver(function () {
    addOverlays();
    protectVideos();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
