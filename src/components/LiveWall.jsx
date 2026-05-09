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
    <div className="relative h-screen w-screen bg-ceremony-cream overflow-hidden flex flex-col items-center justify-between p-[4vh]">
      
      {/* BACKGROUND COLLAGE - Universal Scaling */}
      <div className="absolute inset-0 flex flex-wrap opacity-15 grayscale pointer-events-none overflow-hidden">
        {posts.map((post, i) => (
          <div 
            key={`bg-${i}`} 
            className="flex-grow border-[0.1vh] border-white/20 overflow-hidden"
            style={{
              flexBasis: `${cellSize}%`,
              height: `${cellSize}%`,
              minWidth: '2vw',
              minHeight: '2vh'
            }}
          >
            {post.imageUrl ? (
              <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full p-[0.5vh] bg-white/50 flex items-center justify-center text-center text-[1vh] font-serif text-ceremony-emerald italic overflow-hidden">
                {post.message.substring(0, 20)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* HEADER - Scaled with vh */}
      <div className="relative z-30 text-center">
        <div className="text-ceremony-gold text-[8vh] mb-[0.5vh] font-arabic drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-[4.5vh] text-ceremony-emerald tracking-tight bg-white/70 backdrop-blur-md px-[4vw] py-[1vh] rounded-full shadow-sm">
          My Little Angel's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE - Adaptive sizing */}
      <div className="relative z-20 w-full max-w-[85vw] px-[2vw]">
        <div 
          key={currentPost.id} 
          className="relative h-[62vh] w-full shadow-[0_4vh_10vh_-3vh_rgba(0,0,0,0.4)] rounded-[5vh] overflow-hidden animate-zoom-in"
          style={{
            backgroundImage: `url(${frameBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex flex-col md:flex-row items-center p-[5vh]">
            
            {/* Photo Section */}
            {currentPost.imageUrl && (
              <div className="w-full md:w-1/3 h-full flex justify-center items-center">
                <div className="w-fit h-fit max-h-[85%] overflow-hidden rounded-[3vh] shadow-xl border-[0.6vh] border-white/80">
                  <img 
                    src={currentPost.imageUrl} 
                    className="max-h-[48vh] w-auto h-auto block object-contain" 
                    alt="Guest"
                  />
                </div>
              </div>
            )}

            {/* Message Section */}
            <div className={`flex flex-col items-center justify-center text-center p-[2vh] ${currentPost.imageUrl ? 'md:w-2/3' : 'w-full h-full'}`}>
              <div className="p-[4vh] rounded-[4vh] border border-white/20 w-full h-fit max-h-[80%] flex flex-col justify-center">
                <p className="font-serif text-[4.5vh] text-stone-700 italic leading-tight break-words">
                  "{currentPost.message}"
                </p>
                
                {currentPost.name && (
                  <p className="mt-[2vh] text-ceremony-gold uppercase tracking-widest font-bold text-[3vh]">
                    — {currentPost.name}
                  </p>
                )}

                <div className="mt-[3vh] text-amber-600 text-[3vh] tracking-widest opacity-80">
                  {selectedSeparator}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - Scaled with vh */}
      <div className="relative z-30 bg-ceremony-emerald text-ceremony-cream px-[5vw] py-[1.5vh] rounded-full font-serif tracking-[0.3em] text-[2.8vh] uppercase shadow-2xl mb-[1vh]">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;