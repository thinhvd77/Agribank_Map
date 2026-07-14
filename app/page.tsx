"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BranchMap, { BRANCHES } from "./BranchMap";

const COPY = {
  directory: "Danh b\u1ea1 \u0111i\u1ec3m giao d\u1ecbch",
  brandLabel: "Agribank Chi nh\u00e1nh 8",
  branch8: "CHI NH\u00c1NH 8",
  networkMap: "B\u1ea2N \u0110\u1ed2 M\u1ea0NG L\u01af\u1edaI",
  region: "KHU V\u1ef0C TP. H\u1ed2 CH\u00cd MINH",
  network: "M\u1ea1ng l\u01b0\u1edbi",
  transactions: "\u0111i\u1ec3m giao d\u1ecbch",
  intro:
    "5 \u0111i\u1ec3m k\u1ebft n\u1ed1i thu\u1eadn ti\u1ec7n qua c\u00e1c tr\u1ee5c \u0111\u01b0\u1eddng ch\u00ednh ph\u00eda T\u00e2y v\u00e0 Nam th\u00e0nh ph\u1ed1.",
  overview: "T\u1ed5ng quan m\u1ea1ng l\u01b0\u1edbi",
  fivePoints: "\u0111i\u1ec3m giao d\u1ecbch",
  nineRoads: "tr\u1ee5c k\u1ebft n\u1ed1i",
  select: "Ch\u1ecdn \u0111i\u1ec3m giao d\u1ecbch",
  viewAll: "Xem to\u00e0n b\u1ed9 5 \u0111i\u1ec3m",
  mapOverview: "T\u1ed5ng quan tr\u00ean b\u1ea3n \u0111\u1ed3",
  mapLabel: "B\u1ea3n \u0111\u1ed3 m\u1ea1ng l\u01b0\u1edbi \u0111i\u1ec3m giao d\u1ecbch",
  interactiveMap: "B\u1ea2N \u0110\u1ed2 T\u01af\u01a0NG T\u00c1C",
  allNetwork: "To\u00e0n b\u1ed9 m\u1ea1ng l\u01b0\u1edbi",
  showing: "5 \u0111i\u1ec3m \u0111ang hi\u1ec3n th\u1ecb",
  mapHint: "Nh\u1ea5n v\u00e0o \u0111i\u1ec3m \u0111\u00e1nh d\u1ea5u \u0111\u1ec3 xem chi ti\u1ebft",
  corridors: "C\u00c1C TR\u1ee4C K\u1ebeT N\u1ed0I CH\u00cdNH",
  corridorLabel: "TR\u1ee4C K\u1ebeT N\u1ed0I",
  hauGiang: "H\u1eadu Giang",
  phamHung: "Ph\u1ea1m H\u00f9ng",
  nguyenVanLinh: "Nguy\u1ec5n V\u0103n Linh",
  nguyenVanCuBridge: "C\u1ea7u Nguy\u1ec5n V\u0103n C\u1eeb",
  direction: "Ch\u1ec9 \u0111\u01b0\u1eddng",
  cityYear: "TP. H\u1ed2 CH\u00cd MINH - 2026",
  fiveLocations: "05 \u0111i\u1ec3m giao d\u1ecbch",
  mobileHint: "Ch\u1ea1m m\u1ed9t th\u1ebb \u0111\u1ec3 xem v\u1ecb tr\u00ed tr\u00ean b\u1ea3n \u0111\u1ed3",
  swipe: "VU\u1ed0T",
  viewing: "\u0110ang xem v\u1ecb tr\u00ed \u0111\u00e3 ch\u1ecdn",
};

function formatPhone(phone: string) {
  return phone.replace(/^(028)(\d{4})(\d{4})$/, "$1 $2 $3");
}

