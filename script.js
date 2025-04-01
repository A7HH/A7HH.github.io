<script type="module">
  // Import the necessary Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

  // Firebase configuration (replace with your own)
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  // Function to upload a memory (file + note)
  async function uploadMemory() {
    const fileInput = document.getElementById("fileInput");
    const noteInput = document.getElementById("noteInput");
    const file = fileInput.files[0];
    const note = noteInput.value;

    if (file && note) {
      try {
        // Create a reference to the storage location
        const storageRef = ref(storage, 'memories/' + file.name);
        
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the file's download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Add the memory data (file URL + note) to Firestore
        await addDoc(collection(firestore, "memories"), {
          fileName: file.name,
          fileUrl: downloadURL,
          note: note,
          timestamp: new Date().toISOString() // Store the timestamp as a string
        });

        alert("Memory uploaded successfully!");
      } catch (error) {
        console.error("Error uploading memory:", error);
      }
    } else {
      alert("Please provide a file and a note.");
    }
  }

  // Function to display all memories
  async function displayMemories() {
    const memoryContainer = document.getElementById("memoryContainer");
    
    try {
      // Query Firestore for all memories, ordered by timestamp
      const memoriesQuery = query(collection(firestore, "memories"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(memoriesQuery);

      memoryContainer.innerHTML = ""; // Clear existing content

      // Display each memory
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        memoryContainer.innerHTML += `
          <div class="memory">
            <img src="${data.fileUrl}" alt="${data.fileName}" style="width: 200px;" />
            <p>${data.note}</p>
          </div>
        `;
      });
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  }

  // Call the displayMemories function on page load to show existing memories
  displayMemories();
</script>
