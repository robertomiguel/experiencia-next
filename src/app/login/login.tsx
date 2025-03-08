/* eslint-disable @next/next/no-img-element */
'use client';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebaseClient';
import { loginAction, logoutAction } from './actions';
import { useRouter, useSearchParams } from 'next/navigation';

const ClientComponent = ({ user }: { user: any }) => {

  const params = useSearchParams()
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await loginAction(token);
      const redirect = params.get('redirect') || '/';
      router.push(redirect);
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await logoutAction();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      {user ? (
        <>
          <p className="text-lg font-semibold">Bienvenido, {user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <img src={user.picture} alt={user.name} className="w-20 h-20 rounded-full" />
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-xl">
            Cerrar sesión
          </button>
        </>
      ) : (
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded-full flex justify-center items-center w-fit">
          Iniciar sesión con <img src="https://www.google.com/logos/doodles/2025/international-womens-day-2025-6753651837110620.2-sdrk.png" alt="Google" className="inline-block" />
        </button>
      )}
    </div>
  );
};

export default ClientComponent;
