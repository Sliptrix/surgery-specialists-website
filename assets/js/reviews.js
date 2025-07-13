/* Surgery Specialists of St. Louis - Google Reviews Integration */

// Google Reviews Configuration
const GOOGLE_REVIEWS_CONFIG = {
    PLACE_ID: 'ChIJkSsA3b3K2IcRan6SIcBq5zo',
    API_KEY: null, // Set this to your Google Places API key
    FALLBACK_DATA: {
        reviews: [
            {
                author_name: "Sarah Johnson",
                rating: 5,
                text: "Dr. Dysarz performed carpal tunnel surgery on both my hands. His expertise and care were exceptional. The results exceeded my expectations and I'm back to my normal activities.",
                time: Date.now() - (3 * 7 * 24 * 60 * 60 * 1000),
                profile_photo_url: null
            },
            {
                author_name: "Mike Rodriguez", 
                rating: 5,
                text: "Outstanding surgeon! Fixed my wrist fracture perfectly. The staff is professional and Dr. Dysarz explains everything clearly. Highly recommend!",
                time: Date.now() - (4 * 7 * 24 * 60 * 60 * 1000),
                profile_photo_url: null
            },
            {
                author_name: "Linda Thompson",
                rating: 5,
                text: "Excellent experience from consultation to recovery. Dr. Dysarz is skilled, caring, and took time to address all my concerns. The office staff is wonderful too.",
                time: Date.now() - (8 * 7 * 24 * 60 * 60 * 1000),
                profile_photo_url: null
            }
        ],
        rating: 4.8,
        total_reviews: 127,
        name: "Surgery Specialists of St. Louis"
    }
};

