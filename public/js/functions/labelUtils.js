// public/js/functions/labelUtils.js
import { apiRequest } from './api.js';
import logger from '../logging.js';

export async function loadLabelsForSelectedMuseum(acronym, hallname = null) {
    try {
        // Prepare the payload with museum acronym and optional hall name
        const payload = {
            acronym,
            hallname,
        };

        // Call the backend API to load labels with a POST request
        const response = await apiRequest('/api/label/label', 'POST', payload);
        const labels = response.labels;

        if (labels.length === 0) {
            document.getElementById('result').textContent = 'No labels found for this museum or hall.';
            return [];
        }

        logger.log(`Loaded ${labels.length} labels for museum ${acronym} and hall ${hallname || 'all'}`);
        return labels;
    } catch (error) {
        logger.error('Error loading labels:', error);
        document.getElementById('result').textContent = 'Failed to load exhibit labels. Please try again.';
        return [];
    }
}
