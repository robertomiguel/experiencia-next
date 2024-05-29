'use client'
import Link from "next/link"
import { loginAction } from "./login.action"
import { useRouter } from "next/navigation"
import { HTMLInputAutoCompleteAttribute, useState } from "react"
import { FiInfo } from "react-icons/fi"
import { useAppDispatch } from "@/store"
import { login } from "@/store/userSlice"
import { UserLogin } from "@/types/user"

export interface LoginCredentials {
    email: string
    password: string
}

interface FormFieldProps {
    children: React.ReactNode
    error: string | undefined
}

const FormField = ({ children, error }: FormFieldProps) => {
    return <div className="relative mb-5" >
        {children}
        {error &&
            <div className="absolute text-xs flex flex-row gap-2 justify-center items-center ml-3 mt-1 " ><FiInfo /> {error}</div>}
    </div>
}

export const LoginForm = () => {

    const router = useRouter()

    const dispath = useAppDispatch()

    const [errors, setErrors] = useState<LoginCredentials | undefined>()

    const handleSubmit = async (formData: FormData) => {

        const dataText = JSON.stringify(Object.fromEntries(formData.entries()));

        const res = await loginAction(JSON.parse(dataText) as LoginCredentials)
        console.log(res);
        if (res?.user) {
            dispath(login(res.user as UserLogin))
            document.cookie = `auth=${res.token}`
            router.push('/images')
        }
        setErrors(res?.error ? res.data : null)

    }

    const au: HTMLInputAutoCompleteAttribute = "new-password"

    return (
        <div className="ml-2 mr-2" >
            <div className={"flex flex-col rounded-lg p-8 gap-4 w-full sm:w-96 mt-20 m-auto text-center justify-center content-center items-center  bg-blue-500"
            }>
                <h3>Access to generate images with AI</h3>
                <form
                    className="flex flex-col w-full gap-3"
                    action={handleSubmit}
                    autoComplete={au}
                >
                    <FormField error={errors?.email}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={errors?.email ? 'border-red-500 border-2 ' : ''}
                            autoComplete={au}
                        />
                    </FormField>
                    <FormField error={errors?.password}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete={au}
                        />
                    </FormField>
                    <button type="submit">
                        Login
                    </button>
                </form>
                <Link href="/login/register">Create account</Link>
            </div>
        </div>
    )
}