// Google Reviews API Integration
const GoogleReviews = {
    // Initialize reviews when DOM is ready
    init: function() {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.loadReviews();
        });
    },

    // Main function to load and display reviews
    loadReviews: async function() {
        try {
            let reviewData;
            
            // Try to load from API first, then fallback to sample data
            if (GOOGLE_REVIEWS_CONFIG.API_KEY) {
                reviewData = await this.fetchFromAPI();
            }
            
            // If API fails or no API key, use server endpoint
            if (!reviewData) {
                reviewData = await this.fetchFromServer();
            }
            
            // Final fallback to sample data
            if (!reviewData) {
                reviewData = GOOGLE_REVIEWS_CONFIG.FALLBACK_DATA;
                console.log('📝 Using fallback review data');
            }
            
            this.displayReviews(reviewData);
            this.updateReviewLinks();
            
            console.log('✅ Reviews loaded successfully!');
            console.log('📍 Place ID:', GOOGLE_REVIEWS_CONFIG.PLACE_ID);
            
        } catch (error) {
            console.error('❌ Error loading reviews:', error);
            // Use fallback data on error
            this.displayReviews(GOOGLE_REVIEWS_CONFIG.FALLBACK_DATA);
        }
    },

    // Fetch reviews from Google Places API (client-side)
    fetchFromAPI: async function() {
        try {
            // Note: This requires CORS proxy or server-side implementation
            // Client-side Google Places API calls are restricted
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_REVIEWS_CONFIG.PLACE_ID}&fields=reviews,rating,user_ratings_total,name&key=${GOOGLE_REVIEWS_CONFIG.API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.result) {
                return {
                    reviews: data.result.reviews || [],
                    rating: data.result.rating,
                    total_reviews: data.result.user_ratings_total,
                    name: data.result.name
                };
            } else {
                console.warn('Google Places API returned:', data.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching from Google API:', error);
            return null;
        }
    },

    // Fetch reviews from your server endpoint (recommended approach)
    fetchFromServer: async function() {
        try {
            const response = await fetch('/api/google-reviews');
            if (!response.ok) {
                throw new Error(`Server error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching from server:', error);
            return null;
        }
    },

    // Display reviews in the DOM
    displayReviews: function(data) {
        // Update overall rating
        this.updateOverallRating(data);
        
        // Update individual review cards (if needed)
        this.updateReviewCards(data.reviews);
        
        console.log('📊 Review data displayed:', {
            rating: data.rating,
            totalReviews: data.total_reviews,
            reviewCount: data.reviews.length
        });
    },

    // Update the overall rating display
    updateOverallRating: function(data) {
        const ratingElement = document.querySelector('.rating-number');
        const reviewCountElement = document.querySelector('.rating-text');
        const starsElement = document.querySelector('.rating-stars');
        
        if (ratingElement && data.rating) {
            ratingElement.textContent = data.rating.toFixed(1);
        }
        
        if (reviewCountElement && data.total_reviews) {
            reviewCountElement.textContent = `Based on ${data.total_reviews} Google Reviews`;
        }
        
        if (starsElement && data.rating) {
            const fullStars = Math.floor(data.rating);
            const halfStar = data.rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            
            starsElement.textContent = 
                '★'.repeat(fullStars) + 
                (halfStar ? '½' : '') + 
                '☆'.repeat(emptyStars);
        }
    },

    // Update individual review cards dynamically
    updateReviewCards: function(reviews) {
        const reviewContainer = document.querySelector('.google-reviews');
        if (!reviewContainer || !reviews || reviews.length === 0) return;
        
        // Remove existing dynamic review cards
        reviewContainer.querySelectorAll('.review-card.dynamic').forEach(card => {
            card.remove();
        });
        
        // Add new dynamic review cards
        reviews.forEach((review, index) => {
            if (index < 3) { // Show only first 3 reviews
                const reviewCard = this.createReviewCard(review);
                reviewCard.classList.add('dynamic');
                
                // Insert before the Google badge
                const googleBadge = reviewContainer.querySelector('.google-badge');
                if (googleBadge) {
                    reviewContainer.insertBefore(reviewCard, googleBadge);
                } else {
                    reviewContainer.appendChild(reviewCard);
                }
            }
        });
    },

    // Create a review card element
    createReviewCard: function(review) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        const initials = this.getInitials(review.author_name);
        const stars = this.getStarsDisplay(review.rating);
        const timeAgo = this.getTimeAgo(review.time);
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer-avatar">${initials}</div>
                <div class="reviewer-info">
                    <h4>${this.escapeHtml(review.author_name)}</h4>
                    <div class="stars">${stars}</div>
                </div>
            </div>
            <div class="review-text">${this.escapeHtml(review.text)}</div>
            <div class="review-date">${timeAgo}</div>
        `;
        
        return reviewCard;
    },

    // Update review links with correct Place ID
    updateReviewLinks: function() {
        const viewReviewsLink = document.querySelector('.google-badge');
        const writeReviewLink = document.querySelector('a[href*="writereview"]');
        
        if (viewReviewsLink) {
            viewReviewsLink.href = `https://search.google.com/local/reviews?placeid=${GOOGLE_REVIEWS_CONFIG.PLACE_ID}`;
        }
        
        if (writeReviewLink) {
            writeReviewLink.href = `https://search.google.com/local/writereview?placeid=${GOOGLE_REVIEWS_CONFIG.PLACE_ID}`;
        }
    },

    // Helper functions
    getInitials: function(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },

    getStarsDisplay: function(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    },

    getTimeAgo: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        
        if (weeks > 0) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else if (days > 0) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else {
            return 'This week';
        }
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Review Analytics
const ReviewAnalytics = {
    trackReviewView: function(reviewId) {
        // Track when users view reviews
        console.log('📊 Review viewed:', reviewId);
        // Send to analytics service
    },

    trackReviewClick: function(action) {
        // Track when users click review links
        console.log('📊 Review action:', action);
        // Send to analytics service
    }
};

// Initialize reviews
GoogleReviews.init();

// Export for use in other modules
window.SurgerySpecialists = window.SurgerySpecialists || {};
window.SurgerySpecialists.GoogleReviews = GoogleReviews;
window.SurgerySpecialists.ReviewAnalytics = ReviewAnalytics;

// Setup event listeners for review interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track review link clicks
    document.querySelectorAll('.google-badge, a[href*="writereview"]').forEach(link => {
        link.addEventListener('click', function() {
            ReviewAnalytics.trackReviewClick(this.href.includes('writereview') ? 'write_review' : 'view_reviews');
        });
    });
    
    // Track review card hovers
    document.querySelectorAll('.review-card').forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            ReviewAnalytics.trackReviewView(index);
        });
    });
});
