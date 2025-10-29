
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            
            if (form.checkValidity()) {
                
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const message = document.getElementById('message').value.trim();
                
                let isValid = true;
                
                
                if (name.length < 2) {
                    document.getElementById('name').classList.add('is-invalid');
                    isValid = false;
                } else {
                    document.getElementById('name').classList.remove('is-invalid');
                    document.getElementById('name').classList.add('is-valid');
                }
                
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    document.getElementById('email').classList.add('is-invalid');
                    isValid = false;
                } else {
                    document.getElementById('email').classList.remove('is-invalid');
                    document.getElementById('email').classList.add('is-valid');
                }
                
                
                if (phone && phone.length > 0) {
                    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                    if (!phoneRegex.test(phone) || phone.length < 10) {
                        document.getElementById('phone').classList.add('is-invalid');
                        isValid = false;
                    } else {
                        document.getElementById('phone').classList.remove('is-invalid');
                        document.getElementById('phone').classList.add('is-valid');
                    }
                }
                
                
                if (message.length < 10) {
                    document.getElementById('message').classList.add('is-invalid');
                    isValid = false;
                } else {
                    document.getElementById('message').classList.remove('is-invalid');
                    document.getElementById('message').classList.add('is-valid');
                }
                
                
                if (isValid) {
                    console.log('Форма валидна!', { name, email, phone, message });
                    
                    
                    const successMessage = document.getElementById('formSuccess');
                    if (successMessage) {
                        successMessage.classList.remove('d-none');
                        
                        
                        setTimeout(() => {
                            successMessage.classList.add('d-none');
                        }, 5000);
                    }
                    
                    
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    
                    form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                        el.classList.remove('is-valid', 'is-invalid');
                    });
                }
            }
            
            form.classList.add('was-validated');
        }, false);
        
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    if (this.checkValidity()) {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    } else {
                        this.classList.remove('is-valid');
                        this.classList.add('is-invalid');
                    }
                } else {
                    this.classList.remove('is-valid', 'is-invalid');
                }
            });
        });
    }
});
