import React from "react";

const RoomView = ({ children }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 3D White Room Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-white to-gray-200 shadow-inner"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(200,200,200,1)_100%)]"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default RoomView;
