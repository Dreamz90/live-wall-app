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

  // 1. Live Sync with Firestore
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

  // 2. BACKGROUND IMAGE PRE-FETCH ENGINE (Eliminates LED display lag)
  useEffect(() => {
    if (posts.length > 1) {
      // Calculate what the next index will be
      const nextIndex = (currentIndex + 1) % posts.length;
      const nextPost = posts[nextIndex];

      // If the upcoming post has an image, load it into browser cache silently
      if (nextPost && nextPost.imageUrl) {
        const imgCache = new Image();
        imgCache.src = nextPost.imageUrl;
      }
    }
  }, [currentIndex, posts]);

  // 3. Slideshow Rotation Timer
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

  // Shrink-to-Fill background calculation
  const gridDimension = Math.ceil(Math.sqrt(posts.length));
  const cellSize = 100 / gridDimension;

  return (
    <div className="relative h-screen w-screen bg-ceremony-cream overflow-hidden flex flex-col items-center justify-between py-[1vh] px-[4vw]">
      
      {/* BACKGROUND COLLAGE */}
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

      {/* HEADER - Tucked higher */}
      <div className="relative z-30 text-center -mt-[1vh]">
        <div className="text-ceremony-gold text-[8vh] mb-[0.2vh] font-arabic drop-shadow-md">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        <h1 className="font-serif text-[4.5vh] text-ceremony-emerald tracking-tight bg-white/70 backdrop-blur-md px-[4vw] py-[0.5vh] rounded-full shadow-sm">
          My Little Angel's Naming Ceremony
        </h1>
      </div>

      {/* CENTER STAGE - Natural Content Flow */}
      <div className="relative z-20 w-full max-w-[92vw] flex-grow flex items-center justify-center">
        <div 
          key={currentPost.id} 
          className="relative h-[70vh] w-full shadow-[0_4vh_10vh_-3vh_rgba(0,0,0,0.4)] rounded-[5vh] overflow-hidden animate-zoom-in"
          style={{
            backgroundImage: `url(${frameBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Main Content Row: Natural side-by-side occupancy */}
          <div className="absolute inset-0 flex flex-row items-center justify-center p-[8vh] gap-[4vw]">
            
            {/* Image Container: Flex-shrink-0 keeps it from getting squashed */}
            {currentPost.imageUrl && (
              <div className="flex-shrink-0 h-full max-h-[95%] max-w-[34%] flex items-center justify-center">
                <div className="h-full w-auto aspect-auto overflow-hidden rounded-[3vh] shadow-2xl border-[0.6vh] border-white/90 bg-white/5">
                  <img 
                    src={currentPost.imageUrl} 
                    className="h-full w-auto object-contain block" 
                    alt="Guest"
                  />
                </div>
              </div>
            )}

            {/* Message Container: Transparent, flex-1 fills remaining space naturally */}
            <div className="flex-1 h-full flex flex-col items-center justify-center text-center">
              <div className="max-w-[95%] flex flex-col justify-center space-y-[3vh]">
                <p className="font-serif text-[5.5vh] text-stone-800 italic leading-tight break-words drop-shadow-sm">
                  "{currentPost.message}"
                </p>
                
                {currentPost.name && (
                  <div className="flex flex-col items-center">
                    <p className="text-ceremony-gold uppercase tracking-[0.2em] font-bold text-[3.2vh] drop-shadow-sm">
                      — {currentPost.name}
                    </p>
                    <div className="mt-[1.5vh] text-amber-600 text-[5vh] tracking-widest opacity-80">
                      {selectedSeparator}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER - Tucked lower */}
      <div className="relative z-30 bg-ceremony-emerald text-ceremony-cream px-[5vw] py-[1vh] rounded-full font-serif tracking-[0.3em] text-[2.8vh] uppercase shadow-2xl mb-[0.5vh]">
        May 17, 2026
      </div>
    </div>
  );
}

export default LiveWall;