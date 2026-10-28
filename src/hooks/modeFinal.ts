import { createContext, useContext } from "react";

/** Vrai dans l'application « version finale » : textes de produit, sans mentions de démonstration dans les écrans. */
export const ModeFinal = createContext(false);
export const useModeFinal = () => useContext(ModeFinal);
