/**
 * Валидация форм - чистый JavaScript с поддержкой доступности
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    /**
     * Валидирует поле и возвращает сообщение об ошибке или пустую строку
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;

        // Проверка обязательности
        if (field.required && !value) {
            if (name === 'name') return 'Пожалуйста, введите ваше имя';
            if (name === 'email') return 'Пожалуйста, введите email';
            if (name === 'message') return 'Пожалуйста, введите сообщение';
            return 'Это поле обязательно для заполнения';
        }

        // Проверка минимальной длины
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            if (name === 'name') return `Имя должно содержать минимум ${minLength} символа`;
            if (name === 'message') return `Сообщение должно содержать минимум ${minLength} символов`;
            return `Минимум ${minLength} символов`;
        }

        // Проверка email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Пожалуйста, введите корректный email адрес';
            }
        }

        // Проверка телефона (если заполнен)
        if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                return 'Пожалуйста, введите корректный номер телефона';
            }
        }

        return ''; // Нет ошибок
    }

    /**
     * Обновляет визуальное состояние поля и ARIA атрибуты
     */
    function updateFieldState(field, errorMessage) {
        const isTextarea = field.tagName === 'TEXTAREA';
        const validClass = isTextarea ? 'form-textarea--valid' : 'form-input--valid';
        const invalidClass = isTextarea ? 'form-textarea--invalid' : 'form-input--invalid';
        const errorElement = document.getElementById(`${field.name}-error`);

        if (errorMessage) {
            // Поле невалидно
            field.classList.remove(validClass);
            field.classList.add(invalidClass);
            field.setAttribute('aria-invalid', 'true');

            if (errorElement) {
                errorElement.textContent = errorMessage;
                field.setAttribute('aria-describedby', `${field.name}-hint ${field.name}-error`);
            }
        } else {
            // Поле валидно
            field.classList.remove(invalidClass);
            field.classList.add(validClass);
            field.setAttribute('aria-invalid', 'false');

            if (errorElement) {
                errorElement.textContent = '';
                field.setAttribute('aria-describedby', `${field.name}-hint`);
            }
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
        field.removeAttribute('aria-invalid');

        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const fields = form.querySelectorAll('input, textarea');
        let formIsValid = true;
        let firstInvalidField = null;

        fields.forEach(field => {
            const errorMessage = validateField(field);
            updateFieldState(field, errorMessage);

            if (errorMessage && !firstInvalidField) {
                formIsValid = false;
                firstInvalidField = field;
            }
        });

        if (formIsValid) {
            // Форма валидна - показываем сообщение об успехе
            const successMessage = document.getElementById('formSuccess');
            if (successMessage) {
                successMessage.classList.remove('alert--hidden');
                successMessage.focus();

                // Скрываем через 5 секунд
                setTimeout(() => {
                    successMessage.classList.add('alert--hidden');
                }, 5000);
            }

            // Сбрасываем форму
            form.reset();
            fields.forEach(resetFieldState);

            console.log('Форма успешно отправлена!');
        } else {
            // Фокус на первое невалидное поле
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    });

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                const errorMessage = validateField(this);
                updateFieldState(this, errorMessage);
            } else {
                resetFieldState(this);
            }
        });

        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            if (this.required || this.value.length > 0) {
                const errorMessage = validateField(this);
                updateFieldState(this, errorMessage);
            }
        });
    });
});
