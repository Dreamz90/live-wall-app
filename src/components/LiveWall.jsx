import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
    <div className="islamic-floral-bg min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="font-arabic text-6xl text-ceremony-gold mb-2">Bismillah</h1>
        <h2 className="font-serif text-2xl md:text-4xl text-ceremony-green uppercase tracking-widest font-bold">
          Blessings & Memories
        </h2>
      </header>

      {/* Optimized Grid: 5 columns on large screens to keep cards small */}
      <div className="columns-1 sm:columns-2 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="break-inside-avoid bg-white/90 backdrop-blur-sm border border-ceremony-gold/20 rounded-xl shadow-lg overflow-hidden animate-fade-in"
          >
            {post.imageUrl ? (
              /* CASE 1: POST WITH PHOTO */
              <>
                <div className="relative overflow-hidden bg-gray-100">
                  <img 
                    src={post.imageUrl} 
                    alt="Guest Photo" 
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="font-serif italic text-lg text-gray-800 leading-snug">
                    "{post.message}"
                  </p>
                </div>
              </>
            ) : (
              /* CASE 2: MESSAGE ONLY (Floral Note Style) */
              <div 
                className="p-8 text-center min-h-[200px] flex flex-col items-center justify-center relative"
                style={{
                  backgroundImage: "url('/floral-bg.svg')",
                  backgroundSize: "150px",
                  backgroundPosition: "center",
                  backgroundRepeat: "repeat",
                  backgroundColor: "#fffdf5"
                }}
              >
                {/* Overlay to ensure text is readable over the pattern */}
                <div className="absolute inset-0 bg-white/60"></div>
                
                <div className="relative z-10">
                  <div className="text-ceremony-gold text-2xl mb-2">✦</div>
                  <p className="font-serif italic text-xl md:text-2xl text-ceremony-green font-bold leading-tight">
                    {post.message}
                  </p>
                  <div className="text-ceremony-gold text-2xl mt-2">✦</div>
                </div>
              </div>
            )}
            
            {/* Optional Guest Name tag if provided */}
            {post.guestName && (
              <div className="bg-ceremony-gold/10 py-2 text-center border-t border-ceremony-gold/10">
                <p className="text-xs font-bold text-ceremony-gold uppercase tracking-tighter">
                  From: {post.guestName}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveWall;