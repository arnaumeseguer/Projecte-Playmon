import React, { useState, useEffect, useMemo } from 'react'
import { HiStar, HiPlus, HiVideoCamera, HiUser, HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'
import OriginalVideoCard from './components/OriginalVideoCard'
import VideoFormModal from './components/VideoFormModal'
import PersonalPanel from './components/PersonalPanel'
import CreatorModal from './components/CreatorModal'
import { getCurrentUser } from '@/api/authApi'

const STORAGE_KEY = 'playmon_originals'

const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const SORT_OPTIONS = [
    { key: 'newest',    label: 'Més nous' },
    { key: 'mostLiked', label: 'Més valorats' },
    { key: 'mostViewed', label: 'Més vistos' },
    { key: 'oldest',    label: 'Més antics' },
]

function loadVideos() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
    catch { return [] }
}

function saveVideos(videos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onUpload }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 rounded-full bg-[#CC8400]/10 border border-[#CC8400]/20 flex items-center justify-center mb-6">
                <HiVideoCamera className="text-[#CC8400]/60 text-3xl" />
            </div>
            <h3 className="text-white/70 text-xl font-semibold mb-2">Encara no hi ha contingut</h3>
            <p className="text-white/35 text-sm max-w-sm mb-6">
                Sigues el primer en publicar a Playmon Originals. Puja el teu vídeo i comparteix-lo amb la comunitat.
            </p>
            <button
                onClick={onUpload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#CC8400] text-black text-sm font-bold
                           hover:bg-[#E09400] transition-all duration-200"
            >
                <HiPlus className="text-base" />
                Puja el primer vídeo
            </button>
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OriginalsPage() {
    const currentUser = getCurrentUser()
    const [videos, setVideos] = useState(loadVideos)
    const [showModal, setShowModal] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [creatorToShow, setCreatorToShow] = useState(null)

    const categories = useMemo(() => {
        const cats = videos.map(v => v.category).filter(Boolean)
        return [...new Set(cats)].sort()
    }, [videos])

    const filteredVideos = useMemo(() => {
        const q = normalize(searchQuery)

        const filtered = videos.filter(v => {
            const matchesText = !q ||
                normalize(v.title).includes(q) ||
                normalize(v.description).includes(q) ||
                normalize(v.username).includes(q)
            const matchesCat = !activeCategory || v.category === activeCategory
            return matchesText && matchesCat
        })

        return [...filtered].sort((a, b) => {
            if (sortBy === 'newest')    return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortBy === 'oldest')    return new Date(a.createdAt) - new Date(b.createdAt)
            if (sortBy === 'mostLiked') return (b.likes?.length ?? 0) - (a.likes?.length ?? 0)
            if (sortBy === 'mostViewed') return (b.views ?? 0) - (a.views ?? 0)
            return 0
        })
    }, [videos, searchQuery, activeCategory, sortBy])

    useEffect(() => {
        const onStorage = () => setVideos(loadVideos())
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const handleSave = (formData) => {
        if (editingVideo) {
            // Preserve likes and views on edit
            const updated = videos.map(v =>
                v.id === editingVideo.id ? { ...v, ...formData } : v
            )
            saveVideos(updated)
            setVideos(updated)
        } else {
            const newVideo = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                userId: String(currentUser.id),
                username: currentUser.username || currentUser.name || 'Usuari',
                userAvatar: currentUser.avatar || null,
                createdAt: new Date().toISOString(),
                likes: [],
                views: 0,
                ...formData,
            }
            const updated = [newVideo, ...videos]
            saveVideos(updated)
            setVideos(updated)
        }
        setShowModal(false)
        setEditingVideo(null)
    }

    const handleEdit = (video) => {
        setEditingVideo(video)
        setShowModal(true)
        setPanelOpen(false)
    }

    const handleDelete = (id) => {
        const updated = videos.filter(v => v.id !== id)
        saveVideos(updated)
        setVideos(updated)
    }

    const handleLike = (videoId) => {
        if (!currentUser) return
        const uid = String(currentUser.id)
        const updated = videos.map(v => {
            if (v.id !== videoId) return v
            const likes = v.likes ?? []
            const isLiked = likes.includes(uid)
            return { ...v, likes: isLiked ? likes.filter(id => id !== uid) : [...likes, uid] }
        })
        saveVideos(updated)
        setVideos(updated)
    }

    const handleView = (videoId) => {
        const sessionKey = `playmon_originals_viewed_${videoId}`
        if (sessionStorage.getItem(sessionKey)) return
        sessionStorage.setItem(sessionKey, '1')
        const updated = videos.map(v =>
            v.id === videoId ? { ...v, views: (v.views ?? 0) + 1 } : v
        )
        saveVideos(updated)
        setVideos(updated)
    }

    const openUpload = () => {
        setEditingVideo(null)
        setShowModal(true)
    }

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
            <Header />

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative px-6 md:px-12 pt-12 pb-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, #CC8400 0%, transparent 70%)' }} />

                <div className="relative max-w-3xl">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="text-[11px] font-black tracking-[0.18em] px-3 py-1 rounded-full
                                         text-[#CC8400] bg-[#CC8400]/10 border border-[#CC8400]/30">
                            CONTINGUT DE LA COMUNITAT
                        </span>
                    </div>

                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#CC8400]/15 border border-[#CC8400]/30 flex items-center justify-center flex-shrink-0">
                            <HiStar className="text-[#CC8400] text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                                PLAYMON<br />
                                <span style={{ WebkitTextStroke: '1px #CC8400', color: 'transparent' }}>ORIGINALS</span>
                            </h1>
                        </div>
                    </div>

                    <p className="text-white/55 text-base max-w-xl mb-7 leading-relaxed">
                        La plataforma on la comunitat crea. Puja els teus vídeos, descobreix el contingut d'altres usuaris
                        i forma part de l'univers Playmon.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={openUpload}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#CC8400] text-black font-bold text-sm
                                       hover:bg-[#E09400] hover:shadow-[0_0_24px_rgba(204,132,0,0.4)] active:scale-95
                                       transition-all duration-200"
                        >
                            <HiPlus className="text-base" />
                            Puja el teu vídeo
                        </button>

                        <button
                            onClick={() => setPanelOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/80 font-semibold text-sm
                                       bg-white/5 hover:bg-white/10 hover:border-white/30 active:scale-95
                                       transition-all duration-200"
                        >
                            <HiUser className="text-base" />
                            El meu espai
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Divider ───────────────────────────────────────────────────── */}
            <div className="mx-6 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

            {/* ── Search + category filters ─────────────────────────────────── */}
            <div className="px-6 md:px-12 mb-6">
                <div className="relative mb-4">
                    <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-lg pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Busca per títol, descripció o autor..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3
                                   text-white placeholder-white/30 text-sm outline-none
                                   focus:border-[#CC8400]/50 focus:bg-white/8 transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                                       bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <HiXMark className="text-white/60 text-sm" />
                        </button>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory('')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                ${activeCategory === ''
                                    ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                    : 'bg-white/5 border-white/10 text-white/55 hover:border-white/25 hover:text-white/80'
                                }`}
                        >
                            Tots
                        </button>
                        {categories.map(cat => (
                            <button key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                    ${activeCategory === cat
                                        ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                        : 'bg-white/5 border-white/10 text-white/55 hover:border-white/25 hover:text-white/80'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Community content grid ────────────────────────────────────── */}
            <div className="px-6 md:px-12 pb-16">
                {/* Section header + sort options */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#CC8400]/15 border border-[#CC8400]/25 flex items-center justify-center">
                            <HiStar className="text-[#CC8400] text-lg" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">Explorar contingut</h2>
                            <p className="text-white/40 text-xs">
                                {filteredVideos.length !== videos.length
                                    ? `${filteredVideos.length} de ${videos.length} vídeos`
                                    : `${videos.length} ${videos.length === 1 ? 'vídeo' : 'vídeos'}`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Sort pills */}
                    {videos.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.key}
                                    onClick={() => setSortBy(opt.key)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border
                                        ${sortBy === opt.key
                                            ? 'bg-[#CC8400]/15 border-[#CC8400]/40 text-[#CC8400]'
                                            : 'bg-white/4 border-white/8 text-white/45 hover:border-white/20 hover:text-white/70'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {videos.length === 0 ? (
                    <EmptyState onUpload={openUpload} />
                ) : filteredVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <HiMagnifyingGlass className="text-white/15 text-4xl mb-3" />
                        <p className="text-white/50 text-sm font-medium mb-1">Cap resultat trobat</p>
                        <p className="text-white/30 text-xs">
                            Prova amb altres paraules o{' '}
                            <button onClick={() => { setSearchQuery(''); setActiveCategory('') }}
                                className="text-[#CC8400] hover:text-[#E09400] transition-colors">
                                esborra els filtres
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {filteredVideos.map(video => (
                            <OriginalVideoCard
                                key={video.id}
                                video={video}
                                isOwn={video.userId === String(currentUser?.id)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onLike={handleLike}
                                onView={handleView}
                                onOpenCreator={setCreatorToShow}
                            />
                        ))}
                    </div>
                )}
            </div>

            <HomeFooter />

            {/* ── Personal Panel ────────────────────────────────────────────── */}
            <PersonalPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                onEditVideo={handleEdit}
                onDeleteVideo={handleDelete}
            />

            {/* ── Creator Modal ──────────────────────────────────────────────── */}
            {creatorToShow && (
                <CreatorModal
                    creator={creatorToShow}
                    allVideos={videos}
                    onClose={() => setCreatorToShow(null)}
                />
            )}

            {/* ── Upload / Edit Modal ────────────────────────────────────────── */}
            {showModal && (
                <VideoFormModal
                    initialData={editingVideo}
                    onClose={() => { setShowModal(false); setEditingVideo(null) }}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
