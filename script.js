

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButton(theme);
  }

  function updateToggleButton(theme) {
    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
  }

  // Toggle theme when the button is clicked
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // Listen for system preference changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const introParagraph = document.querySelector(".intro-paragraph");
  const aboutMeBtn = document.getElementById("about-me-btn");

  // Scroll to the intro paragraph when the button is clicked
  aboutMeBtn.addEventListener("click", function() {
    smoothScroll(introParagraph);

  });

  // Fade in the paragraph when it comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        aboutMeBtn.style.display = 'none'; // Hide the button when the paragraph is in view
      } else {
        aboutMeBtn.style.display = 'block'; // Show the button when the paragraph is out of view
      }
    });
  }, {
    threshold: 0.1,
  });

  observer.observe(introParagraph);

  window.addEventListener('scroll', () => {
    const rect = introParagraph.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;

    if (isVisible) {
      aboutMeBtn.classList.add('sticky');
    } else {
      aboutMeBtn.classList.remove('sticky');
    }
  });
});

// Smooth scroll function
function smoothScroll(target) {
  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1500; // Duration in milliseconds
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}
document.getElementById('about-me-btn').addEventListener('load', function() {
  this.querySelector('svg').animate([
    { transform: 'translateY(20)' },
    { transform: 'translateY(-5px)' },
    { transform: 'translateY(20)' }
  ], {
    duration: 1000,
    iterations: Infinity
  });
});

