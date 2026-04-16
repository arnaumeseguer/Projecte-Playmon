import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout, ensureCurrentUser } from "@/api/authApi";
import defaultAvatar from "@/assets/perfilDefecte.png";

export default function ProfileDropdown({ mostrarMenu = true }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [menuObert, setMenuObert] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    let viu = true;
    ensureCurrentUser()
      .then((u) => { if (viu) setUser(u); })
      .catch(() => { if (viu) setUser(getCurrentUser()); });

    const onStorage = (e) => { if (e.key === "authUser") setUser(getCurrentUser()); };
    const onCustom = () => setUser(getCurrentUser());

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:user-updated", onCustom);

    return () => {
      viu = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:user-updated", onCustom);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuObert) return;
    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuObert(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [menuObert]);

  const nomUsuari = user?.name ?? user?.username ?? "Usuari";
  const avatarUsuari = user?.avatar ?? defaultAvatar;
  const esAdmin = (user?.role || "").toLowerCase() === "admin";
  const planPagament = (user?.pla_pagament || "").toLowerCase().trim();
  const isPremium = planPagament === "master";
  const isUltra = planPagament === "ultra" || planPagament === "super";

  const inicials = useMemo(() => {
    const n = (nomUsuari || "U").trim();
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [nomUsuari]);

  const cancelTancar = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const obrirMenu = () => {
    if (!mostrarMenu) return;
    cancelTancar();
    setMenuObert(true);
  };

  const programarTancarMenu = () => {
    if (!mostrarMenu) return;
    cancelTancar();
    closeTimerRef.current = window.setTimeout(() => {
      setMenuObert(false);
    }, 140);
  };

  const toggleMenuClick = () => {
    if (!mostrarMenu) return;
    setMenuObert(!menuObert);
  };

  const tancarSessio = () => {
    logout();
    setMenuObert(false);
    navigate("/");
  };

  return (
    <div
      ref={wrapperRef}
      className="relative z-[100]"
      onPointerEnter={obrirMenu}
      onPointerLeave={programarTancarMenu}
    >
      <button
        type="button"
        onClick={toggleMenuClick}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-white/5 transition-all focus:outline-none ring-1 ring-white/10"
      >
        <span 
          className={`hidden text-sm sm:block transition-all font-bold ${
            isPremium
              ? 'text-[#ff9d00]'
              : isUltra
              ? 'text-[#3b9eff]'
              : 'text-white font-semibold'
          }`}
          style={{
            textShadow: isPremium
              ? '0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)'
              : isUltra
              ? '0 0 7px #3b9eff, 0 0 14px rgba(59,158,255,0.4)'
              : '0 0 4px rgba(255,255,255,0.3)'
          }}
        >
          {nomUsuari}
          {isPremium && (
            <span className="ml-1 text-white inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>
          )}
        </span>

        <img
          src={avatarUsuari}
          alt=""
          className={`h-8 w-8 rounded-full object-cover transition-all ${
            isPremium
              ? 'ring-2 ring-[#ff9d00]'
              : isUltra
              ? 'ring-2 ring-[#3b9eff]'
              : 'ring-1 ring-white/20'
          }`}
        />

        {mostrarMenu && <span className="hidden text-white/60 sm:block">▾</span>}
      </button>

      {mostrarMenu && (
        <div
          role="menu"
          className={[
            "absolute right-0 top-[110%] w-64 overflow-hidden rounded-2xl",
            "bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10",
            "origin-top-right transition-all duration-300 ease-out",
            menuObert
              ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
              : "pointer-events-none opacity-0 translate-y-2 scale-95",
          ].join(" ")}
          onPointerEnter={cancelTancar}
          onPointerLeave={programarTancarMenu}
        >
          <MenuItem to="/compte/inici" label="Compte" onClick={() => setMenuObert(false)} />
          <MenuItem to="/compte/informacio-personal" label="Informació personal" onClick={() => setMenuObert(false)} />
          <MenuItem to="/compte/seguretat" label="Seguretat" onClick={() => setMenuObert(false)} />
          <MenuItem to="/compte/contrasenya" label="Contrasenya" onClick={() => setMenuObert(false)} />
          {esAdmin && <MenuItem to="/dashboard/users" label="Dashboard" onClick={() => setMenuObert(false)} />}

          <div className="h-px bg-white/10" />

          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
            onClick={tancarSessio}
            role="menuitem"
          >
            Tancar sessió
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      role="menuitem"
      className={({ isActive }) =>
        [
          "flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-all duration-300",
          isActive 
            ? "bg-[#CC8400]/20 text-[#CC8400] border-l-[3px] border-[#CC8400]" 
            : "text-white/80 hover:bg-white/5",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span className={isActive ? "text-[#CC8400]" : "text-white/20"}>›</span>
        </>
      )}
    </NavLink>
  );
}
