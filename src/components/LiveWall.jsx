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
        setCurrentIndex((prevIndex) => 
          prevIndex === posts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="islamic-floral-bg min-h-screen flex items-center justify-center">
        <p className="text-ceremony-gold font-serif text-3xl animate-pulse">Initializing Wall...</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div className="islamic-floral-bg min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden border-[12px] border-double border-ceremony-gold/20">
      
      {/* Header with Full Arabic Basmala */}
      <div className="absolute top-6 text-center z-20 w-full px-4">
        {/* Full Basmala - Increased size and adjusted tracking */}
        <div className="text-ceremony-gold text-5xl md:text-7xl mb-4 opacity-80 font-arabic leading-relaxed drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        
        <h1 className="font-serif text-3xl md:text-6xl text-ceremony-emerald mb-2 tracking-tight drop-shadow-sm">
          Hafsa Tasnim's Naming Ceremony
        </h1>
        
        <div className="flex justify-center items-center gap-4 mt-1">
          <div className="h-[1px] w-24 bg-ceremony-gold opacity-20"></div>
          <div className="text-ceremony-gold tracking-[0.4em] text-xs uppercase opacity-60 font-light">
            May 17, 2026
          </div>
          <div className="h-[1px] w-24 bg-ceremony-gold opacity-20"></div>
        </div>
      </div>

      {/* Main Container - Adjusted margin top to prevent overlap with larger header */}
      <div className="relative w-full max-w-6xl flex items-center justify-center mt-28">
        <div 
          key={currentPost.id} 
          className="w-full flex flex-col md:flex-row items-center bg-white/95 rounded-[40px] shadow-2xl overflow-hidden border-2 border-ceremony-gold/10 animate-fade-in-up"
        >
          
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 p-6 md:p-12 flex justify-center">
              <div className="islamic-arch h-[45vh] w-full max-w-sm overflow-hidden shadow-inner border border-ceremony-gold/5">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Ceremony Moment"
                />
              </div>
            </div>
          )}

          <div className={`p-10 md:p-16 flex items-center justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <div className="slideshow-message-block">
              <p className="font-serif text-3xl md:text-5xl text-ceremony-emerald leading-tight italic font-medium px-4">
                {currentPost.message}
              </p>
              
              <div className="mt-8 text-ceremony-gold text-4xl tracking-widest opacity-30 font-light">
                ~~~~~~
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-8 flex gap-3">
        {posts.slice(0, 15).map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-700 ${
              idx === currentIndex ? "bg-ceremony-gold w-10" : "bg-ceremony-gold/10 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveWall;