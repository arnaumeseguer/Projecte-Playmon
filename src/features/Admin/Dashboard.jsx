import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";
import { httpClient } from "@/api/httpClient";
import { getCurrentUser } from "@/api/authApi";
import { uploadVideo } from "@/api/videosApi";
import HeaderCompte from "@/components/HeaderCompte";
import logo from "@/assets/LogoProducteLandingPageTransparent.png";

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("admin-dashboard");
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [apiLatencyMs, setApiLatencyMs] = useState(null);
    const [lastSync, setLastSync] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoPublic, setVideoPublic] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadFeedback, setUploadFeedback] = useState("");
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboardData = async () => {
            setLoading(true);
            setError("");

            const start = performance.now();

            try {
                const [usersCountResult, videosCountResult, usersResult, videosResult] = await Promise.allSettled([
                    httpClient("/stats/users/count"),
                    httpClient("/stats/videos/count"),
                    httpClient("/users"),
                    httpClient("/videos"),
                ]);

                const usersList = usersResult.status === "fulfilled"
                    ? (Array.isArray(usersResult.value) ? usersResult.value : usersResult.value?.users || [])
                    : [];

                const videosList = videosResult.status === "fulfilled"
                    ? (Array.isArray(videosResult.value) ? videosResult.value : videosResult.value?.videos || [])
                    : [];

                const usersFromCount = usersCountResult.status === "fulfilled"
                    ? Number(usersCountResult.value?.count ?? 0)
                    : usersList.length;

                const videosFromCount = videosCountResult.status === "fulfilled"
                    ? Number(videosCountResult.value?.count ?? 0)
                    : videosList.length;

                const normalizedUsers = usersList.slice(0, Math.max(usersFromCount, usersList.length));
                const normalizedVideos = videosList.slice(0, Math.max(videosFromCount, videosList.length));

                if (mounted) {
                    setUsers(normalizedUsers);
                    setVideos(normalizedVideos);
                    setApiLatencyMs(Math.round(performance.now() - start));
                    setLastSync(new Date().toLocaleString());
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

        return () => {
            mounted = false;
        };
    }, []);

    const metrics = useMemo(() => {
        const totalUsers = users.length;
        const adminUsers = users.filter((user) => (user?.role || "").toLowerCase() === "admin").length;
        const totalVideos = videos.length;
        const publicVideos = videos.filter((video) => video?.is_public === true).length;

        return [
            { label: "Usuaris totals", value: totalUsers, route: "/dashboard/users" },
            { label: "Admins", value: adminUsers, route: "/dashboard/admins" },
            { label: "Vídeos totals", value: totalVideos, route: "/dashboard/videos" },
            { label: "Vídeos públics", value: publicVideos, route: "/dashboard/public-videos" },
        ];
    }, [users, videos]);

    const selectedRoute = useMemo(() => {
        const path = location.pathname;
        const allowedRoutes = [
            "/dashboard/users",
            "/dashboard/admins",
            "/dashboard/videos",
            "/dashboard/public-videos",
        ];
        return allowedRoutes.includes(path) ? path : "/dashboard/users";
    }, [location.pathname]);

    const detailConfig = useMemo(() => {
        if (selectedRoute === "/dashboard/admins") {
            const rows = users.filter((user) => (user?.role || "").toLowerCase() === "admin");
            return {
                title: "Registres d'admins",
                columns: ["Nom", "Email", "Rol"],
                rows: rows.map((user) => [
                    user?.name || user?.username || "",
                    user?.email || "",
                    user?.role || "",
                ]),
            };
        }

        if (selectedRoute === "/dashboard/videos") {
            return {
                title: "Registres de vídeos totals",
                columns: ["ID", "Títol", "Públic"],
                rows: videos.map((video) => [
                    video?.id ?? "",
                    video?.title || "",
                    video?.is_public ? "Sí" : "No",
                ]),
            };
        }

        if (selectedRoute === "/dashboard/public-videos") {
            const rows = videos.filter((video) => video?.is_public === true);
            return {
                title: "Registres de vídeos públics",
                columns: ["ID", "Títol", "Data"],
                rows: rows.map((video) => [
                    video?.id ?? "",
                    video?.title || "",
                    video?.created_at || "",
                ]),
            };
        }

        return {
            title: "Registres d'usuaris",
            columns: ["Nom", "Email", "Rol"],
            rows: users.map((user) => [
                user?.name || user?.username || "",
                user?.email || "",
                user?.role || "",
            ]),
        };
    }, [selectedRoute, users, videos]);

    const handleUploadVideo = async (event) => {
        event.preventDefault();
        setUploadFeedback("");
        setUploadError("");

        if (!videoFile) {
            setUploadError("Selecciona un vídeo abans de pujar-lo");
            return;
        }

        const authUser = getCurrentUser();
        if (!authUser?.id) {
            setUploadError("No s'ha pogut identificar l'usuari autenticat");
            return;
        }

        try {
            setUploadingVideo(true);

            await uploadVideo({
                file: videoFile,
                title: videoTitle,
                description: videoDescription,
                isPublic: videoPublic,
                userId: authUser.id,
            });

            const videosResult = await httpClient("/videos");
            const videosList = Array.isArray(videosResult)
                ? videosResult
                : videosResult?.videos || [];
            setVideos(videosList);
            setLastSync(new Date().toLocaleString());

            setUploadFeedback("Vídeo pujat correctament");
            setVideoTitle("");
            setVideoDescription("");
            setVideoFile(null);
            setVideoPublic(false);
        } catch (uploadException) {
            setUploadError(uploadException?.message || "Error pujant el vídeo");
        } finally {
            setUploadingVideo(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
            <HeaderCompte logoSrc={logo} appName="Playmon" mostrarMenu={false} />
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
                <aside>
                    <SideBarCompte active={activeSection} onSelect={setActiveSection} />
                </aside>

                <main className="flex min-w-0 flex-col gap-8">
                    <header className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
                        <p className="text-sm font-medium text-[#CC8400] uppercase tracking-widest opacity-80">Gestió de plataforma</p>
                    </header>

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {metrics.map((field) => (
                            <article
                                key={field.label}
                                className="rounded-2xl bg-white/[0.03] p-6 border border-white/5 shadow-xl transition-all hover:bg-white/[0.07] group/card"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest opacity-80 group-hover/card:opacity-100 transition-opacity">
                                        {field.label}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate(field.route)}
                                        className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-[#CC8400] hover:border-[#CC8400] transition-all"
                                    >
                                        Veure
                                    </button>
                                </div>
                                <div className="mt-2 text-3xl font-bold tracking-tight text-white">
                                    {loading ? "..." : field.value}
                                </div>
                            </article>
                        ))}
                    </section>

                    <section>
                        <article className="rounded-2xl bg-[#303134] p-5 ring-1 ring-white/10">
                            <h2 className="text-base font-semibold text-white">{detailConfig.title}</h2>

                            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
                                <table className="w-full border-collapse bg-[#202124] text-left text-sm">
                                    <thead className="bg-white/5 text-white/70">
                                        <tr>
                                            {detailConfig.columns.map((column) => (
                                                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr className="border-t border-white/10">
                                                <td className="px-4 py-6 text-white/60" colSpan={detailConfig.columns.length}>
                                                    Carregant registres...
                                                </td>
                                            </tr>
                                        ) : detailConfig.rows.length === 0 ? (
                                            <tr className="border-t border-white/10">
                                                <td className="px-4 py-6 text-white/60" colSpan={detailConfig.columns.length}>
                                                    No hi ha registres.
                                                </td>
                                            </tr>
                                        ) : (
                                            detailConfig.rows.map((row, rowIndex) => (
                                                <tr key={`${selectedRoute}-${rowIndex}`} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    {row.map((cell, cellIndex) => (
                                                        <td key={`${rowIndex}-${cellIndex}`} className="px-6 py-4 text-white/70 font-medium">
                                                            {String(cell)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </section>

                    <section>
                        <article className="rounded-2xl bg-white/[0.03] p-6 border border-white/5 shadow-xl">
                            <h2 className="text-xs font-bold text-[#CC8400] uppercase tracking-widest mb-4 opacity-80">Pujar vídeo</h2>

                            <form className="mt-4 grid grid-cols-1 gap-3" onSubmit={handleUploadVideo}>
                                <input
                                    type="text"
                                    value={videoTitle}
                                    onChange={(event) => setVideoTitle(event.target.value)}
                                    placeholder="Títol"
                                    className="rounded-xl bg-[#202124] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
                                />

                                <textarea
                                    value={videoDescription}
                                    onChange={(event) => setVideoDescription(event.target.value)}
                                    placeholder="Descripció"
                                    rows={3}
                                    className="rounded-xl bg-[#202124] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
                                />

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
                                    className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white outline-none border border-white/10 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:text-white/90"
                                />

                                <label className="flex items-center gap-2 text-sm text-white/80">
                                    <input
                                        type="checkbox"
                                        checked={videoPublic}
                                        onChange={(event) => setVideoPublic(event.target.checked)}
                                        className="h-4 w-4 rounded border-white/20 bg-[#202124]"
                                    />
                                    Fer públic
                                </label>

                                {uploadError ? (
                                    <div className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-500/30">
                                        {uploadError}
                                    </div>
                                ) : null}

                                {uploadFeedback ? (
                                    <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/30">
                                        {uploadFeedback}
                                    </div>
                                ) : null}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={uploadingVideo}
                                        className="rounded-full bg-white/10 px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest hover:bg-[#CC8400] transition-all duration-300 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {uploadingVideo ? "Pujant..." : "Pujar vídeo"}
                                    </button>
                                </div>
                            </form>
                        </article>
                    </section>

                    <section>
                        <article className="rounded-2xl bg-white/[0.03] p-6 border border-white/5 shadow-xl">
                            <h2 className="text-xs font-bold text-[#CC8400] uppercase tracking-widest mb-4 opacity-80">Salut del sistema</h2>

                            {error ? (
                                <div className="mt-4 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/30">
                                    {error}
                                </div>
                            ) : (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                                        <div className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-2 opacity-80">API</div>
                                        <div className="text-lg font-bold text-white">
                                            {loading ? "Comprovant..." : "Operativa"}
                                        </div>
                                        <div className="mt-1 text-xs text-white/40">
                                            {loading || apiLatencyMs == null ? "" : `Latència: ${apiLatencyMs}ms`}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                                        <div className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-2 opacity-80">Base de dades</div>
                                        <div className="text-lg font-bold text-white">
                                            {loading ? "Comprovant..." : "Connectada"}
                                        </div>
                                        <div className="mt-1 text-xs text-white/40">
                                            {loading ? "" : `Usuaris: ${metrics[0].value} · Vídeos: ${metrics[2].value}`}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                                        <div className="text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-2 opacity-80">Última sincronització</div>
                                        <div className="text-lg font-bold text-white">{loading ? "..." : lastSync}</div>
                                        <div className="mt-1 text-xs text-white/40">Dades en temps real</div>
                                    </div>
                                </div>
                            )}
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
}
