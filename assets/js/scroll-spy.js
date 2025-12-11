/**
 * Anacoluthe - Index Page
 * Scroll spy pour la navigation par pills
 */

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navPills = document.querySelectorAll('.nav-pill[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('href') === '#' + current) {
                pill.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
});
