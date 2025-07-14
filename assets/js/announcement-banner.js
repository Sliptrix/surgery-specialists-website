/* Surgery Specialists of St. Louis - Announcement Banner */

class AnnouncementBanner {
    constructor() {
        this.currentIndex = 0;
        this.items = document.querySelectorAll('.announcement-item');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.banner-nav.prev');
        this.nextBtn = document.querySelector('.banner-nav.next');
        this.autoRotateInterval = null;
        this.autoRotateDelay = 5000; // 5 seconds
        this.isVisible = true;
        
        this.init();
    }
    
    init() {
        if (this.items.length === 0) return;
        
        this.setupEventListeners();
        this.startAutoRotate();
        this.setupVisibilityDetection();
        
        console.log('✅ Announcement banner initialized with', this.items.length, 'items');
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.showPrevious());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.showNext());
        }
        
        // Indicator dots
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showItem(index));
        });
        
        // Pause on hover
        const banner = document.querySelector('.announcement-banner');
        if (banner) {
            banner.addEventListener('mouseenter', () => this.pauseAutoRotate());
            banner.addEventListener('mouseleave', () => this.resumeAutoRotate());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const banner = document.querySelector('.announcement-banner');
            if (!banner) return;
            
            // Only respond to keys when banner is focused or contains focus
            if (!banner.contains(document.activeElement)) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.showPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.showNext();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoRotate();
                    break;
            }
        });
    }
    
    setupVisibilityDetection() {
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRotate();
            } else {
                this.resumeAutoRotate();
            }
        });
        
        // Use Intersection Observer to detect if banner is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) {
                    this.resumeAutoRotate();
                } else {
                    this.pauseAutoRotate();
                }
            });
        }, { threshold: 0.5 });
        
        const banner = document.querySelector('.announcement-banner');
        if (banner) {
            observer.observe(banner);
        }
    }
    
    showItem(index) {
        if (index < 0 || index >= this.items.length) return;
        
        // Remove active class from current item and indicator
        this.items[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        
        // Add active class to new item and indicator
        this.currentIndex = index;
        this.items[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        
        // Reset auto-rotate timer
        this.resetAutoRotate();
        
        // Analytics tracking
        this.trackInteraction('banner_view', {
            index: this.currentIndex,
            content: this.items[this.currentIndex].textContent.trim()
        });
    }
    
    showNext() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.showItem(nextIndex);
        this.trackInteraction('banner_next');
    }
    
    showPrevious() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showItem(prevIndex);
        this.trackInteraction('banner_prev');
    }
    
    startAutoRotate() {
        if (this.autoRotateInterval) return;
        
        this.autoRotateInterval = setInterval(() => {
            if (this.isVisible) {
                this.showNext();
            }
        }, this.autoRotateDelay);
    }
    
    pauseAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    resumeAutoRotate() {
        if (!this.autoRotateInterval && this.isVisible) {
            this.startAutoRotate();
        }
    }
    
    resetAutoRotate() {
        this.pauseAutoRotate();
        this.resumeAutoRotate();
    }
    
    toggleAutoRotate() {
        if (this.autoRotateInterval) {
            this.pauseAutoRotate();
        } else {
            this.resumeAutoRotate();
        }
    }
    
    trackInteraction(action, data = {}) {
        // Track banner interactions for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'banner_interaction',
                ...data
            });
        }
        
        console.log('📊 Banner interaction:', action, data);
    }
    
    // Public method to add new announcements dynamically
    addAnnouncement(content, insertAtIndex = null) {
        const bannerText = document.querySelector('.banner-text');
        const bannerIndicators = document.querySelector('.banner-indicators');
        
        if (!bannerText || !bannerIndicators) return;
        
        // Create new announcement item
        const newItem = document.createElement('div');
        newItem.className = 'announcement-item';
        newItem.setAttribute('data-index', this.items.length);
        newItem.innerHTML = content;
        
        // Create new indicator
        const newIndicator = document.createElement('span');
        newIndicator.className = 'indicator';
        newIndicator.setAttribute('data-index', this.items.length);
        newIndicator.addEventListener('click', () => this.showItem(this.items.length));
        
        // Insert elements
        if (insertAtIndex !== null && insertAtIndex < this.items.length) {
            bannerText.insertBefore(newItem, this.items[insertAtIndex]);
            bannerIndicators.insertBefore(newIndicator, this.indicators[insertAtIndex]);
        } else {
            bannerText.appendChild(newItem);
            bannerIndicators.appendChild(newIndicator);
        }
        
        // Update references
        this.items = document.querySelectorAll('.announcement-item');
        this.indicators = document.querySelectorAll('.indicator');
        
        console.log('✅ New announcement added:', content.substring(0, 50) + '...');
    }
    
    // Public method to remove announcement
    removeAnnouncement(index) {
        if (index < 0 || index >= this.items.length || this.items.length <= 1) return;
        
        // Remove elements
        this.items[index].remove();
        this.indicators[index].remove();
        
        // Update references and indices
        this.items = document.querySelectorAll('.announcement-item');
        this.indicators = document.querySelectorAll('.indicator');
        
        // Update data-index attributes
        this.items.forEach((item, i) => {
            item.setAttribute('data-index', i);
        });
        this.indicators.forEach((indicator, i) => {
            indicator.setAttribute('data-index', i);
        });
        
        // Adjust current index if necessary
        if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        }
        
        // Show current item
        this.showItem(this.currentIndex);
        
        console.log('✅ Announcement removed at index:', index);
    }
}

// Initialize banner when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.announcementBanner = new AnnouncementBanner();
});

// Export for use in other modules
window.SurgerySpecialists = window.SurgerySpecialists || {};
window.SurgerySpecialists.AnnouncementBanner = AnnouncementBanner;
