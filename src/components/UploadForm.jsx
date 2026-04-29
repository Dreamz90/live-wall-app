import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";

function UploadForm() {
  const [message, setMessage] = useState("");
  const [guestName, setGuestName] = useState(""); // New state for name
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

      if (file) {
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, compressedFile);
        downloadURL = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, "posts"), {
        message: message,
        guestName: guestName.trim() || "Well-wisher", // Fallback if empty
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
      });

      setMessage("");
      setGuestName(""); // Reset name
      setFile(null);
      setStatus("Sent successfully!");
      setTimeout(() => setStatus(""), 3000);

    } catch (error) {
      console.error("Error:", error);
      setStatus("Oops! Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/95 rounded-[2rem] shadow-2xl border border-ceremony-gold/20 mt-10">
      <h2 className="font-serif text-2xl text-ceremony-emerald text-center mb-6 uppercase tracking-widest font-bold">
        Share a Blessing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest Name Field (Optional) */}
        <div>
          <input
            type="text"
            className="w-full p-4 border-2 border-ceremony-gold/10 rounded-2xl focus:border-ceremony-gold outline-none text-lg"
            placeholder="Your Name (Optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        {/* Message Field */}
        <div>
          <textarea
            className="w-full p-4 border-2 border-ceremony-gold/10 rounded-2xl focus:border-ceremony-gold outline-none h-32 italic text-lg"
            placeholder="Write your wishes for Hafsa..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div className="bg-ceremony-cream/30 p-4 rounded-2xl border border-dashed border-ceremony-gold/30">
          <label className="block text-xs font-bold text-ceremony-gold uppercase mb-2 tracking-widest text-center">
            Add a Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-ceremony-gold file:text-white hover:file:bg-opacity-90 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
            uploading ? "bg-gray-400" : "bg-ceremony-emerald hover:shadow-emerald-900/20"
          }`}
        >
          {uploading ? "Sending..." : "Post Blessing"}
        </button>

        {status && <p className="text-center font-bold text-ceremony-gold animate-pulse">{status}</p>}
      </form>
    </div>
  );
}

export default UploadForm;