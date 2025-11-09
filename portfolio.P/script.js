/* ===========================
   Canvas Background: Stars & Particles
=========================== */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 150;
const shootingStars = [];

// Utility function for random number
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* ===========================
   Particle Class
=========================== */
class Particle {
    constructor() { this.reset(); }

    reset() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.size = random(0.5, 2);
        this.speedX = random(-0.2, 0.2);
        this.speedY = random(-0.1, 0.5);
        this.alpha = random(0.3, 1);
        this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.speedX;
        this.y -= this.speedY; // upward movement

        this.alpha += 0.005 * this.alphaDirection;
        if (this.alpha >= 1) this.alphaDirection = -1;
        if (this.alpha <= 0.3) this.alphaDirection = 1;

        if (this.y < 0 || this.x < 0 || this.x > width) {
            this.reset();
            this.y = height;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

/* ===========================
   Shooting Star Class
=========================== */
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(0, width);
        this.y = random(0, height / 2); // start from top half
        this.len = random(80, 150);
        this.speed = random(6, 12);
        this.angle = random(Math.PI / 4, Math.PI / 3); // diagonal
        this.alpha = 1;
        this.active = true;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.alpha -= 0.02;
        if (this.alpha <= 0) this.active = false;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.len * Math.cos(this.angle),
            this.y - this.len * Math.sin(this.angle)
        );
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Create new shooting stars occasionally
function createShootingStar() {
    shootingStars.push(new ShootingStar());
    setTimeout(createShootingStar, random(3000, 7000)); // every 3-7 sec
}
createShootingStar();

/* ===========================
   Animation Loop
=========================== */
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw shooting stars
    shootingStars.forEach((s, index) => {
        if (!s.active) shootingStars.splice(index, 1);
        else {
            s.update();
            s.draw();
        }
    });

    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

/* ===========================
   Fade-in Effect on Scroll
=========================== */
const faders = document.querySelectorAll('.fade-section');

const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

/* ===========================
   Ripple Effect on Project Cards
=========================== */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
        const circle = document.createElement('span');
        circle.classList.add('click-circle');
        circle.style.left = `${e.offsetX}px`;
        circle.style.top = `${e.offsetY}px`;
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 500);
    });
});
