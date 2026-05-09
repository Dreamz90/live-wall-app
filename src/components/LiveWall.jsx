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

  // Dynamic calculation for Shrink-to-Fill logic
  const gridDimension = Math.ceil(Math.sqrt(posts.length));
  const cellSize = 100 / gridDimension;

  return (
    <div className="relative min-h-screen h-screen w-screen bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center p-10">
      
      {/* BACKGROUND COLLAGE - Dynamic Shrink to Fill */}
      <div className="absolute inset-0 flex flex-wrap opacity-15 grayscale pointer-events-none overflow-hidden">
        {posts.map((post, i) => (
          <div 
            key={`bg-${i}`} 
            className="flex-grow border-[0.5px] border-white/20 overflow-hidden"
            style={{
              // These dynamic values ensure images fill the screen and shrink as count increases
              flexBasis: `${cellSize}%`,
              height: `${cellSize}%`,
              minWidth: '50px',
              minHeight: '50px'
            }}
          >
            {post.imageUrl ? (
              <img 
                src={post.imageUrl} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            ) : (
              <div className="w-full h-full p-2 bg-white/50 flex items-center justify-center text-center text-[10px] font-serif text-ceremony-emerald italic leading-tight break-words">
                {post.message.substring(0, 30)}...
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
        <h1 className="font-serif text-6xl md:text-7xl text-ceremony-emerald tracking-tight bg-white/70 backdrop-blur-md px-10 py-2 rounded-full inline-block shadow-sm">
          My Little Angel's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE */}
      <div className="relative z-20 w-full max-w-[85vw] px-2">
        <div 
          key={currentPost.id} 
          className="relative h-[65vh] w-full shadow-[0_50px_120px_-30px_rgba(0,0,0,0.4)] rounded-[40px] overflow-hidden animate-zoom-in"
          style={{
            backgroundImage: `url(${frameBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex flex-col md:flex-row items-center p-6 md:p-12">
            
            {/* Photo Section */}
            {currentPost.imageUrl && (
              <div className="w-full md:w-1/2 h-full flex justify-center items-center p-4">
                <div className="w-fit h-fit max-h-[85%] overflow-hidden rounded-2xl shadow-xl border-4 border-white/80">
                  <img 
                    src={currentPost.imageUrl} 
                    className="max-h-[50vh] w-auto h-auto block object-contain" 
                    alt="Guest"
                  />
                </div>
              </div>
            )}

            {/* Message Section */}
            <div className={`flex flex-col items-center justify-center p-6 text-center ${currentPost.imageUrl ? 'md:w-1/2' : 'w-full h-full'}`}>
              <div className="bg-white/50 backdrop-blur-lg p-8 rounded-[30px] border border-white/20 w-full h-fit max-h-[90%] overflow-hidden flex flex-col justify-center">
                <p className="font-serif text-5xl md:text-6xl text-stone-700 italic leading-snug break-words">
                  "{currentPost.message}"
                </p>
                
                {currentPost.name && (
                  <p className="mt-6 text-ceremony-gold uppercase tracking-widest font-bold text-[35px] md:text-[45px]">
                    — {currentPost.name}
                  </p>
                )}

                <div className="mt-8 text-amber-600 text-6xl md:text-7xl tracking-widest opacity-80 font-light">
                  {selectedSeparator}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-30 mt-8 bg-ceremony-emerald text-ceremony-cream px-10 py-3 rounded-full font-serif tracking-[0.3em] text-[28px] uppercase shadow-2xl">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;