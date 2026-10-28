import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { LuShieldAlert, LuShieldCheck } from "react-icons/lu";
import type { VehiculeDemo } from "../data/demo";
import { gsap } from "../hooks/useGsap";
import { Arc, Frise, Rosace, ZelligeFond } from "./MotifsMarocains";
import { PlaqueMaroc } from "./PlaqueMaroc";
import { QrCode } from "./QrCode";

/**
 * Carte grise 3D (spécification Figma « Carte 3D · motion »).
 * - Couches en profondeur (translateZ) : fond, holographique, arc, textes, plaque, reflet.
 * - Inclinaison qui suit le pointeur (gsap.quickTo), retour élastique au repos.
 * - Épaisseur de carte et ombre portée qui se déplace avec l'inclinaison.
 * - Retournement en deux demi-tours : une seule face est rendue, le texte n'est jamais en miroir.
 */
export function Carte3D({
  v, retournee = false, onFlip, interactive = true, flottante = false, entree = false, label,
}: {
  v: VehiculeDemo; retournee?: boolean; onFlip?: () => void; interactive?: boolean; flottante?: boolean; entree?: boolean; label?: string;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLElement | null>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState(retournee);
  const aFinir = useRef(false);
  const reduit = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const valide = v.statut === "valide";

  // Inclinaison + reflet
  const quick = useRef<{ rx: (n: number) => void; ry: (n: number) => void; sx: (n: number) => void; sy: (n: number) => void } | null>(null);
  useLayoutEffect(() => {
    if (reduit || !tiltRef.current || !shadowRef.current) return;
    const t = tiltRef.current, s = shadowRef.current;
    quick.current = {
      rx: gsap.quickTo(t, "rotationX", { duration: 0.5, ease: "power3.out" }),
      ry: gsap.quickTo(t, "rotationY", { duration: 0.5, ease: "power3.out" }),
      sx: gsap.quickTo(s, "x", { duration: 0.6, ease: "power3.out" }),
      sy: gsap.quickTo(s, "y", { duration: 0.6, ease: "power3.out" }),
    };
    gsap.set(t, { transformPerspective: 1100 });
    const tweens: gsap.core.Tween[] = [];
    if (flottante) tweens.push(gsap.to(sceneRef.current, { y: -6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    if (entree) tweens.push(gsap.from(t, { rotationX: -35, y: 80, autoAlpha: 0, duration: 0.9, ease: "power3.out" }));
    return () => { tweens.forEach((tw) => tw.kill()); gsap.killTweensOf([t, s]); };
  }, [reduit, flottante, entree]);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!interactive || reduit || !quick.current || !sceneRef.current) return;
    const r = sceneRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const nx = Math.max(-1, Math.min(1, px * 2 - 1)), ny = Math.max(-1, Math.min(1, py * 2 - 1));
    quick.current.ry(nx * 16);
    quick.current.rx(-ny * 12);
    quick.current.sx(-nx * 14);
    quick.current.sy(10 - ny * 8);
    const el = sceneRef.current;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ga", "1");
    el.style.setProperty("--holo", `${(px * 60 + py * 40).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (reduit || !tiltRef.current || !shadowRef.current) return;
    gsap.to(tiltRef.current, { rotationX: 0, rotationY: 0, duration: 1.2, ease: "elastic.out(1, 0.45)" });
    gsap.to(shadowRef.current, { x: 0, y: 10, duration: 0.8, ease: "power3.out" });
    sceneRef.current?.style.setProperty("--ga", "0");
  };

  // Retournement
  useEffect(() => {
    if (retournee === face) return;
    const el = flipRef.current;
    if (!el || reduit) { setFace(retournee); return; }
    const tw = gsap.to(el, {
      rotationY: 90, z: 40, scale: 1.03, transformPerspective: 1100, duration: 0.25, ease: "power2.in",
      onComplete: () => { aFinir.current = true; setFace(retournee); },
    });
    return () => { tw.kill(); };
  }, [retournee, face, reduit]);
  useLayoutEffect(() => {
    if (!aFinir.current || !flipRef.current) return;
    aFinir.current = false;
    gsap.fromTo(flipRef.current, { rotationY: -90, z: 40, scale: 1.03 }, { rotationY: 0, z: 0, scale: 1, transformPerspective: 1100, duration: 0.6, ease: "back.out(1.6)" });
  }, [face]);

  const faces = (
    <>
      <span className="c3d-edge" aria-hidden="true">{[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ transform: `translateZ(${-i}px)` }} />)}</span>
      {face ? <Verso v={v} /> : <Recto v={v} valide={valide} />}
    </>
  );
  const setFlip = (el: HTMLElement | null) => { flipRef.current = el; };
  return (
    <div className="c3d-scene" ref={sceneRef} onPointerMove={onMove} onPointerLeave={onLeave} onPointerCancel={onLeave}>
      <div className="c3d-shadow" ref={shadowRef} aria-hidden="true" />
      <div className="c3d-tilt" ref={tiltRef}>
        {onFlip ? (
          <button
            type="button"
            className="c3d-flip"
            ref={setFlip}
            onClick={onFlip}
            aria-label={label ?? (retournee ? "Afficher le recto de la carte" : "Retourner la carte pour afficher le QR code")}
          >
            {faces}
          </button>
        ) : (
          <div className="c3d-flip" ref={setFlip}>{faces}</div>
        )}
      </div>
    </div>
  );
}

function Recto({ v, valide }: { v: VehiculeDemo; valide: boolean }) {
  return (
    <span className="c3d-face c3d-front">
      <span className="c3d-l c3d-bg"><ZelligeFond /><Rosace className="c3d-rosace" /><span className="c3d-guilloche" /></span>
      <span className="c3d-l c3d-holo" />
      <span className="c3d-l c3d-z18 c3d-arcwrap"><Arc className="c3d-arc" /></span>
      <span className="c3d-l c3d-z24 c3d-content">
        <span className="c3d-head">
          <span className="c3d-fr"><strong>Carte grise</strong><span>numérique</span></span>
          <span className={`dcard-status ${valide ? "ok" : "ko"}`}>{valide ? <LuShieldCheck /> : <LuShieldAlert />}{valide ? "Valide" : "Signalé"}</span>
          <span className="c3d-ar" lang="ar">البطاقة الرمادية<br />الرقمية</span>
        </span>
        <Frise />
        <span className="c3d-spacer" />
        <span className="c3d-bottom">
          <span><span className="c3d-lbl">Véhicule · <span lang="ar">المركبة</span></span><span className="c3d-val">{v.marque} {v.modele}</span></span>
          <span style={{ textAlign: "right" }}><span className="c3d-lbl">N° de titre</span><span className="c3d-val mono">{v.numeroTitre}</span></span>
        </span>
      </span>
      <span className="c3d-l c3d-z40 c3d-platewrap"><PlaqueMaroc plaque={v.plaque} /></span>
      <span className="c3d-l c3d-z60 c3d-glare" />
    </span>
  );
}

function Verso({ v }: { v: VehiculeDemo }) {
  return (
    <span className="c3d-face c3d-back">
      <span className="c3d-l c3d-bg c3d-bg-back"><ZelligeFond couleur="#124a8c" opacite={0.1} taille={30} /></span>
      <span className="c3d-l c3d-z18 c3d-qrwrap"><Arc className="c3d-arc" couleur="#c9a227" /><span className="c3d-qr"><QrCode id={v.qrId} /></span></span>
      <span className="c3d-l c3d-z24 c3d-backtxt">
        <span className="c3d-ar dark" lang="ar">قدّم هذا الرمز لعون المراقبة</span>
        <strong>{v.titulaire}</strong>
        <span>Présentez ce QR code à l’agent</span>
        <PlaqueMaroc plaque={v.plaque} size="sm" />
      </span>
      <span className="c3d-l c3d-z60 c3d-glare" />
    </span>
  );
}
