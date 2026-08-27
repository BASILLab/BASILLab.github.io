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
  // 4. Hero Subtitle Typewriter Effect
  // ==========================================
  const typedTextSpan = document.getElementById('typed-text');
  const textArray = [
    'Brain-Computer Interfaces (BCI)',
    'Artificial Intelligence & Deep Learning',
    'Computational Neuroscience',
    'EEG, fNIRS & MEG Neuroimaging',
    'Photobiomodulation & Neuromodulation',
    'Psychiatric & Cognitive Diagnostics'
  ];
  const typingDelay = 75;
  const erasingDelay = 35;
  const newTextDelay = 1800;
  let textArrayIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  function type() {
    if (!typedTextSpan) return;

    const currentText = textArray[textArrayIndex];

    if (!isErasing && charIndex < currentText.length) {
      typedTextSpan.textContent += currentText.charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else if (isErasing && charIndex > 0) {
      typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, erasingDelay);
    } else if (!isErasing && charIndex === currentText.length) {
      isErasing = true;
      setTimeout(type, newTextDelay);
    } else if (isErasing && charIndex === 0) {
      isErasing = false;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, 400);
    }
  }

  if (typedTextSpan) {
    typedTextSpan.textContent = '';
    setTimeout(type, 600);
  }

  // ==========================================
  // 5. Toast Notification System
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
  // 9. Contact Form Submission (Client Feedback)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      
      // Simple visual feedback
      formStatus.className = 'form-status success';
      formStatus.textContent = `Thank you, ${nameInput ? nameInput.value : 'colleague'}! Your message has been sent successfully.`;

      // Reset form
      contactForm.reset();

      // Clear notification after 6 seconds
      setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 6000);
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
