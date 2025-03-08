import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    await admin.auth().verifyIdToken(token);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
