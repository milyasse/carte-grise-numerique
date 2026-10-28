import { LuArrowRight, LuCircleCheck, LuCircleX, LuMonitorSmartphone } from "react-icons/lu";
import { CarteGriseMobile } from "../components/CarteGriseMobile";
import { ICONS } from "../components/icons";
import { LogoNarsa } from "../components/LogoNarsa";
import { PhoneFrame } from "../components/PhoneFrame";
import { SectionHead } from "../components/SectionHead";
import { VEHICULES_DEMO } from "../data/demo";
import { AUJOURDHUI, DEFIS, DEMAIN, ECOSYSTEME, OBJECTIFS, RESULTATS, SITUATION_ACTUELLE } from "../data/project";

export function VisionPage({ onDemo }: { onDemo: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-copy">
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <LogoNarsa size={52} />
              <span className="badge"><LuMonitorSmartphone /> Projet de transformation numérique</span>
            </div>
            <h1>Carte grise numérique</h1>
            <p className="ar hero-title-ar" lang="ar" style={{ textAlign: "left" }}>البطاقة الرمادية الرقمية</p>
            <p className="lead">Vers une gestion numérique, sécurisée et simplifiée des titres de véhicules.</p>
            <p className="muted" style={{ maxWidth: "60ch" }}>
              Le projet, porté par la NARSA, propose de consulter la carte grise sur smartphone, d’en vérifier
              l’authenticité par QR code lors des contrôles, et de réaliser en ligne les démarches de duplicata et de mutation.
            </p>
            <div className="btn-row">
              <button className="btn" type="button" onClick={onDemo}>Ouvrir l’application <LuArrowRight /></button>
              <a className="btn secondary" href="#parcours">Voir le parcours usager</a>
            </div>
          </div>
          <div className="hero-visual">
            <PhoneFrame label="Illustration : carte grise numérique sur smartphone">
              <CarteGriseMobile vehicule={VEHICULES_DEMO[0]} qrId="valide" />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Contexte" title="La situation actuelle">
            Aujourd’hui, la carte grise reste un document physique, contrôlé à l’œil, et les démarches associées se font au guichet.
          </SectionHead>
          <div className="grid g-auto">
            {SITUATION_ACTUELLE.map((s) => {
              const I = ICONS[s.icon];
              return (
                <article className="card" key={s.title}>
                  <div className={`icon-tile ${s.icon === "alert" ? "red" : ""}`}><I /></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Problématique" title="Six défis à relever" />
          <div className="grid g-3">
            {DEFIS.map((d) => {
              const I = ICONS[d.icon];
              return (
                <article className="card" key={d.title} style={{ display: "flex", gap: 14 }}>
                  <div className="icon-tile" style={{ marginBottom: 0 }}><I /></div>
                  <div>
                    <h3>{d.title}</h3>
                    <p className="muted small" style={{ marginTop: 4 }}>{d.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Vision cible" title="Aujourd’hui → Demain" />
          <div className="compare">
            <div className="compare-col today">
              <span className="badge red">Aujourd’hui</span>
              <ul>{AUJOURDHUI.map((t) => <li key={t}><LuCircleX />{t}</li>)}</ul>
            </div>
            <div className="compare-arrow" aria-hidden="true"><LuArrowRight /></div>
            <div className="compare-col tomorrow">
              <span className="badge">Demain</span>
              <ul>{DEMAIN.map((t) => <li key={t}><LuCircleCheck />{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Objectifs stratégiques" title="Ce que le projet doit permettre" />
          <div className="grid g-3">
            {OBJECTIFS.map((o, i) => (
              <article className="card objective" key={o}>
                <span className="num">{i + 1}</span>
                <h3 style={{ fontSize: "1rem", paddingTop: 6 }}>{o}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Résultats attendus" title="Les bénéfices visés">
            Ces résultats sont des objectifs du projet. Ils ne sont pas encore mesurés.
          </SectionHead>
          <div className="grid g-3">
            {RESULTATS.map((r) => {
              const I = ICONS[r.icon];
              return (
                <article className="card" key={r.title} style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="icon-tile" style={{ marginBottom: 0 }}><I /></div>
                    <span className="badge neutral">Objectif</span>
                  </div>
                  <h3 style={{ fontSize: "1rem" }}>{r.title}</h3>
                  <span className="small muted">Indicateur à définir · valeur non mesurée</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Écosystème institutionnel" title="Acteurs concernés">
            Entités concernées ou envisagées dans le cadre du projet. Aucun partenariat formel n’est présenté ici.
          </SectionHead>
          <div className="grid g-auto">
            {ECOSYSTEME.map((e, i) => (
              <article className={`card partner ${i === 0 ? "lead" : ""}`} key={e.sigle}>
                <span className="monogram" aria-hidden="true">{e.sigle}</span>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: "0.98rem" }}>{e.nom}</h3>
                  <p className="small muted">{e.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
