import { useRef, useState } from "react";
import { LuSmartphone, LuSiren } from "react-icons/lu";
import { CarteGriseMobile } from "../components/CarteGriseMobile";
import { AgentScanner } from "../components/demo/AgentScanner";
import { AuthFlow } from "../components/demo/AuthFlow";
import { Demarches } from "../components/demo/Demarches";
import { PhoneFrame } from "../components/PhoneFrame";
import { PlaqueMaroc } from "../components/PlaqueMaroc";
import { SectionHead } from "../components/SectionHead";
import { VEHICULES_DEMO, type ScenarioId } from "../data/demo";
import { verificationService } from "../services/verification";
import { QR_MATRICES } from "../data/qr";

type Mode = "usager" | "agent";

export function DemoPage({ onApp }: { onApp: () => void }) {
  const [mode, setMode] = useState<Mode>("usager");
  const [vIdx, setVIdx] = useState(0);
  const [connecte, setConnecte] = useState(false);
  const [verif, setVerif] = useState("");
  const [scenario, setScenario] = useState<ScenarioId>("valide");
  const phoneRef = useRef<HTMLDivElement>(null);

  const v = VEHICULES_DEMO[vIdx];
  const qrId: ScenarioId = v.statut === "signale" ? "signale" : "valide";

  const verifier = async () => {
    setVerif("Vérification simulée en cours…");
    const r = await verificationService.verifier(QR_MATRICES[v.qrId].payload);
    window.setTimeout(() => {
      setVerif(
        r.statut === "reconnu"
          ? "Vérification simulée réussie : document fictif reconnu."
          : r.statut === "signale"
            ? "Document signalé dans le jeu fictif."
            : "Vérification simulée non concluante.",
      );
    }, 500);
  };

  const controle = () => {
    setScenario(qrId);
    setMode("agent");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="demo-top">
          <SectionHead eyebrow="Démonstrateur" title="La carte grise numérique en action">
            Basculez entre la vue de l’usager et celle de l’agent de contrôle. Toutes les données sont fictives.
          </SectionHead>
          <div className="segmented" role="group" aria-label="Mode de démonstration">
            <button type="button" aria-pressed={mode === "usager"} onClick={() => setMode("usager")}><LuSmartphone /> Mode usager</button>
            <button type="button" aria-pressed={mode === "agent"} onClick={() => setMode("agent")}><LuSiren /> Mode agent</button>
          </div>
          <button className="btn" type="button" onClick={onApp}><LuSmartphone /> Ouvrir l’application</button>
        </div>

        {mode === "usager" ? (
          <div className="demo-layout fade-in">
            <div className="phone-col" ref={phoneRef} style={{ display: "grid", gap: 12, justifyItems: "center" }}>
              <div className="chip-row" role="group" aria-label="Véhicule affiché">
                {VEHICULES_DEMO.map((x, i) => (
                  <button key={x.immatriculation} type="button" className="chip" aria-pressed={i === vIdx} onClick={() => { setVIdx(i); setVerif(""); }}>
                    <PlaqueMaroc plaque={x.plaque} size="sm" />
                  </button>
                ))}
              </div>
              <PhoneFrame label="Carte grise numérique de démonstration">
                <CarteGriseMobile vehicule={v} qrId={v.qrId} onVerifier={verifier} onControle={controle} verifMessage={verif} />
              </PhoneFrame>
            </div>
            <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
              <AuthFlow connecte={connecte} onConnecte={setConnecte} />
              <Demarches
                connecte={connecte}
                onVoirCarte={() => phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              />
            </div>
          </div>
        ) : (
          <div className="fade-in" style={{ display: "grid", gap: 16 }}>
            <AgentScanner initialScenario={scenario} />
            <p className="small muted" style={{ maxWidth: "80ch" }}>
              Cette simulation ne constitue pas une vérification officielle. Une vérification réelle devra passer par un service
              autorisé, connecté à la base de référence, si une telle intégration est mise en place. Le QR code peut aussi être
              scanné avec un téléphone : il contient seulement un identifiant de démonstration.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
