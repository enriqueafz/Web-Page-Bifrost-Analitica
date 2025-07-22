document.addEventListener('DOMContentLoaded', () => {
    // --- SCRIPT PARA EL MENÚ MÓVIL (VERSIÓN CORREGIDA) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const body = document.body;

    if (mobileMenuButton && mobileMenu && menuBackdrop) {
        const toggleMenu = (event) => {
            if (event) event.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('mobile-menu-open');
            menuBackdrop.classList.toggle('menu-backdrop-visible', isOpen);
            body.classList.toggle('body-no-scroll', isOpen);
        };

        // Lógica para abrir/cerrar el menú con el botón
        mobileMenuButton.addEventListener('click', toggleMenu);

        // Lógica para cerrar el menú si se hace clic en un enlace dentro de él
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('mobile-menu-open')) {
                    toggleMenu();
                }
            });
        });

        // Lógica para cerrar el menú si se hace clic en el fondo oscuro
        menuBackdrop.addEventListener('click', toggleMenu);
    }

    // --- Script de Navegación (Sin cambios) ---
    const nav = document.querySelector('nav.hidden.md\\:flex');
    if (nav) {
        const highlighter = nav.querySelector('.nav-highlighter');
        const navLinks = nav.querySelectorAll('a.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const updateHighlighter = (activeLink) => {
            if (highlighter && activeLink) {
                highlighter.style.width = `${activeLink.offsetWidth}px`;
                highlighter.style.transform = `translateX(${activeLink.offsetLeft}px)`;
                highlighter.style.opacity = '1';
            }
        };

        const onScroll = () => {
            let currentSectionId = 'home';
            document.querySelectorAll('main#home, section[id]').forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 70) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
            const activeLink = nav.querySelector('a.nav-link.active');
            updateHighlighter(activeLink);
        };

        if (currentPage === 'index.html') {
            window.addEventListener('scroll', onScroll);
            onScroll();
        } else {
            const activeLinkOnLoad = nav.querySelector(`a[href*="${currentPage}"]`);
            if (activeLinkOnLoad) {
                activeLinkOnLoad.classList.add('active');
            }
        }

        setTimeout(() => {
             const linkToActivate = nav.querySelector('a.nav-link.active');
             if(linkToActivate) updateHighlighter(linkToActivate);
        }, 100);
        
        window.addEventListener('resize', () => {
            const activeLink = nav.querySelector('a.nav-link.active');
            if(activeLink) updateHighlighter(activeLink);
        });
    }

    // --- Script de Animación al Hacer Scroll (Sin cambios) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- Script de Particles.js (Sin cambios) ---
    const particlesElement = document.getElementById('particles-js');
    if (particlesElement) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 }}, "color": { "value": "#00A9E0" }, "shape": { "type": "circle" }, "opacity": { "value": 0.4, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.05, "sync": false }}, "size": { "value": 2, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#00A9E0", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "bottom-right", "random": true, "straight": true, "out_mode": "out", "bounce": false }},
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "resize": true }, "modes": { "bubble": { "distance": 200, "size": 3, "duration": 2, "opacity": 0.8 }}},
            "retina_detect": true
        });
    }

    // --- Script del Formulario de Contacto y Notificación (CORREGIDO) ---
    const contactForm = document.getElementById('contact-form');
    const formNotification = document.getElementById('form-notification');

    if (contactForm && formNotification) {
        const notificationIcon = document.getElementById('notification-icon');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        const icons = {
            success: `<div class="flex justify-center"><svg class="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`,
            error: `<div class="flex justify-center"><svg class="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`
        };

        const showNotification = (type, title, message) => {
            notificationIcon.innerHTML = icons[type];
            notificationTitle.textContent = title;
            notificationMessage.textContent = message;
            
            formNotification.classList.remove('opacity-0', 'pointer-events-none');
            formNotification.classList.add('is-visible');

            setTimeout(() => {
                formNotification.classList.add('opacity-0', 'pointer-events-none');
                formNotification.classList.remove('is-visible');
            }, 4000);
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData.entries());

            // Anti-spam honeypot check
            if (object.botcheck) {
                return;
            }

            showNotification('success', 'Enviando...', 'Por favor espere.');

            try {
                // **CORRECCIÓN**: Apuntamos a nuestro propio backend seguro
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });

                const result = await response.json();

                if (response.ok) {
                    showNotification('success', '¡Enviado!', 'Tu solicitud ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.');
                    contactForm.reset();
                } else {
                    console.error('Error de la API:', result);
                    showNotification('error', 'Error', result.message || 'Hubo un problema al enviar tu mensaje.');
                }
            } catch (error) {
                console.error('Error de red:', error);
                showNotification('error', 'Error de Red', 'No se pudo enviar el formulario. Revisa tu conexión a internet.');
            }
        });
    }
});
