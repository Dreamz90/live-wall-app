import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
      }, 6000); // 6 seconds for better readability on big screens
      return () => clearInterval(interval);
    }
  }, [posts]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className="relative min-h-screen w-full bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center">
      
      {/* 1. THE BACKGROUND COLLAGE (Fills the entire screen) */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 opacity-10 grayscale pointer-events-none p-2">
        {posts.map((post, i) => (
          <div key={`bg-${i}`} className="h-40 bg-white border border-ceremony-gold/20 overflow-hidden rounded-sm">
            {post.imageUrl ? (
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="p-2 text-[8px] font-serif text-ceremony-emerald italic overflow-hidden">
                {post.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 2. THE TOP HEADER (Floating over collage) */}
      <div className="relative z-30 text-center mb-12">
        <div className="text-ceremony-gold text-5xl md:text-7xl mb-4 font-arabic drop-shadow-lg">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-ceremony-emerald tracking-tight drop-shadow-md bg-ceremony-cream/80 px-6 py-2 rounded-full inline-block">
          Hafsa Tasnim's Naming Ceremony
        </h1>
      </div>

      {/* 3. THE CENTER STAGE CARD */}
      <div className="relative z-20 w-full max-w-6xl px-6">
        <div 
          key={currentPost.id} 
          className="flex flex-col md:flex-row items-center bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden border-b-8 border-ceremony-gold animate-zoom-in"
        >
          {/* Photo Section */}
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="islamic-arch h-[55vh] w-full overflow-hidden shadow-2xl">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-contain" 
                  alt="Feature"
                />
              </div>
            </div>
          )}

          {/* Message Section */}
          <div className={`p-12 md:p-20 text-center flex flex-col items-center justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <p className="font-serif text-4xl md:text-6xl text-ceremony-emerald leading-tight italic font-medium">
              {currentPost.message}
            </p>
            <div className="mt-12 text-ceremony-gold text-5xl tracking-[0.5em] opacity-40">
              ~~~~~~
            </div>
            {currentPost.guestName && (
              <p className="mt-8 text-ceremony-gold uppercase tracking-widest font-bold">
                — {currentPost.guestName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. DATE FOOTER */}
      <div className="relative z-30 mt-12 bg-ceremony-emerald text-ceremony-cream px-8 py-2 rounded-full font-serif tracking-[0.3em] text-sm">
        MAY 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;