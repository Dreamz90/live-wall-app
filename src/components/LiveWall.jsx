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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-white/80 backdrop-blur-sm border-2 border-ceremony-gold p-4 rounded-xl shadow-2xl animate-fade-in"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg h-80 bg-gray-100">
              <img 
                src={post.imageUrl} 
                alt="Ceremony Guest Upload" 
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
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