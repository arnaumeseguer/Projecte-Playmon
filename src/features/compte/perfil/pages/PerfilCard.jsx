export default function PerfilCard({
  user,
  cameraIcon,
  onEditProfile,
  onChangePhoto,
}) {
  const nom = user?.name ?? "Usuari";
  const correu = user?.email ?? "";
  const avatar = user?.avatar ?? null;
  const username = user?.username ?? "@nomusuari";
  const planRaw = (user?.plan || user?.pla_pagament || "basic").toLowerCase().trim();
  const normalizedPlan = planRaw === 'super' ? 'ultra' : planRaw;

  const planMapping = {
    basic: { label: "Basic", colorClass: "text-white", dotClass: "bg-gray-400", glow: "0 0 4px rgba(255,255,255,0.3)" },
    ultra: { label: "Ultra", colorClass: "text-[#3b9eff]", dotClass: "bg-[#3b9eff] shadow-[0_0_12px_rgba(59,158,255,0.6)]", glow: "0 0 7px #3b9eff, 0 0 14px rgba(59,158,255,0.4)" },
    master: { label: "Master", colorClass: "text-[#ff9d00]", dotClass: "bg-[#ff9d00] shadow-[0_0_12px_rgba(255,157,0,0.6)]", glow: "0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)" },
  };

  const planInfo = planMapping[normalizedPlan] || planMapping.basic;

  return (
    <section className="w-full rounded-3xl bg-[#1f1f1f] px-6 py-12 sm:px-12 sm:py-16 ring-1 ring-white/10 shadow-2xl">
      {/* Acció d'editar nom de perfil */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white hover:bg-[#CC8400] transition-all duration-300 shadow-lg"
        >
          Editar perfil
        </button>
      </div>

      {/* Avatar + camps centrats */}
      <div className="flex flex-col items-center">
        <div className="relative inline-block mb-10">
          <div className="h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-full bg-white/5 ring-4 ring-white/10 shadow-2xl">
            {avatar ? (
              <img src={avatar} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-6xl font-semibold text-white/50">
                {nom.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Càmera a sobre de foto d'avatar per poder editar*/}
          <button
            type="button"
            title="Canviar foto"
            aria-label="Canviar foto"
            onClick={onChangePhoto}
            className="absolute bottom-2 right-2 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#202124] ring-4 ring-[#1f1f1f] hover:bg-white/20 transition-all shadow-xl"
          >
            {cameraIcon ? (
              <img src={cameraIcon} alt="" className="h-7 w-7 opacity-90" />
            ) : (
              <span className="text-2xl">📷</span>
            )}
          </button>
        </div>

        {/* Camps d'informació */}
        <div className="w-full max-w-3xl space-y-5">
          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Nom d'usuari</span>
            <span 
              className={`text-xl sm:text-2xl font-semibold ${planInfo.colorClass}`}
              style={{ textShadow: planInfo.glow }}
            >
              {username}
              {normalizedPlan === 'master' && (
                <span className="ml-2 text-white inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>
              )}
            </span>
          </div>
          
          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Nom</span>
            <span className="text-xl sm:text-2xl font-semibold text-white">{nom}</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Correu electrònic</span>
            <span className="text-xl sm:text-2xl font-semibold text-white truncate">{correu}</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Pla de subscripció</span>
            <span className={`flex items-center gap-3 text-xl sm:text-2xl font-semibold ${planInfo.colorClass}`}>
              <span className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full ${planInfo.dotClass}`}></span>
              {planInfo.label}
            </span>
          </div>
        </div>

        {/* Cercador */}
        <div className="mt-12 w-full max-w-3xl">
          <div className="flex items-center gap-4 rounded-full bg-white/5 px-6 py-4 sm:py-5 border border-white/10 focus-within:border-[#CC8400]/50 focus-within:bg-white/10 transition-all shadow-inner group">
            <SearchIcon className="group-focus-within:text-[#CC8400] transition-colors" />
            <input
              type="search"
              placeholder="Cerca al Compte"
              className="w-full bg-transparent text-base sm:text-lg text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 text-white/40 ${className}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

