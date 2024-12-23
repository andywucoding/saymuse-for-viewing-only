const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests allowed' });
    }

    try {
        const filePath = path.join(__dirname, '../../data/museums.json');
        const museumsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const museums = museumsData.museums.filter(museum => museum.acronym === 'hmns');  // Example filter for HMNS
        res.status(200).json({ museums });
    } catch (error) {
        console.error('Error fetching museums:', error);
        res.status(500).json({ error: 'Failed to fetch museums' });
    }
}
