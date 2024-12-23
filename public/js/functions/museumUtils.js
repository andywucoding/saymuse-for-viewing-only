// public/js/functions/museumUtils.js
import { apiRequest } from './api.js';
import logger from '../logging.js';

// Function to fetch the list of museums from the backend
export async function fetchMuseums(displayMuseumCarousel, selectMuseum) {
    try {
        const response = await apiRequest('/api/museum/museum', 'GET');
        const museums = response.museums;

        displayMuseumCarousel(museums, selectMuseum);
        logger.log('Museums fetched and displayed:', museums);
    } catch (error) {
        logger.error('Error fetching museums:', error);
    }
}

// Function to display the museum carousel
export function displayMuseumCarousel(museums, selectMuseum) {
    const carouselContainer = document.getElementById('museumCarouselContainer');
    carouselContainer.innerHTML = '';
    carouselContainer.style.display = 'flex';
    carouselContainer.style.overflowX = 'auto';
    carouselContainer.style.margin = '20px auto';
    carouselContainer.style.maxWidth = '800px';

    museums.forEach((museum) => {
        const museumCard = document.createElement('div');
        museumCard.classList.add('museum-card');
        museumCard.textContent = museum.name;
        museumCard.style.padding = '10px';
        museumCard.style.margin = '10px';
        museumCard.style.border = '2px solid var(--accent-color)';
        museumCard.style.borderRadius = '10px';
        museumCard.style.cursor = 'pointer';
        museumCard.style.backgroundColor = '#fff';
        museumCard.addEventListener('click', () => selectMuseum(museum));

        carouselContainer.appendChild(museumCard);
    });

    logger.log('Museum carousel displayed with', museums.length, 'museums.');
}
