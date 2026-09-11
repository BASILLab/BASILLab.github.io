/**
 * Academic & Research Portfolio Script
 * Author: Kyeonggu Lee (Université de Montréal)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.setAttribute('data-theme', 'light');
  }

  // Toggle theme listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ==========================================
  // 2. Mobile Navigation Menu
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 3. Active Nav Link on Scroll (IntersectionObserver)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================
  // 4. Toast Notification System
  // ==========================================
  // ==========================================
  const toastMsg = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message) {
    if (!toastMsg) return;
    if (toastText) toastText.textContent = message;
    
    toastMsg.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3000);
  }

  // ==========================================
  // 6. Publications Filtering & Search
  // ==========================================
  const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
  const publicationCards = document.querySelectorAll('.publication-card');
  const pubSearchInput = document.getElementById('pub-search-input');

  let activePubFilter = 'all';
  let activeSearchQuery = '';

  function filterPublications() {
    publicationCards.forEach(card => {
      const categoryStr = card.getAttribute('data-category') || '';
      const textContent = card.innerText.toLowerCase();
      
      const matchesCategory = (activePubFilter === 'all') || categoryStr.includes(activePubFilter);
      const matchesSearch = !activeSearchQuery || textContent.includes(activeSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hide');
        card.style.opacity = '0';
        setTimeout(() => { card.style.opacity = '1'; }, 40);
      } else {
        card.classList.add('hide');
      }
    });
  }

  pubFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pubFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePubFilter = btn.getAttribute('data-filter');
      filterPublications();
    });
  });

  if (pubSearchInput) {
    pubSearchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim().toLowerCase();
      filterPublications();
    });
  }

  // ==========================================
  // 7. Citation Copy Handlers (APA & BibTeX)
  // ==========================================
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-citation');
      if (citation && navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast('APA citation copied to clipboard!');
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      }
    });
  });

  document.querySelectorAll('.bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (bibtex && navigator.clipboard) {
        navigator.clipboard.writeText(bibtex).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      }
    });
  });

  // ==========================================
  // 8. Projects Filtering
  // ==========================================
  const projectFilters = document.querySelector('.project-filters:not(.pub-filters)');
  if (projectFilters) {
    const projectFilterBtns = projectFilters.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    projectFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hide');
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }

  // ==========================================
  // 9. Contact Form Submission (Direct Email via FormSubmit AJAX)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      formStatus.className = 'form-status';
      formStatus.style.display = 'block';
      formStatus.textContent = 'Sending your message...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/kyeonggu.lee@pusan.ac.kr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            _subject: `[BASIL Lab Website] ${subjectInput ? subjectInput.value : 'Inquiry'}`,
            message: messageInput ? messageInput.value : '',
            _template: 'table',
            _captcha: 'false'
          })
        });

        const result = await response.json();

        if (response.ok || result.success === "true" || result.success === true) {
          formStatus.className = 'form-status success';
          formStatus.textContent = `Thank you, ${nameInput ? nameInput.value : 'colleague'}! Your message has been sent successfully to Prof. Kyeonggu Lee.`;
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Failed to send message via form. Please email directly to kyeonggu.lee@pusan.ac.kr.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }

        setTimeout(() => {
          if (formStatus.classList.contains('success')) {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            formStatus.style.display = '';
          }
        }, 8000);
      }
    });
  }

  // ==========================================
  // 10. Dynamic Footer Year
  // ==========================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
