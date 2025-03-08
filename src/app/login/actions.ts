'use server';

import { cookies } from 'next/headers';

export async function loginAction(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
    name: 'firebaseToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('firebaseToken');
}
