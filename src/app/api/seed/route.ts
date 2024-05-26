import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    // insert user
    /* const user = await prisma.user.create({
        data: {
            email: 'roberto@miguel.com',
            password: '121212',
            token: '123456',
        }
    }) */

    // get user by id and no get password field
    /* const user = await prisma.user.findUnique({
        where: {
            id: 'clwhtuaog0000m6nlcasgpzbf'
        },
        select: {
            id: true,
            email: true,
            token: true,
            createdAt: true,
            updatedAt: true
        }
    }) */

    // get all users and no get password field
    /* const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            token: true,
            createdAt: true,
            updatedAt: true
        },
        where: {
            createdAt: {
                gt: new Date('2024-01-01')
            }
        }
    }) */

    // update user by id
    /* const user = await prisma.user.update({
        where: {
            id: 'clwhtuaog0000m6nlcasgpzbf'
        },
        data: {
            token: '654321',
        }
    }) */

    // get all users
    // const users = await prisma.user.findMany()

    // delete all users
    // const res = await prisma.wikipedia.deleteMany()

    // insert users
    /* const users = await prisma.user.createMany({
        data: usersTest
    }) */

    /* const list = await prisma.wikipedia.findMany({
        where: {
            search: {
                text: 'adonna'
            }
        },
        select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
        }
    }); */

    /* const wikiSearch = await prisma.wikiSearch.findFirst({
        where: {
            text: 'madonna'
        },
        select: {
            id: true,
        }
    }) */

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

    return NextResponse.json({ res });
}