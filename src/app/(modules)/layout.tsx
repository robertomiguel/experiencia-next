import { MainMenu } from "../components";

export default function WikiLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>
        <MainMenu />
        {children}
    </>
    );
}