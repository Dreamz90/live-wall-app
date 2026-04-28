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
    <div className="islamic-floral-bg min-h-screen p-6 md:p-10 border-[16px] border-double border-ceremony-gold/20">
      
      {/* Ornate Header */}
      <header className="text-center mb-16 relative">
        <div className="text-ceremony-gold text-4xl mb-4 opacity-40">✨ ﷽ ✨</div>
        <h1 className="font-serif text-6xl md:text-8xl text-ceremony-emerald mb-4 tracking-tighter">
          Hafsa Tasnim
        </h1>
        <h2 className="font-serif text-xl md:text-2xl text-ceremony-gold uppercase tracking-[0.4em] font-light">
          Naming Ceremony • May 17, 2026
        </h2>
        <div className="flex justify-center mt-6">
          <div className="h-[2px] w-24 bg-ceremony-gold"></div>
          <div className="mx-4 text-ceremony-gold -mt-2">❈</div>
          <div className="h-[2px] w-24 bg-ceremony-gold"></div>
        </div>
      </header>

      {/* Grid with 5 columns for high-capacity viewing */}
      <div className="columns-1 sm:columns-2 lg:columns-4 xl:columns-5 gap-6 space-y-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="break-inside-avoid bg-white/95 border-t-4 border-ceremony-gold rounded-b-2xl shadow-xl transition-all duration-700 hover:-translate-y-2"
          >
            {post.imageUrl ? (
              /* PHOTO POST: Arch Shape */
              <div className="p-2">
                <div className="islamic-arch overflow-hidden bg-ceremony-cream border-2 border-ceremony-gold/10">
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-auto block hover:scale-110 transition-transform duration-1000"
                    alt="Blessing"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="font-serif italic text-lg text-ceremony-emerald italic leading-tight">
                    "{post.message}"
                  </p>
                </div>
              </div>
            ) : (
              /* TEXT ONLY: Decorative Floral Frame */
              <div className="p-8 text-center min-h-[220px] flex flex-col items-center justify-center border-4 border-double border-ceremony-gold/30 m-2 rounded-xl">
                <div className="text-ceremony-gold text-2xl mb-2">❦</div>
                <p className="font-serif text-2xl text-ceremony-emerald font-semibold leading-relaxed">
                  {post.message}
                </p>
                <div className="text-ceremony-gold text-2xl mt-2">❦</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveWall;