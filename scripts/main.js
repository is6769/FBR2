/**
 * Основной скрипт - чистый JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен успешно!');

    // ============================================
    // 1. Мобильное меню (бургер)
    // ============================================
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    if (navToggle && navList) {
        // Открытие/закрытие меню
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navList.classList.toggle('nav__list--open');
            this.setAttribute('aria-expanded', isOpen);
        });

        // Закрытие меню при клике на ссылку
        navList.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================
    // 2. Модальные окна
    // ============================================
    const modals = document.querySelectorAll('.modal');

    // Функция закрытия модалки
    function closeModal(modal) {
        modal.classList.remove('modal--open');
        document.body.style.overflow = '';
        // Убираем хэш из URL
        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname + window.location.search);
        }
    }

    // Функция открытия модалки
    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.classList.add('modal--open');
            document.body.style.overflow = 'hidden';
        }
    }

    // Обработчики для кнопок открытия модалок
    document.querySelectorAll('a[href^="#modal-"]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            openModal(modalId);
        });
    });

    // Закрытие по клику на overlay, крестик или кнопку "Закрыть"
    modals.forEach(modal => {
        // Клик по overlay (фону)
        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal__overlay')) {
                closeModal(this);
            }
        });

        // Клик по крестику и кнопке закрыть
        modal.querySelectorAll('.modal__close, .modal__footer .btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(modal);
            });
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('modal--open')) {
                    closeModal(modal);
                }
            });
        }
    });

    // Проверка хэша при загрузке страницы
    if (window.location.hash.startsWith('#modal-')) {
        openModal(window.location.hash);
    }

    // ============================================
    // 3. Плавная прокрутка к якорям
    // ============================================
    document.querySelectorAll('a[href^="#"]:not([href^="#modal-"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#!') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // 4. Анимация появления элементов при скролле
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Добавляем CSS для анимации
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(animationStyle);

        // Наблюдаем за элементами
        document.querySelectorAll('.card, .skill, .diary-entry, .course-card').forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(el);
        });
    }
});
