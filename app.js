// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk2EqtQ0Ro61wPQv7oPEX1_HGgYGwqJAU",
  authDomain: "a7hh-7b385.firebaseapp.com",
  projectId: "a7hh-7b385",
  storageBucket: "a7hh-7b385.firebasestorage.app",
  messagingSenderId: "320411738458",
  appId: "1:320411738458:web:4905b24e610fa7497d9363",
  measurementId: "G-MQ1SZWZ833"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Upload function
async function uploadMemory() {
  const fileInput = document.getElementById("fileInput");
  const noteInput = document.getElementById("noteInput");
  const file = fileInput.files[0];
  const note = noteInput.value;

  console.log("File:", file);
  console.log("Note:", note);

  if (file && note) {
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, 'memories/' + file.name);
      
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Download URL:", downloadURL);  // Check the download URL

      // Add memory data to Firestore
      const docRef = await addDoc(collection(firestore, "memories"), {
        fileName: file.name,
        fileUrl: downloadURL,
        note: note,
        timestamp: new Date().toISOString()
      });

      console.log("Document written with ID:", docRef.id);  // Check if the document is added

      alert("Memory uploaded successfully!");
    } catch (error) {
      console.error("Error uploading memory:", error);
    }
  } else {
    alert("Please provide a file and a note.");
  }
}

// Display function
async function displayMemories() {
  const memoryContainer = document.getElementById("memoryContainer");

  try {
    // Query Firestore for all memories, ordered by timestamp
    const memoriesQuery = query(collection(firestore, "memories"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(memoriesQuery);

    console.log("Fetched memories:", querySnapshot.size);  // Check how many memories are fetched

    memoryContainer.innerHTML = ""; // Clear existing content

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Memory data:", data);  // Check each memory's data

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

// Display memories when the page loads
window.onload = () => {
  displayMemories();
};

// Event listener for upload button
document.getElementById("uploadButton").addEventListener("click", uploadMemory);
