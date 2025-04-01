// Handle form submission
document.getElementById("memory-upload").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const file = document.getElementById("memory-file").files[0];
    const note = document.getElementById("memory-note").value;

    if (file && note) {
        const memoryData = {
            file: URL.createObjectURL(file),
            note: note
        };
        
        displayMemory(memoryData);
    }
});

// Function to display the memory in the gallery
function displayMemory(memory) {
    const memoryContainer = document.getElementById("memories-container");
    const memoryCard = document.createElement("div");
    memoryCard.classList.add("memory-card");
    
    const img = document.createElement("img");
    img.src = memory.file;
    memoryCard.appendChild(img);
    
    const text = document.createElement("p");
    text.textContent = memory.note;
    memoryCard.appendChild(text);

    memoryContainer.appendChild(memoryCard);
}
