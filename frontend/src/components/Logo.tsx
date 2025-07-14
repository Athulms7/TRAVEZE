import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-vander-dark tracking-wider">
        <span className="text-vander-green">TRAVEZE</span>
      </h1>
      <p className="text-xs tracking-widest text-vander-dark">THE SMART VOYAGE</p>
    </div>
  );
};

export default Logo;
