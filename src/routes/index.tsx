import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Maximize, RefreshCw, Settings, X } from "lucide-react";
import { useMemo, useState } from "react";

import logo from "@/assets/gn-math-title.png";
import zonesData from "@/data/zones.json";

type Zone = {
  id: number;
  name: string;
  cover: string;
  url: string;
  featured?: boolean;
  special?: string[];
  author?: string;
  authorLink?: string;
};

const COVER_BASE =
  "https://gn-math.dev/s/EE0_FEFXflkxUx5iECccXCcNRB9_GDdDXysSex5LLgFQGDgFPFIDP1U3F08uFkEtPBc7WV8/";

const zones = zonesData as Zone[];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GN-Math | The Best Unblocked Games Site" },
      {
        name: "description",
        content:
          "Play unblocked games like Crazy Cattle 3D and DriveMad on GN-Math. Fast, free, no downloads—perfect for school or home.",
      },
      { property: "og:title", content: "GN-Math | The Best Unblocked Games Site" },
      {
        property: "og:description",
        content: "Play hundreds of free browser games on GN-Math.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function coverUrl(zone: Zone) {
  return zone.cover.replace("{COVER_URL}/", COVER_BASE);
}

function destination(zone: Zone) {
  return zone.url.startsWith("http") ? zone.url : `https://gn-math.dev/?id=${zone.id}`;
}

function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <a className="zone-card" href={destination(zone)} target="_blank" rel="noreferrer">
      <img src={coverUrl(zone)} alt={zone.name} loading="lazy" />
      <span>{zone.name}</span>
    </a>
  );
}

function Index() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [tag, setTag] = useState("none");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const tags = useMemo(
    () => [...new Set(zones.flatMap((zone) => zone.special ?? []))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    const result = zones.filter(
      (zone) =>
        zone.name.toLowerCase().includes(query.toLowerCase()) &&
        (tag === "none" || zone.special?.includes(tag)),
    );
    return result.sort((a, b) => {
      if (a.id === -1) return -1;
      if (b.id === -1) return 1;
      return sort === "id" ? a.id - b.id : a.name.localeCompare(b.name);
    });
  }, [query, sort, tag]);

  const featured = useMemo(
    () =>
      zones
        .filter((zone) => zone.id === -1 || zone.featured)
        .sort((a, b) => {
          if (a.id === -1) return -1;
          if (b.id === -1) return 1;
          return a.name.localeCompare(b.name);
        }),
    [],
  );

  return (
    <div className={dark ? "gn-app dark-mode" : "gn-app"}>
      <header className="site-header">
        <div className="header-content">
          <a className="logo" href="/" aria-label="GN-Math home">
            <img src={logo} alt="gn-math" />
          </a>
          <div className="search-controls">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search zones..."
              aria-label="Search zones"
            />
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort zones">
              <option value="name">Name</option>
              <option value="id">ID (Date)</option>
            </select>
            <select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="Filter by tag">
              <option value="none">Tag</option>
              {tags.map((item) => (
                <option key={item} value={item}>{item.replace(/\b\w/g, (letter) => letter.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div className="utility-controls">
            <button onClick={() => window.location.reload()} title="Refresh all the zones" aria-label="Refresh all the zones">
              <RefreshCw />
            </button>
            <button onClick={() => setSettingsOpen(true)} title="Settings" aria-label="Settings">
              <Settings />
            </button>
          </div>
        </div>
      </header>

      <main>
        {!query && tag === "none" && (
          <details open>
            <summary><ChevronDown /> Featured Zones ({featured.length})</summary>
            <div className="zone-grid">{featured.map((zone) => <ZoneCard key={zone.id} zone={zone} />)}</div>
          </details>
        )}
        {!query && tag === "none" && <div className="section-rule" />}
        <details open>
          <summary><ChevronDown /> All Zones ({filtered.length})</summary>
          <div className="zone-grid">
            {filtered.map((zone) => <ZoneCard key={zone.id} zone={zone} />)}
          </div>
        </details>
      </main>

      <footer>
        <div className="footer-copy">© 2026 GN-Math</div>
        <nav aria-label="Footer links">
          <a href="https://gn-math.dev/?dmca=1" target="_blank" rel="noreferrer">DMCA</a>
          <a href="mailto:gn.math.business@gmail.com">Contact</a>
          <a href="https://gn-math.dev/?privacy=1" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="https://discord.gg/NAFw4ykZ7n" target="_blank" rel="noreferrer">Discord</a>
        </nav>
      </footer>

      {settingsOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSettingsOpen(false)}>
          <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 id="settings-title">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X /></button>
            </div>
            <button className="settings-action" onClick={() => setDark((value) => !value)}>Toggle Dark Mode</button>
            <a className="settings-action" href="https://gn-math.dev" target="_blank" rel="noreferrer"><Maximize /> Open Original GN-Math</a>
          </div>
        </div>
      )}
    </div>
  );
}
