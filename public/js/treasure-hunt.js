import { handleFileUpload } from './functions/handleFileUpload.js';
import { createTreasureHuntList } from './functions/treasureHuntUtils.js';
import { fetchMuseums, displayMuseumCarousel } from './functions/museumUtils.js';
import logger from './logging.js';

let selectedItems = []; // This is now globally managed
let checkedItems = new Set();
let selectedMuseum = null;

function selectMuseum(museum) {
    selectedMuseum = museum;
    const selectedMuseumNameElement = document.getElementById('selectedMuseumName');
    selectedMuseumNameElement.innerHTML = `You have selected:<br> <span class="highlighted-text"> ${museum.name}</span>`;
    
    // Show the "Change Museum" button and hide the carousel
    document.getElementById('changeMuseumButton').style.display = 'block';
    document.getElementById('museumCarouselContainer').style.display = 'none';
    document.getElementById('createListButton').style.display = 'block';
    logger.log('Selected museum:', selectedMuseum);
}

function changeMuseum() {
    selectedMuseum = null;
    selectedItems = []; // Clear selected items
    checkedItems.clear();
    document.getElementById('result').textContent = '';
    
    // Reset UI: show carousel, hide change museum button, and reset the selected museum name
    document.getElementById('selectedMuseumName').textContent = 'Select a museum';
    document.getElementById('changeMuseumButton').style.display = 'none';
    document.getElementById('createListButton').style.display = 'none';
    document.getElementById('customUploadLabel').style.display = 'none';
    document.getElementById('imageUpload').style.display = 'none';
    document.getElementById('treasureList').innerHTML = '';
    document.getElementById('museumCarouselContainer').style.display = 'block';
    logger.log('Museum selection reset.');
}

document.addEventListener('DOMContentLoaded', () => {
    const createListButton = document.getElementById('createListButton');
    const imageUpload = document.getElementById('imageUpload');
    const changeMuseumButton = document.getElementById('changeMuseumButton');
    const backToHomeButton = document.getElementById('backToHomeButton');

    // Define browser and device information for tracking
    const browser = navigator.userAgent;
    const device = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';

    fetch('/api/tracking/track-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event: 'First Time Visit to Treasure Hunt Page',
            browser,
            device,
        }),
    })
    .then(response => response.json())
    .then(data => logger.log('First time visit tracked successfully:', data))
    .catch(error => logger.error('Error tracking visit:', error));

    if (createListButton) {
        createListButton.addEventListener('click', async () => {
            // Send notification when the "Create Treasure Hunt List" button is clicked
            const browser = navigator.userAgent;
            const device = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';

            fetch('/api/tracking/track-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'Create Treasure Hunt List Button Clicked',
                    browser,
                    device,
                }),
            })
            .then(response => response.json())
            .then(data => logger.log('Event tracked successfully:', data))
            .catch(error => logger.error('Error tracking event:', error));

            // Pass the current selectedItems to the function
            selectedItems = await createTreasureHuntList(selectedMuseum, checkedItems, selectedItems);
            logger.log('Treasure hunt list (after regeneration/cancel):', selectedItems);

            if (selectedItems.length > 0) {
                document.getElementById('customUploadLabel').style.display = 'block';
                document.getElementById('imageUpload').style.display = 'block';
            }
        });
        logger.log('Event listener added to createListButton.');
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', (event) => {
            if (selectedItems.length > 0) {
                handleFileUpload(event, selectedItems, checkedItems);
            } else {
                document.getElementById('result').textContent = 'Please create a treasure hunt list first.';
                logger.warn('Attempted to upload image without creating a treasure hunt list.');
            }
        });
        logger.log('Event listener added to imageUpload.');
    }

    if (changeMuseumButton) {
        changeMuseumButton.addEventListener('click', changeMuseum);
        logger.log('Event listener added to changeMuseumButton.');
    }

    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        logger.log('Event listener added to backToHomeButton.');
    }

    fetchMuseums(displayMuseumCarousel, selectMuseum);
});
