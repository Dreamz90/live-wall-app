import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Fetch data from Firebase
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

  // 2. Automatic Slideshow Timer
  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === posts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="islamic-floral-bg min-h-screen flex items-center justify-center">
        <p className="text-ceremony-gold font-serif text-3xl animate-pulse">Waiting for blessings...</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <div className="islamic-floral-bg min-h-screen flex flex-col items-center justify-center p-10 overflow-hidden">
      
      {/* Fixed Header */}
      <div className="absolute top-10 text-center z-20">
        <div className="text-ceremony-gold text-2xl mb-2 opacity-60">﷽</div>
        <h1 className="font-serif text-4xl text-ceremony-emerald uppercase tracking-[0.3em]">
          Hafsa Tasnim
        </h1>
      </div>

      {/* Main Slideshow Container */}
      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
        {/* Animated Card */}
        <div 
          key={currentPost.id} 
          className="w-full flex flex-col md:flex-row items-center bg-white/95 rounded-[40px] shadow-2xl overflow-hidden border-4 border-ceremony-gold/20 animate-fade-in-up"
        >
          
          {/* Photo Section (If exists) */}
          {currentPost.imageUrl && (
            <div className="w-full md:w-1/2 h-full p-6">
              <div className="islamic-arch h-[50vh] overflow-hidden border-2 border-ceremony-gold/10">
                <img 
                  src={currentPost.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Ceremony Moment"
                />
              </div>
            </div>
          )}

          {/* Message Section */}
          <div className={`p-12 text-center flex flex-col justify-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
            <span className="text-6xl text-ceremony-gold opacity-30 font-serif">“</span>
            <p className="font-serif text-3xl md:text-5xl text-ceremony-emerald leading-snug italic px-4">
              {currentPost.message}
            </p>
            <span className="text-6xl text-ceremony-gold opacity-30 font-serif text-right mt-2">”</span>
            
            {/* Ornament Divider */}
            <div className="mt-8 text-ceremony-gold text-2xl">❈ ❈ ❈</div>
          </div>
        </div>
      </div>

      {/* Slide Indicator (Footer) */}
      <div className="absolute bottom-10 flex gap-2">
        {posts.map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "bg-ceremony-gold w-8" : "bg-ceremony-gold/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveWall;