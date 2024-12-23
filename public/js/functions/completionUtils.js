// completionUtils.jsf
import logger from '../logging.js';

// Function to check if all items are found (i.e., all checkboxes checked)
export function checkCompletion(checkedItems, selectedItems) {
    if (checkedItems.size === selectedItems.length) {
        displayBadgeModal(); // Call the badge function when all items are found
    }
}

// Function to display the badge modal with a randomly selected badge and exciting compliments
function displayBadgeModal() {
    const modal = document.getElementById('badgeModal');
    const modalContent = document.getElementById('badgeContent');
    const badgeNumber = Math.floor(Math.random() * 5) + 1;
    const badgeImage = `/assets/images/badges/hmns/badge-${badgeNumber}.webp`;

    const compliments = [
        "Incredible! You've uncovered all the treasures. Claim your badge and dive into a new challenge!",
        "Outstanding! You've earned a special badge for your brilliance. Ready to hunt for more treasures?",
        "You're a treasure-hunting champion! Keep the momentum going and try for another badge!",
        "Amazing job! Your badge collection just got even cooler. How about one more round?",
        "Well done! You've unlocked this special badge. Can you top that score with the next hunt?"
    ];

    const compliment = compliments[Math.floor(Math.random() * compliments.length)];

    modalContent.innerHTML = `
        <h2 class="compliment-text" style="color: var(--primary-color); font-family: 'Fredoka'; font-weight: normal;">
            ${compliment}
        </h2>
        <img src="${badgeImage}" alt="Badge Image" class="badge-image" style="border-radius: 15px;" />
        <button id="restartButton" style="background-color: var(--secondary-color); color: var(--neutral-color); padding: 10px 20px; border-radius: 10px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease; font-family: 'Fredoka';">Restart Game</button>
    `;

    modal.style.display = 'block';

    document.getElementById('restartButton').addEventListener('click', () => {
        modal.style.display = 'none';
        restartGame();
    });
}

function restartGame() {
    const checkedItems = new Set();
    document.getElementById('treasureList').innerHTML = '';
    logger.log('Game restarted');
}