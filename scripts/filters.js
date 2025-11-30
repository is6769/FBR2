/**
 * Фильтрация проектов - чистый JavaScript с поддержкой доступности
 */

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projectsGrid');

    // Создаём aria-live region для объявлений
    let liveRegion = document.getElementById('filter-status');
    if (!liveRegion && projectsGrid) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'filter-status';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        projectsGrid.parentNode.insertBefore(liveRegion, projectsGrid);
    }

    // Инициализация - устанавливаем начальные стили
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок и сбрасываем aria-pressed
            filterButtons.forEach(btn => {
                btn.classList.remove('filter-btn--active');
                btn.setAttribute('aria-pressed', 'false');
            });

            // Добавляем активный класс на текущую кнопку
            this.classList.add('filter-btn--active');
            this.setAttribute('aria-pressed', 'true');

            const filterValue = this.getAttribute('data-filter');

            // Сначала определяем какие карточки скрыть, какие показать
            const toHide = [];
            const toShow = [];

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    toShow.push(card);
                } else {
                    toHide.push(card);
                }
            });

            // Сначала анимируем скрытие
            toHide.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
            });

            // После анимации скрытия - скрываем и показываем нужные
            setTimeout(() => {
                toHide.forEach(card => {
                    card.style.display = 'none';
                });

                toShow.forEach(card => {
                    // Сначала делаем невидимым но показываем
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    card.style.display = '';

                    // Затем анимируем появление
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        });
                    });
                });

                // Объявляем результат для screen readers
                if (liveRegion) {
                    const filterName = this.textContent.trim();
                    const count = toShow.length;
                    liveRegion.textContent = `Показано ${count} ${getProjectWord(count)} в категории "${filterName}"`;
                }
            }, 200);
        });
    });

    // Вспомогательная функция для правильного склонения
    function getProjectWord(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'проектов';
        if (lastDigit === 1) return 'проект';
        if (lastDigit >= 2 && lastDigit <= 4) return 'проекта';
        return 'проектов';
    }
});
