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
    
    // Inicializar validaciones del formulario
    initFormValidation();
});

// VALIDACIONES DEL FORMULARIO DE CONTACTO

// Función para mostrar errores
function showError(input, message) {
    const formGroup = input.parentElement;
    
    // Agregar clase de error al form-group
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Mostrar alert con el mensaje de error
    alert(message);
}

// Función para limpiar errores
function clearError(input) {
    const formGroup = input.parentElement;
    
    // Remover clases de error y agregar clase de éxito
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
}

// Validación del nombre
function validateName(input) {
    const name = input.value.trim();
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    
    if (name === '') {
        showError(input, 'El nombre es obligatorio');
        return false;
    }
    
    if (name.length < 2) {
        showError(input, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }
    
    if (!nameRegex.test(name)) {
        showError(input, 'El nombre solo puede contener letras y espacios');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validación del email
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        showError(input, 'El email es obligatorio');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(input, 'Por favor ingresa un email válido');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validación del teléfono
function validatePhone(input) {
    const phone = input.value.trim();
    const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
    
    // El teléfono es opcional, pero si se ingresa debe ser válido
    if (phone !== '' && !phoneRegex.test(phone)) {
        showError(input, 'Por favor ingresa un teléfono válido');
        return false;
    }
    
    clearError(input);
    return true;
}

// Validación del mensaje
function validateMessage(input) {
    const message = input.value.trim();
    
    if (message === '') {
        showError(input, 'El mensaje es obligatorio');
        return false;
    }
    
    if (message.length < 10) {
        showError(input, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    }
    
    if (message.length > 1000) {
        showError(input, 'El mensaje no puede exceder los 1000 caracteres');
        return false;
    }
    
    clearError(input);
    return true;
}

// Función principal de validación del formulario
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPhoneValid = validatePhone(phoneInput);
    const isMessageValid = validateMessage(messageInput);
    
    return isNameValid && isEmailValid && isPhoneValid && isMessageValid;
}

// Inicializar validaciones del formulario
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    // Validación en tiempo real
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateName(nameInput));
        nameInput.addEventListener('input', () => {
            if (nameInput.parentElement.classList.contains('error')) {
                validateName(nameInput);
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => {
            if (emailInput.parentElement.classList.contains('error')) {
                validateEmail(emailInput);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
        phoneInput.addEventListener('input', () => {
            if (phoneInput.parentElement.classList.contains('error')) {
                validatePhone(phoneInput);
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => validateMessage(messageInput));
        messageInput.addEventListener('input', () => {
            if (messageInput.parentElement.classList.contains('error')) {
                validateMessage(messageInput);
            }
        });
    }
    
    // Validación al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Si todas las validaciones pasan, enviar el formulario
            form.submit();
        } else {
            // Scroll al primer error
            const firstErrorGroup = form.querySelector('.form-group.error');
            if (firstErrorGroup) {
                const firstErrorInput = firstErrorGroup.querySelector('input, textarea');
                if (firstErrorInput) {
                    firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorInput.focus();
                }
            }
        }
    });
}