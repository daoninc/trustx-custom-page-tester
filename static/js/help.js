// Help Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    
    // Close help page
    closeHelpBtn.addEventListener('click', () => {
        // Close the help window/tab
        window.close();
    });
    
    // Handle escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.close();
        }
    });
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add copy functionality for code blocks
    document.querySelectorAll('.code-block').forEach(block => {
        block.addEventListener('click', () => {
            const text = block.querySelector('pre').textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show temporary feedback
                const originalBg = block.style.backgroundColor;
                block.style.backgroundColor = '#2d3748';
                block.style.transition = 'background-color 0.3s ease';
                
                setTimeout(() => {
                    block.style.backgroundColor = originalBg;
                }, 300);
            });
        });
        
        // Add cursor pointer to indicate clickability
        block.style.cursor = 'pointer';
        block.title = 'Click to copy code';
    });
});
