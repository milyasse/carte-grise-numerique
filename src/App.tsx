import { LuInfo, LuLayoutGrid, LuRoute, LuSmartphone } from "react-icons/lu";
import { LogoNarsa } from "./components/LogoNarsa";
import { DISCLAIMER } from "./data/project";
import { useHashTab } from "./hooks/useHashTab";
import { DemoPage } from "./pages/DemoPage";
import { ParcoursPage } from "./pages/ParcoursPage";
import { VisionPage } from "./pages/VisionPage";

const TABS = ["vision", "demonstrateur", "parcours"] as const;
type Tab = (typeof TABS)[number];

const LABELS: Record<Tab, { label: string; icon: typeof LuLayoutGrid }> = {
  vision: { label: "Vision du projet", icon: LuLayoutGrid },
  demonstrateur: { label: "Démonstrateur", icon: LuSmartphone },
  parcours: { label: "Parcours usager", icon: LuRoute },
};

export default function App() {
  const [tab, go] = useHashTab(TABS, "vision");

  return (
    <>
      <div className="demo-strip" role="note">
        <div className="container"><LuInfo /> Démonstrateur de projet · données et vérifications fictives · service non officiel</div>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="bar">
            <div className="brand">
              <LogoNarsa size={40} />
              <div className="brand-text">
                <strong>Carte grise numérique</strong>
                <span>Projet porté par la NARSA · prototype de présentation</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tabs-row">
          <nav className="container tabs" role="tablist" aria-label="Sections de l’application">
            {TABS.map((t) => {
              const I = LABELS[t].icon;
              return (
                <button
                  key={t}
                  id={`tab-${t}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  aria-controls="contenu"
                  className="tab"
                  onClick={() => go(t)}
                >
                  <I aria-hidden="true" /> {LABELS[t].label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="contenu" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "vision" && <VisionPage onDemo={() => go("demonstrateur")} />}
        {tab === "demonstrateur" && <DemoPage />}
        {tab === "parcours" && <ParcoursPage />}
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="brand">
              <LogoNarsa size={40} variant="light" />
              <div className="brand-text">
                <strong>Carte grise numérique</strong>
                <span style={{ color: "#a8c7bb" }}>Porteur : NARSA · Transformation numérique de l’administration</span>
              </div>
            </div>
            <span className="small">Prototype réalisé dans le cadre d’une formation en conduite du changement.</span>
          </div>
          <p className="disclaimer">{DISCLAIMER}</p>
        </div>
      </footer>
    </>
  );
}
