import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/LogoProducteLandingPageTransparent.png";
import { ensureCurrentUser, getCurrentUser } from "@/api/authApi";
import ProfileDropdown from "./ProfileDropdown";

export default function HeaderCompte({
  logoSrc = logo,
  appName = "Playmon",
  mostrarMenu = true,
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());

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
    };
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#050505]/95 backdrop-blur-md border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      <div className="relative mx-auto flex h-[100px] w-full items-center justify-between px-6">
        
        {/* Placeholder esquerra per balancejar visualment l'espai si calgués nav */}
        <div className="w-[140px] hidden md:block"></div>

        {/* Logo al centre absolut per garantir que estigui completament centrat */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Logo"
            className="h-[80px] md:h-[95px] w-auto object-contain cursor-pointer drop-shadow-2xl hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
            draggable={false}
          />
        </div>

        {/* Perfil empès al màxim a la dreta */}
        <div className="flex items-center justify-end z-10 w-[140px] md:w-auto">
          <ProfileDropdown mostrarMenu={mostrarMenu} />
        </div>
        
      </div>
    </header>
  );
}
