"use client";

import Login from "@/pages/Login";
import MainApp from "@/pages/MainApp";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (usernameInput: string) => {
    const newUuid = uuidv4();
    setUsername(usernameInput);
    setUserUuid(newUuid);
    console.log(`User ${usernameInput} logged in with UUID: ${newUuid}`);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return username && userUuid ? (
    <MainApp username={username} userUuid={userUuid} />
  ) : (
    <Login onSubmit={handleLogin} />
  );
}
