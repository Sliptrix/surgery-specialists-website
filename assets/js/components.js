/* Surgery Specialists of St. Louis - Interactive Components */

// Placeholder for additional interactive component functionality

// Example Accordion Component
document.addEventListener('DOMContentLoaded', function() {
    setupAccordion();
});

function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((accordion) => {
        accordion.querySelector('.accordion-header').addEventListener('click', () => {
            const accordionContent = accordion.querySelector('.accordion-content');
            accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
        });
    });
}

// Export for use in other modules
window.SurgerySpecialists = window.SurgerySpecialists || {};
window.SurgerySpecialists.Components = {
    setupAccordion
};
