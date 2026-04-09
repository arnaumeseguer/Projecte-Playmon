import { useState, useEffect } from "react";
import { httpClient } from "@/api/httpClient";
import { HiTrash, HiPlus, HiTv, HiFilm, HiVideoCamera, HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function AdminMultimedia() {
    const [activeTab, setActiveTab] = useState("pelis");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Paginació
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const tabs = [
        { id: "pelis", label: "Pel·lícules", icon: HiFilm, endpoint: "/pelis" },
        { id: "series", label: "Sèries", icon: HiTv, endpoint: "/series" },
        { id: "videos", label: "Vídeos", icon: HiVideoCamera, endpoint: "/videos" },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await httpClient(currentTab.endpoint);
            let list = [];
            if (Array.isArray(data)) list = data;
            else if (data.results) list = data.results;
            else if (data.videos) list = data.videos;
            
            setItems(list);
            setCurrentPage(1); // Reset to first page on tab change
        } catch (err) {
            setError(`No s'han pogut carregar les ${currentTab.label.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm(`Vols eliminar aquest element de ${currentTab.label.toLowerCase()}?`)) return;
        try {
            await httpClient(`${currentTab.endpoint}/${id}`, { method: "DELETE" });
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            alert("Error eliminant l'element");
        }
    };

    // Lògica de paginació
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Gestió Multimèdia</h1>
                <button className="flex items-center gap-2 bg-[#CC8400] hover:bg-[#B37400] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95">
                    <HiPlus className="h-4 w-4" />
                    Nou Contingut
                </button>
            </header>

            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab.id 
                                ? "bg-[#CC8400] text-white shadow-lg" 
                                : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="text-white p-10 text-center">Carregant {currentTab.label.toLowerCase()}...</div>
            ) : error ? (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-xl">
                    {error}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItems.map((item) => (
                            <article key={item.id} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-[#CC8400]/50 transition-all duration-300">
                                <div className="aspect-video w-full bg-[#141414] overflow-hidden">
                                    <img 
                                        src={item.backdrop_url || item.poster_url || item.poster_path || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop"} 
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                                </div>
                                
                                <div className="p-4 relative">
                                    <h3 className="text-sm font-bold text-white transition-colors group-hover:text-[#CC8400] line-clamp-1">{item.title}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">ID: {item.id}</span>
                                        <div className="flex gap-1">
                                             <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-white/5 text-rose-400 opacity-0 group-hover:opacity-100 rounded-lg hover:bg-rose-500/20 transition-all"
                                                title="Eliminar"
                                            >
                                                <HiTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {items.length === 0 && (
                            <div className="col-span-full py-20 text-center text-white/20 font-medium italic border-2 border-dashed border-white/5 rounded-3xl">
                                No s'ha trobat cap element en aquesta categoria
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button 
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-all"
                            >
                                <HiChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                                Pàgina {currentPage} de {totalPages}
                            </span>
                            <button 
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-all"
                            >
                                <HiChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
