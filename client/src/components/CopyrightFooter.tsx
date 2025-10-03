import React from 'react';

export default function CopyrightFooter() {
  return (
    <div
      style={{ zIndex: 999 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 opacity-60 hover:opacity-90 transition-opacity duration-300"
    >
      <div className="bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 flex-col sm:flex-row">
          <span className="font-bold text-md sm:text-lg">© 2025</span>
          <span className="font-bold text-md sm:text-lg">
            Real-Time Tracker
          </span>
          <span className="text-gray-300 text-md sm:text-lg">
            by Kevin Kelly Isyanta
          </span>
        </div>
      </div>
    </div>
  );
}
