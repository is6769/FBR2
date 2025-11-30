/**
 * Валидация форм - чистый JavaScript (без Bootstrap)
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    // CSS классы для состояний валидации
    const VALID_CLASS = 'form-input--valid';
    const INVALID_CLASS = 'form-input--invalid';

    // Добавляем CSS стили для валидации
    const style = document.createElement('style');
    style.textContent = `
        .form-input--valid {
            border-color: var(--color-success) !important;
        }
        .form-input--invalid {
            border-color: var(--color-danger) !important;
        }
        .form-input--invalid + .form-error,
        .form-textarea--invalid + .form-error {
            display: block !important;
        }
        .form-textarea--valid {
            border-color: var(--color-success) !important;
        }
        .form-textarea--invalid {
            border-color: var(--color-danger) !important;
        }
    `;
    document.head.appendChild(style);

    /**
     * Валидирует поле и возвращает результат
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;

        // Проверка обязательности
        if (field.required && !value) {
            isValid = false;
        }

        // Проверка минимальной длины
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
        }

        // Проверка email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Проверка телефона (если заполнен)
        if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Обновляет визуальное состояние поля
     */
    function updateFieldState(field, isValid) {
        const isTextarea = field.tagName === 'TEXTAREA';
        const validClass = isTextarea ? 'form-textarea--valid' : 'form-input--valid';
        const invalidClass = isTextarea ? 'form-textarea--invalid' : 'form-input--invalid';

        if (isValid) {
            field.classList.remove(invalidClass);
            field.classList.add(validClass);
        } else {
            field.classList.remove(validClass);
            field.classList.add(invalidClass);
        }
    }

    /**
     * Сбрасывает состояние поля
     */
    function resetFieldState(field) {
        field.classList.remove(
            'form-input--valid',
            'form-input--invalid',
            'form-textarea--valid',
            'form-textarea--invalid'
        );
    }

    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const fields = form.querySelectorAll('input, textarea');
        let formIsValid = true;

        fields.forEach(field => {
            const isValid = validateField(field);
            updateFieldState(field, isValid);

            if (!isValid && field.required) {
                formIsValid = false;
            }
        });

        if (formIsValid) {
            // Форма валидна - показываем сообщение об успехе
            const successMessage = document.getElementById('formSuccess');
            if (successMessage) {
                successMessage.classList.remove('alert--hidden');

                // Скрываем через 5 секунд
                setTimeout(() => {
                    successMessage.classList.add('alert--hidden');
                }, 5000);
            }

            // Сбрасываем форму
            form.reset();
            fields.forEach(resetFieldState);

            console.log('Форма успешно отправлена!');
        }
    });

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                const isValid = validateField(this);
                updateFieldState(this, isValid);
            } else {
                resetFieldState(this);
            }
        });

        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            if (this.required || this.value.length > 0) {
                const isValid = validateField(this);
                updateFieldState(this, isValid);
            }
        });
    });
});
