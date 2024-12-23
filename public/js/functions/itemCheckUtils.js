// itemCheckUtils.js
import logger from '../logging.js';

// Function to mark an item as checked when found and ensure it's skipped in future checks
export function markItemAsChecked(itemLabelStr, checkedItems) {
    const listItems = document.querySelectorAll('li[data-item]');
    listItems.forEach((listItem) => {
        if (listItem.dataset.item === itemLabelStr) {
            // Add the 'answered' class to change the border color
            listItem.classList.add('answered');
            checkedItems.add(itemLabelStr);

            // Check if the checkmark icon already exists
            if (!listItem.querySelector('.checkmark-icon')) {
                // Create a checkmark icon
                const checkmarkIcon = document.createElement('span');
                checkmarkIcon.classList.add('checkmark-icon');
                checkmarkIcon.innerHTML = `
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" fill="var(--correct-answer-color)"/>
                    </svg>
                `;
                listItem.appendChild(checkmarkIcon); // Append checkmark icon
            }
        }
    });
}