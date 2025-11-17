// Orbit Animation System for Join Page
// Implements moving orbit elements with collision detection and boundary bouncing

(function() {
  'use strict';

  class OrbitAnimation {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.orbits = Array.from(this.container.querySelectorAll('.join-orbit'));
      if (this.orbits.length === 0) return;

      this.particles = [];
      this.animationId = null;
      this.isRunning = false;

      this.init();
    }

    init() {
      // Get container dimensions
      const rect = this.container.getBoundingClientRect();
      this.containerWidth = rect.width;
      this.containerHeight = rect.height;

      // Initialize each orbit element as a particle
      this.orbits.forEach((orbit, index) => {
        // Get size from CSS width/height
        const computedStyle = window.getComputedStyle(orbit);
        const width = parseFloat(computedStyle.width) || 160;
        const height = parseFloat(computedStyle.height) || 160;
        const size = Math.max(width, height);
        
        // Get initial position from CSS inset values
        const top = computedStyle.top;
        const left = computedStyle.left;
        const right = computedStyle.right;
        const bottom = computedStyle.bottom;
        const inset = computedStyle.inset;

        let x, y;

        // Handle inset shorthand or individual properties
        if (inset && inset !== 'auto') {
          const values = inset.split(' ').map(v => v.trim());
          if (values.length === 4) {
            // top right bottom left
            const topVal = parseFloat(values[0]) || 0;
            const rightVal = parseFloat(values[1]) || 0;
            const bottomVal = parseFloat(values[2]) || 0;
            const leftVal = parseFloat(values[3]) || 0;
            
            if (topVal !== 0 && leftVal !== 0) {
              x = leftVal;
              y = topVal;
            } else if (rightVal !== 0 && bottomVal !== 0) {
              x = this.containerWidth - rightVal - size;
              y = this.containerHeight - bottomVal - size;
            }
          }
        }

        // Fallback to individual properties
        if (x === undefined || y === undefined) {
          if (top !== 'auto' && left !== 'auto') {
            x = parseFloat(left) || 0;
            y = parseFloat(top) || 0;
          } else if (right !== 'auto' && bottom !== 'auto') {
            x = this.containerWidth - parseFloat(right) - size;
            y = this.containerHeight - parseFloat(bottom) - size;
          } else {
            // Use current bounding rect position
            const rect = orbit.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            x = rect.left - containerRect.left;
            y = rect.top - containerRect.top;
          }
        }

        // Random velocity (slower for larger elements)
        const baseSpeed = 0.3;
        const speedFactor = 1 - (size / 200) * 0.5; // Larger elements move slower
        const speed = baseSpeed * speedFactor;
        const angle = Math.random() * Math.PI * 2;

        this.particles.push({
          element: orbit,
          x: Math.max(0, Math.min(x, this.containerWidth - size)),
          y: Math.max(0, Math.min(y, this.containerHeight - size)),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: size,
          radius: size / 2
        });
      });

      // Convert all orbits to use transform instead of inset
      this.particles.forEach(particle => {
        particle.element.style.position = 'absolute';
        particle.element.style.top = '0';
        particle.element.style.left = '0';
        particle.element.style.right = 'auto';
        particle.element.style.bottom = 'auto';
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });

      // Start animation
      this.start();
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animate();
    }

    stop() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }

    animate() {
      if (!this.isRunning) return;

      // Update container dimensions (in case of resize)
      const rect = this.container.getBoundingClientRect();
      this.containerWidth = rect.width;
      this.containerHeight = rect.height;

      // Update each particle
      this.particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary collision detection
        if (particle.x <= 0 || particle.x + particle.size >= this.containerWidth) {
          particle.vx = -particle.vx;
          particle.x = Math.max(0, Math.min(particle.x, this.containerWidth - particle.size));
        }

        if (particle.y <= 0 || particle.y + particle.size >= this.containerHeight) {
          particle.vy = -particle.vy;
          particle.y = Math.max(0, Math.min(particle.y, this.containerHeight - particle.size));
        }

        // Collision detection with other particles
        this.particles.forEach((other, j) => {
          if (i === j) return;

          const dx = (particle.x + particle.radius) - (other.x + other.radius);
          const dy = (particle.y + particle.radius) - (other.y + other.radius);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = particle.radius + other.radius;

          if (distance < minDistance && distance > 0) {
            // Collision detected - elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocity vectors
            const vx1 = particle.vx * cos + particle.vy * sin;
            const vy1 = particle.vy * cos - particle.vx * sin;
            const vx2 = other.vx * cos + other.vy * sin;
            const vy2 = other.vy * cos - other.vx * sin;

            // Swap velocities (elastic collision)
            const finalVx1 = vx2;
            const finalVx2 = vx1;

            // Rotate back
            particle.vx = finalVx1 * cos - vy1 * sin;
            particle.vy = vy1 * cos + finalVx1 * sin;
            other.vx = finalVx2 * cos - vy2 * sin;
            other.vy = vy2 * cos + finalVx2 * sin;

            // Separate particles to prevent overlap
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;

            particle.x += separationX;
            particle.y += separationY;
            other.x -= separationX;
            other.y -= separationY;
          }
        });

        // Apply position
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });

      this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Handle window resize
    handleResize() {
      const rect = this.container.getBoundingClientRect();
      this.containerWidth = rect.width;
      this.containerHeight = rect.height;

      // Ensure particles stay within bounds
      this.particles.forEach(particle => {
        particle.x = Math.max(0, Math.min(particle.x, this.containerWidth - particle.size));
        particle.y = Math.max(0, Math.min(particle.y, this.containerHeight - particle.size));
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const animation = new OrbitAnimation('.join-hero-visual');
      
      // Handle window resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (animation) animation.handleResize();
        }, 250);
      });
    });
  } else {
    const animation = new OrbitAnimation('.join-hero-visual');
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animation) animation.handleResize();
        }, 250);
    });
  }
})();

