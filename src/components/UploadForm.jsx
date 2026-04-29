import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";

function UploadForm() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

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

      // 1. Only process image if a file is selected
      if (file) {
        // Image Compression Settings
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        
        // Upload to Firebase Storage
        const uploadResult = await uploadBytes(storageRef, compressedFile);
        downloadURL = await getDownloadURL(uploadResult.ref);
      }

      // 2. Add data to Firestore (Works with or without imageUrl)
      await addDoc(collection(db, "posts"), {
        message: message,
        imageUrl: downloadURL, // Will be empty string if no photo
        timestamp: serverTimestamp(),
      });

      // 3. Reset Form
      setMessage("");
      setFile(null);
      setStatus("Sent successfully! Check the wall.");
      setTimeout(() => setStatus(""), 3000);

    } catch (error) {
      console.error("Error:", error);
      setStatus("Oops! Something went wrong. Please try again.");
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
        {/* Message Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Your Message</label>
          <textarea
            className="w-full p-3 border-2 border-ceremony-gold/20 rounded-lg focus:border-ceremony-gold outline-none transition-all h-32"
            placeholder="Write your wishes for the baby..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Photo Input (Optional) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Upload Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ceremony-gold/10 file:text-ceremony-gold hover:file:bg-ceremony-gold/20 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
            uploading ? "bg-gray-400" : "bg-ceremony-green hover:bg-opacity-90 shadow-lg"
          }`}
        >
          {uploading ? "Sending..." : "Post to Live Wall"}
        </button>

        {/* Status Message */}
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