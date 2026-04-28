import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LiveWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 1. Reference the 'posts' collection in Firestore
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    // 2. Set up a real-time listener (OnSnapshot)
    // This is the "magic" - as soon as a guest uploads, it appears here!
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="islamic-floral-bg min-h-screen p-8">
      {/* Header: Update this with your baby's name */}
      <header className="text-center mb-12">
        <h1 className="font-arabic text-6xl text-ceremony-gold mb-2">Bismillah</h1>
        <h2 className="font-serif text-4xl text-ceremony-green uppercase tracking-widest">
          Naming Ceremony Moments
        </h2>
        <div className="w-32 h-1 bg-ceremony-gold mx-auto mt-4 rounded-full"></div>
      </header>

      {/* The Live Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="ceremony-card p-3 animate-fade-in">
            {post.type === 'video' ? (
              <video 
                src={post.fileUrl} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-72 object-cover rounded shadow-inner"
              />
            ) : (
              <img 
                src={post.fileUrl} 
                alt="Ceremony Moment" 
                className="w-full h-72 object-cover rounded" 
              />
            )}
            
            {/* The Message Area */}
            <div className="mt-4 text-center px-2">
              <p className="font-serif italic text-xl text-gray-800">
                "{post.message}"
              </p>
              <div className="mt-2 text-ceremony-gold opacity-50">✦ ✦ ✦</div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-ceremony-gold font-serif mt-20 text-2xl">
          Waiting for the first moments to be shared...
        </p>
      )}
    </div>
  );
}

export default LiveWall;