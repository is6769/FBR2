// Данные о проектах для Bootstrap Modal
const projectsData = {
    project1: {
        title: 'Личный сайт',
        description: 'Адаптивный личный веб-сайт с современным дизайном и анимациями. Включает портфолио, биографию и контактную форму. Проект создан с использованием чистого HTML и CSS без использования фреймворков.',
        technologies: ['HTML5', 'CSS3', 'CSS Grid', 'Flexbox', 'Media Queries'],
        features: [
            'Адаптивный дизайн для всех устройств',
            'Современные CSS-анимации',
            'Семантическая разметка',
            'Оптимизированные изображения'
        ],
        liveLink: '#',
        githubLink: '#'
    },
    project2: {
        title: 'Todo-приложение',
        description: 'Интерактивное приложение для управления задачами с возможностью фильтрации, редактирования и сохранения данных в localStorage. Полностью функциональное приложение на чистом JavaScript.',
        technologies: ['JavaScript ES6', 'LocalStorage API', 'DOM Manipulation', 'CSS3'],
        features: [
            'Добавление, редактирование и удаление задач',
            'Фильтрация по статусу',
            'Сохранение данных в localStorage',
            'Счетчик активных задач'
        ],
        liveLink: '#',
        githubLink: '#'
    },
    project3: {
        title: 'Интернет-магазин',
        description: 'SPA приложение интернет-магазина с корзиной, фильтрацией товаров и системой оформления заказов. Использует React и Redux для управления состоянием приложения.',
        technologies: ['React', 'Redux', 'React Router', 'Styled Components'],
        features: [
            'Каталог товаров с фильтрацией',
            'Корзина покупок',
            'Система оформления заказа',
            'Адаптивный дизайн'
        ],
        liveLink: '#',
        githubLink: '#'
    },
    project4: {
        title: 'Портфолио Bootstrap',
        description: 'Адаптивное портфолио, созданное с использованием фреймворка Bootstrap. Включает галерею работ, форму обратной связи и анимированные компоненты.',
        technologies: ['HTML5', 'Bootstrap 5', 'jQuery', 'SASS'],
        features: [
            'Готовые компоненты Bootstrap',
            'Адаптивная сетка',
            'Модальные окна',
            'Валидация форм'
        ],
        liveLink: '#',
        githubLink: '#'
    },
    project5: {
        title: 'Калькулятор',
        description: 'Простой, но функциональный калькулятор с базовыми математическими операциями и историей вычислений. Реализован с использованием JavaScript и CSS Grid.',
        technologies: ['JavaScript', 'CSS Grid', 'HTML5'],
        features: [
            'Базовые математические операции',
            'История вычислений',
            'Клавиатурная поддержка',
            'Адаптивный интерфейс'
        ],
        liveLink: '#',
        githubLink: '#'
    },
    project6: {
        title: 'Погодное приложение',
        description: 'React-приложение для просмотра текущей погоды и прогноза с использованием API OpenWeatherMap. Показывает детальную информацию о погоде в выбранном городе.',
        technologies: ['React', 'OpenWeatherMap API', 'React Hooks', 'Axios'],
        features: [
            'Текущая погода в режиме реального времени',
            'Прогноз на 5 дней',
            'Поиск по городам',
            'Геолокация'
        ],
        liveLink: '#',
        githubLink: '#'
    }
};

// Функция для загрузки данных проекта в Bootstrap Modal
function loadProject(projectId) {
    const project = projectsData[projectId];
    
    if (project) {
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h2 class="mb-3">${project.title}</h2>
            <p class="lead">${project.description}</p>
            
            <h4 class="mt-4 mb-3">Технологии:</h4>
            <div class="mb-3">
                ${project.technologies.map(tech => `<span class="badge bg-primary me-1 mb-1">${tech}</span>`).join('')}
            </div>
            
            <h4 class="mt-4 mb-3">Основные возможности:</h4>
            <ul class="list-group list-group-flush mb-3">
                ${project.features.map(feature => `<li class="list-group-item"><i class="bi bi-check-circle text-success me-2"></i>${feature}</li>`).join('')}
            </ul>
            
            <div class="d-flex gap-2 mt-4">
                <a href="${project.liveLink}" class="btn btn-primary" target="_blank">
                    <i class="bi bi-eye me-1"></i>Посмотреть демо
                </a>
                <a href="${project.githubLink}" class="btn btn-outline-dark" target="_blank">
                    <i class="bi bi-github me-1"></i>GitHub
                </a>
            </div>
        `;
    }
}

// Глобальная функция для совместимости с onclick
window.loadProject = loadProject;
