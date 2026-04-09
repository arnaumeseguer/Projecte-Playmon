import { Outlet } from "react-router-dom";
import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";
import HeaderCompte from "@/components/HeaderCompte";
import logo from "@/assets/LogoProducteLandingPageTransparent.png";

export default function CompteLayout() {
    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)' }}>
            <HeaderCompte logoSrc={logo} appName="Playmon" mostrarMenu={false} />
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
                <aside>
                    <SideBarCompte />
                </aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}