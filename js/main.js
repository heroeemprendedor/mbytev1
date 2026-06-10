(function(){
  'use strict';

  /* ── HAMBURGER + MOBILE NAV ── */
  var hamburger = document.querySelector('.hamburger');
  var overlay = document.querySelector('.mobile-nav-overlay');

  if (hamburger && overlay) {
    function open() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function(){
      overlay.classList.contains('open') ? close() : open();
    });

    overlay.addEventListener('click', function(e){
      if (e.target === overlay) close();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    // Close on nav link click
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', close);
    });
  }

  /* ── ANNOUNCEMENT BANNER ── */
  var banner = document.getElementById('announcementBanner');
  var closeBtn = document.getElementById('closeBanner');

  if (banner && closeBtn) {
    // Skip auto-close on direct child pages (don't show banner there)
    closeBtn.addEventListener('click', function(){
      banner.style.display = 'none';
      try { sessionStorage.setItem('mbyte_banner_closed', '1'); } catch(e){}
    });

    // Don't show if already closed this session
    try {
      if (sessionStorage.getItem('mbyte_banner_closed')) {
        banner.style.display = 'none';
      }
    } catch(e){}
  }

  /* ── INTRO PRESENTATION MODAL ── */
  var introModal = document.getElementById('introModal');
  var introPlayButton = document.getElementById('introPlayButton');
  var introFrame = document.getElementById('introPresentationFrame');

  if (introModal && introFrame) {
    var closeTriggers = introModal.querySelectorAll('[data-intro-close]');

    function openIntroModal() {
      introModal.classList.add('open');
      introModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeIntroModal() {
      introModal.classList.remove('open');
      introModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      try { sessionStorage.setItem('mbyte_intro_closed', '1'); } catch(e){}
      if (introFrame.contentWindow) {
        introFrame.contentWindow.postMessage({ type: 'mbyte:presentation-pause' }, window.location.origin);
      }
    }

    closeTriggers.forEach(function(trigger){
      trigger.addEventListener('click', closeIntroModal);
    });

    if (introPlayButton) {
      introPlayButton.addEventListener('click', function(){
        if (introFrame.contentWindow) {
          introFrame.contentWindow.postMessage({ type: 'mbyte:presentation-play' }, window.location.origin);
        }
      });
    }

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && introModal.classList.contains('open')) {
        closeIntroModal();
      }
    });

    try {
      if (!sessionStorage.getItem('mbyte_intro_closed')) {
        window.setTimeout(openIntroModal, 900);
      }
    } catch(e) {
      window.setTimeout(openIntroModal, 900);
    }
  }

})();
