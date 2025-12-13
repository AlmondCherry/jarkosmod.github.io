// JARKOS MOD - Crimson Mod for Terraria
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initParallax();
    initGallery();
    initScrollAnimations();
    initInstallationGuide();
    initFloatingSpheres(); // Плавающие сферы вместо дождя
    initLogoBanner();
    initLanguageToggle();
    initMainDeveloperParticles();
    initBloodWashAnimation(); // Анимация смывания крови
    
    // Show main content after loading
    setTimeout(() => {
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== ПЛАВАЮЩИЕ СФЕРЫ ====================
function initFloatingSpheres() {
    const canvas = document.getElementById('floating-spheres');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Класс для сфер
    class FloatingSphere {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Случайные начальные параметры
            this.radius = Math.random() * 40 + 10; // 10-50px
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Скорость движения
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            
            // Прозрачность
            this.opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
            
            // Цветовые вариации красного
            const redBase = 139; // Базовый красный цвет (#8b0000)
            const redVariation = Math.floor(Math.random() * 50);
            this.color = `rgba(${redBase + redVariation}, 0, 0, ${this.opacity})`;
            
            // Пульсация
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.baseRadius = this.radius;
            
            // Движение по синусоиде
            this.waveAmplitude = Math.random() * 2 + 1;
            this.waveFrequency = Math.random() * 0.02 + 0.01;
            this.wavePhase = Math.random() * Math.PI * 2;
            
            // Время жизни
            this.life = 1;
            this.maxLife = 10000 + Math.random() * 20000;
            this.age = 0;
        }
        
        update(deltaTime) {
            this.age += deltaTime;
            
            // Постепенное исчезновение и перерождение
            this.life = 1 - (this.age / this.maxLife);
            
            if (this.life <= 0) {
                this.reset();
                this.life = 1;
                this.age = 0;
                return;
            }
            
            // Движение
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Волнообразное движение
            this.x += Math.sin(this.age * this.waveFrequency + this.wavePhase) * this.waveAmplitude * 0.1;
            this.y += Math.cos(this.age * this.waveFrequency * 0.7 + this.wavePhase) * this.waveAmplitude * 0.1;
            
            // Пульсация радиуса
            this.radius = this.baseRadius * (1 + Math.sin(this.age * this.pulseSpeed + this.pulsePhase) * 1.9);
            
            // Отражение от границ
            if (this.x < -this.radius) {
                this.x = canvas.width + this.radius;
            } else if (this.x > canvas.width + this.radius) {
                this.x = -this.radius;
            }
            
            if (this.y < -this.radius) {
                this.y = canvas.height + this.radius;
            } else if (this.y > canvas.height + this.radius) {
                this.y = -this.radius;
            }
            
            // Медленное изменение направления
            this.speedX += (Math.random() - 0.5) * 0.002;
            this.speedY += (Math.random() - 0.5) * 0.002;
            
            // Ограничение скорости
            const maxSpeed = 0.8;
            const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            if (speed > maxSpeed) {
                this.speedX = (this.speedX / speed) * maxSpeed;
                this.speedY = (this.speedY / speed) * maxSpeed;
            }
        }
        
        draw() {
            ctx.save();
            
            // Градиент для эффекта свечения
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 1.5
            );
            
            gradient.addColorStop(0, `rgba(255, 50, 50, ${this.opacity * this.life * 0.8})`);
            gradient.addColorStop(0.5, `rgba(139, 0, 0, ${this.opacity * this.life * 0.5})`);
            gradient.addColorStop(1, `rgba(74, 0, 0, ${this.opacity * this.life * 0.1})`);
            
            // Основная сфера
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Внутреннее свечение
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 100, ${this.opacity * this.life * 0.3})`;
            ctx.fill();
            
            // Блики
            ctx.beginPath();
            ctx.arc(
                this.x - this.radius * 0.3,
                this.y - this.radius * 0.3,
                this.radius * 0.2,
                0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 200, 200, ${this.opacity * this.life * 0.4})`;
            ctx.fill();
            
            // Внешнее свечение
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 0, 0, ${this.opacity * this.life * 0.05})`;
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Инициализация сфер
    const spheres = [];
    const sphereCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 80000));
    
    for (let i = 0; i < sphereCount; i++) {
        spheres.push(new FloatingSphere());
        // Разнообразим начальные позиции
        spheres[i].age = Math.random() * spheres[i].maxLife;
    }
    
    let lastTime = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let mouseRadius = 550;
    
    // Следим за мышью
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Анимация
    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 16 || 1;
        lastTime = currentTime;
        
        // Очищаем с прозрачностью для эффекта шлейфа
        ctx.fillStyle = 'rgba(15, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Обновляем и рисуем сферы
        spheres.forEach(sphere => {
            // Взаимодействие с мышью (отталкивание)
            const dx = sphere.x - mouseX;
            const dy = sphere.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                sphere.x += Math.cos(angle) * force * 5;
                sphere.y += Math.sin(angle) * force * 5;
                
                // Увеличиваем пульсацию при приближении к мыши
                sphere.pulseSpeed = 0.05;
            } else {
                sphere.pulseSpeed = 0.005 + Math.random() * 0.02;
            }
            
            sphere.update(deltaTime);
            sphere.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Запуск анимации
    requestAnimationFrame(animate);
    
    // Изменение количества сфер при изменении размера окна
    window.addEventListener('resize', () => {
        // Добавляем новые сферы, если увеличилось окно
        const newSphereCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 80000));
        
        while (spheres.length < newSphereCount) {
            const sphere = new FloatingSphere();
            spheres.push(sphere);
        }
        
        // Удаляем лишние сферы, если уменьшилось окно
        while (spheres.length > newSphereCount) {
            spheres.pop();
        }
    });
}

// ==================== АНИМАЦИЯ СМЫВАНИЯ КРОВИ ====================
function initBloodWashAnimation() {
    const overlay = document.getElementById('blood-wash-overlay');
    if (!overlay) return;
    
    const dripContainer = overlay.querySelector('.blood-drip-container');
    
    // Создаём капли крови
    function createBloodDrips() {
        const dripCount = 30;
        const splashCount = 10;
        
        // Создаём капли
        for (let i = 0; i < dripCount; i++) {
            setTimeout(() => {
                const drip = document.createElement('div');
                drip.className = 'blood-drip';
                
                // Случайные параметры
                const left = Math.random() * 100;
                const height = 100 + Math.random() * 200;
                const delay = Math.random() * 0.5;
                const duration = 0.5 + Math.random() * 1;
                const width = 1 + Math.random() * 3;
                
                // Устанавливаем стили
                drip.style.left = `${left}%`;
                drip.style.height = `${height}px`;
                drip.style.width = `${width}px`;
                drip.style.animationDelay = `${delay}s`;
                drip.style.animationDuration = `${duration}s`;
                drip.style.opacity = '0.7';
                
                // Анимация падения
                drip.style.animation = `dripFall ${duration}s cubic-bezier(0.55, 0, 1, 0.45) ${delay}s forwards`;
                
                // Добавляем в контейнер
                dripContainer.appendChild(drip);
                
                // Создаём брызг при "падении"
                setTimeout(() => {
                    createBloodSplash(left, overlay.offsetHeight - 50);
                }, delay * 1000 + duration * 1000);
                
            }, i * 100);
        }
        
        // Создаём случайные брызги
        for (let i = 0; i < splashCount; i++) {
            setTimeout(() => {
                const splash = document.createElement('div');
                splash.className = 'blood-splash';
                
                const left = Math.random() * 100;
                const top = 20 + Math.random() * 80;
                const size = 20 + Math.random() * 40;
                
                splash.style.left = `${left}%`;
                splash.style.top = `${top}%`;
                splash.style.width = `${size}px`;
                splash.style.height = `${size * 0.5}px`;
                splash.style.opacity = '0.4';
                splash.style.animation = `splashFade 1s ease-out ${Math.random() * 0.5}s forwards`;
                
                dripContainer.appendChild(splash);
            }, i * 200);
        }
    }
    
    // Создаём брызг крови
    function createBloodSplash(xPercent, yPos) {
        const splashCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < splashCount; i++) {
            setTimeout(() => {
                const splash = document.createElement('div');
                splash.className = 'blood-splash';
                
                const x = (xPercent / 100) * window.innerWidth;
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = Math.random() * -30;
                const size = 10 + Math.random() * 30;
                
                splash.style.left = `${x + offsetX}px`;
                splash.style.top = `${yPos + offsetY}px`;
                splash.style.width = `${size}px`;
                splash.style.height = `${size * 0.4}px`;
                splash.style.opacity = '0.6';
                splash.style.animation = `splashFade 0.8s ease-out forwards`;
                
                dripContainer.appendChild(splash);
                
                // Удаляем через время
                setTimeout(() => {
                    if (splash.parentNode) {
                        splash.parentNode.removeChild(splash);
                    }
                }, 800);
            }, i * 50);
        }
    }
    
    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dripFall {
            0% {
                transform: translateY(-100px) scaleY(0.5);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(${window.innerHeight}px) scaleY(1);
                opacity: 0;
            }
        }
        
        @keyframes splashFade {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }
            100% {
                transform: scale(0.8);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Запускаем анимацию
    createBloodDrips();
    
    // Удаляем overlay через 3 секунды
    setTimeout(() => {
        overlay.style.animation = 'bloodWashAway 1s ease-out forwards';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 1000);
    }, 3000);
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Menu icon animation
        const bars = menuToggle.querySelectorAll('.menu-bar');
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const bars = menuToggle.querySelectorAll('.menu-bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
}

// ==================== PARALLAX EFFECT ====================
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// ==================== GALLERY ====================
function initGallery() {
    const galleryItems = document.querySelectorAll('.featured-item');
    
    galleryItems.forEach((item, index) => {
        // Delay for appearance animation
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Hover effect
        item.addEventListener('mouseenter', () => {
            const image = item.querySelector('.featured-image');
            if (image) {
                image.style.filter = 'sepia(0.3) contrast(1.2) brightness(0.95)';
            }
            
            // Light glow
            item.style.boxShadow = '0 0 20px rgba(139, 0, 0, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            const image = item.querySelector('.featured-image');
            if (image) {
                image.style.filter = 'sepia(0.4) contrast(1.1) brightness(0.9)';
            }
            item.style.boxShadow = '';
        });
        
        // Click to enlarge
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('step-action')) {
                const image = item.querySelector('.featured-image');
                if (image && image.src) {
                    const title = item.querySelector('h3');
                    openImageModal(image.src, title ? title.textContent : 'Image');
                }
            }
        });
    });
}

// Image modal window
function openImageModal(src, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content pixel-border">
            <button class="modal-close">&times;</button>
            <h3>${title}</h3>
            <img src="${src}" alt="${title}">
            <p>Press ESC or click outside the image to close</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Styles for modal window
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: #1a0a0a;
            padding: 2rem;
            max-width: 90%;
            max-height: 90%;
            position: relative;
            animation: scaleIn 0.3s ease;
        }
        
        .modal-content img {
            max-width: 100%;
            max-height: 70vh;
            margin: 1rem 0;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #8b0000;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.8); }
            to { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal window
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            document.body.style.overflow = 'auto';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close on ESC
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escClose);
        }
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with class fade-in
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        el.dataset.delay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe team cards
    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.dataset.delay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ==================== INTERACTIVE GUIDE ====================
function initInstallationGuide() {
    const stepCards = document.querySelectorAll('.step-card');
    const stepActions = document.querySelectorAll('.step-action');
    
    stepCards.forEach((card, index) => {
        // Hover animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateY(-5px) rotate(${index % 2 === 0 ? 0.5 : -0.5}deg)`;
            card.style.boxShadow = '0 5px 15px rgba(139, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0deg)';
            card.style.boxShadow = '';
        });
        
        // Light pulse for step number
        const stepNumber = card.querySelector('.step-number');
        if (stepNumber) {
            setInterval(() => {
                stepNumber.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stepNumber.style.transform = 'scale(1)';
                }, 500);
            }, 4000 + (index * 1000));
        }
    });
    
    // Action button handlers
    stepActions.forEach((action, index) => {
        action.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Press animation
            action.style.transform = 'scale(0.95)';
            setTimeout(() => {
                action.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ==================== BANNER WITH FLYING ICONS ====================
function initLogoBanner() {
    const banner = document.querySelector('.jarkos-banner');
    const iconsContainer = document.querySelector('.floating-icons-container');
    const bannerTitle = document.querySelector('.banner-title');
    
    if (!banner || !iconsContainer) return;
    
    // Clear container
    iconsContainer.innerHTML = '';
    
    // Create floating icons
    const iconCount = 12;
    const icons = [];
    
    for (let i = 0; i < iconCount; i++) {
        const icon = document.createElement('img');
        icon.src = 'assets/images/jarkos-logo.png';
        icon.alt = 'Jarkos Icon';
        icon.className = 'floating-icon';
        
        // Random initial parameters for each icon
        const iconData = {
            element: icon,
            x: Math.random() * banner.offsetWidth,
            y: Math.random() * banner.offsetHeight,
            speedX: (Math.random() - 0.5) * 2 + 0.5,
            speedY: (Math.random() - 0.5) * 2 + 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 3,
            size: 40 + Math.random() * 40,
            orbitRadius: 100 + Math.random() * 200,
            orbitSpeed: 0.002 + Math.random() * 0.004,
            orbitAngle: Math.random() * Math.PI * 2,
            orbitCenterX: banner.offsetWidth / 2,
            orbitCenterY: banner.offsetHeight / 2,
            chaosFactor: Math.random() * 0.02 + 0.01,
            movementType: Math.random() > 0.5 ? 'orbit' : 'chaotic',
            lastTime: Date.now()
        };
        
        // Set size
        icon.style.width = `${iconData.size}px`;
        icon.style.height = `${iconData.size}px`;
        
        // Set initial position
        icon.style.left = `${iconData.x}px`;
        icon.style.top = `${iconData.y}px`;
        
        iconsContainer.appendChild(icon);
        icons.push(iconData);
    }
    
    // Animation on title load
    if (bannerTitle) {
        bannerTitle.style.opacity = '0';
        bannerTitle.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
            bannerTitle.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bannerTitle.style.opacity = '1';
            bannerTitle.style.transform = 'scale(1) translateY(0)';
        }, 300);
    }
    
    // Animation function
    function animateIcons() {
        const currentTime = Date.now();
        const deltaTime = Math.min((currentTime - (icons[0]?.lastTime || currentTime)) / 16, 2);
        
        icons.forEach(iconData => {
            if (!iconData.element.parentElement) return;
            
            const icon = iconData.element;
            iconData.lastTime = currentTime;
            
            if (iconData.movementType === 'orbit') {
                // Orbital movement around center
                iconData.orbitAngle += iconData.orbitSpeed * deltaTime;
                
                // Add chaos to orbit
                iconData.orbitRadius += Math.sin(currentTime * 0.001) * 10;
                
                // Calculate position on orbit
                iconData.x = iconData.orbitCenterX + 
                           Math.cos(iconData.orbitAngle) * iconData.orbitRadius +
                           Math.sin(currentTime * 0.001 * iconData.chaosFactor) * 30;
                
                iconData.y = iconData.orbitCenterY + 
                           Math.sin(iconData.orbitAngle * 0.8) * (iconData.orbitRadius * 0.7) +
                           Math.cos(currentTime * 0.001 * iconData.chaosFactor * 1.3) * 30;
                
                // Rotation
                iconData.rotation += iconData.rotationSpeed * deltaTime;
                
            } else {
                // Chaotic free movement
                iconData.x += iconData.speedX * deltaTime;
                iconData.y += iconData.speedY * deltaTime;
                
                // Bounce from borders
                if (iconData.x < -50 || iconData.x > banner.offsetWidth + 50) {
                    iconData.speedX *= -1;
                    iconData.speedX += (Math.random() - 0.5) * 0.5;
                }
                
                if (iconData.y < -50 || iconData.y > banner.offsetHeight + 50) {
                    iconData.speedY *= -1;
                    iconData.speedY += (Math.random() - 0.5) * 0.5;
                }
                
                // Smooth speed change
                iconData.speedX += (Math.random() - 0.5) * iconData.chaosFactor;
                iconData.speedY += (Math.random() - 0.5) * iconData.chaosFactor;
                
                // Speed limit
                const maxSpeed = 3;
                const speed = Math.sqrt(iconData.speedX * iconData.speedX + iconData.speedY * iconData.speedY);
                if (speed > maxSpeed) {
                    iconData.speedX = (iconData.speedX / speed) * maxSpeed;
                    iconData.speedY = (iconData.speedY / speed) * maxSpeed;
                }
                
                // Rotation
                iconData.rotation += (iconData.speedX + iconData.speedY) * 0.5;
            }
            
            // Apply transformations
            icon.style.left = `${iconData.x}px`;
            icon.style.top = `${iconData.y}px`;
            icon.style.transform = `rotate(${iconData.rotation}deg)`;
            
            // Floating effect
            const floatOffset = Math.sin(currentTime * 0.003 + iconData.x * 0.01) * 3;
            icon.style.transform += ` translateY(${floatOffset}px)`;
            
            // Opacity change for depth
            const distanceFromCenter = Math.sqrt(
                Math.pow(iconData.x - banner.offsetWidth / 2, 2) + 
                Math.pow(iconData.y - banner.offsetHeight / 2, 2)
            );
            const maxDistance = Math.sqrt(
                Math.pow(banner.offsetWidth / 2, 2) + 
                Math.pow(banner.offsetHeight / 2, 2)
            );
            const opacity = 0.4 + (1 - distanceFromCenter / maxDistance) * 0.4;
            icon.style.opacity = opacity.toString();
        });
        
        requestAnimationFrame(animateIcons);
    }
    
    // Start animation
    animateIcons();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            icons.forEach(iconData => {
                iconData.orbitCenterX = banner.offsetWidth / 2;
                iconData.orbitCenterY = banner.offsetHeight / 2;
                
                // If icon went out of bounds, return it
                if (iconData.x < -100 || iconData.x > banner.offsetWidth + 100 ||
                    iconData.y < -100 || iconData.y > banner.offsetHeight + 100) {
                    iconData.x = Math.random() * banner.offsetWidth;
                    iconData.y = Math.random() * banner.offsetHeight;
                }
            });
        }, 100);
    });
    
    // Periodic glow change for title
    if (bannerTitle) {
        setInterval(() => {
            const intensity = 0.5 + Math.random() * 0.5;
            bannerTitle.style.textShadow = `
                3px 3px 0 var(--color-primary-dark),
                6px 6px 0 rgba(0, 0, 0, 0.5),
                0 0 ${30 * intensity}px rgba(139, 0, 0, ${0.3 + intensity * 0.2})
            `;
        }, 2000);
    }
}

