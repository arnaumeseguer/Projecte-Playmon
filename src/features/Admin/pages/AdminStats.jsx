import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { HiUsers, HiVideoCamera, HiFilm, HiTv } from "react-icons/hi2";

export default function AdminStats() {
    const { users, videos, loading } = useOutletContext();
    const navigate = useNavigate();

    const metrics = useMemo(() => {
        const totalUsers = users.length;
        const totalVideos = videos.length;
        const publicVideos = videos.filter((video) => video?.is_public === true).length;

        return [
            { label: "Usuaris totals", value: totalUsers, route: "/dashboard/users", icon: HiUsers, color: "text-blue-400" },
            { label: "Vídeos totals", value: totalVideos, route: "/dashboard/videos", icon: HiVideoCamera, color: "text-emerald-400" },
            { label: "Pel·lícules", value: "Pendents", route: "/dashboard/pelis", icon: HiFilm, color: "text-[#CC8400]" },
            { label: "Sèries", value: "Pendents", route: "/dashboard/series", icon: HiTv, color: "text-rose-400" },
        ];
    }, [users, videos]);

    return (
        <div className="space-y-8">
             <header className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard d'Administració</h1>
                <p className="text-sm font-medium text-[#CC8400] uppercase tracking-widest opacity-80">Resum de la plataforma</p>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((field) => {
                    const Icon = field.icon;
                    return (
                        <article
                            key={field.label}
                            className="rounded-2xl bg-white/[0.03] p-6 border border-white/5 shadow-xl transition-all hover:bg-white/[0.07] group/card cursor-pointer"
                            onClick={() => navigate(field.route)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl bg-white/5 ${field.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest opacity-60 group-hover/card:opacity-100 transition-opacity">
                                    Veure més
                                </div>
                            </div>
                            <div className="text-3xl font-bold tracking-tight text-white mb-1">
                                {loading ? "..." : field.value}
                            </div>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                {field.label}
                            </div>
                        </article>
                    );
                })}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <article className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Activitat Recenta</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-[#CC8400]/10 flex items-center justify-center text-[#CC8400]">
                                    <HiUsers className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Nou usuari registrat</p>
                                    <p className="text-[10px] text-white/40">Fa {i * 10} minuts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Estat del Sistema</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/40">Càrrega del Servidor</span>
                                <span className="text-[#CC8400]">12%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#CC8400] w-[12%] rounded-full shadow-[0_0_10px_#CC8400]" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/40">Espai ocupat (S3)</span>
                                <span className="text-emerald-400">45 GB / 100 GB</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[45%] rounded-full shadow-[0_0_10px_#10b981]" />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
