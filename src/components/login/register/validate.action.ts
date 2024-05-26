'use server'
import prisma from '@/lib/prisma';
import * as yup from 'yup';

interface FormValues {
    [key: string]: any
}

export const onRegisterValidate = async (formData: FormData) => {
    'use server'
    const values: FormValues = {}
    formData.forEach((data, key) => {
        if (data) values[key] = data
    })
    const schema = yup.object({
        firstName: yup.string().required().min(5).max(50),
        lastName: yup.string().required().min(5).max(50),
        email: yup.string().email().required().max(100),
        phoneNumber: yup.string().trim().min(10).max(10),
        password: yup.string().required().min(8).max(100),
        confirmPassword: yup.string().required().max(100)
            .oneOf([yup.ref('password')], 'Passwords must match')

    })
    try {
        const res = await schema.validate(values, { abortEarly: false })
        return {
            error: false,
            data: res
        }
    } catch (error: any) {
        return {
            error: true,
            data: error.inner.reduce((errors: any, err: any) => {
                errors[err.path] = err.message
                return errors
            }, {})
        }
    }
}
