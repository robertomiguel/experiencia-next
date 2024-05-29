'use server'
import * as yup from 'yup'
import { LoginCredentials } from './LoginForm'
import prisma from '@/lib/prisma'
import { encode } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(3)
})

const JWT_SECRET = process.env.JWT_SECRET || ''

export const loginAction = async (formData: LoginCredentials) => {

    try {
        await schema.validate(formData, { abortEarly: false })

        const acc = await prisma.user.findFirst({
            where: {
                email: formData.email,
                deletedAt: null,
                status: 'active',
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                userName: true,
                phoneNumber: true,
                password: true,
                role: {
                    select: {
                        name: true,
                    }
                }
            }
        })


        if (acc && await bcrypt.compare(formData.password, acc.password)) {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000)
            const token = await encode({
                token: {
                    id: acc.id,
                    role: acc.role.name,
                    time: currentTimeInSeconds,
                    expired: 10, // segundos
                },
                secret: JWT_SECRET
            })

            return {
                token,
                user: {
                    firstName: acc.firstName,
                    lastName: acc.lastName,
                    userName: acc.userName,
                    phoneNumber: acc.phoneNumber,
                    role: acc.role.name
                },
                error: '',
            }
        }

        return {
            error: true,
            data: {
                email: 'Email or password is incorrect',
                password: 'Email or password is incorrect'
            }
        }
    } catch (error: any) {
        console.error(error)
        return {
            error: true,
            data: error.inner.reduce((errors: any, err: any) => {
                errors[err.path] = err.message
                return errors
            }, {})
        }
    }
}
