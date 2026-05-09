import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import frameBg from '../assets/frame-bg.jpg';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const separators = [
    "┈━═☆ ☾ ☆═━┈","✨ ✨ ✨ ✨ ✨", "⸜(｡˃ ᵕ ˂ )⸝♡","❀⊱┄┄┄┄┄┄┄┄┄┄┄⊰❀", "✧ ✧ ✧ ✧ ✧","(づ◕‿◕)づ", "~❁~❁~❁~❁~","(ദ്ദി˙ᗜ˙)","(·❛ ֊ ❛)",
    "◈ ◈ ◈ ◈ ◈", "ꕥ ꕥ ꕥ", "(˶ᵔ ᵕ ᵔ˶)", "(˶ᵔᗜᵔ˶)ﾉﾞ","ദ്ദി(˵•̀ ᴗ - ˵)✧","⚜ • ⚜ • ⚜","🍼 ✨ 🍼 ✨ 🍼",
    "(๑>◡<๑)", "⸜( ˶>ᴗ<˶)⸝♡","(◠‿◠)","（＾◡＾）♡"
  ];

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
      }, 6000); 
      return () => clearInterval(interval);
    }
  }, [posts]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const selectedSeparator = separators[currentIndex % separators.length];

  return (
    // Added 'p-10' for safe-zone padding to prevent cut-offs
    <div className="relative min-h-screen h-screen w-screen bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center p-10">
      
      {/* BACKGROUND COLLAGE - Shrinks items as more are added */}
      <div className="absolute inset-0 flex flex-wrap content-start gap-1 opacity-10 grayscale pointer-events-none p-2 overflow-hidden">
        {posts.map((post, i) => (
          <div 
            key={`bg-${i}`} 
            className="bg-white border border-ceremony-gold/10 overflow-hidden rounded-sm"
            style={{
              flex: '1 0 10%', // Base size 10% width, grows/shrinks dynamically
              height: 'auto',
              aspectRatio: '1 / 1',
              maxWidth: '120px' // Prevents photos from being too huge when you only have 1 or 2 posts
            }}
          >
            {post.imageUrl ? (
              <img 
                src={post.imageUrl} 
                className="w-full h-full object-contain bg-white" 
                alt="" 
              />
            ) : (
              <div className="p-1 text-[10px] font-serif text-ceremony-emerald italic leading-tight break-words">
                {post.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="relative z-30 text-center mb-6">
        <div className="text-ceremony-gold text-7xl md:text-8xl mb-2 font-arabic drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-6xl md:text-7xl text-ceremony-emerald tracking-tight bg-white/60 backdrop-blur-sm px-10 py-2 rounded-full inline-block shadow-sm">
          My Little Angel's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE */}
      <div className="relative z-20 w-full max-w-[85vw] px-2">
        <div 
          key={currentPost.id} 
          className="relative h-[65vh] w-full shadow-[0_50px_120px_-30px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden animate-zoom-in"
          style={{
            backgroundImage: `url(${frameBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex flex-col md:flex-row items-center p-6 md:p-12">
            
            {/* Adaptive Photo Section */}
            {currentPost.imageUrl && (
              <div className="w-full md:w-1/2 h-full flex justify-center items-center p-4">
                <div className="w-fit h-fit max-h-[85%] overflow-hidden rounded-2xl shadow-xl border-4 border-white/80">
                  <img 
                    src={currentPost.imageUrl} 
                    className="max-h-[50vh] w-auto h-auto block object-contain bg-black/5" 
                    alt="Guest"
                  />
                </div>
              </div>
            )}

            {/* Message Section */}
            <div className={`flex flex-col items-center justify-center p-6 text-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full h-full'}`}>
              <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[30px] border border-white/20 w-full h-fit max-h-[90%] overflow-hidden flex flex-col justify-center">
                
                {/* Forced text wrapping with break-words */}
                <p className="font-serif text-5xl md:text-6xl text-stone-600 italic leading-snug text-center break-words w-full">
                  "{currentPost.message}"
                </p>
                
                {currentPost.name && (
                  <p className="mt-6 text-ceremony-gold uppercase tracking-widest font-bold text-[35px] md:text-[40px]">
                    — {currentPost.name}
                  </p>
                )}

                {/* Separator placed after message/name */}
                <div className="mt-8 text-amber-500 text-6xl md:text-7xl tracking-widest opacity-80 font-light">
                  {selectedSeparator}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-30 mt-8 bg-ceremony-emerald text-ceremony-cream px-10 py-3 rounded-full font-serif tracking-[0.3em] text-[28px] uppercase shadow-xl">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;