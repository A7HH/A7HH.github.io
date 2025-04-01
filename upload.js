document.getElementById("upload-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const fileInput = document.getElementById("memory-file");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    // The URL of your Netlify function (we'll set this up later)
    const uploadUrl = "/.netlify/functions/upload";

    fetch(uploadUrl, {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("status").innerText = "Memory uploaded successfully!";
    })
    .catch(error => {
        document.getElementById("status").innerText = "Error uploading memory: " + error.message;
    });
});
