/**
 * Фильтрация проектов - чистый JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Инициализация - устанавливаем начальные стили
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));

            // Добавляем активный класс на текущую кнопку
            this.classList.add('filter-btn--active');

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
            }, 200);
        });
    });
});
