/* ============================================
   Bob Rohrman Collision Repair Center
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Actionable Top Bar ---
  (function enhanceTopBar() {
    const bar = document.querySelector('.top-bar');
    if (!bar) return;
    const container = bar.querySelector('.container');
    const left = bar.querySelector('.top-bar-left');
    const right = bar.querySelector('.top-bar-right');
    if (!container || !left) return;

    const telLink = left.querySelector('a[href^="tel:"]');
    const mapLink = left.querySelector('a[href*="maps.google"]');
    const telHref = telLink ? telLink.getAttribute('href') : 'tel:7654481100';
    const mapHref = mapLink ? mapLink.getAttribute('href') : 'https://maps.google.com/?q=3400+National+Drive+Lafayette+IN+47905';

    const actions = document.createElement('div');
    actions.className = 'top-bar-actions';
    actions.innerHTML =
      '<a href="' + telHref + '" class="top-bar-btn top-bar-btn-call" data-event="topbar_call">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
        '<span>Call</span>' +
      '</a>' +
      '<a href="' + mapHref + '" target="_blank" rel="noopener" class="top-bar-btn" data-event="topbar_directions">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
        '<span>Directions</span>' +
      '</a>' +
      '<button type="button" class="top-bar-btn top-bar-hours-toggle" aria-expanded="false" aria-controls="top-bar-hours-panel">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '<span>Hours</span>' +
        '<svg class="top-bar-hours-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 5 6 8 9 5"/></svg>' +
      '</button>' +
      '<div id="top-bar-hours-panel" class="top-bar-hours-panel" hidden>' +
        '<div class="hours-heading">Shop Hours</div>' +
        '<div class="hours-row"><strong>Mon &ndash; Thu</strong><span>7:30 AM &ndash; 5:00 PM</span></div>' +
        '<div class="hours-row"><strong>Friday</strong><span>7:30 AM &ndash; 6:00 PM</span></div>' +
        '<div class="hours-row"><strong>Sat &ndash; Sun</strong><span>Closed</span></div>' +
        '<div class="hours-note">Online photo estimates 24/7</div>' +
      '</div>';
    left.replaceWith(actions);

    const hoursBtn = actions.querySelector('.top-bar-hours-toggle');
    const hoursPanel = actions.querySelector('#top-bar-hours-panel');
    const closeHours = () => {
      hoursPanel.setAttribute('hidden', '');
      hoursBtn.setAttribute('aria-expanded', 'false');
    };
    hoursBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hoursPanel.hasAttribute('hidden')) {
        hoursPanel.removeAttribute('hidden');
        hoursBtn.setAttribute('aria-expanded', 'true');
      } else {
        closeHours();
      }
    });
    document.addEventListener('click', (e) => {
      if (!actions.contains(e.target)) closeHours();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHours();
    });

    if (right) {
      const langLink = right.querySelector('.lang-switch');
      if (langLink) {
        const txt = (langLink.textContent || '').trim().toLowerCase();
        const isOnSpanish = /english/.test(txt);
        const label = isOnSpanish ? 'English' : 'Espa\u00F1ol';
        langLink.innerHTML = '<span>' + label + '</span>';
      }
    }
  })();

  // --- CTA Cluster Enhancement: upgrade Estimate button, inject Call button ---
  (function enhanceCtaClusters() {
    const PHONE_HREF = 'tel:7654481100';
    const PHONE_DISPLAY = '(765) 448-1100';

    // Upgrade primary "24/7 Estimate" CTAs to extra-large
    document.querySelectorAll('a.btn, button.btn').forEach((el) => {
      const text = (el.textContent || '').trim();
      const looksLikeEstimate = /24\s*\/?\s*7/i.test(text) && /estimate|photo/i.test(text);
      const looksLikeFreeEstimate = /free.*estimate/i.test(text);
      if ((looksLikeEstimate || looksLikeFreeEstimate) && el.classList.contains('btn-lg')) {
        el.classList.add('btn-xl');
      }
    });

    // Abbreviate "Book Appointment" to "Appt" in the header so it fits next to the logo
    document.querySelectorAll('.header-ctas a.btn').forEach((el) => {
      const t = (el.textContent || '').trim();
      if (/book\s*appointment/i.test(t)) {
        const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
        textNodes.forEach(n => { n.textContent = ' Appt '; });
      }
    });

    // Inject a Call button into CTA clusters that promote Estimate or Book Appointment
    const clusterSelectors = ['.hero-ctas', '.header-ctas', '.mobile-nav-ctas', '.estimates-cta'];
    const callSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';

    document.querySelectorAll(clusterSelectors.join(',')).forEach((cluster) => {
      if (cluster.querySelector('[data-call-btn]')) return;
      const buttons = cluster.querySelectorAll('a.btn, button.btn');
      if (!buttons.length) return;
      const hasBookOrEstimate = Array.from(buttons).some((b) => {
        const t = (b.textContent || '').trim();
        return /book\s*appointment|estimate|submit photos|photo estimate/i.test(t);
      });
      if (!hasBookOrEstimate) return;

      const isHeader = cluster.classList.contains('header-ctas');
      const sizeClass = isHeader ? ' btn-sm' : '';
      const label = isHeader ? 'Call' : 'Call ' + PHONE_DISPLAY;

      const callBtn = document.createElement('a');
      callBtn.href = PHONE_HREF;
      callBtn.className = 'btn btn-call' + sizeClass;
      callBtn.setAttribute('data-call-btn', 'true');
      callBtn.setAttribute('data-event', 'cta_call');
      callBtn.innerHTML = callSvg + '<span>' + label + '</span>';
      cluster.appendChild(callBtn);
    });
  })();

  // --- Mobile Navigation ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Floating CTA Bar ---
  const floatingCta = document.querySelector('.floating-cta');
  if (floatingCta) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 600) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
      lastScroll = currentScroll;
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        const ans = faq.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Open clicked if wasn't active
      if (!isActive) {
        item.classList.add('active');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // --- Scroll Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
  });

  // --- Active Navigation ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Review Carousel (auto-rotate on mobile) ---
  const reviewGrid = document.querySelector('.reviews-carousel');
  if (reviewGrid && window.innerWidth < 768) {
    let currentIndex = 0;
    const cards = reviewGrid.querySelectorAll('.review-card');
    if (cards.length > 1) {
      setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        const scrollTo = cards[currentIndex].offsetLeft - reviewGrid.offsetLeft;
        reviewGrid.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }, 5000);
    }
  }

  // --- Counter Animation ---
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

});
