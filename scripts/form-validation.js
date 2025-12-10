document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;

        if (field.required && !value) {
            if (name === 'name') return 'Пожалуйста, введите ваше имя';
            if (name === 'email') return 'Пожалуйста, введите email';
            if (name === 'message') return 'Пожалуйста, введите сообщение';
            return 'Это поле обязательно для заполнения';
        }

        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            if (name === 'name') return `Имя должно содержать минимум ${minLength} символа`;
            if (name === 'message') return `Сообщение должно содержать минимум ${minLength} символов`;
            return `Минимум ${minLength} символов`;
        }

        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Пожалуйста, введите корректный email адрес';
            }
        }

        if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                return 'Пожалуйста, введите корректный номер телефона';
            }
        }

        return '';
    }

    function updateFieldState(field, errorMessage) {
        const isTextarea = field.tagName === 'TEXTAREA';
        const validClass = isTextarea ? 'form-textarea--valid' : 'form-input--valid';
        const invalidClass = isTextarea ? 'form-textarea--invalid' : 'form-input--invalid';
        const errorElement = document.getElementById(`${field.name}-error`);

        if (errorMessage) {
            field.classList.remove(validClass);
            field.classList.add(invalidClass);
            field.setAttribute('aria-invalid', 'true');

            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        } else {
            field.classList.remove(invalidClass);
            field.classList.add(validClass);
            field.setAttribute('aria-invalid', 'false');

            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    function resetFieldState(field) {
        field.classList.remove(
            'form-input--valid',
            'form-input--invalid',
            'form-textarea--valid',
            'form-textarea--invalid'
        );
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

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
            const successMessage = document.getElementById('formSuccess');
            if (successMessage) {
                successMessage.classList.remove('alert--hidden');
                successMessage.focus();

                setTimeout(() => {
                    successMessage.classList.add('alert--hidden');
                }, 5000);
            }

            form.reset();
            fields.forEach(resetFieldState);

            console.log('Форма успешно отправлена!');
        } else {
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    });

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

        input.addEventListener('blur', function() {
            if (this.required || this.value.length > 0) {
                const errorMessage = validateField(this);
                updateFieldState(this, errorMessage);
            }
        });
    });
});
