/**
 * Основной скрипт - чистый JavaScript с поддержкой доступности
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен успешно!');

    // ============================================
    // 1. Мобильное меню (бургер) с полной поддержкой клавиатуры
    // ============================================
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    if (navToggle && navList) {
        // Открытие/закрытие меню
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navList.classList.toggle('nav__list--open');
            this.setAttribute('aria-expanded', isOpen.toString());

            // Фокус на первую ссылку при открытии
            if (isOpen) {
                const firstLink = navList.querySelector('.nav__link');
                if (firstLink) firstLink.focus();
            }
        });

        // Поддержка клавиши Enter и Space на кнопке
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Закрытие меню при клике на ссылку
        navList.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Закрытие меню по Escape
        navList.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navList.classList.remove('nav__list--open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
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
    // 2. Модальные окна с полной поддержкой доступности
    // ============================================
    const modals = document.querySelectorAll('.modal');
    let lastFocusedElement = null;

    // Получить все фокусируемые элементы внутри модалки
    function getFocusableElements(modal) {
        return modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    // Функция закрытия модалки
    function closeModal(modal) {
        modal.classList.remove('modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Возвращаем фокус на элемент, который открыл модалку
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }

        // Убираем хэш из URL
        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname + window.location.search);
        }
    }

    // Функция открытия модалки
    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) {
            // Сохраняем элемент, который вызвал модалку
            lastFocusedElement = document.activeElement;

            modal.classList.add('modal--open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Фокус на первый фокусируемый элемент или кнопку закрытия
            const closeBtn = modal.querySelector('.modal__close');
            if (closeBtn) {
                closeBtn.focus();
            }
        }
    }

    // Обработчики для кнопок открытия модалок
    document.querySelectorAll('a[href^="#modal-"]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            openModal(modalId);
        });

        // Поддержка Enter и Space
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                openModal(modalId);
            }
        });
    });

    // Обработчики для каждой модалки
    modals.forEach(modal => {
        // Устанавливаем aria-hidden по умолчанию
        modal.setAttribute('aria-hidden', 'true');

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

        // Ловушка фокуса (Focus Trap)
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = getFocusableElements(this);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
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
                // Устанавливаем фокус на целевой элемент для screen readers
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
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

    // ============================================
    // 5. Улучшение доступности для screen readers
    // ============================================

    // Объявление текущей страницы для screen readers
    const currentPageLink = document.querySelector('[aria-current="page"]');
    if (currentPageLink) {
        const pageTitle = currentPageLink.textContent.trim();
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Текущая страница: ${pageTitle}`;
        document.body.appendChild(announcement);

        // Удаляем объявление после прочтения
        setTimeout(() => announcement.remove(), 1000);
    }
});
