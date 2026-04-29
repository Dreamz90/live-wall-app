import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Listen to Firestore for real-time updates from 250+ guests
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

  // 2. Slideshow Timer: Rotate every 6 seconds for comfortable reading
  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
      }, 6000); 
      return () => clearInterval(interval);
    }
  }, [posts]);

  // Loading state if no posts exist yet
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-ceremony-cream flex items-center justify-center">
        <p className="text-ceremony-gold font-serif text-3xl animate-pulse">Initializing Blessing Wall...</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div className="relative min-h-screen w-full bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND COLLAGE: Fills large projection space to avoid empty gaps */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 gap-2 opacity-10 grayscale pointer-events-none p-2">
        {posts.map((post, i) => (
          <div key={`bg-${i}`} className="h-40 bg-white border border-ceremony-gold/10 overflow-hidden rounded-sm">
            {post.imageUrl ? (
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="p-2 text-[10px] font-serif text-ceremony-emerald italic leading-tight">
                {post.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HEADER: Arabic Basmala and Event Title */}
      <div className="relative z-30 text-center mb-8">
        <div className="text-ceremony-gold text-5xl md:text-8xl mb-4 font-arabic drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-3xl md:text-6xl text-ceremony-emerald tracking-tight bg-white/60 backdrop-blur-sm px-10 py-3 rounded-full inline-block shadow-sm">
          Hafsa Tasnim's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE: The Featured Blessing Card */}
      <div className="relative z-20 w-full max-w-6xl px-6">
        <div 
          key={currentPost.id} 
          className="flex flex-col md:flex-row items-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden animate-zoom-in min-h-[60vh]"
          style={{
            backgroundImage: "url('/frame-bg.jpg')", // Ensure this file is in your /public folder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(197, 160, 89, 0.3)'
          }}
        >
          {/* Photo Section: Using object-contain to ensure group photos are NOT cut off */}
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 p-8 md:p-12 flex justify-center items-center">
              <div className="w-full h-[45vh] overflow-hidden rounded-3xl shadow-2xl bg-black/5 flex items-center justify-center border-4 border-white/60">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-contain" 
                  alt="Guest Share"
                />
              </div>
            </div>
          )}

          {/* Message Section */}
          <div className={`p-10 md:p-16 text-center flex flex-col items-center justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-white/20 shadow-inner w-full">
              <p className="font-serif text-4xl md:text-5xl text-ceremony-emerald leading-snug italic font-medium">
                {currentPost.message}
              </p>
              
              <div className="mt-10 text-ceremony-gold text-5xl tracking-[0.6em] opacity-40">
                ~~~~~~
              </div>

              {/* Conditional Guest Name: Only shows if user provided it */}
              {currentPost.guestName && (
                <p className="mt-8 text-ceremony-gold uppercase tracking-[0.3em] font-bold text-sm">
                  — {currentPost.guestName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: Static Date for the Event */}
      <div className="relative z-30 mt-12 bg-ceremony-emerald text-ceremony-cream px-10 py-2 rounded-full font-serif tracking-[0.4em] text-xs uppercase shadow-xl">
        May 17, 2026
      </div>

    </div>
  );
}

export default LiveWall;