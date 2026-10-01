"use client";

import { OptimizedPhoto as Image } from "@/components/ui/optimized-photo";
import { useEffect, useState } from "react";

const photos = [
  { file: "jersey-biru-putih", alt: "Model memakai jersey bergaris biru putih" },
  { file: "jersey-putih", alt: "Model memakai jersey putih dengan aksen biru dan merah" },
  { file: "jersey-biru", alt: "Model memakai jersey biru dengan aksen merah" },
  { file: "jersey-hijau", alt: "Model memakai jersey hijau bermotif" },
  { file: "jersey-kuning", alt: "Model memakai jersey kuning dengan lengan teal" },
];

export function ModelSlideshow() {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState<number[]>([0]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!loaded.includes(active)) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % photos.length;
      setRequested((items) => items.includes(next) ? items : [...items, next]);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [active, loaded]);

  useEffect(() => {
    if (paused || reducedMotion || !loaded.includes((active + 1) % photos.length)) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % photos.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, active, loaded]);

  return (
    <div className="model-slideshow" aria-label="Foto model BP Sport">
      {photos.map((photo, index) => requested.includes(index) && (
        <div
          key={photo.file}
          className={`model-slide${active === index ? " is-active" : ""}`}
          aria-hidden={active !== index}
        >
          <Image
            src={`/images/models/${photo.file}.jpg`}
            alt={photo.alt}
            fill
            sizes="(max-width: 760px) 76vw, 42vw"
            priority={index === 0}
            loading={index === 0 ? undefined : "eager"}
            onLoad={() => setLoaded((items) => items.includes(index) ? items : [...items, index])}
          />
        </div>
      ))}
      <div className="model-slide-controls">
        <span>{active + 1} / {photos.length}</span>
        <button type="button" disabled={!loaded.includes((active + 1) % photos.length)} onClick={() => setActive((index) => (index + 1) % photos.length)} aria-label="Foto model berikutnya">Berikutnya →</button>
        {!reducedMotion && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Putar slideshow" : "Jeda slideshow"}>{paused ? "Putar" : "Jeda"}</button>}
      </div>
    </div>
  );
}
