import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Listen to Firestore for real-time updates
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

  // 2. Slideshow Timer: Rotate every 5 seconds
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
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-ceremony-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-ceremony-gold font-serif text-3xl animate-pulse">Waiting for blessings...</p>
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div className="islamic-floral-bg min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden border-[12px] border-double border-ceremony-gold/20">
      
      {/* Permanent Header */}
      <div className="absolute top-8 text-center z-20">
        <div className="text-ceremony-gold text-3xl mb-2 opacity-50">✨ ﷽ ✨</div>
        <h1 className="font-serif text-5xl md:text-7xl text-ceremony-emerald mb-2 tracking-tight">
          Hafsa Tasnim
        </h1>
        <div className="h-[1px] w-32 bg-ceremony-gold mx-auto opacity-40"></div>
      </div>

      {/* Slideshow Display Area */}
      <div className="relative w-full max-w-6xl flex items-center justify-center">
        <div 
          key={currentPost.id} 
          className="w-full flex flex-col md:flex-row items-center bg-white/95 rounded-[40px] shadow-2xl overflow-hidden border-2 border-ceremony-gold/10 animate-fade-in-up"
        >
          
          {/* Photo Section (Only if imageUrl exists) */}
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 p-6 md:p-10 flex justify-center">
              <div className="islamic-arch h-[50vh] w-full max-w-sm overflow-hidden border-4 border-ceremony-gold/10">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Ceremony Moment"
                />
              </div>
            </div>
          )}

          {/* Centered Message Section */}
          <div className={`p-10 md:p-16 flex items-center justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <div className="slideshow-message-block">
              <span className="message-quote">“</span>
              
              <p className="font-serif text-3xl md:text-5xl text-ceremony-emerald leading-tight italic font-medium">
                {currentPost.message}
              </p>
              
              <span className="message-quote mt-4">”</span>
              
              {/* Optional Guest Name Divider */}
              <div className="flex items-center gap-3 mt-8">
                <span className="h-[1px] w-8 bg-ceremony-gold/40"></span>
                <span className="text-ceremony-gold text-sm tracking-[0.3em] uppercase font-bold">
                  Blessings
                </span>
                <span className="h-[1px] w-8 bg-ceremony-gold/40"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 flex gap-3">
        {posts.slice(0, 15).map((_, idx) => ( // Showing max 15 dots to avoid clutter
          <div 
            key={idx}
            className={`h-2 rounded-full transition-all duration-700 ${
              idx === currentIndex ? "bg-ceremony-gold w-10" : "bg-ceremony-gold/20 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveWall;