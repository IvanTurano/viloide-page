// Navegación móvil
const navToggle = document.querySelector('.nav-toggle');
const navClose = document.querySelector('.nav-close');
const navMenu = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-menu a');

// Función para abrir el menú
function openMenu() {
    navToggle.classList.add('active');
    navMenu.classList.add('visible');
    document.body.classList.add('nav-open');
}

// Función para cerrar el menú
function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('visible');
    document.body.classList.remove('nav-open');
}

// Toggle del menú móvil
navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('visible')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Botón de cerrar menú
if (navClose) {
    navClose.addEventListener('click', closeMenu);
}

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Cerrar menú al hacer click fuera de él
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
    }
});

// Navegación suave mejorada
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.hero-header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto parallax para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;

    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});



// Header transparente/sólido según scroll
const header = document.querySelector('.hero-header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Ocultar/mostrar header al hacer scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});

// Contador animado para números (si se agregan estadísticas)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);

        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Lazy loading para imágenes
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Agregar clase para animaciones CSS
    document.body.classList.add('js-loaded');

    // Precargar imágenes críticas
    const criticalImages = ['assets/hero.jpg', 'assets/logo.png'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Manejo de errores para imágenes
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        this.style.display = 'none';
        console.warn(`Error cargando imagen: ${this.src}`);
    });
});

// Carrusel de clientes
const clientCarousel = () => {
    const track = document.querySelector('.clients-track');
    const slides = Array.from(document.querySelectorAll('.client-slide'));

    if (!track || !slides.length) return;

    const slideWidth = slides[0].offsetWidth;
    const totalWidth = slideWidth * slides.length;

    // Duplicar slides para efecto infinito
    track.innerHTML += track.innerHTML;

    let currentPosition = 0;
    const speed = 1; // px por frame

    const animate = () => {
        currentPosition -= speed;
        if (currentPosition <= -totalWidth) {
            currentPosition = 0;
        }
        track.style.transform = `translateX(${currentPosition}px)`;
        requestAnimationFrame(animate);
    };

    // Pausar al hacer hover
    track.addEventListener('mouseenter', () => {
        speed = 0;
    });

    track.addEventListener('mouseleave', () => {
        speed = 1;
    });

    animate();
};

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', clientCarousel);

// Performance: Throttle para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Aplicar throttle a eventos de scroll costosos
const throttledScrollHandler = throttle(() => {
    // Aquí van los handlers de scroll que necesiten throttling
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Animaciones para las nuevas secciones
const newSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observar elementos de las nuevas secciones
document.querySelectorAll('.differentiators-list li, .contact-form, .contact-details, .social-links, .map-container').forEach(el => {
    newSectionObserver.observe(el);
});


// Pausar carrusel al hacer hover
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.clients-carousel');
    const track = document.querySelector('.clients-track');

    if (carousel && track) {
        carousel.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        carousel.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }
});