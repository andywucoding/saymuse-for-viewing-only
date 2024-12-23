import logger from '../logging.js'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    // Whitelist of IP addresses (you can add more IPs to this array)
    const whitelist = [
        '98.198.8.11'
    ]; // IPS

    // Get the user's IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check if the IP is in the whitelist
    if (whitelist.includes(ip)) {
      return res.status(200).json({ message: 'Event tracked, but no notification sent (IP whitelisted)' });
    }

    const { event, browser, device } = req.body;

    // Send the data to Discord via webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = {
      content: `Event: ${event}\nBrowser: ${browser}\nDevice: ${device}\nIP: ${ip}`,
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      res.status(200).json({ message: 'Event tracked successfully' });
    } catch (error) {
      logger.error('Error sending Discord notification:', error);
      res.status(500).json({ error: 'Failed to send Discord notification' });
    }
}