import logger from '../logging.js'

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // Destructure request body to get feedback, contact info, and permission to contact details
    const { feedback, contactInfo, mayContact, browser, device } = req.body;

    // Validate feedback input
    if (!feedback || feedback.trim() === '') {
        return res.status(400).json({ error: 'Feedback cannot be empty' });
    }

    // Get the user's IP address from headers or connection information
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Optionally, send the feedback to Discord via webhook (or any other service)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    // Construct the message for Discord or your logging service
    const message = {
        content: `New Feedback Received:\nFeedback: ${feedback}\nContact Info: ${contactInfo || 'No contact info provided'}\nMay Contact: ${mayContact ? 'Yes' : 'No'}\nBrowser: ${browser}\nDevice: ${device}\nIP: ${ip}`,
    };

    try {
        // Send the feedback notification to Discord webhook
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        // Validate Discord response
        if (!discordResponse.ok) {
            logger.error(`Failed to send feedback to Discord: ${discordResponse.statusText}`);
            return res.status(500).json({ error: 'Failed to send feedback notification' });
        }

        // Send a success response back to the user
        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        // Handle errors
        logger.error('Error sending feedback notification:', error);
        res.status(500).json({ error: 'Error occurred while sending feedback' });
    }
}