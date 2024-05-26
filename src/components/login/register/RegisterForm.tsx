'use client'
import { User } from "@/types/user"
import { formFields } from "./registerForm.fields"
import { HtmlForm } from "@/components/common/HtmlForm"
import { onRegisterValidate } from "./validate.action"
import { useState } from "react"
import { userCreate } from "./userCreate.action"
import { useRouter } from "next/navigation"

export const RegisterForm = () => {

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    return (
        <div className="ml-2 mr-2" >
            <div className={
                "flex flex-col rounded-lg gap-4 w-full mt-20 m-auto justify-center content-center items-center  bg-blue-500"
            }>
                <h1>Register</h1>
                <div>
                    <HtmlForm
                        formFields={formFields}
                        errors={errors}
                        submitLabel='Register'
                        isSubmitting={isSubmitting}
                        showReset={false}
                        submitAction={async data => {
                            const validateRes = await onRegisterValidate(data)
                            if (validateRes.error) {
                                setErrors(validateRes.data)
                            } else {
                                const createRes: any = await userCreate(validateRes.data as User)
                                if (createRes?.id) {
                                    alert('User created')
                                    router.push('/login')
                                } else {
                                    alert(createRes)
                                }
                                setErrors({})
                            }

                        }}
                    />
                </div>
            </div>
        </div>
    )
}
