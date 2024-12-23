import OpenAI from "openai";
import logger from '../logging.js'

const openai = new OpenAI();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;  // Access the key securely
    if (!openaiApiKey) {
        logger.error('OpenAI API Key is missing');
        return res.status(500).json({ message: 'OpenAI API key not found in environment variables.' });
    }

    const { image, contextText } = req.body; // Expecting image and context text in the body

    if (!image || !contextText) {
        logger.error('Image or contextText missing in request body');
        return res.status(400).json({ message: 'Image or context text not provided' });
    }

    // Prepare the base64 image without the prefix if necessary
    const base64Image = image.split(",")[1];  // Remove the "data:image/jpeg;base64," prefix if necessary
    if (!base64Image) {
        logger.error('Failed to extract base64 content from image');
        return res.status(400).json({ message: 'Invalid base64 image data' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",  // Specify the correct model you're using
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Is this image talking about the context: ${contextText}? Provide your answer in true or false format, no need to add a trailing period at the end.` },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`, // Attach the base64 encoded image as URL
                            },
                        }
                    ],
                },
            ],
        });

        // Process the OpenAI API response and return the entire response
        logger.log('OpenAI API response:', response);
        return res.status(200).json({
            response: response,  // Return the whole response
        });
    } catch (error) {
        logger.error('Error verifying image:', error);
        return res.status(500).json({ message: 'Internal server error during image verification.' });
    }
}