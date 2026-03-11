import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background transition-colors duration-300">
            <Sidebar />
            <div className="flex flex-col p-8 flex-1 min-w-0 relative">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
