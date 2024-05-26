'use client'
import Link from "next/link"
import { loginAction } from "./login.action"
import { useRouter } from "next/navigation"

export const LoginForm = () => {

    const router = useRouter()

    return (
        <div className="ml-2 mr-2" >
            <div className={"flex flex-col rounded-lg p-8 gap-4 w-full sm:w-96 mt-20 m-auto text-center justify-center content-center items-center  bg-blue-500"
            }>
                <h3>Access to generate images with AI</h3>
                <form className="flex flex-col w-full gap-3" action={async (data) => {
                    const res = await loginAction(data)
                    document.cookie = `auth=${res.token}`
                    if (res.token) router.push('/images')
                }} >
                    <input id="email" name="email" type="email" placeholder="Usuario" />
                    <input id="password" name="password" type="password" placeholder="Contraseña" />
                    <button type="submit" >Login</button>
                </form>
                <Link href="/login/register">Create account</Link>
            </div>
        </div>
    )
}