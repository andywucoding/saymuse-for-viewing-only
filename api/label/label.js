const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { acronym, hallname } = req.body; // Extract acronym and hallname from request body

    // Log the received payload
    console.log('Received acronym:', acronym);
    console.log('Received hallname:', hallname);

    if (!acronym) {
        return res.status(400).json({ error: 'Museum acronym is required' });
    }

    const basePath = path.join(__dirname, '../../data/labels', acronym);
    const hallsFilePath = path.join(basePath, 'halls.json');

    // Log the paths being used
    console.log('Base path for labels:', basePath);
    console.log('Halls file path:', hallsFilePath);

    let allLabels = [];

    try {
        // Log before attempting to read halls.json
        console.log('Attempting to read halls.json...');
        
        const hallsData = JSON.parse(fs.readFileSync(hallsFilePath, 'utf-8'));
        const halls = hallsData.halls;

        // Log the content of halls.json
        console.log('Halls data:', halls);

        if (hallname) {
            // Log before searching for the specific hall by value (the folder name is the value)
            console.log(`Searching for hall with name "${hallname}"`);

            // We assume the folder names are the values in halls.json
            const folderName = Object.values(halls).find(value => value === hallname);

            // Log the result of the search
            console.log('Found hall folder name:', folderName);

            if (!folderName) {
                return res.status(404).json({ error: `Hall with name "${hallname}" not found.` });
            }

            const labelFilePath = path.join(basePath, folderName, 'label.json');

            // Log the label file path being used
            console.log('Label file path for hall:', labelFilePath);

            if (fs.existsSync(labelFilePath)) {
                const labelData = JSON.parse(fs.readFileSync(labelFilePath, 'utf-8'));
                allLabels = labelData.labels;

                // Log the loaded labels
                console.log(`Loaded ${allLabels.length} labels for hall "${hallname}"`);
            } else {
                console.error(`Label file not found for hall "${folderName}".`);
                return res.status(404).json({ message: `No labels found for hall "${hallname}".` });
            }
        } else {
            // Log before loading labels from all halls
            console.log('Loading labels from all halls...');

            for (const hallAcronym in halls) {
                const folderName = halls[hallAcronym];
                const labelFilePath = path.join(basePath, folderName, 'label.json');

                // Log the path of each label file
                console.log(`Loading labels for hall "${folderName}" from "${labelFilePath}"`);

                try {
                    if (fs.existsSync(labelFilePath)) {
                        const labelData = JSON.parse(fs.readFileSync(labelFilePath, 'utf-8'));
                        allLabels = allLabels.concat(labelData.labels);

                        // Log the number of labels loaded for the current hall
                        console.log(`Loaded ${labelData.labels.length} labels for hall "${folderName}"`);
                    } else {
                        console.error(`Label file not found for hall "${folderName}".`);
                    }
                } catch (error) {
                    console.error(`Error loading labels for hall "${folderName}":`, error.message);
                }
            }
        }

        if (allLabels.length === 0) {
            // Log when no labels are found
            console.log('No labels found for this museum or hall.');
            return res.status(404).json({ message: 'No labels found for this museum or hall.' });
        }

        // Log the total number of labels found
        console.log(`Total labels loaded: ${allLabels.length}`);
        res.status(200).json({ labels: allLabels });
    } catch (error) {
        console.error('Error loading labels:', error.message);
        res.status(500).json({ error: 'Failed to load exhibit labels. Please try again.' });
    }
}
