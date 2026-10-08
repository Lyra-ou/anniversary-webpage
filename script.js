// ==================== Distance Calculation ====================
const london = { lat: 51.5074, lon: -0.1278 };
const beijing = { lat: 39.9042, lon: 116.4074 };

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistance(km) {
  const miles = km * 0.621371;
  const distanceKm = Math.round(km);
  const distanceMiles = Math.round(miles);
  return `${distanceKm.toLocaleString()} km`;
}

const distance = haversineDistance(
  london.lat,
  london.lon,
  beijing.lat,
  beijing.lon
);

const distanceValue = document.getElementById("distanceValue");
distanceValue.textContent = formatDistance(distance);

// ==================== Particle Animation Along Line ====================
function createParticles() {
  const particleGroup = document.getElementById("particles");
  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", Math.random() * 2 + 1);
    circle.setAttribute("fill", Math.random() > 0.5 ? "#ffc6d7" : "#d5ccff");
    circle.setAttribute("opacity", Math.random() * 0.6 + 0.4);
    
    const startTime = (i / particleCount) * 4;
    circle.style.animation = `moveAlongPath ${3 + Math.random() * 2}s linear ${startTime}s infinite`;
    
    particleGroup.appendChild(circle);
  }

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes moveAlongPath {
      0% {
        cx: 120;
        cy: 200;
      }
      50% {
        cx: 500;
        cy: 150;
      }
      100% {
        cx: 880;
        cy: 200;
      }
    }
  `;
  document.head.appendChild(style);
}

// ==================== Countdown Timer ====================
function updateCountdown() {
  const anniversaryDate = new Date("2025-05-24").getTime();
  const now = new Date().getTime();
  const difference = anniversaryDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
      countdownEl.textContent = `${days} days • ${hours}h • ${minutes}m until next anniversary`;
    }
  } else {
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
      countdownEl.textContent = "💕 Today is our anniversary! 💕";
    }
  }
}

updateCountdown();
setInterval(updateCountdown, 60000); // Update every minute

// ==================== Pulse Canvas Animation ====================
function setupPulseCanvas() {
  const canvas = document.getElementById("pulseCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pulses = [];
  let animationId;

  class Pulse {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 150;
      this.opacity = 0.6;
      this.speed = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? "rgba(255, 198, 215" : "rgba(213, 204, 255";
    }

    update() {
      this.radius += this.speed;
      this.opacity = 0.6 * (1 - this.radius / this.maxRadius);
    }

    draw(ctx) {
      ctx.strokeStyle = `${this.color}, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    isDead() {
      return this.radius > this.maxRadius;
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pulses.forEach((pulse, index) => {
      pulse.update();
      pulse.draw(ctx);

      if (pulse.isDead()) {
        pulses.splice(index, 1);
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  // Create pulses on click or at intervals
  window.addEventListener("click", (e) => {
    pulses.push(new Pulse(e.clientX, e.clientY));
  });

  // Auto-create pulses at random intervals
  setInterval(() => {
    if (Math.random() > 0.7) {
      const randomX = Math.random() * canvas.width;
      const randomY = Math.random() * canvas.height;
      pulses.push(new Pulse(randomX, randomY));
    }
  }, 800);

  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ==================== Scroll Animation Trigger ====================
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.animation = "none";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".story-card").forEach((el) => {
    observer.observe(el);
  });
}

// ==================== Mouse Glow Effect ====================
function setupMouseGlow() {
  const mousePos = { x: 0, y: 0 };

  document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    const cards = document.querySelectorAll(".story-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mousePos.x - cardX, 2) + Math.pow(mousePos.y - cardY, 2)
      );

      if (distance < 200) {
        const brightness = 1 - distance / 200;
        card.style.boxShadow = `
          0 18px 36px rgba(0, 0, 0, 0.12),
          0 0 ${30 * brightness}px rgba(255, 122, 158, ${0.3 * brightness})
        `;
      }
    });
  });
}

// ==================== Initialize ====================
window.addEventListener("load", () => {
  createParticles();
  setupPulseCanvas();
  setupScrollAnimations();
  setupMouseGlow();
});

// ==================== Smooth Scroll Support ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