export default function Home() {
  const [selectedId, setSelectedId] = useState("all");
  const branchListRef = useRef<HTMLOListElement>(null);
  const branchItemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const selectedBranch = useMemo(
    () => BRANCHES.find((branch) => branch.id === selectedId),
    [selectedId],
  );

  useEffect(() => {
    if (selectedId === "all" || !window.matchMedia("(max-width: 900px)").matches) {
      return;
    }

    const list = branchListRef.current;
    const item = branchItemRefs.current[selectedId];
    if (!list || !item) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = item.offsetLeft - (list.clientWidth - item.clientWidth) / 2;
    list.scrollTo({
      left: Math.max(0, left),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [selectedId]);

  return (
    <main className="network-app">
      <header className="mobile-topbar">
        <a className="mobile-brand" href="#network-map" aria-label={COPY.brandLabel}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>
            <strong>AGRIBANK</strong>
            <small aria-live="polite">
              {selectedBranch ? selectedBranch.name : COPY.fiveLocations}
            </small>
          </span>
        </a>
        <button
          className="mobile-all-button"
          type="button"
          onClick={() => setSelectedId("all")}
          aria-label={COPY.viewAll}
          aria-pressed={selectedId === "all"}
        >
          <strong>05</strong>
          <small>{COPY.fivePoints}</small>
        </button>
      </header>

      <aside className="directory-panel" aria-label={COPY.directory}>
        <header className="brand-header">
          <a className="brand-lockup" href="#top" aria-label={COPY.brandLabel}>
            <span className="brand-mark" aria-hidden="true">A</span>
            <span>
              <strong>AGRIBANK</strong>
              <small>{COPY.branch8}</small>
            </span>
          </a>
          <span className="live-dot"><i aria-hidden="true" />{COPY.networkMap}</span>
        </header>

        <section className="directory-intro" id="top">
          <p className="eyebrow">{COPY.region}</p>
          <h1>{COPY.network}<br />{COPY.transactions}</h1>
          <p className="intro-copy">{COPY.intro}</p>
          <div className="summary-row" aria-label={COPY.overview}>
            <span><b>05</b> {COPY.fivePoints}</span>
            <span><b>09</b> {COPY.nineRoads}</span>
          </div>
        </section>

        <nav className="branch-directory" aria-label={COPY.select}>
          <div className="mobile-directory-heading">
            <div>
              <strong>{COPY.select}</strong>
              <small>{COPY.mobileHint}</small>
            </div>
            <span aria-hidden="true">{COPY.swipe} {"\u2192"}</span>
          </div>

          <button
            className={`overview-card ${selectedId === "all" ? "is-selected" : ""}`}
            type="button"
            onClick={() => setSelectedId("all")}
            aria-pressed={selectedId === "all"}
          >
            <span className="overview-icon" aria-hidden="true">+</span>
            <span>
              <strong>{COPY.viewAll}</strong>
              <small>{COPY.mapOverview}</small>
            </span>
            <span className="card-arrow" aria-hidden="true">{"\u2197"}</span>
          </button>

          <ol className="branch-list" ref={branchListRef}>
            {BRANCHES.map((branch) => {
              const selected = branch.id === selectedId;
              return (
                <li
                  key={branch.id}
                  ref={(element) => {
                    branchItemRefs.current[branch.id] = element;
                  }}
                  data-branch-id={branch.id}
                >
                  <button
                    className={`branch-card ${selected ? "is-selected" : ""}`}
                    type="button"
                    onClick={() => setSelectedId(branch.id)}
                    aria-pressed={selected}
                  >
                    <span className="branch-number">{String(branch.number).padStart(2, "0")}</span>
                    <span className="branch-card-copy">
                      <small>{branch.type}</small>
                      <strong>{branch.name}</strong>
                      <span className="connection-line"><i aria-hidden="true" />{branch.connection}</span>
                    </span>
                    <span className="card-arrow" aria-hidden="true">&rsaquo;</span>
                  </button>

                  {selected && (
                    <div className="branch-details" aria-live="polite">
                      <p><span aria-hidden="true">+</span>{branch.address}</p>
                      <div className="detail-actions">
                        <a
                          className="call-link"
                          href={`tel:+84${branch.phone.slice(1)}`}
                          aria-label={`G\u1ecdi ${branch.name}: ${formatPhone(branch.phone)}`}
                        >
                          <span aria-hidden="true">TEL</span>{formatPhone(branch.phone)}
                        </a>
                        <a
                          className="direction-link"
                          href={branch.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${COPY.direction} \u0111\u1ebfn ${branch.name} - m\u1edf trong th\u1ebb m\u1edbi`}
                        >
                          {COPY.direction} <span aria-hidden="true">{"\u2197"}</span>
                        </a>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <footer className="directory-footer">
          <span>AGRIBANK - {COPY.branch8}</span>
          <span>{COPY.cityYear}</span>
        </footer>
      </aside>

      <section id="network-map" className="map-panel" aria-label={COPY.mapLabel}>
        <div className="map-heading">
          <div>
            <p className="eyebrow">{COPY.interactiveMap}</p>
            <h2>{selectedBranch ? selectedBranch.name : COPY.allNetwork}</h2>
          </div>
          <div className="map-status">
            <span><i aria-hidden="true" />{selectedBranch ? COPY.viewing : COPY.showing}</span>
            <small>{COPY.mapHint}</small>
          </div>
        </div>

        <BranchMap selectedId={selectedId} onSelect={setSelectedId} />

        <div className="corridor-legend" aria-label={COPY.corridors}>
          <span className="legend-label">{COPY.corridorLabel}</span>
          <span>QL50</span>
          <span>{COPY.hauGiang}</span>
          <span>{COPY.phamHung}</span>
          <span>{COPY.nguyenVanLinh}</span>
          <span>{COPY.nguyenVanCuBridge}</span>
        </div>
      </section>
    </main>
  );
}
