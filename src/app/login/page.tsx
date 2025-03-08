/* eslint-disable @next/next/no-img-element */
'use client'

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, useCallback } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyAiEqVkK3a0R-ZYfylLFyXAayA-WIe2YwM",
    authDomain: "experiencia-next.firebaseapp.com",
    projectId: "experiencia-next",
    storageBucket: "experiencia-next.firebasestorage.app",
    messagingSenderId: "552760815957",
    appId: "1:552760815957:web:eba6f666c823fa9fe47fdc"
  };

initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
    Iniciar sesión con Google
  </button>
);

const LogoutButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="px-4 py-2 bg-red-500 text-white rounded-xl">
    Cerrar sesión
  </button>
);

const Page = () => {
  const [user, setUser] = useState(auth.currentUser);

  console.log('rerender: ', user);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      {user ? (
        <>
          <img src={user.photoURL || ""} alt="Perfil" className="w-20 h-20 rounded-full" />
          <p className="text-lg font-semibold">{user.displayName}</p>
          <p className="text-lg font-semibold">{user.email}</p>
          <LogoutButton onClick={handleLogout} />
        </>
      ) : (
        <LoginButton onClick={handleLogin} />
      )}
    </div>
  );
};

export default Page;
