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

const dot = document.querySelector('.custom-cursor-dot');
const outline = document.querySelector('.custom-cursor-outline');
const fuzzy = document.querySelector('.cursor-fuzzy-sphere');
const links   = document.querySelectorAll('a');
const button   = document.querySelectorAll('button');
const toggle   = document.querySelectorAll('#theme-toggle');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
const speed = 0.2;
const fuzzyspeed = speed*0.65;

links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
    fuzzy.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
    fuzzy.classList.remove('link-hover');
  });
});

// Add hover effects for fuzzy spheres
// fuzzy.forEach(link => {
//   link.addEventListener('mouseenter', () => {
//     fuzz.classList.add('link-hover');
//   });
//   link.addEventListener('mouseleave', () => {
//     fuzz.classList.remove('link-hover');
//   });
// });

button.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
    fuzzy.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
    fuzzy.classList.remove('link-hover');
  });
});
toggle.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
    fuzzy.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
    fuzzy.classList.remove('link-hover');
  });
});

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; 
  mouseY = e.clientY; 
  // (Use clientX/clientY since our container is the full viewport.)
});


const fuzzySphere = document.querySelector('.cursor-fuzzy-sphere');
let sphereX = 0, sphereY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Move the fuzzy sphere directly
  // fuzzySphere.style.left = mouseX + 'px';
  // fuzzySphere.style.top  = mouseY + 'px';

  // If you already do a "smooth" outline, you can also do the same for fuzzySphere 
  // or just keep it in sync with the dot, up to you.
});

function animate() {
  // Dot moves instantly:
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  // Outline lerps toward the mouse:
  outlineX += (mouseX - outlineX) * speed;
  outlineY += (mouseY - outlineY) * speed;
  outline.style.left = outlineX + 'px';
  outline.style.top  = outlineY + 'px';

  sphereX += (mouseX - sphereX) * fuzzyspeed;
  sphereY += (mouseY - sphereY) * fuzzyspeed;
  fuzzySphere.style.left = sphereX + 'px';
  fuzzySphere.style.top  = sphereY + 'px';

  requestAnimationFrame(animate);
}
animate();

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('close-mobile-warning');
  const mobileWarning = document.getElementById('mobile-warning');

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      mobileWarning.style.display = 'none';
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const safariBanner = document.getElementById("safari-banner");

  // Detect browser
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isChrome = /chrome|crios/i.test(userAgent);
  const isFirefox = /firefox/i.test(userAgent);

  // Debug statements to print browser information
  console.log("User Agent:", userAgent);
  if (isSafari) {
    console.log("Browser detected: Safari");
    safariBanner.style.left = "0"; // Show banner with slide-in animation
  } else if (isChrome) {
    console.log("Browser detected: Chrome");
  } else if (isFirefox) {
    console.log("Browser detected: Firefox");
  } else {
    console.log("Browser detected: Other");
  }

  // Hide the banner if not Safari
  if (!isSafari) {
    safariBanner.style.display = "none";
  }

  // Add event listener to close button
  document.getElementById("close-banner").addEventListener("click", () => {
    console.log("Safari banner dismissed by user.");
    safariBanner.style.animation = "slideOut 0.5s ease-in forwards";
  });
});

// Slide-out animation for the banner
const css = `
@keyframes slideOut {
  from {
    left: 0;
  }
  to {
    left: -300px;
  }
}`;
const style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
