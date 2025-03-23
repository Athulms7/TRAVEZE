
import React from "react";

const BackgroundImage: React.FC<{ fullHeight?: boolean }> = ({ fullHeight = false }) => {
  return (
    <div 
      className={`absolute left-0 top-0 w-full overflow-hidden ${
        fullHeight ? "h-full" : "h-[40%]"
      }`}
    >
      <div 
        className="w-full h-full bg-gradient-to-b from-vander-blue/80 to-vander-teal/60 absolute top-0 left-0 z-10"
        style={{ mixBlendMode: "multiply" }}
      />
      <img
        src="https://images.unsplash.com/photo-1586500036706-41963de24d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
        alt="Aerial view of an island"
        className="w-full h-full object-cover animate-blur-in"
        loading="lazy"
        style={{ objectPosition: "center 30%" }}
      />
    </div>
  );
};

export default BackgroundImage;
