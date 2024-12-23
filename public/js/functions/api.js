// public/js/functions/api.js
export async function apiRequest(url, method, body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    // Add body to the request only if it's provided (for POST or PUT requests)
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
    }

    return await response.json();
}
