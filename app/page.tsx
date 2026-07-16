"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import BranchMap, { BRANCHES } from "./BranchMap";

const COPY = {
  directory: "Danh bạ điểm giao dịch",
  brandLabel: "Agribank Chi nhánh Bắc Thành phố Hồ Chí Minh",
  branchLabel: "CHI NHÁNH BẮC TP. HỒ CHÍ MINH",
  networkMap: "BẢN ĐỒ MẠNG LƯỚI",
  region: "KHU VỰC TP. HỒ CHÍ MINH",
  network: "Mạng lưới",
  transactions: "điểm giao dịch",
  intro:
    "5 điểm kết nối thuận tiện qua các trục đường chính phía Tây và Nam thành phố.",
  overview: "Tổng quan mạng lưới",
  fivePoints: "điểm giao dịch",
  nineRoads: "trục kết nối",
  select: "Chọn điểm giao dịch",
  viewAll: "Xem toàn bộ 5 điểm",
  mapOverview: "Tổng quan trên bản đồ",
  mapLabel: "Bản đồ mạng lưới điểm giao dịch",
  interactiveMap: "BẢN ĐỒ TƯƠNG TÁC",
  allNetwork: "Toàn bộ mạng lưới",
  showing: "5 điểm đang hiển thị",
  mapHint: "Nhấn vào điểm đánh dấu để xem chi tiết",
  corridors: "CÁC TRỤC KẾT NỐI CHÍNH",
  corridorLabel: "TRỤC KẾT NỐI",
  hauGiang: "Hậu Giang",
  phamHung: "Phạm Hùng",
  nguyenVanLinh: "Nguyễn Văn Linh",
  nguyenVanCuBridge: "Cầu Nguyễn Văn Cừ",
  direction: "Chỉ đường",
  cityYear: "TP. HỒ CHÍ MINH - 2026",
  fiveLocations: "05 điểm giao dịch",
  mobileHint: "Chạm một thẻ để xem vị trí trên bản đồ",
  swipe: "VUỐT",
  viewing: "Đang xem vị trí đã chọn",
  allShort: "Tất cả",
};

function formatPhone(phone: string) {
  return phone.replace(/^(028)(\d{4})(\d{4})$/, "$1 $2 $3");
}

export default function Home() {
  const [selectedId, setSelectedId] = useState("all");
  const [viewAllRequest, setViewAllRequest] = useState(0);
  const branchListRef = useRef<HTMLOListElement>(null);
  const branchItemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const selectedBranch = useMemo(
    () => BRANCHES.find((branch) => branch.id === selectedId),
    [selectedId],
  );

  const showAllBranches = () => {
    setSelectedId("all");
    setViewAllRequest((request) => request + 1);
  };

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
      <h1 className="mobile-page-title">{COPY.brandLabel}</h1>

      <header className="mobile-topbar">
        <a className="mobile-brand" href="#network-map" aria-label={COPY.brandLabel}>
          <span className="brand-mark" aria-hidden="true">
            <Image
              className="brand-mark-image"
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              priority
            />
          </span>
          <span>
            <strong>AGRIBANK</strong>
            <small role="status" aria-live="polite" aria-atomic="true">
              {selectedBranch ? selectedBranch.name : COPY.fiveLocations}
            </small>
          </span>
        </a>
        <button
          className="mobile-all-button"
          type="button"
          onClick={showAllBranches}
          aria-label={COPY.viewAll}
          aria-pressed={selectedId === "all"}
        >
          <strong>05</strong>
          <small>{COPY.allShort}</small>
        </button>
      </header>

      <section id="network-map" className="map-panel" aria-label={COPY.mapLabel}>
        {/* <div className="map-heading">
          <div>
            <p className="eyebrow">{COPY.interactiveMap}</p>
            <h2>{selectedBranch ? selectedBranch.name : COPY.allNetwork}</h2>
          </div>
          <div className="map-status">
            <span><i aria-hidden="true" />{selectedBranch ? COPY.viewing : COPY.showing}</span>
            <small>{COPY.mapHint}</small>
          </div>
        </div> */}

        <BranchMap
          selectedId={selectedId}
          onSelect={setSelectedId}
          onViewAll={showAllBranches}
          viewAllRequest={viewAllRequest}
        />

        {/* <div className="corridor-legend" aria-label={COPY.corridors}>
          <span className="legend-label">{COPY.corridorLabel}</span>
          <span>QL50</span>
          <span>{COPY.hauGiang}</span>
          <span>{COPY.phamHung}</span>
          <span>{COPY.nguyenVanLinh}</span>
          <span>{COPY.nguyenVanCuBridge}</span>
        </div> */}
      </section>

      <aside className="directory-panel" aria-label={COPY.directory}>
        <header className="brand-header">
          <a className="brand-lockup" href="#top" aria-label={COPY.brandLabel}>
            <span className="brand-mark" aria-hidden="true">
              <Image
                className="brand-mark-image"
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                priority
              />
            </span>
            <span>
              <strong>AGRIBANK</strong>
              <small>{COPY.branchLabel}</small>
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
            <span aria-hidden="true">{COPY.swipe} {"→"}</span>
          </div>

          <button
            className={`overview-card ${selectedId === "all" ? "is-selected" : ""}`}
            type="button"
            onClick={showAllBranches}
            aria-pressed={selectedId === "all"}
          >
            <span className="overview-icon" aria-hidden="true">+</span>
            <span>
              <strong>{COPY.viewAll}</strong>
              <small>{COPY.mapOverview}</small>
            </span>
            <span className="card-arrow" aria-hidden="true">{"↗"}</span>
          </button>

          <ol className="branch-list" ref={branchListRef}>
            {BRANCHES.map((branch) => {
              const selected = branch.id === selectedId;
              const detailsId = `branch-details-${branch.id}`;
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
                    aria-expanded={selected}
                    aria-controls={detailsId}
                  >
                    <span className="branch-number">{String(branch.number).padStart(2, "0")}</span>
                    <span className="branch-card-copy">
                      <small>{branch.type}</small>
                      <strong>{branch.name}</strong>
                      <span className="connection-line"><i aria-hidden="true" />{branch.connection}</span>
                    </span>
                    <span className="card-arrow" aria-hidden="true">&rsaquo;</span>
                  </button>

                  <div
                    id={detailsId}
                    className="branch-details"
                    role="region"
                    aria-label={`Chi tiết ${branch.name}`}
                    aria-live="polite"
                    hidden={!selected}
                  >
                    <p><span aria-hidden="true">+</span>{branch.address}</p>
                    <div className="detail-actions">
                      <a
                        className="call-link"
                        href={`tel:+84${branch.phone.slice(1)}`}
                        aria-label={`Gọi ${branch.name}: ${formatPhone(branch.phone)}`}
                      >
                        <span aria-hidden="true">GỌI</span>{formatPhone(branch.phone)}
                      </a>
                      <a
                        className="direction-link"
                        href={branch.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${COPY.direction} đến ${branch.name} - mở trong thẻ mới`}
                      >
                        {COPY.direction} <span aria-hidden="true">{"↗"}</span>
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <footer className="directory-footer">
          <span>AGRIBANK - {COPY.branchLabel}</span>
          <span>{COPY.cityYear}</span>
        </footer>
      </aside>
    </main>
  );
}
