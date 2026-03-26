import { useEffect, useMemo, useState } from "react";
import { creaRepositoriVideoApi } from "@/features/reproductor/dades/repositoriVideoApi";

/**
 * DIP: la UI depèn d’un repositori abstracte; ara usem API en comptes de dades locals (FIXER).
 */
export function useVideoAsset(id) {
  const repo = useMemo(() => creaRepositoriVideoApi(), []);
  const [dades, setDades] = useState(null);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let viu = true;

    async function carrega() {
      try {
        setCarregant(true);
        setError(null);
        const v = await repo.obtenirPerId(id);
        if (viu) setDades(v);
      } catch (e) {
        if (viu) setError(e);
      } finally {
        if (viu) setCarregant(false);
      }
    }

    if (id) carrega();
    else {
      setDades(null);
      setError(new Error("ID no vàlid"));
      setCarregant(false);
    }

    return () => {
      viu = false;
    };
  }, [id, repo]);

  return { dades, carregant, error };
}