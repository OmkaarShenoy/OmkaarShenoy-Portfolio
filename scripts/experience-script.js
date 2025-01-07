document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const workbarLinks = document.querySelectorAll('.work-item a'); // Ensure this is defined here

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

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Add event listener to work-item links
  workbarLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Remove active class from all work-items
      workbarLinks.forEach(link => link.parentElement.classList.remove('active'));

      // Add active class to the clicked work-item
      this.parentElement.classList.add('active');

      // Smooth scroll to the target element
      smoothScroll(targetElement);
    });
  });
});

function smoothScroll(target) {
  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1500;
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

document.getElementById('back-button').addEventListener('click', () => {
  window.history.back();
});
document.getElementById('work-bar-toggle').addEventListener('click', function () {
  document.querySelector('.work-bar').classList.toggle('active');
});

// Toggle work-bar visibility on button click
document.getElementById('work-bar-toggle').addEventListener('click', function (event) {
  event.stopPropagation(); // Prevent the click event from reaching the document
  document.querySelector('.work-bar').classList.toggle('active');
});

// Close work-bar if clicked anywhere outside
document.addEventListener('click', function (event) {
  const workBar = document.querySelector('.work-bar');
  const toggleButton = document.getElementById('work-bar-toggle');

  // Check if click happened outside the work-bar and toggle button
  if (workBar.classList.contains('active') && !workBar.contains(event.target) && !toggleButton.contains(event.target)) {
    workBar.classList.remove('active');
  }
});

const dot = document.querySelector('.custom-cursor-dot');
const outline = document.querySelector('.custom-cursor-outline');
const links   = document.querySelectorAll('a');
const button   = document.querySelectorAll('button');
const toggle   = document.querySelectorAll('#theme-toggle');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
const speed = 0.2;

links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
  });
});
button.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
  });
});
toggle.forEach(link => {
  link.addEventListener('mouseenter', () => {
    outline.classList.add('link-hover');
  });
  link.addEventListener('mouseleave', () => {
    outline.classList.remove('link-hover');
  });
});

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; 
  mouseY = e.clientY; 
  // (Use clientX/clientY since our container is the full viewport.)
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

  requestAnimationFrame(animate);
}
animate();