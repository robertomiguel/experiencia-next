import { Paginator } from "@/components/images/Paginator";

export default function DashLayout({
    children, params
}: Readonly<{
    children: React.ReactNode;
    params: any;
}>) {
    return (<>
        <div>
            <Paginator page={params?.p} />
            {children}
        </div>
    </>
    );
}