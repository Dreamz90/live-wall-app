import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { db, storage } from "../firebase"; // The two dots '..' mean "go up one folder"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadForm() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a photo!");
    setLoading(true);

    try {
      // --- IMAGE COMPRESSION LOGIC ---
      const options = {
        maxSizeMB: 1,          // Max size 1MB
        maxWidthOrHeight: 1280, // High quality but web-friendly
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Upload compressed file to Firebase
      const storageRef = ref(storage, `moments/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "posts"), {
        message: text,
        imageUrl: url,
        timestamp: serverTimestamp(),
      });

      alert("Uploaded successfully!");
      setText(''); setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="islamic-container min-h-screen p-6 font-serif">
      <div className="max-w-md mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 border-4 border-[#C5A059]"> 
        <h2 className="text-3xl text-[#2C5E1A] font-bold text-center mb-2">Naming Ceremony</h2>
        <p className="text-center text-gray-600 mb-6 font-medium italic">Share your blessings with us</p>
        
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} 
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE0] file:text-[#2C5E1A]"
          />
          <textarea placeholder="Your message..." value={text} onChange={(e) => setText(e.target.value)}
            className="border-2 border-[#EADCA6] p-3 rounded-lg h-24 focus:outline-none focus:border-[#C5A059]"
          />
          <button disabled={loading} className="bg-[#2C5E1A] text-[#F3EFE0] py-4 rounded-xl font-bold hover:bg-[#1E4112] transition-all">
            {loading ? "Sending..." : "Post to Wall"}
          </button>
        </form>
      </div>
    </div>
  );
}