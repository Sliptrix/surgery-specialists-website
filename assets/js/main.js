/* Surgery Specialists of St. Louis - Main JavaScript */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main application initialization
function initializeApp() {
    setupSmoothScrolling();
    setupScrollAnimations();
    setupHeaderEffects();
    setupMobileMenu();
    
    console.log('✅ Surgery Specialists website initialized successfully!');
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
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
}

// Fade in animations on scroll
function setupScrollAnimations() {
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

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
function setupHeaderEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(44, 90, 160, 0.95) 0%, rgba(30, 61, 108, 0.95) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c5aa0 0%, #1e3d6c 100%)';
            header.style.backdropFilter = 'none';
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Update button text based on state
            if (navLinks.classList.contains('active')) {
                this.textContent = '✕';
            } else {
                this.textContent = '☰';
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }
}

// Utility functions
const Utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format phone number for display
    formatPhoneNumber: function(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    },
    
    // Get time ago from timestamp
    getTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor(diff / (60 * 60 * 1000));
        
        if (weeks > 0) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else if (days > 0) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else {
            return 'Just now';
        }
    },
    
    // Validate email address
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone number
    validatePhone: function(phone) {
        const re = /^\(\d{3}\) \d{3}-\d{4}$/;
        return re.test(phone);
    }
};

// Performance monitoring
const Performance = {
    startTime: performance.now(),
    
    logLoadTime: function() {
        const loadTime = performance.now() - this.startTime;
        console.log(`📊 Page loaded in ${loadTime.toFixed(2)}ms`);
    },
    
    logMetrics: function() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('📈 Performance Metrics:');
            console.log(`  - DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
            console.log(`  - Page Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            console.log(`  - First Paint: ${performance.getEntriesByType('paint')[0]?.startTime || 'N/A'}ms`);
        }
    }
};

// Log performance metrics when page is fully loaded
window.addEventListener('load', function() {
    Performance.logLoadTime();
    Performance.logMetrics();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey) {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Export for use in other modules
window.SurgerySpecialists = {
    Utils,
    Performance,
    initializeApp
};
