import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import SideBarAdmin from "./components/SideBarAdmin";
import { httpClient } from "@/api/httpClient";
import HeaderCompte from "@/components/HeaderCompte";
import logo from "@/assets/LogoProducteLandingPageTransparent.png";

export default function AdminDashboard() {
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [usersResult, videosResult] = await Promise.allSettled([
                    httpClient("/users"),
                    httpClient("/videos"),
                ]);

                const usersList = usersResult.status === "fulfilled"
                    ? (Array.isArray(usersResult.value) ? usersResult.value : usersResult.value?.users || [])
                    : [];

                const videosList = videosResult.status === "fulfilled"
                    ? (Array.isArray(videosResult.value) ? videosResult.value : videosResult.value?.videos || [])
                    : [];

                if (mounted) {
                    setUsers(usersList);
                    setVideos(videosList);
                }
            } catch (e) {
                if (mounted) {
                    setError(e?.message || "No s'han pogut carregar dades del dashboard");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();
        return () => { mounted = false; };
    }, []);

    // Passem dades globals si cal als fills mitjançant un context o Outlet context
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
            {/* Elements decoratius de fons */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#CC8400]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <HeaderCompte logoSrc={logo} appName="Playmon" mostrarMenu={false} />
            
            <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
                <aside className="sticky top-24 h-fit">
                    <SideBarAdmin />
                </aside>

                <main className="flex min-w-0 flex-col gap-8">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}
                    
                    <Outlet context={{ users, videos, loading, fetchUsers: () => {}, fetchVideos: () => {} }} />
                </main>
            </div>
        </div>
    );
}
