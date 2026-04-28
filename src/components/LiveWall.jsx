import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Reference the 'posts' collection, ordered by newest first
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    // Real-time listener: Updates automatically when guests upload
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle image errors
  const handleImageError = (id) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, loadError: true } : post
      )
    );
  };

  return (
    <div className="islamic-floral-bg min-h-screen p-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="font-arabic text-7xl text-ceremony-gold mb-2">Bismillah</h1>
        <h2 className="font-serif text-4xl text-ceremony-green uppercase tracking-widest font-bold">
          Our Beloved Daughter's Naming Ceremony
        </h2>
        <div className="w-48 h-1.5 bg-ceremony-gold mx-auto mt-4 rounded-full opacity-60"></div>
      </header>

      {/* Photo & Message Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-white/80 backdrop-blur-sm border-2 border-ceremony-gold p-4 rounded-xl shadow-2xl animate-fade-in"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg h-80 bg-gray-100">
              <img 
                src={post.fileUrl} 
                alt="Ceremony Guest Upload" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              {/* The Image */}
              <img 
                src={post.fileUrl} 
                alt="Upload" 
                className={`w-full h-full object-cover ${post.loadError ? 'hidden' : 'block'}`}
                onError={() => handleImageError(post.id)}
              />

              {/* The Error Message - Only shows if image fails */}
              {post.loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-red-50">
                  <span className="text-red-500 text-5xl mb-2">⚠️</span>
                  <p className="text-red-700 font-bold">Image Failed to Load</p>
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    Source: {post.fileUrl ? post.fileUrl.substring(0, 50) + "..." : "URL Missing"}
                  </p>
                  <p className="text-[10px] text-red-400 mt-1 uppercase tracking-tighter">
                    Check Firebase Storage Rules or CORS
                  </p>
                </div>
              )}
            </div>
            
            {/* Message Area */}
            <div className="mt-6 text-center">
              <div className="text-ceremony-gold text-2xl mb-2">❝</div>
              <p className="font-serif italic text-2xl text-gray-800 px-4 leading-relaxed">
                {post.message}
              </p>
              <div className="text-ceremony-gold text-2xl mt-2">❞</div>
              
              {/* Optional: Guest Name if you added it to your form */}
              {post.guestName && (
                <p className="mt-4 font-serif font-bold text-ceremony-green">
                  — {post.guestName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-32">
          <p className="text-ceremony-gold font-serif text-3xl animate-pulse">
            Waiting for your beautiful photos and wishes...
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveWall;