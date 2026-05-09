import { useState, useRef } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";

function UploadForm() {
  const [name, setName] = useState(""); // 1. Added name state
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const MAX_LIMIT = 150;

  // 2. Added ref for file input reset
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus("Please enter a message!");
      return;
    }

    setUploading(true);
    setStatus("Sharing your blessings...");

    try {
      let downloadURL = "";

      if (file) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        // Unique filename fix
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        
        const uploadResult = await uploadBytes(storageRef, compressedFile);
        downloadURL = await getDownloadURL(uploadResult.ref);
      }

      // 3. Save to Firestore with Name logic
      await addDoc(collection(db, "posts"), {
        name: name.trim() === "" ? "Well-wisher" : name.trim(), // Default to Well-wisher
        message: message,
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
      });

      // 4. Reset Form
      setName("");
      setMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
      
      setStatus("Sent successfully! Check the wall.");
      setTimeout(() => setStatus(""), 3000);

    } catch (error) {
      console.error("Error:", error);
      setStatus("Oops! Something went wrong. " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-ceremony-gold/30 mt-10">
      <h2 className="font-serif text-2xl text-ceremony-green text-center mb-6 uppercase tracking-wider">
        Share a Blessing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        {/* Message Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Your Message</label>
          <textarea
            className="w-full p-3 border-2 border-ceremony-gold/20 rounded-lg focus:border-ceremony-gold outline-none transition-all h-32"
            placeholder="Write your wishes for the baby..."
            value={message}
            //onChange={(e) => setMessage(e.target.value)}
            onChange={(e) => {
              // This ensures the state update never exceeds 150
              if (e.target.value.length <= MAX_LIMIT) {
                setMessage(e.target.value);
              }
            }}
            maxLength={MAX_LIMIT}
            required
          />
          <div className={`w-full text-right text-sm font-bold ${message.length === MAX_LIMIT ? 'text-red-500' : 'text-emerald-600'}`}>
  {message.length} / {MAX_LIMIT}
</div>
        </div>

        {/* Photo Input (Optional) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Upload Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef} // Attached ref
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ceremony-gold/10 file:text-ceremony-gold hover:file:bg-ceremony-gold/20 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Your Name (Optional)</label>
          <input
            type="text"
            className="w-full p-3 border-2 border-ceremony-gold/20 rounded-lg focus:border-ceremony-gold outline-none transition-all"
            placeholder="Enter your name..."
            value={name}
            maxLength={30}
            onChange={(e) => {
      // Functional restriction to prevent pasting longer strings
      if (e.target.value.length <= 30) {
        setName(e.target.value);
      }
    }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
            uploading ? "bg-gray-400" : "bg-ceremony-green hover:bg-opacity-90 shadow-lg"
          }`}
        >
          {uploading ? "Sending..." : "Post to Live Wall"}
        </button>

        {status && (
          <p className={`text-center text-sm font-bold mt-4 ${status.includes("Oops") ? "text-red-500" : "text-ceremony-gold"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}

export default UploadForm;