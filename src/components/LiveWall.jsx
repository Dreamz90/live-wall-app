import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import frameBg from '../assets/frame-bg.jpg';

function LiveWall() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
//keyboards icons
  const separators = [
    "┈━═☆ ☾ ☆═━┈","✨ ✨ ✨ ✨ ✨", "⸜(｡˃ ᵕ ˂ )⸝♡","❀⊱┄┄┄┄┄⊰❀", "✧ ✧ ✧ ✧ ✧","(づ◕‿◕)づ", "~❁~❁~❁~❁~","(ദ്ദി˙ᗜ˙)","(·❛ ֊ ❛)",
    "◈ ◈ ◈ ◈ ◈", "ꕥ ꕥ ꕥ", "(˶ᵔ ᵕ ᵔ˶)", "(˶ᵔᗜᵔ˶)ﾉﾞ","ദ്ദി(˵•̀ ᴗ - ˵)✧","⚜ • ⚜ • ⚜","🍼 ✨ 🍼 ✨ 🍼",
    "(๑>◡<๑)", "⸜( ˶>ᴗ<˶)⸝♡","(◠‿◠)","（＾◡＾）♡","❃°•°❀°•°❃","── ⋆⋅☆⋅⋆ ──"
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
    <div className="relative min-h-screen w-full bg-ceremony-cream overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND COLLAGE */}
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

      {/* HEADER */}
      <div className="relative z-30 text-center mb-6">
        <div className="text-ceremony-gold text-5xl md:text-7xl mb-2 font-arabic drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-2xl md:text-5xl text-ceremony-emerald tracking-tight bg-white/60 backdrop-blur-sm px-8 py-2 rounded-full inline-block">
          Hafsa Tasnim's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE */}
      <div className="relative z-20 w-full max-w-screen-xl px-4">
        <div 
          key={currentPost.id} 
          className="relative h-[70vh] w-full shadow-[0_50px_120px_-30px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden animate-zoom-in"
          style={{
            backgroundImage: `url(${frameBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex flex-col md:flex-row items-center p-8 md:p-12">
            
            {/* Adaptive Photo Section */}
            {currentPost.imageUrl && (
              <div className="w-full md:w-1/2 h-full flex justify-center items-center p-4">
                {/* Border hugs the image tightly */}
                <div className="w-fit h-fit max-h-[80%] overflow-hidden rounded-2xl shadow-xl border-4 border-white/80">
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
              <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[30px] border border-white/20 w-full max-h-full overflow-y-auto">
                <p className="font-serif text-3xl md:text-4xl text-ceremony-emerald italic leading-snug">
                  {currentPost.message}
                </p>
                
                {currentPost.name && (
                  <p className="mt-4 text-ceremony-gold uppercase tracking-widest font-bold text-xs md:text-sm">
                    — {currentPost.name}
                  </p>
                )}

                {/* Separator placed after message/name */}
                <div className="mt-10 text-ceremony-gold text-3xl md:text-4xl tracking-widest opacity-80 font-light">
                  {selectedSeparator}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-30 mt-8 bg-ceremony-emerald text-ceremony-cream px-8 py-2 rounded-full font-serif tracking-[0.3em] text-[14px] uppercase shadow-xl">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;