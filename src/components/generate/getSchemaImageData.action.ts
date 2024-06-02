'use server'
import prisma from "@/lib/prisma"

export const GetSchemaImageDataAction = async () => {

    const hairColors = prisma.hairColors.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const hairLengths = prisma.hairLengths.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const hairStyles = prisma.hairStyles.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const eyeColors = prisma.eyeColors.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const ethnicGroups = prisma.ethnicGroups.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const dancerStyles = prisma.dancerStyles.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const backgrounds = prisma.backgrounds.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    const genderList = prisma.genderList.findMany({
        select: {
            label: true,
            value: true,
        }
    })

    // id alias to value
    const modelList = prisma.modelSDV.findMany({
        select: {
            label: true,
            id: true,
        },
    })

    const res = await Promise.all([
        hairColors, hairLengths, hairStyles,
        eyeColors, ethnicGroups, dancerStyles,
        backgrounds, genderList, modelList])

    return {
        hairColors: res[0],
        hairLengths: res[1],
        hairStyles: res[2],
        eyeColors: res[3],
        ethnicGroups: res[4],
        dancerStyles: res[5],
        backgrounds: res[6],
        genderList: res[7],
        modelList: res[8].map(m => ({ label: m.label, value: m.id }))
    }
}