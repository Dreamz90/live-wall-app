import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadForm = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // FIX 1: Generate a unique filename using a timestamp
      // This prevents errors when a user uploads "image.jpg" twice
      const fileExtension = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, `uploads/${uniqueName}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save to Firestore
      await addDoc(collection(db, "posts"), {
        name: name || "Anonymous Guest",
        message: message,
        imageUrl: downloadURL,
        createdAt: serverTimestamp()
      });

      alert("Blessing shared successfully!");
      setMessage('');
      setName('');
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
      // FIX 2: Reset the input value so mobile browsers 
      // trigger 'onChange' again for the next selection
      e.target.value = null;
    }
  };

  return (
    <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 rounded bg-white/50 border-none"
      />
      <textarea
        placeholder="Write a blessing for Hafsa..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-white/50 border-none"
      />
      
      <label className="block">
        <span className="sr-only">Choose photo</span>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100 disabled:opacity-50"
        />
      </label>

      {uploading && <p className="mt-2 text-emerald-600 animate-pulse">Uploading blessing...</p>}
    </div>
  );
};

export default UploadForm;