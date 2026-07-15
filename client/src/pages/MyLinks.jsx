// client/src/pages/MyLinks.jsx
// "Your Links" — one clear page listing every URL a user gets from FolioFYX
// (portfolio links, username URLs, free subdomains, custom domains), which
// ones are active for them right now, copy buttons, and a plain-language
// DNS explainer for connecting their own domain. Routed at /links (protected).

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Link2, Globe, AtSign, Rocket, Copy, Check, ArrowRight, Info,
} from "lucide-react";
import { getAllPortfolios } from "../api/portfolioAPI";
import { getUserCustomWebsites } from "../api/customWebsiteAPI";
import Footer from "../components/Footer";

const ROOT = "foliofyx.in";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 90 } },
};

/* Copyable URL row with feedback */
const UrlRow = ({ url, active }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 min-w-0 ${
        active ? "border-black/10 bg-white" : "border-dashed border-black/15 bg-black/[0.02]"
      }`}
    >
      <span
        className={`flex-1 truncate font-mono text-[13px] ${
          active ? "text-black" : "text-black/40"
        }`}
      >
        {url}
      </span>
      {active ? (
        <>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${url}`}
            className="shrink-0 grid h-8 w-8 place-items-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            <ArrowRight size={14} className="-rotate-45" />
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${url}`}
            className="shrink-0 grid h-8 w-8 place-items-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </>
      ) : (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-black/30">
          Not active yet
        </span>
      )}
    </div>
  );
};

const StatusChip = ({ ok, okLabel = "Live", noLabel = "Draft" }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
      ok ? "bg-emerald-100 text-emerald-700" : "bg-black/5 text-black/40"
    }`}
  >
    {ok ? okLabel : noLabel}
  </span>
);