// ==================== LANGUAGE TOGGLE ====================
function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    if (!languageToggle) return;
    
    // Define translations
    const translations = {
        en: {
            // Navigation
            'nav.features': 'Content',
            'nav.gallery': 'Crimson Saga',
            'nav.installation': 'Installation',
            'nav.changelog': 'Updates',
            'nav.team': 'Team',
            'nav.community': 'Community',
            
            // Banner
            'banner.subtitle': 'Crimson Mod for Terraria',
            
            // Hero section
            'hero.title': 'ADVENTURE AWAITS',
            'hero.subtitle': 'Enter the world of Crimson Saga',
            'hero.description': 'Discover new bosses, biomes, items and exciting mechanics in this massive Terraria expansion',
            
            // Stats
            'stats.items': 'Items',
            'stats.bosses': 'New Bosses',
            'stats.class': 'New Class',
            
            // Buttons
            'buttons.workshop': 'Steam Workshop',
            'buttons.explore': 'Explore World',
            'buttons.download': 'Download',
            'buttons.instructions': 'Instructions',
            'buttons.start': 'Start Game',
            
            // Sections
            'sections.features': 'What does the mod add?',
            'sections.gallery': 'Crimson Saga',
            'sections.installation': 'Installation',
            'sections.changelog': 'Updates',
            'sections.team': 'Development Team',
            'sections.community': 'Community',
            
            // Content items
            'content.1.title': '300+ items',
            'content.1.description': 'The mod contains over 300 items in total',
            'content.2.title': '2 new bosses',
            'content.2.description': 'Unique bosses with interesting mechanics',
            'content.3.title': '100+ weapons',
            'content.3.description': 'Over 100 different weapons for all playstyles',
            'content.4.title': '50+ accessories',
            'content.4.description': 'Over 50 accessories with unique effects',
            'content.5.title': 'New class',
            'content.5.description': 'New fifth playable class "Mechanoids"',
            'content.6.title': 'New mechanics',
            'content.6.description': 'Many new mechanics and systems for gameplay variety',
            
            // Gallery
            'gallery.1.title': 'Crimson Eden',
            'gallery.1.p1': 'Once upon a time, a civilization believing in decency and one God flourished in these crimson sands. The crosses in this biome contained the accumulated blood of innocent and brutally executed inhabitants.',
            'gallery.1.p2': 'Thus, Crimson Eden turned into an almost dead desert, where only some architectures of past generations remained, and crimson crosses, which were, surprisingly, extremely durable. The entire desert was soaked in anger and injustice.',
            'gallery.1.p3': 'All these accumulated feelings, held for a long time in the soil, gave the opportunity for one of the most ancient Gods of vengeance to be born. Alas, soon after this, many left this place. Now this is clearly not Eden, but only a desert soaked in negative thoughts and condemnations.',
            'gallery.2.title': 'Tenderot',
            'gallery.2.p1': 'Tenderot is the most current God of vengeance after the death of Charon. Visually, it is a huge creature, remotely resembling a worm, with scales made of the strongest material - nitozium.',
            'gallery.2.p2': 'This God contradicts his divine brethren with his principles. He sees revenge in everything, and his obsession has long become like "blindfold" - he sees no progress in anyone or anything. His perception of the world is distorted by the eternal thirst for retribution, which makes him both powerful and blind to the true nature of things.',
            'gallery.3.title': 'Death Goddess',
            'gallery.3.p1': 'An ancient deity personifying not the end, but the transition. Unlike Tenderot, whose essence is permeated with personal resentment and thirst for revenge, the Death Goddess represents an impersonal, inexorable force of natural order.',
            'gallery.3.p2': 'She does not feel hatred, does not strive for destruction for the sake of destruction. Her existence is a guarantee that everything that has a beginning will have an end. In her presence, time flows differently, and matter reminds of its mortality.',
            'gallery.3.p3': 'Her appearance in Crimson Eden was a response to the violation of the natural balance caused by the birth of Tenderot from accumulated injustice. She is the necessary opposite, a force striving to restore disturbed harmony, even if it requires putting an end to an entire era.',
            
            // Steps
            'steps.1.title': 'Install tModLoader',
            'steps.1.description': 'Download tModLoader via Steam or from the official website',
            'steps.2.title': 'Subscribe to Jarkos',
            'steps.2.description': 'Go to Steam Workshop and subscribe to Jarkos mod',
            'steps.3.title': 'Activate the mod',
            'steps.3.description': 'Launch tModLoader and enable Jarkos in the mods menu',
            'steps.4.title': 'Start the game',
            'steps.4.description': 'Create a new world and start your adventure',
            
            // Changelog
            'changelog.new': 'New features:',
            'changelog.changes': 'Changes:',
            'changelog.weapons': 'Weapons:',
            'changelog.accessories': 'Accessories:',
            'changelog.other': 'Other:',
            'changelog.generation': 'Generation:',
            'changelog.change1': 'Many item recipes have been changed',
            'changelog.change2': 'Disterian Ring heals 33% 5% of maximum health every 0.833 30 seconds',
            'changelog.materials': 'Materials:',
            'changelog.melee': 'Melee Weapons:',
            'changelog.ranged': 'Ranged Weapons:',
            'changelog.magic': 'Magic Weapons:',
            'changelog.summoner': 'Summoner Weapons:',
            
            // Team
            'team.subtitle': 'Creators of the Crimson Saga',
            'team.lead.badge': 'LEAD DEVELOPER',
            'team.lead.role': 'Lead mod developer, architect of Crimson Saga',
            'team.lead.description': 'Creator of JARKOS world, main programmer and designer',
            'team.shmel.role': 'Video editing, promotion, website creation',
            'team.shmel.description': 'Responsible for visual presentation and project marketing',
            'team.kermitus.role': 'Drawing most armor sets',
            'team.kermitus.description': 'Artist creating unique visual styles for equipment',
            'team.autism.role': 'Drawing sprites',
            'team.autism.description': 'Creator of detailed sprites for items and creatures',
            'team.winda.role': 'Drawing sprites and translation assistance',
            'team.winda.description': 'Artist and linguist responsible for localization',
            'team.banana.role': 'Drawing sprites, code assistance and many ideas',
            'team.banana.description': 'Multidisciplinary contributor involved in all aspects of development',
            'team.kknat.role': 'Motivation and inspiration',
            'team.kknat.description': 'Motivator who inspired the team and kept everyone going',
            
            // Community
            'community.discord': 'Discussion, help, theories',
            'community.youtube': 'Guides, playthroughs, lore',
            'community.github': 'Source code, suggestions',
            
            // Download
            'download.title': 'Start Your Journey',
            'download.version': 'Current version:',
            'download.note': 'Requires tModLoader',
            
            // Footer
            'footer.mod': 'Mod for Terraria',
            'footer.navigation': 'Navigation',
            'footer.resources': 'Resources',
            'footer.authors': 'Authorship',
            'footer.description': 'Jarkos Mod created for Terraria enthusiasts.',
            'footer.copyright': 'Terraria © Re-Logic. All rights reserved.',
            
            // Badges
            'badges.biome': 'New Biome',
            'badges.boss': 'Boss',
        },
        ru: {
            // Navigation
            'nav.features': 'Контент',
            'nav.gallery': 'Багровая сага',
            'nav.installation': 'Установка',
            'nav.changelog': 'Обновления',
            'nav.team': 'Команда',
            'nav.community': 'Сообщество',
            
            // Banner
            'banner.subtitle': 'Багровый мод для Terraria',
            
            // Hero section
            'hero.title': 'ПРИКЛЮЧЕНИЕ ЖДЕТ',
            'hero.subtitle': 'Войди в мир Багровой саги',
            'hero.description': 'Открой для себя новые боссы, биомы, предметы и увлекательные механики в этом масштабном дополнении для Terraria',
            
            // Stats
            'stats.items': 'Предметов',
            'stats.bosses': 'Новых босса',
            'stats.class': 'Новый класс',
            
            // Buttons
            'buttons.workshop': 'Steam Workshop',
            'buttons.explore': 'Исследовать мир',
            'buttons.download': 'Скачать',
            'buttons.instructions': 'Инструкция',
            'buttons.start': 'Начать игру',
            
            // Sections
            'sections.features': 'Что добавляет мод?',
            'sections.gallery': 'Багровая сага',
            'sections.installation': 'Установка',
            'sections.changelog': 'Обновления',
            'sections.team': 'Команда разработчиков',
            'sections.community': 'Сообщество',
            
            // Content items
            'content.1.title': '300+ предметов',
            'content.1.description': 'В общей сложности мод содержит более 300 предметов',
            'content.2.title': '2 новых босса',
            'content.2.description': 'Уникальные боссы с интересными механиками',
            'content.3.title': '100+ оружия',
            'content.3.description': 'Более 100 различного оружия для всех стилей игры',
            'content.4.title': '50+ аксессуаров',
            'content.4.description': 'Более 50 аксессуаров с уникальными эффектами',
            'content.5.title': 'Новый класс',
            'content.5.description': 'Новый пятый игровой класс "механоидов"',
            'content.6.title': 'Новые механики',
            'content.6.description': 'Множество новых механик и систем для разнообразия геймплея',
            
            // Gallery
            'gallery.1.title': 'Багровый Эдем',
            'gallery.1.p1': 'Когда-то в этих багровых песках процветала цивилизация, верующая в порядочность и единого Бога. Кресты в данном биоме содержали накопленную кровь невинных и жестоко казнённых жителей.',
            'gallery.1.p2': 'Так Багровый Эдем превратился в практически мёртвую пустыню, где остались лишь некоторые архитектуры прошлых поколений, и багровые кресты, которые были, на удивление, чрезвычайно крепкими. Вся пустыня была пропитана гневом и несправедливостью.',
            'gallery.1.p3': 'Все эти накопленные чувства, что держались долгое время в почве, дали возможность появиться на свет одному из древнейших Богов мести. Увы, вскоре после этого многие покинули это место. Теперь это явно не Эдем, а лишь пустыня, пропитанная негативными мыслями и осуждениями.',
            'gallery.2.title': 'Тендерот',
            'gallery.2.p1': 'Тендерот является самым нынешним Богом мести после гибели Харона. Визуально представляет из себя огромное существо, отдалённо похожее на червя, с чешуёй из самого прочного материала - нитозиума.',
            'gallery.2.p2': 'Данный Бог противоречит своими принципами своим божественным собратьям. Он видит во всём месть, и его одержимость уже давно стала подобием "повязки для глаз" - он не видит ни в ком, или в чём-либо, прогресс. Его восприятие мира искажено вечной жаждой возмездия, что делает его одновременно могущественным и слепым к истинной природе вещей.',
            'gallery.3.title': 'Богиня Смерти',
            'gallery.3.p1': 'Древнее божество, олицетворяющее не конец, а переход. В отличие от Тендерота, чья сущность пропитана личной обидой и жаждой мести, Богиня Смерти представляет собой безличную, неумолимую силу природного порядка.',
            'gallery.3.p2': 'Она не испытывает ненависти, не стремится к разрушению ради разрушения. Её существование - это гарантия того, что всё, что имеет начало, будет иметь и завершение. В её присутствии время течёт иначе, а материя напоминает о своей бренности.',
            'gallery.3.p3': 'Её появление в Багровом Эдеме стало ответом на нарушение естественного баланса, вызванное рождением Тендерота из накопленной несправедливости. Она - необходимая противоположность, сила, стремящаяся восстановить нарушенную гармонию, даже если для этого потребуется положить конец целой эпохе.',
            
            // Steps
            'steps.1.title': 'Установите tModLoader',
            'steps.1.description': 'Загрузите tModLoader через Steam или с официального сайта',
            'steps.2.title': 'Подпишитесь на Jarkos',
            'steps.2.description': 'Перейдите в Steam Workshop и подпитесь на мод Jarkos',
            'steps.3.title': 'Активируйте мод',
            'steps.3.description': 'Запустите tModLoader и включите Jarkos в меню модов',
            'steps.4.title': 'Начните игру',
            'steps.4.description': 'Создайте новый мир и начните своё приключение',
            
            // Changelog
            'changelog.new': 'Нововведения:',
            'changelog.changes': 'Изменения:',
            'changelog.weapons': 'Оружие:',
            'changelog.accessories': 'Аксессуары:',
            'changelog.other': 'Другое:',
            'changelog.generation': 'Генерация:',
            'changelog.change1': 'Многие рецепты предметов изменены',
            'changelog.change2': 'Кольцо Дистериана исцеляет на 33% 5% от максимального здоровья каждые 0.833 30 секунд',
            'changelog.materials': 'Материалы:',
            'changelog.melee': 'Оружие ближнего боя:',
            'changelog.ranged': 'Оружие дальнего боя:',
            'changelog.magic': 'Оружие магического боя:',
            'changelog.summoner': 'Оружие прямого повреждения:',
            
            // Team
            'team.subtitle': 'Творцы Багровой саги',
            'team.lead.badge': 'ГЛАВНЫЙ РАЗРАБОТЧИК',
            'team.lead.role': 'Ведущий разработчик мода, архитектор Багровой саги',
            'team.lead.description': 'Создатель мира JARKOS, основной программист и дизайнер',
            'team.shmel.role': 'Монтаж видео, продвижение, создание сайта',
            'team.shmel.description': 'Отвечает за визуальную составляющую и маркетинг проекта',
            'team.kermitus.role': 'Рисование большинства комплектов брони',
            'team.kermitus.description': 'Художник, создающий уникальные визуальные стили для экипировки',
            'team.autism.role': 'Рисование спрайтов',
            'team.autism.description': 'Создатель детализированных спрайтов предметов и существ',
            'team.winda.role': 'Рисование спрайтов и помощь в переводе',
            'team.winda.description': 'Художник и лингвист, отвечающий за локализацию',
            'team.banana.role': 'Рисование спрайтов, помощь с кодом и идеями',
            'team.banana.description': 'Мультидисциплинарный участник, вносящий вклад во все аспекты разработки',
            'team.kknat.role': 'Мотивация и вдохновение',
            'team.kknat.description': 'Мотиватор, который вдохновлял команду и поддерживал всех',
            
            // Community
            'community.discord': 'Обсуждение, помощь, теории',
            'community.youtube': 'Гайды, прохождения, лор',
            'community.github': 'Исходный код, предложения',
            
            // Download
            'download.title': 'Начните своё путешествие',
            'download.version': 'Текущая версия:',
            'download.note': 'Требуется tModLoader',
            
            // Footer
            'footer.mod': 'Мод для Terraria',
            'footer.navigation': 'Навигация',
            'footer.resources': 'Ресурсы',
            'footer.authors': 'Авторство',
            'footer.description': 'Jarkos Mod создан для ценителей Terraria.',
            'footer.copyright': 'Terraria © Re-Logic. Все права защищены.',
            
            // Badges
            'badges.biome': 'Новый биом',
            'badges.boss': 'Босс',
        }
    };
    
    // Set default language to English
    let currentLang = 'en';
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('jarkos_lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }
    
    // Apply translation
    function applyTranslation(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = translations[lang][key];
                } else if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', translations[lang][key]);
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update button text
        languageToggle.querySelector('.language-text').textContent = 
            lang === 'en' ? 'RU' : 'EN';
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Save preference
        localStorage.setItem('jarkos_lang', lang);
        currentLang = lang;
    }
    
    // Initialize with current language
    applyTranslation(currentLang);
    
    // Toggle language on button click
    languageToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ru' : 'en';
        applyTranslation(newLang);
    });
}

