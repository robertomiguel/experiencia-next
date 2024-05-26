import { ImageNavBar } from "@/components/images/ImageNavBar";

export default function DashLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>
        <div>
            <ImageNavBar />
            {children}
        </div>
    </>
    );
}