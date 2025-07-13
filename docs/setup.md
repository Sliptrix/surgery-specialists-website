# Setup Instructions

## Prerequisites

- Web browser (Chrome, Firefox, Safari, or Edge)
- Text editor or IDE (VS Code, Sublime Text, etc.)
- Local development server (optional but recommended)

## Quick Start

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd SSWebsite
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or serve via local development server for best experience

3. **Local Development Server (Recommended)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Project Structure

```
SSWebsite/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles
│   │   ├── components.css  # Component styles
│   │   └── responsive.css  # Responsive design
│   ├── js/
│   │   ├── main.js         # Main functionality
│   │   ├── reviews.js      # Google Reviews integration
│   │   └── components.js   # Interactive components
│   └── images/
│       └── (future assets)
├── components/
│   ├── header.html         # Header component
│   ├── hero.html          # Hero section
│   ├── services.html      # Services section
│   ├── about.html         # About section
│   ├── reviews.html       # Reviews section
│   ├── scheduling.html    # Scheduling section
│   └── footer.html        # Footer component
└── docs/
    ├── setup.md           # This file
    └── deployment.md      # Deployment guide
```

## Google Reviews Integration

### Option 1: Using Sample Data (Current Setup)
The website currently displays sample reviews. No additional setup required.

### Option 2: Live Google Reviews
1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API
3. Update `assets/js/reviews.js`:
   ```javascript
   const GOOGLE_REVIEWS_CONFIG = {
       API_KEY: 'YOUR_API_KEY_HERE',
       // ... rest of config
   };
   ```

### Option 3: Server-side Integration (Recommended)
1. Create a backend endpoint at `/api/google-reviews`
2. Use server-side Google Places API calls
3. Return JSON data matching the expected format

## Acuity Scheduling Integration

1. Get your Acuity Scheduling embed code
2. Replace the placeholder in `components/scheduling.html`:
   ```html
   <div class="acuity-placeholder">
       <!-- Replace with your Acuity embed code -->
   </div>
   ```

## Customization

### Colors and Branding
Edit `assets/css/main.css` to customize:
- Primary colors: `#2c5aa0`, `#4caf50`
- Typography: Currently using system fonts
- Logo: Update the `.logo` class

### Content Updates
- Practice information: Edit `index.html` directly
- Services: Modify the services section
- Doctor information: Update the about section
- Contact details: Update footer section

### Adding New Sections
1. Create new HTML component in `components/`
2. Add corresponding CSS in `assets/css/components.css`
3. Include in `index.html`

## Testing

### Browser Testing
Test in multiple browsers:
- Chrome (desktop and mobile)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Android Chrome)

### Responsive Testing
Test at different screen sizes:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Performance Testing
- Use browser DevTools Network tab
- Test loading times
- Optimize images and assets as needed

## Common Issues

### CSS Not Loading
- Check file paths in `index.html`
- Ensure web server is serving static files

### JavaScript Errors
- Check browser console for errors
- Verify all script files are loading properly

### Mobile Menu Not Working
- Ensure JavaScript is enabled
- Check for CSS conflicts

## SEO Optimization

The website includes:
- Meta tags for search engines
- Open Graph tags for social sharing
- Schema.org structured data
- Semantic HTML structure

## Accessibility

Features included:
- Proper heading hierarchy
- Alt text for images (when added)
- Color contrast compliance
- Keyboard navigation support
- Screen reader compatibility

## Support

For technical issues:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Test in different browsers
4. Check network connectivity for external resources

## Next Steps

1. Add real images to `assets/images/`
2. Set up Google Reviews integration
3. Integrate Acuity Scheduling
4. Customize colors and branding
5. Add more content sections as needed
6. Set up analytics tracking
7. Deploy to production server
