const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod === "POST") {
        const file = event.body;  // This is where the uploaded file data will be

        // Dropbox API setup (Replace with your Dropbox API token)
        const dropboxAccessToken = "YOUR_DROPBOX_ACCESS_TOKEN";

        try {
            const response = await axios.post("https://content.dropboxapi.com/2/files/upload", file, {
                headers: {
                    "Authorization": `Bearer ${dropboxAccessToken}`,
                    "Content-Type": "application/octet-stream",
                    "Dropbox-API-Arg": JSON.stringify({
                        path: `/memories/${Date.now()}`,
                        mode: "add",
                        autorename: true,
                        mute: false,
                    }),
                },
            });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "File uploaded successfully!", data: response.data }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error uploading file", error: error.message }),
            };
        }
    }
    
    return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" }),
    };
};
