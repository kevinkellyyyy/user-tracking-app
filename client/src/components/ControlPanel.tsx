"use client";

import { useState } from "react";

interface ControlPanelProps {
  username: string;
  userUuid: string;
  fakeUserCount: number;
  setFakeUserCount: (count: number) => void;
  followedUserId: string | null;
  followedUserData: {
    id: string;
    name: string;
  } | null;
  onUnfollow: () => void;
}

export default function ControlPanel({
  username,
  userUuid,
  fakeUserCount,
  setFakeUserCount,
  followedUserId,
  followedUserData,
  onUnfollow,
}: ControlPanelProps) {
  // Local state for input value
  const [inputValue, setInputValue] = useState("");
  // State for panel visibility
  const [isOpen, setIsOpen] = useState(true);

  // Reload the page to go back to login
  const handleLogout = () => {
    window.location.reload();
  };

  // Open a new tab with the same URL (for testing websocket multiple users)
  const handleOpenNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  const handleSimulate = () => {
    const count = parseInt(inputValue) || 0;
    if (count > 0) {
      setFakeUserCount(count);
      console.log(`Simulating ${count} fake users`);
    }
  };

  const handleResetSimulation = () => {
    setFakeUserCount(0);
    setInputValue("");
  };

  return (
    <div style={{ zIndex: 999 }} className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 ml-auto block bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition duration-200 h-[50px] w-[50px]"
        title={isOpen ? "Hide Control Panel" : "Show Control Panel"}
      >
        <span className="text-lg">{isOpen ? "✕" : "⚙️"}</span>
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg border p-4 space-y-3 min-w-[200px] animate-in slide-in-from-right duration-200">
          {/* Always visible buttons */}
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>

            <button
              onClick={handleOpenNewTab}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm flex items-center justify-center gap-2"
            >
              <span>🔗</span>
              New Tab
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* User info */}
          <div className="text-xs text-gray-500 text-center border-b border-gray-100 pb-2">
            <div>👤 {username}</div>
            <div className="truncate">🔑 {userUuid.slice(0, 8)}...</div>
          </div>

          {/* Currently Following Section */}
          {followedUserId && followedUserData && (
            <>
              <hr className="border-gray-200" />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <div className="text-sm font-medium text-blue-800 text-center">
                  📍 Currently Following...
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <strong>ID:</strong> {followedUserData.id}
                  </div>
                  <div>
                    <strong>Name:</strong> {followedUserData.name}
                  </div>
                </div>
                <button
                  onClick={onUnfollow}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm flex items-center justify-center gap-2"
                >
                  <span>❌</span>
                  Unfollow
                </button>
              </div>
            </>
          )}

          {/* Conditional simulation controls */}
          {fakeUserCount === 0 ? (
            <div className="space-y-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Number of fake users"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                min="1"
                max="100"
              />
              <button
                onClick={handleSimulate}
                disabled={!inputValue || parseInt(inputValue) <= 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm flex items-center justify-center gap-2"
              >
                <span>🤖</span>
                Simulate Users
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 text-center">
                <span className="font-medium">{fakeUserCount}</span> fake users
                active
              </div>
              <button
                onClick={handleResetSimulation}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-md transition duration-200 text-sm flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Reset Simulation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
