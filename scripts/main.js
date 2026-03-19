/* ============================================
   FRAME X FRAME — Scroll Interactions
   Cinematic, intentional motion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Page Loader ----
  const loader = document.getElementById('loader');

  if (loader) {
    // Hide loader after animation completes
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
  }

  // ---- Process Carousel ----
  const processTrack = document.getElementById('processTrack');
  const processPrev = document.getElementById('processPrev');
  const processNext = document.getElementById('processNext');
  const processIndicators = document.querySelectorAll('.process__indicator');

  if (processTrack && processPrev && processNext) {
    const cards = processTrack.querySelectorAll('.process__card');
    let currentIndex = 0;

    // Get card width dynamically
    const getCardWidth = () => {
      const card = cards[0];
      if (!card) return 340;
      const style = window.getComputedStyle(card);
      const marginRight = parseFloat(style.marginRight) || 0;
      return card.offsetWidth + marginRight + 24; // card width + margin + gap
    };

    const updateIndicators = () => {
      processIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    };

    const scrollToCard = (index) => {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;
      currentIndex = index;

      const cardWidth = getCardWidth();
      const scrollPosition = index * cardWidth;
      processTrack.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      updateIndicators();
    };

    processPrev.addEventListener('click', () => {
      scrollToCard(currentIndex - 1);
    });

    processNext.addEventListener('click', () => {
      scrollToCard(currentIndex + 1);
    });

    // Indicator clicks
    processIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        scrollToCard(index);
      });
    });

    // Update indicators on scroll
    processTrack.addEventListener('scroll', () => {
      const scrollPosition = processTrack.scrollLeft;
      const cardWidth = getCardWidth();
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
        currentIndex = newIndex;
        updateIndicators();
      }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    processTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    processTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollToCard(currentIndex + 1);
        } else {
          scrollToCard(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  // ---- Scroll Progress Bar ----
  const progressBar = document.querySelector('.scroll-progress');

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    });
  }

  // ---- Navigation Background on Scroll ----
  const nav = document.querySelector('.nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---- Mobile Navigation Toggle ----
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ---- Scroll Reveal with Intersection Observer ----
  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Parallax Effect ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Video Modal ----
  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal__content');
  const modalClose = document.querySelector('.modal__close');
  const videoTriggers = document.querySelectorAll('[data-video]');

  if (modal && modalContent) {
    // Open modal
    videoTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const videoUrl = trigger.dataset.video;

        if (videoUrl) {
          // Create iframe for video embed
          modalContent.innerHTML = `
            <iframe 
              src="${videoUrl}?autoplay=1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          `;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close modal
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // Clear iframe to stop video
      setTimeout(() => {
        modalContent.innerHTML = '';
      }, 300);
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // ---- Form Handling ----
  const contactForm = document.querySelector('.contact__form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name     = contactForm.querySelector('#name').value.trim();
      const email    = contactForm.querySelector('#email').value.trim();
      const location = contactForm.querySelector('#location').value.trim();
      const message  = contactForm.querySelector('#message').value.trim();

      const to      = 'work.framebyframe@gmail.com';
      const subject = encodeURIComponent(`Film Enquiry from ${name}`);
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nProperty Location: ${location || '—'}\n\n${message}`
      );

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      // Show brief feedback
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Opening Mail App ✓';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // Hero animations are now handled via CSS for smoother performance

  // ---- Cursor Following Effect (Optional - for desktop) ----
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: var(--color-primary);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: transform 0.15s ease-out, opacity 0.3s ease-out;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX - 4}px`;
      cursor.style.top = `${e.clientY - 4}px`;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Scale up on interactive elements
    document.querySelectorAll('a, button, .work-card__media').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(4)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }
});
