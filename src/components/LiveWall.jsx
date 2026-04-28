// Example of a Photo Card with the Islamic Theme
<div className="relative p-4 border-2 border-[#C5A059] bg-white shadow-xl rounded-sm">
  {/* Decorative corner element (Optional) */}
  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]"></div>
  
  <img src={post.imageUrl} className="w-full h-auto rounded-sm border border-[#EADCA6]" />
  
  <div className="mt-4 text-center">
    <p className="font-serif text-[#2C5E1A] text-lg italic leading-relaxed">
      "{post.message}"
    </p>
  </div>
</div>