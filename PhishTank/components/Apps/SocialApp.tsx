
import React, { useState } from 'react';
import { SocialPost } from '../../types';
import { X, Heart, MessageCircle, Share2, AlertOctagon, Bookmark } from 'lucide-react';

interface SocialAppProps {
  posts: SocialPost[];
  onBack: () => void;
  onInteract: (id: string, action: 'like' | 'report') => void;
}

export const SocialApp: React.FC<SocialAppProps> = ({ posts, onBack, onInteract }) => {
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
  const [lastTap, setLastTap] = useState<{id: string, time: number} | null>(null);
  const [heartAnim, setHeartAnim] = useState<string | null>(null);

  const handleDoubleTap = (id: string) => {
      const now = Date.now();
      if (lastTap && lastTap.id === id && now - lastTap.time < 300) {
          // Double Tap Detected
          onInteract(id, 'like');
          setHeartAnim(id);
          setTimeout(() => setHeartAnim(null), 1000);
      } else {
          setLastTap({ id, time: now });
      }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="pt-12 pb-2 px-4 bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20 flex items-center justify-between">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-lg tracking-wider font-serif italic bg-gradient-to-r from-purple-500 to-orange-500 text-transparent bg-clip-text">InstaFace</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
             <div className="w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm">Refreshing Feed...</p>
          </div>
        ) : (
          sortedPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-900 pb-2 mb-2">
              {/* User Header */}
              <div className="flex items-center px-3 py-3 gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${post.isScam ? 'from-red-500 to-pink-500' : 'from-blue-400 to-green-400'} flex items-center justify-center font-bold text-xs ring-2 ring-black`}>
                  {post.username.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm leading-none mb-1">{post.username}</div>
                  <div className="text-gray-400 text-[10px]">{post.handle}</div>
                </div>
                <button className="text-gray-500"><Share2 size={16}/></button>
              </div>
              
              {/* Image Content */}
              <div 
                className="w-full aspect-square bg-gray-900 relative overflow-hidden group cursor-pointer"
                onClick={() => handleDoubleTap(post.id)}
              >
                  {post.imageUrl ? (
                      <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                          <p className="px-8 text-center text-gray-400 font-serif text-xl italic">"{post.content}"</p>
                      </div>
                  )}
                  
                  {/* Heart Animation */}
                  {heartAnim === post.id && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 animate-[ping_0.5s_ease-out]">
                          <Heart size={80} className="fill-white text-white drop-shadow-2xl"/>
                      </div>
                  )}

                  {/* Scam Overlay Hint (Subtle) */}
                  {post.isScam && (
                      <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white/50 pointer-events-none">
                          Sponsored
                      </div>
                  )}
              </div>

              {/* Actions */}
              <div className="px-3 pt-3">
                <div className="flex items-center justify-between mb-3">
                     <div className="flex gap-4">
                        <button onClick={() => onInteract(post.id, 'like')} className={`${post.interacted ? 'text-red-500' : 'text-white hover:text-gray-400'} transition-colors active:scale-90 transform duration-100`}>
                            <Heart size={24} className={post.interacted ? "fill-red-500" : ""} />
                        </button>
                        <button className="text-white hover:text-gray-400 rotate-90"><MessageCircle size={24} /></button>
                        <button className="text-white hover:text-gray-400"><Share2 size={24} /></button>
                     </div>
                     <div className="flex gap-3">
                        {!post.interacted && (
                            <button onClick={() => onInteract(post.id, 'report')} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide border border-gray-700 rounded px-2 py-1">
                                <AlertOctagon size={14} />
                            </button>
                        )}
                        <button className="text-white hover:text-gray-400"><Bookmark size={24} /></button>
                     </div>
                </div>

                <div className="text-white font-bold text-sm mb-1">{post.likes.toLocaleString()} likes</div>
                
                <div className="mb-2">
                    <span className="font-bold text-sm mr-2">{post.username}</span>
                    <span className="text-sm text-gray-200">{post.content}</span>
                </div>

                <div className="text-gray-500 text-[10px] uppercase tracking-wide">
                    {new Date(post.timestamp).toLocaleDateString()}
                </div>
                
                {post.interacted && (
                    <div className={`text-xs font-bold mt-3 py-2 px-3 rounded w-full text-center ${post.isScam ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-blue-900/50 text-blue-400 border border-blue-800'}`}>
                        {post.isScam ? "✓ SCAM REPORTED (+Rep)" : "✓ LIKED POST"}
                    </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
