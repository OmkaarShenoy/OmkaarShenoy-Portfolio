/**
 * Magnetic Filings Animation Effect
 * Creates a grid of elements that rotate toward the mouse cursor
 */

(function() {
  'use strict';

// ============================================
// CONFIGURATION PARAMETERS
// ============================================
const CONFIG = {
  // Grid density — higher gives a more fluid field look.
  gridCols: 70,   // wider grid for fine detail
  gridRows: 40,   // rectangular grids feel more organic on widescreens

  // Spacing — smaller spacing makes the field look continuous.
  spacing: 10,    // 10–14px gives good density without choking CPU
  
  // Element style — “line” looks more like filings than “dot”.
  elementType: 'line',
  elementSize: 18,    // longer lines exaggerate rotation, looks more magnetic
  elementWidth: 1.0,  // thin enough to stay subtle but visible
  
  // Animation — subtle but responsive.
  rotationSpeed: 0.15, // keep slightly lower to mimic inertia
  easing: 'ease-out',
  
  // Visual tone — faint but noticeable shimmer.
  opacity: 0.25,      // between 0.2–0.3 looks natural
  color: '#b6b6b6',   // cool neutral gray (iron-like)
  
  // Behavior — calm when idle.
  pauseOnMouseLeave: true,
  pauseOpacity: 0.08,
};


// ============================================
// STATE MANAGEMENT
// ============================================
let mouseX = 0;
let mouseY = 0;
let isMouseInViewport = false;
let wasMouseOut = false;
let animationFrameId = null;
let filingsContainer = null;
let filings = [];
let currentRotations = []; // Current rotation angles for smooth interpolation

// ============================================
// INITIALIZATION
// ============================================
function initMagneticFilings() {
  // Create container
  filingsContainer = document.createElement('div');
  filingsContainer.id = 'magnetic-filings-container';
  document.body.appendChild(filingsContainer);
  
  // Set initial container opacity
  filingsContainer.style.opacity = CONFIG.opacity;
  
  // Create grid
  createGrid();
  
  console.log(`Magnetic filings initialized: ${filings.length} elements created`);
  
  // Initialize rotations array
  currentRotations = new Array(filings.length).fill(0);
  
  // Set up event listeners
  setupEventListeners();
  
  // Start animation loop
  animate();
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createGrid();
      currentRotations = new Array(filings.length).fill(0);
    }, 150);
  });
}

// ============================================
// GRID CREATION
// ============================================
function createGrid() {
  // Clear existing filings
  if (filingsContainer) {
    filingsContainer.innerHTML = '';
  }
  filings = [];
  currentRotations = [];
  
  // Calculate viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate actual spacing based on viewport
  const actualSpacingX = viewportWidth / (CONFIG.gridCols + 1);
  const actualSpacingY = viewportHeight / (CONFIG.gridRows + 1);
  
  // Create grid elements
  for (let row = 0; row < CONFIG.gridRows; row++) {
    for (let col = 0; col < CONFIG.gridCols; col++) {
      const filing = createFilingElement();
      
      // Position element
      const x = actualSpacingX * (col + 1) - 10;
      const y = actualSpacingY * (row + 1) - 10;
      
      filing.style.left = `${x}px`;
      filing.style.top = `${y}px`;
      
      // Store position for calculations
      filing.dataset.x = x;
      filing.dataset.y = y;
      
      filingsContainer.appendChild(filing);
      filings.push(filing);
      currentRotations.push(0);
    }
  }
}

// ============================================
// ELEMENT CREATION
// ============================================
function createFilingElement() {
  const element = document.createElement('div');
  element.className = 'magnetic-filing';
  
  if (CONFIG.elementType === 'line') {
    element.style.width = `${CONFIG.elementSize}px`;
    element.style.height = `${CONFIG.elementWidth}px`;
    element.style.borderRadius = '1px';
    element.style.border = 'none';
    element.style.backgroundColor = 'var(--text-color)';
  } else {
    element.style.width = `${CONFIG.elementSize * 2}px`;
    element.style.height = `${CONFIG.elementSize * 2}px`;
    element.style.borderRadius = '50%';
    element.style.borderWidth = `${CONFIG.elementWidth}px`;
    element.style.borderStyle = 'solid';
    element.style.backgroundColor = 'transparent';
    element.style.borderColor = 'var(--text-color)';
  }
  
  // Color is handled by CSS via var(--text-color)
  // Opacity is set on container, not individual elements
  element.style.position = 'absolute';
  element.style.transformOrigin = 'center center';
  element.style.pointerEvents = 'none';
  element.style.willChange = 'transform';
  
  return element;
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update container opacity when mouse re-enters
    if (wasMouseOut && filingsContainer) {
      filingsContainer.style.opacity = CONFIG.opacity;
      wasMouseOut = false;
    }
    
    isMouseInViewport = true;
  });
  
  // Handle mouse leave
  if (CONFIG.pauseOnMouseLeave) {
    // Check if mouse is outside viewport
    const checkMousePosition = () => {
      if (mouseX < 0 || mouseX > window.innerWidth || 
          mouseY < 0 || mouseY > window.innerHeight) {
        if (isMouseInViewport) {
          isMouseInViewport = false;
          wasMouseOut = true;
          if (filingsContainer) {
            filingsContainer.style.opacity = CONFIG.pauseOpacity;
          }
        }
      }
    };
    
    // Check periodically
    setInterval(checkMousePosition, 100);
    
    // Also listen for mouse leave on document
    document.addEventListener('mouseleave', () => {
      isMouseInViewport = false;
      wasMouseOut = true;
      if (filingsContainer) {
        filingsContainer.style.opacity = CONFIG.pauseOpacity;
      }
    });
  }
}

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
  if (!isMouseInViewport && CONFIG.pauseOnMouseLeave) {
    // Skip animation when mouse is out, but keep loop running
    animationFrameId = requestAnimationFrame(animate);
    return;
  }
  
  // Update each filing's rotation
  filings.forEach((filing, index) => {
    const filingX = parseFloat(filing.dataset.x);
    const filingY = parseFloat(filing.dataset.y);
    
    // Calculate angle to mouse
    const dx = mouseX - filingX;
    const dy = mouseY - filingY;
    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Smooth interpolation toward target angle
    let currentAngle = currentRotations[index];
    
    // Normalize angles to -180 to 180 range for shortest rotation path
    let angleDiff = targetAngle - currentAngle;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    // Interpolate
    currentAngle += angleDiff * CONFIG.rotationSpeed;
    currentRotations[index] = currentAngle;
    
    // Apply rotation
    filing.style.transform = `rotate(${currentAngle}deg)`;
  });
  
  animationFrameId = requestAnimationFrame(animate);
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
function startMagneticFilings() {
  // Wait for body to be available
  if (document.body) {
    initMagneticFilings();
  } else {
    // If body isn't ready, wait for it
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMagneticFilings, 100);
      });
    } else {
      setTimeout(initMagneticFilings, 100);
    }
  }
}

startMagneticFilings();

})(); // End IIFE
