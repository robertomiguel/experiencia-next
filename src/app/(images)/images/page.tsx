import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "ID Images",
    description: "ID inteligencia digital",
    keywords: ['images', 'ia', 'generator', 'free', 'stable', 'diffusion']
};

export default function Image() {

    redirect('/images/1')
}