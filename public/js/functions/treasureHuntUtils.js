import { loadLabelsForSelectedMuseum } from "./labelUtils.js";
import logger from '../logging.js';

let previouslySelectedItems = new Set();
let foundItems = new Set(); // Track found items
let isFirstCreation = true;

// Function to create the treasure hunt list with confirmation and avoiding repetition
export async function createTreasureHuntList(selectedMuseum, checkedItems, currentSelectedItems, hallname = null) {
    const resultDiv = document.getElementById('result');
    const createButton = document.getElementById('createListButton');

    // If not the first time, ask for confirmation to regenerate the list
    if (!isFirstCreation) {
        const userConfirmed = confirm('Are you sure you want to regenerate the treasure hunt list? This will replace the current list.');

        if (!userConfirmed) {
            logger.log('User canceled the list regeneration.');
            return currentSelectedItems; // Return the current list without changes
        }
    }

    // Resetting UI and checked items if regeneration is confirmed or first creation
    resultDiv.textContent = '';
    checkedItems.clear();

    if (!selectedMuseum) {
        resultDiv.textContent = 'Please select a museum first.';
        logger.warn('No museum selected.');
        return [];
    }

    try {
        // Load the labels for the selected museum
        const labels = await loadLabelsForSelectedMuseum(selectedMuseum.acronym);
        if (labels.length === 0) {
            resultDiv.textContent = 'No labels found for this museum.';
            return [];
        }
        logger.log('Labels loaded for selected museum:', labels);

        // Filter only those items where is_included_in_hunt is true and by hallname if provided
        let filteredLabels = labels.filter(label => label.is_included_in_hunt === true);

        if (hallname) {
            filteredLabels = filteredLabels.filter(label => label.label_str.startsWith(`${hallname}_`));
            if (filteredLabels.length === 0) {
                resultDiv.textContent = `No labels found for the hall: ${hallname}.`;
                return [];
            }
        }

        logger.log('Filtered labels for treasure hunt:', filteredLabels);

        // Generate the treasure hunt list item by item
        const newSelectedItems = await generateTreasureHuntList(filteredLabels, 4, hallname);
        logger.log('Selected items for the treasure hunt:', newSelectedItems);

        // Display the selected items in the UI
        displayTreasureList(newSelectedItems);
        document.getElementById('customUploadLabel').style.display = 'block';
        document.getElementById('imageUpload').style.display = 'block';

        // Change the button label and set the first creation flag
        if (isFirstCreation) {
            createButton.textContent = 'Regenerate List';
            isFirstCreation = false;
        }

        return newSelectedItems; // Return the newly created list
    } catch (error) {
        resultDiv.textContent = 'Failed to create treasure hunt list. Please try again.';
        logger.error('Error creating treasure hunt list:', error);
        return [];
    }
}

// Function to generate the treasure hunt list item by item, ensuring the hall ID gap rule
async function generateTreasureHuntList(labels, count, hallname) {
    let selectedItems = [];

    while (selectedItems.length < count) {
        const newItem = selectRandomLabel(labels, selectedItems, hallname);
        if (newItem) {
            selectedItems.push(newItem);
        } else {
            logger.warn('No more valid items to select.');
            break; // Stop if no more valid items are available
        }
    }

    // Add selected items to the previously selected set
    selectedItems.forEach(item => previouslySelectedItems.add(item.label_str));

    return selectedItems;
}

// Function to randomly select a label, ensuring ID gap for the same hall
function selectRandomLabel(labels, selectedItems, hallname) {
    let availableLabels = labels.filter(label => !previouslySelectedItems.has(label.label_str) && !foundItems.has(label.label_str));

    if (availableLabels.length === 0) {
        previouslySelectedItems.clear(); // Clear the set and recheck all labels if no more available
        availableLabels = labels.filter(label => !foundItems.has(label.label_str)); // Exclude found items
    }

    const shuffled = availableLabels.sort(() => 0.5 - Math.random());

    // Filter based on ID gap if necessary
    for (const item of shuffled) {
        const [hall, idStr] = item.label_str.split('_');
        const id = parseInt(idStr, 10);

        if (hallname && hall !== hallname) {
            continue; // Skip if hallname is provided and doesn't match
        }

        const sameHallItems = selectedItems.filter(sel => sel.label_str.startsWith(`${hall}_`));
        if (sameHallItems.length === 0 || Math.abs(id - parseInt(sameHallItems[0].label_str.split('_')[1])) >= 5) {
            return item; // Return the item if it satisfies the gap condition
        }
    }

    return null; // Return null if no valid items found
}

// Function to mark an item as found and exclude it from further similarity checks
export function markItemAsFound(item) {
    foundItems.add(item.label_str); // Add to found items
}

// Function to handle the similarity check, excluding already found items
export function handleSimilarityCheck(inputLabel, labels) {
    logger.log('Full list of labels:', labels);

    let uncheckedItems = labels.filter(label => !foundItems.has(label.label_str));
    
    logger.log('Found items:', Array.from(foundItems));
    logger.log('Items to be checked for similarity (excluding found):', uncheckedItems);

    let newlyFoundItems = [];

    uncheckedItems.forEach(label => {
        const similarity = stringSimilarity.compareTwoStrings(inputLabel, label.label_str);

        if (similarity > 0.6) { // Threshold for similarity check
            logger.log(`Item found: ${label.label_str} (Similarity: ${similarity})`);
            markItemAsFound(label);
            newlyFoundItems.push(label);
        }
    });

    logger.log('Newly found items in this round:', newlyFoundItems);

    return newlyFoundItems;
}

// Function to display the treasure hunt list in the UI
export function displayTreasureList(items) {
    const listContainer = document.getElementById('treasureList');
    listContainer.innerHTML = ''; // Clear any previous items

    items.forEach((item) => {
        const listItem = document.createElement('li');
        const randomHint = item.label_hints[Math.floor(Math.random() * item.label_hints.length)];
        listItem.textContent = randomHint;
        listItem.dataset.item = item.label_str;

        listContainer.appendChild(listItem);
    });
}