'use server'
import { NextjsXP } from "@/components/home/NextjsXP";

export default async function Home() {
  // Array estático de rutas en lugar de leer el directorio
  const folders = [
    'coin',
    'editor',
    'login',
    'paint',
    'arcade',
    'cripto',
    'fabric',
    'image',
    'notif',
    'piano',
    'simon',
    'chat',
    'dj',
    'pong',
    'sound'
  ];

  return (
    <div className="flex justify-center items-center mt-2 sm:mt-10">
      <NextjsXP routes={folders} />
    </div>
  );
}
