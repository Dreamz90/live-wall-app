import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Fetch posts in real-time
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

  // 2. Slideshow Logic
  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
      }, 6000); // 6 seconds per slide
      return () => clearInterval(interval);
    }
  }, [posts]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className="relative min-h-screen w-full bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND COLLAGE: Fills large projection space */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 gap-2 opacity-10 grayscale pointer-events-none p-2">
        {posts.map((post, i) => (
          <div key={`bg-${i}`} className="h-40 bg-white border border-ceremony-gold/10 overflow-hidden">
            {post.imageUrl ? (
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="p-2 text-[10px] font-serif text-ceremony-emerald italic">
                {post.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HEADER: Full Basmala and Updated Title */}
      <div className="relative z-30 text-center mb-8">
        <div className="text-ceremony-gold text-5xl md:text-7xl mb-4 font-arabic">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-ceremony-emerald tracking-tight bg-ceremony-cream/80 px-8 py-2 rounded-full inline-block">
          Hafsa Tasnim's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE: Featured Post with JPEG Background */}
      <div className="relative z-20 w-full max-w-6xl px-6">
        <div 
          key={currentPost.id} 
          className="flex flex-col md:flex-row items-center shadow-2xl rounded-[40px] overflow-hidden animate-zoom-in min-h-[60vh]"
          style={{
            backgroundImage: "url('/frame-bg.jpg')", // Ensure this file is in your /public folder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid rgba(197, 160, 89, 0.4)'
          }}
        >
          {/* Photo Section: Fixed for Group Photos */}
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 p-8 md:p-12 flex justify-center items-center">
              <div className="w-full h-[45vh] overflow-hidden rounded-2xl shadow-lg bg-black/5 flex items-center justify-center border-4 border-white/40">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-contain" // Shows full group photo without cutting
                  alt="Guest"
                />
              </div>
            </div>
          )}

          {/* Message Section */}
          <div className={`p-12 text-center flex flex-col items-center justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-[30px] border border-white/30 shadow-sm">
              <p className="font-serif text-4xl md:text-5xl text-ceremony-emerald leading-tight italic font-medium">
                {currentPost.message}
              </p>
              <div className="mt-10 text-ceremony-gold text-5xl tracking-[0.5em] opacity-50">
                ***
              </div>
              {currentPost.guestName && (
                <p className="mt-8 text-ceremony-gold uppercase tracking-[0.2em] font-bold text-sm">
                  — {currentPost.guestName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: Fixed Date Display */}
      <div className="relative z-30 mt-10 bg-ceremony-emerald text-ceremony-cream px-10 py-2 rounded-full font-serif tracking-[0.4em] text-xs uppercase shadow-lg">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;