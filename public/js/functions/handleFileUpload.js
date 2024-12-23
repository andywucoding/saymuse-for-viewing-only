import { compressImage } from './imageUtils.js';
import { markItemAsChecked } from './itemCheckUtils.js';
import { checkCompletion } from './completionUtils.js';
import { apiRequest } from './api.js';  // Use this for sending image to OpenAI API
import logger from '../logging.js';

/**
 * Function to handle the image upload, resize it, and send it to OpenAI API.
 */
export async function handleFileUpload(event, selectedItems, checkedItems) {
    const file = event.target.files[0];
    const resultDiv = document.getElementById('result');

    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Uploading...';  // Initial status while uploading

    if (file && selectedItems.length > 0) {
        try {
            logger.log('Selected items for comparison (List A):', selectedItems);
            logger.log('Checked items (List B):', Array.from(checkedItems)); // Items already found

            // Compress the image and convert it to base64
            const base64Image = await compressImage(file);
            logger.log('Image compressed and converted to base64:', base64Image);

            resultDiv.textContent = 'Processing...'; // Update status while processing

            // Loop through selected items and check each label
            for (const item of selectedItems) {
                const contextText = item.label_str; // Use label_str as context text

                // Send the base64 image and contextText to the OpenAI API
                const apiResponse = await apiRequest('/api/image/verify', 'POST', { 
                    image: base64Image, 
                    contextText: contextText 
                });
                logger.log('API response for item:', contextText, apiResponse);
                logger.log('response:', apiResponse.response.choices[0].message.content);

                if (apiResponse && apiResponse.response.choices[0].message.content.trim() === 'True') {
                    // If the API determines the image matches, mark it as found
                    markItemAsChecked(item.label_str, checkedItems);
                    resultDiv.textContent = `Hooray! You have found one item!`;
                    checkCompletion(checkedItems, selectedItems); // Check if all items are found
                    return; // Exit once a matching item is found
                }
            }

            resultDiv.textContent = 'Processing complete! No matching item found. Please try again.';

        } catch (error) {
            logger.error('Error during image processing:', error);
            resultDiv.textContent = 'Failed to process the image. Please try again.';
        }
    } else {
        logger.warn('No file or no selected items found for processing.');
        resultDiv.textContent = 'Please create a treasure hunt list first.';
    }
}