const MyLinks = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [pRes, sRes] = await Promise.allSettled([
        getAllPortfolios(),
        getUserCustomWebsites(),
      ]);
      if (!alive) return;
      if (pRes.status === "fulfilled") {
        const d = pRes.value?.data ?? pRes.value;
        setPortfolios(Array.isArray(d) ? d : d?.portfolios ?? []);
      }
      if (sRes.status === "fulfilled") {
        const d = sRes.value;
        setSites(Array.isArray(d) ? d : d?.sites ?? []);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const hasUsername = useMemo(() => portfolios.some((p) => p.username), [portfolios]);
  const hasPublishedSite = useMemo(() => sites.some((s) => s.status === "published"), [sites]);

  // The four URL kinds every user can have, with their availability.
  const urlKinds = [
    {
      icon: Link2,
      title: "Portfolio link",
      sample: `${ROOT}/portfolio/your-id`,
      desc: "Every portfolio gets this link automatically the moment it exists.",
      have: portfolios.length > 0,
      cta: portfolios.length === 0 ? { label: "Create a portfolio", to: "/create" } : null,
    },
    {
      icon: AtSign,
      title: "Username URL",
      sample: `${ROOT}/portfolio/your-name`,
      desc: "Claim a username in the editor and your portfolio link becomes readable and memorable.",
      have: hasUsername,
      cta: !hasUsername && portfolios.length > 0 ? { label: "Claim in editor", to: "/dashboard" } : null,
    },
    {
      icon: Rocket,
      title: "Free subdomain",
      sample: `your-name.${ROOT}`,
      desc: "Publish a Studio site and it goes live on its own foliofyx.in subdomain with HTTPS - nothing to configure.",
      have: hasPublishedSite,
      cta: !hasPublishedSite ? { label: "Build in AI Studio", to: "/ai-builder" } : null,
    },
    {
      icon: Globe,
      title: "Your own domain",
      sample: "yourname.com",
      desc: "Connect a domain you already own. We give you the exact DNS records; verification runs automatically.",
      have: sites.some((s) => ["verified", "live"].includes(s.customDomain?.status)),
      cta: { label: "Connect a domain", to: "/ai-builder" },
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-black font-['Switzer'] selection:bg-black/10">
      {/* Pastel wash so the page matches the brand texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 15% 0%, rgba(233,213,255,0.4), transparent 65%), radial-gradient(ellipse 45% 30% at 95% 30%, rgba(199,210,254,0.3), transparent 65%)",
        }}
      />

      <motion.main
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-24"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-12">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
            Your links
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.02]">
            Every way people reach you.
          </h1>
          <p className="mt-4 max-w-xl text-gray-500 leading-relaxed">
            These are the URLs FolioFYX gives you — which ones you have already,
            and how to unlock the rest. Copy any active link and share it anywhere.
          </p>
        </motion.div>

        {/* URL kinds grid */}
        <motion.div variants={fadeUp} className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {urlKinds.map((k) => (
            <div
              key={k.title}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">
                    <k.icon size={16} className="text-black" />
                  </span>
                  <h3 className="font-semibold tracking-tight">{k.title}</h3>
                </div>
                <StatusChip ok={k.have} okLabel="You have this" noLabel="Available" />
              </div>
              <p className="mb-3 font-mono text-[12.5px] text-black/50">{k.sample}</p>
              <p className="text-sm leading-relaxed text-gray-500">{k.desc}</p>
              {k.cta && (
                <button
                  type="button"
                  onClick={() => navigate(k.cta.to)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-black underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded"
                >
                  {k.cta.label}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          ))}
        </motion.div>

        {/* Live links */}
        <motion.div variants={fadeUp} className="mb-16">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-black/40">
            Your live links
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-black/5" />
              ))}
            </div>
          ) : portfolios.length === 0 && sites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
              <p className="font-medium text-black/70">Nothing published yet</p>
              <p className="mt-1 mb-5 text-sm text-black/40">
                Create a portfolio or build a site in the Studio and your links appear here.
              </p>
              <button
                type="button"
                onClick={() => navigate("/create")}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform"
              >
                Start creating
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolios.map((p) => (
                <div key={p._id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="truncate font-semibold tracking-tight">
                      {p.name || "My portfolio"}{" "}
                      <span className="ml-1 text-xs font-normal text-black/40">Portfolio</span>
                    </h3>
                    <StatusChip ok={p.isPublic} okLabel="Public" noLabel="Private" />
                  </div>
                  <div className="space-y-2">
                    <UrlRow url={`https://${ROOT}/portfolio/${p._id}`} active />
                    {p.username && (
                      <>
                        <UrlRow url={`https://${ROOT}/portfolio/${p.username}`} active />
                        <UrlRow url={`https://${p.username}.${ROOT}`} active />
                      </>
                    )}
                  </div>
                </div>
              ))}

              {sites.map((s) => (
                <div key={s._id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="truncate font-semibold tracking-tight">
                      {s.title || "My website"}{" "}
                      <span className="ml-1 text-xs font-normal text-black/40">Studio site</span>
                    </h3>
                    <StatusChip ok={s.status === "published"} />
                  </div>
                  <div className="space-y-2">
                    {s.publishedUrl && <UrlRow url={s.publishedUrl} active={s.status === "published"} />}
                    {s.slug && (
                      <UrlRow url={`https://${s.slug}.${ROOT}`} active={s.status === "published"} />
                    )}
                    {s.customDomain?.name && (
                      <UrlRow
                        url={`https://${s.customDomain.name}`}
                        active={["verified", "live"].includes(s.customDomain.status)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* DNS explainer */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04]">
              <Info size={16} />
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              How connecting your own domain works
            </h2>
          </div>
          <ol className="space-y-3 text-sm leading-relaxed text-gray-600">
            <li>
              <span className="font-semibold text-black">1. You keep your domain</span> — it stays at
              your registrar (GoDaddy, Namecheap, Cloudflare...). We never take it over.
            </li>
            <li>
              <span className="font-semibold text-black">2. We give you two small DNS records</span> —
              a TXT record that proves you own the domain, and a CNAME that points it at your site.
              You paste them into your registrar's DNS page.
            </li>
            <li>
              <span className="font-semibold text-black">3. Verification runs automatically</span> —
              hit Verify and we check the records live. Once they propagate (minutes to a few hours),
              your domain shows your site with HTTPS.
            </li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/ai-builder")}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
            >
              <Globe size={15} />
              Connect a domain
            </button>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-black hover:bg-black/5 transition-colors"
            >
              Need help? Contact us
            </Link>
          </div>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default MyLinks;