// ==================== MAIN DEVELOPER PARTICLES ====================
function initMainDeveloperParticles() {
    const mainDev = document.getElementById('main-developer');
    if (!mainDev) return;
    
    const particlesContainer = document.getElementById('main-dev-particles');
    if (!particlesContainer) return;
    
    let particles = [];
    let animationId = null;
    let isHovering = false;
    
    // Create particle
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position around avatar
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const x = 100 + Math.cos(angle) * distance;
        const y = 100 + Math.sin(angle) * distance;
        
        // Set initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random properties
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random speed and direction
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const opacity = 0.3 + Math.random() * 0.7;
        const life = 1000 + Math.random() * 2000; // 1-3 seconds
        
        particles.push({
            element: particle,
            x: x,
            y: y,
            speedX: speedX,
            speedY: speedY,
            opacity: opacity,
            life: life,
            age: 0,
            size: size
        });
        
        particle.style.opacity = opacity;
        particlesContainer.appendChild(particle);
    }
    
    // Animate particles
    function animateParticles(timestamp) {
        if (!animationId) {
            animationId = timestamp;
        }
        
        const deltaTime = timestamp - animationId;
        animationId = timestamp;
        
        // Create new particles if hovering
        if (isHovering && Math.random() > 0.7) {
            createParticle();
        }
        
        // Update existing particles
        particles = particles.filter(particle => {
            particle.age += deltaTime;
            
            // Remove old particles
            if (particle.age > particle.life) {
                particle.element.remove();
                return false;
            }
            
            // Update position
            particle.x += particle.speedX * (deltaTime / 16);
            particle.y += particle.speedY * (deltaTime / 16);
            
            // Add some randomness to movement
            particle.speedX += (Math.random() - 0.5) * 0.1;
            particle.speedY += (Math.random() - 0.5) * 0.1;
            
            // Apply gravity-like effect
            particle.speedY += 0.02;
            
            // Update opacity (fade out)
            const lifeRatio = particle.age / particle.life;
            particle.element.style.opacity = particle.opacity * (1 - lifeRatio);
            
            // Update size (shrink)
            const currentSize = particle.size * (1 - lifeRatio * 0.5);
            particle.element.style.width = `${currentSize}px`;
            particle.element.style.height = `${currentSize}px`;
            
            // Update position
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            
            return true;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    requestAnimationFrame(animateParticles);
    
    // Hover events
    mainDev.addEventListener('mouseenter', () => {
        isHovering = true;
        
        // Create initial burst of particles
        for (let i = 0; i < 20; i++) {
            createParticle();
        }
        
        // Enhance glow effect
        const avatar = mainDev.querySelector('.team-avatar');
        if (avatar) {
            avatar.style.animationDuration = '1s';
            avatar.style.boxShadow = 
                '0 0 50px rgba(255, 0, 0, 0.8), ' +
                '0 0 100px rgba(139, 0, 0, 0.6), ' +
                '0 0 150px rgba(139, 0, 0, 0.4)';
        }
    });
    
    mainDev.addEventListener('mouseleave', () => {
        isHovering = false;
        
        // Restore normal glow
        const avatar = mainDev.querySelector('.team-avatar');
        if (avatar) {
            avatar.style.animationDuration = '2s';
            avatar.style.boxShadow = 
                '0 0 30px rgba(139, 0, 0, 0.6), ' +
                '0 0 60px rgba(139, 0, 0, 0.4), ' +
                '0 0 90px rgba(139, 0, 0, 0.2)';
        }
    });
    
    // Create some initial particles for effect
    for (let i = 0; i < 10; i++) {
        createParticle();
    }
}

// ==================== UTILITIES ====================
// Handle image errors
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Set fallback image
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232a0000"/><text x="50%" y="50%" font-family="monospace" font-size="20" fill="%23d46a6a" text-anchor="middle" dominant-baseline="middle">JARKOS</text></svg>';
        e.target.alt = 'Image not loaded';
    }
}, true);

// Keyboard support
document.addEventListener('keydown', function(e) {
    // Escape closes menu and modal windows
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }
});

// Loading animation
window.addEventListener('load', function() {
    // Start animations after loading
    initScrollAnimations();

});

