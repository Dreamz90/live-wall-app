import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Listener for real-time updates from Firebase
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
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
    <div className="islamic-floral-bg min-h-screen p-6 md:p-12">
      {/* Elegant Header */}
      <header className="text-center mb-16">
        <h1 className="font-arabic text-7xl text-ceremony-gold mb-4 drop-shadow-sm">
          Bismillah
        </h1>
        <h2 className="font-serif text-3xl md:text-5xl text-ceremony-green uppercase tracking-[0.2em] font-bold">
          Celebration of Life & Love
        </h2>
        <div className="w-40 h-1 bg-gradient-to-r from-transparent via-ceremony-gold to-transparent mx-auto mt-6"></div>
      </header>

      {/* Masonry Grid: Prevents images from being cut off */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="break-inside-avoid bg-white/90 backdrop-blur-md border border-ceremony-gold/30 p-4 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl animate-fade-in"
          >
            {/* Photo Container */}
            <div className="relative group overflow-hidden rounded-xl bg-gray-50">
              <img 
                src={post.imageUrl} 
                alt="Ceremony Moment" 
                className="w-full h-auto block transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Photo+Coming+Soon";
                }}
              />
            </div>
            
            {/* Message Area */}
            <div className="mt-6 text-center pb-2">
              <div className="text-ceremony-gold text-3xl leading-none">“</div>
              <p className="font-serif italic text-xl md:text-2xl text-gray-800 px-4 leading-relaxed">
                {post.message}
              </p>
              <div className="text-ceremony-gold text-3xl leading-none mt-2">”</div>
              
              {/* Gold Ornament Divider */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <span className="h-[1px] w-8 bg-ceremony-gold/30"></span>
                <span className="text-ceremony-gold text-xs">✦</span>
                <span className="h-[1px] w-8 bg-ceremony-gold/30"></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State: Only shows before any uploads occur */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24">
          <div className="w-24 h-24 border-4 border-ceremony-gold/20 border-t-ceremony-gold rounded-full animate-spin mb-6"></div>
          <p className="text-ceremony-green font-serif text-2xl animate-pulse tracking-wide">
            Waiting for guests to share their blessings...
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveWall;