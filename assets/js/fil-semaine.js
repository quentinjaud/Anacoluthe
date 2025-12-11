/**
 * Anacoluthe - Le fil de la semaine
 * Navigation slider + scroll spy
 */

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.fil-section');
    const steps = document.querySelectorAll('.fil-step');
    
    // ===========================================
    // SCROLL SPY - Intersection Observer
    // ===========================================
    
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveStep(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // ===========================================
    // UPDATE ACTIVE STEP
    // ===========================================
    
    function updateActiveStep(sectionId) {
        steps.forEach(step => {
            const stepSection = step.getAttribute('data-section');
            step.classList.toggle('active', stepSection === sectionId);
        });
    }
    
    // ===========================================
    // CLICK NAVIGATION
    // ===========================================
    
    steps.forEach(step => {
        step.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===========================================
    // KEYBOARD NAVIGATION
    // ===========================================
    
    document.addEventListener('keydown', function(e) {
        // Desktop seulement (snap scroll)
        if (window.innerWidth < 769) return;
        
        const currentActive = document.querySelector('.fil-step.active');
        if (!currentActive) return;
        
        const stepsArray = Array.from(steps).filter(s => !s.classList.contains('fil-step-sos'));
        const currentIndex = stepsArray.indexOf(currentActive);
        
        let targetStep = null;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < stepsArray.length - 1) {
                targetStep = stepsArray[currentIndex + 1];
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) {
                targetStep = stepsArray[currentIndex - 1];
            }
        }
        
        if (targetStep) {
            targetStep.click();
        }
    });
    
    // ===========================================
    // INITIAL STATE
    // ===========================================
    
    // Activer le premier step au chargement
    if (steps.length > 0) {
        steps[0].classList.add('active');
    }
    
    // Si URL avec hash, scroller vers la section
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});
