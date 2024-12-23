import logger from './logging.js';

// frontend.js: Logic for the homepage interactions
logger.log('App initialized.');

// Adjust the banner size when scrolling on the index page
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('banner');

    // Send notification when the homepage is visited for the first time
    const browser = navigator.userAgent;
    const device = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';

    fetch('/api/tracking/track-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event: 'First Time Visit to Homepage',
            browser,
            device,
        }),
    })
    .then(response => response.json())
    .then(data => logger.log('First time visit tracked successfully:', data))
    .catch(error => logger.error('Error tracking visit:', error));

    if (banner) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                banner.classList.add('shrink');
            } else {
                banner.classList.remove('shrink');
            }
        });
    }

    // Add event listener for "Try Now" button click
    const tryNowButton = document.querySelector('.try-now-button');
    if (tryNowButton) {
        tryNowButton.addEventListener('click', function() {
            // Capture browser, device type, and event
            const browser = navigator.userAgent;
            const device = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';

            // Send event data to the serverless API
            fetch('/api/tracking/track-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'Try Now Button Clicked',
                    browser,
                    device,
                }),
            })
            .then(response => response.json())
            .then(data => logger.log('Event tracked successfully:', data))
            .catch(error => logger.error('Error tracking event:', error));
        });
    }
});
