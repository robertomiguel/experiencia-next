/* eslint-disable @next/next/no-img-element */
import { cookies } from 'next/headers'
import { LinkAction } from './LinkAction'
import Link from 'next/link'
import admin from '@/lib/firebaseAdmin'

export const MainMenu = async () => {
  const menuItems = [{ label: 'Home', href: '/' }]

  const cookieStore = await cookies()
  const token = cookieStore.get('firebaseToken')?.value
  let user = null

  if (token) {
    const decodedToken = await admin.auth().verifyIdToken(token)
    if (
      decodedToken.aud == process.env.FIREBASE_PROJECT_ID ||
      decodedToken.iss ==
        `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`
    ) {
      user = decodedToken
    }
  }

  return (
    <nav className="flex justify-between z-20 text-gray-50 bg-blue-800 p-2 pl-4 pr-4 m-3 rounded-full gap-3 sticky top-0 overflow-x-auto ">
      {menuItems.map((item) => (
        <LinkAction key={item.href} label={item.label} href={item.href} />
      ))}
      {!user && (
        <Link href="/login">
          <span className="max-h-[30px] p-1 text-blue-500 bg-gray-50 rounded-xl">
            Login
          </span>
        </Link>
      )}
      {user && (
        <Link href="/login">
          <img
            src={user.picture}
            alt={user.name}
            className="max-h-[30px] rounded-full"
          />
        </Link>
      )}
    </nav>
  )
}
