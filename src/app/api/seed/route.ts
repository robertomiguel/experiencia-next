import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    console.log('seed');


    try {
        const rolesDefault = [
            {
                name: 'admin',
                description: 'Administrator',
                imageLimit: 1000,
            },
            {
                name: 'user',
                description: 'User'
            }
        ]

        const defaultUser = {
            email: 'robertomiguel@outlook.com',
            password: '123123123',
            firstName: 'Roberto',
            lastName: 'Miguel',
            userName: 'Roberto Miguel',
            phoneNumber: '123456789',
            roleId: 'admin',
        }



        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.role.deleteMany(),
        ])

        const roles = prisma.role.createMany({
            data: rolesDefault
        })

        const user = prisma.user.create({
            data: defaultUser
        })

        const res = await prisma.$transaction([roles, user])
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'error seed' }, { status: 500 });
    }

    return NextResponse.json({ message: 'seeded' });
}