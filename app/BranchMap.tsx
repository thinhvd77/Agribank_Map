"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  Popup as MapLibrePopup,
} from "maplibre-gl";

export type Branch = {
  id: string;
  number: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  connection: string;
  coordinates: [number, number];
  directionsUrl: string;
  approximate?: boolean;
};

const directionsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const BRANCHES: readonly Branch[] = [
  {
    id: "hoi-so",
    number: 1,
    name: "H\u1ed9i s\u1edf",
    type: "H\u1ed8I S\u1ede",
    address:
      "925 - 925 (ABCD), T\u1ea1 Quang B\u1eedu, Ph\u01b0\u1eddng B\u00ecnh \u0110\u00f4ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837515939",
    connection: "T\u1ea1 Quang B\u1eedu \u00b7 QL50",
    coordinates: [106.6585755, 10.7339522],
    directionsUrl: directionsUrl(
      "925 T\u1ea1 Quang B\u1eedu, Ph\u01b0\u1eddng B\u00ecnh \u0110\u00f4ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "nam-hoa",
    number: 2,
    name: "Chi nh\u00e1nh Nam Hoa",
    type: "CHI NH\u00c1NH",
    address: "241 H\u1eadu Giang, Ph\u01b0\u1eddng B\u00ecnh T\u00e2y, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02839607865",
    connection: "H\u1eadu Giang \u00b7 Minh Ph\u1ee5ng",
    coordinates: [106.6439967, 10.7495461],
    directionsUrl: directionsUrl(
      "241 H\u1eadu Giang, Ph\u01b0\u1eddng B\u00ecnh T\u00e2y, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "binh-tay",
    number: 3,
    name: "PGD B\u00ecnh T\u00e2y",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address: "61 Ch\u1ee3 L\u1edbn, Ph\u01b0\u1eddng B\u00ecnh Ph\u00fa, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837554673",
    connection: "Ch\u1ee3 L\u1edbn \u00b7 H\u1eadu Giang",
    coordinates: [106.6326919, 10.7458739],
    directionsUrl: directionsUrl(
      "61 Ch\u1ee3 L\u1edbn, Ph\u01b0\u1eddng B\u00ecnh Ph\u00fa, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "chanh-hung",
    number: 4,
    name: "PGD Ch\u00e1nh H\u01b0ng",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address:
      "329 Ph\u1ea1m H\u00f9ng, KDC Him Lam, \u1ea4p 4A, X\u00e3 B\u00ecnh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837583488",
    connection: "Ph\u1ea1m H\u00f9ng \u00b7 Nguy\u1ec5n V\u0103n Linh",
    coordinates: [106.6729081, 10.7350739],
    directionsUrl: directionsUrl(
      "329 Ph\u1ea1m H\u00f9ng, X\u00e3 B\u00ecnh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "duong-ba-trac",
    number: 5,
    name: "PGD D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address: "124 D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c, Ph\u01b0\u1eddng Ch\u00e1nh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02839830317",
    connection: "D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c \u00b7 C\u1ea7u Nguy\u1ec5n V\u0103n C\u1eeb",
    coordinates: [106.6884174, 10.7480873],
    directionsUrl: directionsUrl(
      "124 D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c, Ph\u01b0\u1eddng Ch\u00e1nh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
    approximate: true,
  },
];

type BranchMapProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

type MarkerEntry = {
  marker: MapLibreMarker;
  element: HTMLButtonElement;
  handleClick: (event: MouseEvent) => void;
};

const ALL_BRANCH_BOUNDS: [[number, number], [number, number]] = [
  [
    Math.min(...BRANCHES.map((branch) => branch.coordinates[0])),
    Math.min(...BRANCHES.map((branch) => branch.coordinates[1])),
  ],
  [
    Math.max(...BRANCHES.map((branch) => branch.coordinates[0])),
    Math.max(...BRANCHES.map((branch) => branch.coordinates[1])),
  ],
];

function formatPhone(phone: string) {
  return phone.replace(/^(028)(\d{4})(\d{4})$/, "$1 $2 $3");
}

function createPopupContent(branch: Branch) {
  const content = document.createElement("div");
  content.className = "branch-popup";

  const type = document.createElement("small");
  type.textContent = `${branch.type} \u00b7 ${String(branch.number).padStart(2, "0")}`;

  const title = document.createElement("strong");
  title.textContent = branch.name;

  const address = document.createElement("span");
  address.textContent = branch.address;

  const actions = document.createElement("div");
  actions.className = "branch-popup-actions";

  const phone = document.createElement("a");
  phone.href = `tel:+84${branch.phone.slice(1)}`;
  phone.textContent = formatPhone(branch.phone);
  phone.setAttribute("aria-label", `G\u1ecdi ${branch.name}: ${formatPhone(branch.phone)}`);

  const directions = document.createElement("a");
  directions.href = branch.directionsUrl;
  directions.target = "_blank";
  directions.rel = "noopener noreferrer";
  directions.textContent = "Ch\u1ec9 \u0111\u01b0\u1eddng \u2197";
  directions.setAttribute(
    "aria-label",
    `Ch\u1ec9 \u0111\u01b0\u1eddng \u0111\u1ebfn ${branch.name} - m\u1edf trong th\u1ebb m\u1edbi`,
  );

  actions.append(phone, directions);
  content.append(type, title, address, actions);
  return content;
}

export default function BranchMap({ selectedId, onSelect }: BranchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<MapLibrePopup | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const markers = markersRef.current;
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function initialiseMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled) return;

        map = new maplibregl.Map({
          container,
          style: "https://tiles.openfreemap.org/styles/positron",
          center: [106.6607, 10.7433],
          zoom: 12.3,
          attributionControl: true,
        });
        mapRef.current = map;

        popupRef.current = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: "310px",
          offset: 24,
        });

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );

        BRANCHES.forEach((branch) => {
          const element = document.createElement("button");
          const number = document.createElement("span");
          element.type = "button";
          element.className = "branch-marker";
          number.textContent = String(branch.number).padStart(2, "0");
          element.append(number);
          element.title = branch.name;
          element.setAttribute(
            "aria-label",
            `Ch\u1ecdn \u0111i\u1ec3m giao d\u1ecbch ${branch.number}: ${branch.name}`,
          );
          element.setAttribute("aria-pressed", "false");

          const handleClick = (event: MouseEvent) => {
            event.stopPropagation();
            onSelectRef.current(branch.id);
          };
          element.addEventListener("click", handleClick);

          const marker = new maplibregl.Marker({ element, anchor: "center" })
            .setLngLat(branch.coordinates)
            .addTo(map as MapLibreMap);

          markers.set(branch.id, { marker, element, handleClick });
        });

        map.once("load", () => {
          if (!cancelled) setIsReady(true);
        });

        resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(container);
      } catch {
        if (!cancelled) setMapError(true);
      }
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      markers.forEach(({ marker, element, handleClick }) => {
        element.removeEventListener("click", handleClick);
        marker.remove();
      });
      markers.clear();
      popupRef.current?.remove();
      popupRef.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    const map = mapRef.current;
    const branch = BRANCHES.find((item) => item.id === selectedId);
    const compactViewport = window.matchMedia("(max-width: 900px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cameraDuration = prefersReducedMotion ? 0 : 900;

    markersRef.current.forEach(({ element }, branchId) => {
      const active = branchId === selectedId;
      element.classList.toggle("is-active", active);
      element.setAttribute("aria-pressed", String(active));
    });

    popupRef.current?.remove();

    if (!branch) {
      map.fitBounds(ALL_BRANCH_BOUNDS, {
        padding: compactViewport
          ? { top: 80, right: 28, bottom: 120, left: 28 }
          : { top: 135, right: 100, bottom: 105, left: 100 },
        maxZoom: 13.5,
        duration: cameraDuration,
        essential: false,
      });
      return;
    }

    const selectionOffset: [number, number] = compactViewport
      ? [0, -64]
      : [0, 0];

    map.flyTo({
      center: branch.coordinates,
      zoom: compactViewport ? 15.2 : 15.8,
      offset: selectionOffset,
      duration: cameraDuration,
      essential: false,
    });

    if (!compactViewport) {
      popupRef.current
        ?.setLngLat(branch.coordinates)
        .setDOMContent(createPopupContent(branch))
        .addTo(map);
    }
  }, [isReady, selectedId]);

  return (
    <div className="map-shell">
      <div
        ref={mapContainerRef}
        className="map-canvas"
        role="region"
        aria-label={"B\u1ea3n \u0111\u1ed3 v\u1ecb tr\u00ed n\u0103m \u0111i\u1ec3m giao d\u1ecbch Agribank"}
      />

      {mapError && (
        <div className="map-error" role="alert">
          <strong>{"B\u1ea3n \u0111\u1ed3 ch\u01b0a th\u1ec3 hi\u1ec3n th\u1ecb"}</strong>
          <small>{"Vui l\u00f2ng ki\u1ec3m tra k\u1ebft n\u1ed1i Internet v\u00e0 t\u1ea3i l\u1ea1i trang."}</small>
        </div>
      )}

      <div
        className="map-actions"
        role="group"
        aria-label={"\u0110i\u1ec1u khi\u1ec3n b\u1ea3n \u0111\u1ed3"}
      >
        <button
          type="button"
          className="map-reset-button"
          aria-pressed={selectedId === "all"}
          onClick={() => onSelect("all")}
        >
          {"Xem to\u00e0n b\u1ed9"}
        </button>
      </div>
    </div>
  );
}
