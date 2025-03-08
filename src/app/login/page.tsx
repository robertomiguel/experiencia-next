'use server';

import { cookies } from 'next/headers';
import admin from '@/lib/firebaseAdmin';
import ClientComponent from './login';

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebaseToken')?.value;
  let user = null;

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Validar que el token pertenece a tu proyecto Firebase
      if (
        decodedToken.aud !== process.env.FIREBASE_PROJECT_ID ||
        decodedToken.iss !== `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`
      ) {
        throw new Error('Token no válido para este proyecto.');
      }

      // Validar que el email está verificado
      if (!decodedToken.email_verified) {
        throw new Error('Email no verificado.');
      }

      // Opcional: Restringir solo a ciertos dominios
      if (!decodedToken.email?.endsWith('@gmail.com')) {
        throw new Error('Dominio no autorizado.');
      }

      user = decodedToken;
    } catch (error) {
      console.error("Token inválido o acceso denegado", error);
    }
  }

  return <ClientComponent user={user} />;
};

export default Page;
