'use server'

import prisma from "@/lib/prisma"
import { User } from "@/types/user"

export const userCreate = async (values: User) => {

    try {
        const user = await prisma.user.create({
            data: {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                userName: values.email,
                phoneNumber: values.phoneNumber,
            }
        })
        return user
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            return 'Email already exists'
        } else {
            return 'Error creating user'
        }
    }
}