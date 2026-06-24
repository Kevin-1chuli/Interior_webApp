"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Search, ShoppingBag, Menu, X, Heart, ArrowRight,
  ChevronRight, ChevronLeft, Phone, Mail, MapPin,
  PhoneCall, CheckCircle, MessageSquare, PenTool,
  Settings, Award, Sparkles, Shield, ThumbsUp, Star,
  Home, Armchair,
} from "lucide-react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
import type { CatId, Prod } from "@/lib/types";
import {
  BODY, CHARCOAL, CREAM, CREAM_D, DISPLAY, EASE_OUT,
  GOLD, GOLD_LIGHT, MID, SANS, WHITE,
} from "@/lib/constants";
import { img } from "@/lib/images";
import { getAllProducts } from "@/lib/products";
import {
  CATS, HERO_SLIDES, JOURNEY, MATERIALS, PRODS,
  SPACES, STATS, SVC_CARDS,
} from "@/lib/data";
import { JOURNEY_ICONS, STATS_ICONS } from "@/lib/icons";

export function NGBLogo({ compact=false, inv=false }: { compact?:boolean; inv?:boolean }) {
  const stroke = inv ? "white"                    : CHARCOAL;
  const fill   = inv ? CHARCOAL                   : WHITE;
  const sub    = inv ? "rgba(255,255,255,0.45)"   : MID;

  if (compact) {
    // ── Navbar: horizontal mark + wordmark in a single SVG ──────────────────
    // Outer rect (3,3)→(42,42)  Inner rect (12,12)→(51,51)
    // Offset = 9 = 24% of rect-width 38 ✓
    return (
      <svg
        viewBox="0 0 158 50"
        width={158} height={50}
        aria-label="NGB Interior Concepts & Craft"
        style={{ display:"block", flexShrink:0 }}
      >
        {/* Geometric mark */}
        <rect x="3"  y="3"  width="38" height="38" fill={fill} stroke={stroke} strokeWidth="3"/>
        <rect x="12" y="12" width="38" height="38" fill={fill} stroke={stroke} strokeWidth="3"/>

        {/* "ngb" wordmark — sits to the right of the mark */}
        <text
          x="60" y="30"
          fontFamily="'Montserrat', sans-serif"
          fontSize="20" fontWeight="700"
          fill={stroke}
          letterSpacing="-0.3"
        >ngb</text>

        {/* Tagline */}
        <text
          x="60" y="43"
          fontFamily="'Montserrat', sans-serif"
          fontSize="6" fontWeight="600"
          fill={sub}
          letterSpacing="1.8"
        >INTERIOR CONCEPTS &amp; CRAFT</text>
      </svg>
    );
  }

  // ── Full logo: mark with embedded "ngb" + tagline (footer / brand) ─────────
  // Outer rect (4,4)→(92,92)  Inner rect (26,26)→(114,114)
  // Offset = 22 = 25% of rect-width 88 ✓
  // "ngb" sits at the staircase step, bottom-right of outer rect
  return (
    <svg
      viewBox="0 0 185 148"
      width={185} height={148}
      aria-label="NGB Interior Concepts & Craft"
      style={{ display:"block" }}
    >
      {/* Geometric mark */}
      <rect x="4"  y="4"  width="88" height="88" fill={fill} stroke={stroke} strokeWidth="5.5"/>
      <rect x="26" y="26" width="88" height="88" fill={fill} stroke={stroke} strokeWidth="5.5"/>

      {/* "ngb" overlapping the staircase step — bottom-right corner */}
      <text
        x="76" y="113"
        fontFamily="'Montserrat', sans-serif"
        fontSize="25" fontWeight="700"
        fill={stroke}
        letterSpacing="-0.4"
      >ngb</text>

      {/* Tagline centred below the mark */}
      <text
        x="92" y="141"
        textAnchor="middle"
        fontFamily="'Montserrat', sans-serif"
        fontSize="7.8" fontWeight="600"
        fill={sub}
        letterSpacing="2.8"
      >INTERIOR CONCEPTS &amp; CRAFT</text>
    </svg>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
export function SectionHdr({ eyebrow, heading, sub, light, tight }: { eyebrow:string; heading:string; sub?:string; light?:boolean; tight?:boolean }) {
  return (
    <div className={`${tight?"mb-5":"mb-12"} max-w-lg`}>
      <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", color:light?GOLD_LIGHT:GOLD, marginBottom:10, fontWeight:600 }}>{eyebrow}</p>
      <h2 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.6rem,3.2vw,2.2rem)", fontWeight:600, color:light?"white":CHARCOAL, lineHeight:1.18 }}>{heading}</h2>
      {sub && <p style={{ fontFamily:BODY, fontSize:"0.88rem", fontWeight:300, lineHeight:1.85, color:light?"rgba(255,255,255,0.55)":MID, marginTop:12 }}>{sub}</p>}
    </div>
  );
}

export function GoldBtn({ onClick, children, fullW }: { onClick?:()=>void; children:ReactNode; fullW?:boolean }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onClick} className={fullW?"w-full":""} style={{ fontFamily:SANS, fontSize:"0.66rem", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:600, color:"white", padding:"0.95rem 2rem", backgroundColor:h?"#9a7a3a":GOLD, border:`2px solid ${h?"#9a7a3a":GOLD}`, borderRadius:2, transform:h?"translateY(-2px)":"translateY(0)", transition:`all 0.28s ${EASE_OUT}`, cursor:"pointer" }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {children}
    </button>
  );
}

export function OutlineBtn({ onClick, children, dark }: { onClick?:()=>void; children:ReactNode; dark?:boolean }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onClick} style={{ fontFamily:SANS, fontSize:"0.66rem", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:600, padding:"0.95rem 2rem", color:h?(dark?"white":"rgba(255,255,255,0.95)"):(dark?CHARCOAL:"white"), backgroundColor:h?(dark?CHARCOAL:"rgba(255,255,255,0.1)"):"transparent", border:`2px solid ${dark?(h?CHARCOAL:"rgba(30,30,30,0.35)"):"rgba(255,255,255,0.6)"}`, borderRadius:2, transform:h?"translateY(-2px)":"translateY(0)", transition:`all 0.28s ${EASE_OUT}`, cursor:"pointer" }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {children}
    </button>
  );
}

// ─── ShowroomCard (image-dominant, Airbnb-style) ─────────────────────────────
export function ShowroomCard({ p, fav, onFav, onView }: { p:Prod; fav:boolean; onFav:(id:number)=>void; onView:(p:Prod)=>void }) {
  const [h, setH] = useState(false);
  return (
    <div className="relative overflow-hidden cursor-pointer" onClick={()=>onView(p)}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ borderRadius:10, background:CHARCOAL, height:160 }}>
      <img src={img(p.pid, 500, 670)} alt={p.name} className="absolute inset-0 w-full h-full object-cover"
        style={{ transform:h?"scale(1.06)":"scale(1)", transition:`transform 0.6s ${EASE_OUT}`, opacity:0.9 }} />
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.22) 45%, transparent 70%)" }} />

      {/* Heart — stop propagation so it doesn't trigger onView */}
      <button onClick={e=>{e.stopPropagation();onFav(p.id);}} className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor:"rgba(255,255,255,0.9)", backdropFilter:"blur(6px)", transition:"transform 0.2s ease", transform:fav?"scale(1.15)":"scale(1)" }}
        aria-label="Toggle favourite">
        <Heart size={16} fill={fav?"#e53e3e":"none"} stroke={fav?"#e53e3e":"#555"} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:600, color:"white", lineHeight:1.25, marginBottom:4 }}>{p.name}</h3>
        <p style={{ fontFamily:SANS, fontSize:"0.8rem", fontWeight:600, color:GOLD_LIGHT }}>{p.price}</p>
        <div style={{ marginTop:10, opacity:h?1:0, transform:h?"translateY(0)":"translateY(6px)", transition:"all 0.3s ease" }}>
          <span style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.75)", borderBottom:"1px solid rgba(255,255,255,0.35)", paddingBottom:2 }}>
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard (for category page — shows more info) ───────────────────────
export function ProductCard({ p, fav, onFav, onView }: { p:Prod; fav:boolean; onFav:(id:number)=>void; onView:(p:Prod)=>void }) {
  const [h,setH] = useState(false);
  const [vh,setVh] = useState(false);
  return (
    <div className="bg-card rounded-xl overflow-hidden flex flex-col" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ boxShadow:h?"0 12px 40px rgba(0,0,0,0.13)":"0 2px 16px rgba(0,0,0,0.07)", transform:h?"translateY(-4px)":"translateY(0)", transition:`all 0.3s ${EASE_OUT}`, border:"1px solid rgba(0,0,0,0.05)" }}>
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio:"4/3" }}>
        <img src={img(p.pid,600,450)} alt={p.name} className="w-full h-full object-cover"
          style={{ transform:h?"scale(1.06)":"scale(1)", transition:`transform 0.55s ${EASE_OUT}` }} />
        <button onClick={()=>onFav(p.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Heart size={15} fill={fav?"#e53e3e":"none"} stroke={fav?"#e53e3e":"#aaa"} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-0.5 mb-1.5">
          {[1,2,3,4,5].map(n=><Star key={n} size={11} fill={n<=Math.floor(p.rating)?GOLD:"none"} stroke={n<=Math.floor(p.rating)?GOLD:"#ccc"} />)}
          <span className="ml-1 text-xs" style={{ color:MID, fontFamily:BODY }}>{p.rating}</span>
        </div>
        <h3 className="leading-snug flex-1" style={{ fontFamily:DISPLAY, fontSize:"0.98rem", fontWeight:600, color:CHARCOAL }}>{p.name}</h3>
        <p className="mt-1" style={{ fontFamily:BODY, fontSize:"0.76rem", color:MID, lineHeight:1.55, fontWeight:300 }}>{p.desc}</p>
        <div className="flex items-center justify-between mt-4">
          <span style={{ fontFamily:SANS, fontSize:"0.82rem", fontWeight:600, color:GOLD }}>{p.price}</span>
          <button onClick={()=>onView(p)} onMouseEnter={()=>setVh(true)} onMouseLeave={()=>setVh(false)}
            className="text-xs font-semibold uppercase px-3 py-2 rounded"
            style={{ fontFamily:SANS, letterSpacing:"0.1em", color:vh?"white":CHARCOAL, backgroundColor:vh?CHARCOAL:"transparent", border:`1.5px solid ${CHARCOAL}`, transition:"all 0.2s ease" }}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── See All Card — appears as last item in every carousel ───────────────────
export function SeeAllCard({ catId, name, onNavigate }: { catId:CatId; name:string; onNavigate:(p:string)=>void }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={()=>onNavigate(catId)}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      className="w-full flex flex-col items-center justify-center"
      style={{
        height:160, borderRadius:10,
        backgroundColor: h ? CHARCOAL : CREAM_D,
        border:`1px solid ${h ? CHARCOAL : "rgba(0,0,0,0.09)"}`,
        boxShadow: h ? "0 8px 28px rgba(0,0,0,0.16)" : "0 2px 10px rgba(0,0,0,0.05)",
        gap:18, cursor:"pointer",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        transition:`all 0.28s ${EASE_OUT}`,
      }}
    >
      <svg width={42} height={42} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <rect x="3"  y="3"  width="76" height="76" fill={h ? CHARCOAL : CREAM_D} stroke={h ? GOLD : CHARCOAL} strokeWidth="5.5"/>
        <rect x="22" y="22" width="76" height="76" fill={h ? CHARCOAL : CREAM_D} stroke={h ? GOLD : CHARCOAL} strokeWidth="5.5"/>
      </svg>
      <div style={{ textAlign:"center", padding:"0 16px" }}>
        <p style={{ fontFamily:DISPLAY, fontSize:"1.05rem", fontWeight:600, color:h?"white":CHARCOAL, lineHeight:1.25, marginBottom:8 }}>
          See All {name}
        </p>
        <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:h?GOLD_LIGHT:MID }}>
          View Collection →
        </p>
      </div>
    </button>
  );
}

// ─── Slider Arrow ─────────────────────────────────────────────────────────────
export function SliderArrow({ dir, onClick, hidden }: { dir:"prev"|"next"; onClick:()=>void; hidden:boolean }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      className="absolute top-1/2 z-20 flex items-center justify-center rounded-full"
      aria-label={dir==="prev"?"Previous":"Next"}
      style={{
        width:44, height:44,
        backgroundColor: h ? CHARCOAL : WHITE,
        border:`1px solid ${h?"transparent":"rgba(0,0,0,0.11)"}`,
        boxShadow: h ? "0 4px 22px rgba(0,0,0,0.24)" : "0 2px 14px rgba(0,0,0,0.1)",
        [dir==="prev"?"left":"right"]: 0,
        transform:`translateY(-50%) ${dir==="prev"?"translateX(-50%)":"translateX(50%)"}`,
        cursor:"pointer",
        transition:`all 0.22s ${EASE_OUT}`,
        // Smoothly fade in/out when hidden
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      {dir==="prev"
        ? <ChevronLeft  size={20} color={h?"white":CHARCOAL} />
        : <ChevronRight size={20} color={h?"white":CHARCOAL} />}
    </button>
  );
}

// ─── CategorySlider — scroll-based, advances 2 cards per click ───────────────
export function CategorySlider({ catId, bg, fav, onFav, onNavigate, onView }: {
  catId:CatId; bg?:string; fav:Set<number>; onFav:(id:number)=>void; onNavigate:(p:string)=>void; onView:(p:Prod)=>void;
}) {
  const cat = CATS.find(c=>c.id===catId)!;
  const products = PRODS[catId];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  // Advance by 2 cards = half the container width
  const scrollCards = (dir:"prev"|"next") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir==="next" ? el.clientWidth / 2 : -el.clientWidth / 2, behavior:"smooth" });
  };

  const sectionBg = bg || WHITE;

  return (
    <section style={{ backgroundColor:sectionBg, paddingTop:10, paddingBottom:10 }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>

        {/* Section header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p style={{ fontFamily:SANS, fontSize:"0.5rem", letterSpacing:"0.22em", textTransform:"uppercase", color:GOLD, marginBottom:3, fontWeight:600 }}>Collection</p>
            <h2 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.1rem,2vw,1.5rem)", fontWeight:600, color:CHARCOAL, lineHeight:1.15 }}>{cat.name}</h2>
          </div>
          <button
            onClick={()=>onNavigate(catId)}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ fontFamily:SANS, fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:CHARCOAL, background:"none", border:"none", cursor:"pointer", textDecoration:"underline", textUnderlineOffset:3 }}>
            See all <ArrowRight size={13} />
          </button>
        </div>

        {/* ── Desktop slider ─────────────────────────────────────────── */}
        <div className="hidden lg:block relative">
          <SliderArrow dir="prev" onClick={()=>scrollCards("prev")} hidden={!canPrev} />

          {/* Edge fade hints */}
          {canPrev && (
            <div className="absolute top-0 left-0 bottom-0 z-10 pointer-events-none"
              style={{ width:72, background:`linear-gradient(to right, ${sectionBg} 20%, transparent)` }} />
          )}
          {canNext && (
            <div className="absolute top-0 right-0 bottom-0 z-10 pointer-events-none"
              style={{ width:72, background:`linear-gradient(to left, ${sectionBg} 20%, transparent)` }} />
          )}

          {/* Scrollable track — cards + SeeAllCard at end */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            style={{
              display:"flex", gap:16,
              overflowX:"auto",
              scrollbarWidth:"none",
              WebkitOverflowScrolling:"touch" as CSSProperties["WebkitOverflowScrolling"],
            }}
          >
            {products.map(p=>(
              <div key={p.id} style={{ flex:"0 0 calc(25% - 12px)" }}>
                <ShowroomCard p={p} fav={fav.has(p.id)} onFav={onFav} onView={onView} />
              </div>
            ))}
            {/* See All card terminates the carousel */}
            <div style={{ flex:"0 0 calc(25% - 12px)" }}>
              <SeeAllCard catId={catId} name={cat.name} onNavigate={onNavigate} />
            </div>
          </div>

          <SliderArrow dir="next" onClick={()=>scrollCards("next")} hidden={!canNext} />
        </div>

        {/* ── Mobile 2-up snap carousel ──────────────────────────────── */}
        <div
          className="lg:hidden flex gap-4 overflow-x-auto pb-4"
          style={{ scrollSnapType:"x mandatory", scrollbarWidth:"none", WebkitOverflowScrolling:"touch" as CSSProperties["WebkitOverflowScrolling"] }}
        >
          {products.map(p=>(
            <div key={p.id} className="flex-none" style={{ width:"calc(50% - 8px)", scrollSnapAlign:"start" }}>
              <ShowroomCard p={p} fav={fav.has(p.id)} onFav={onFav} onView={onView} />
            </div>
          ))}
          {/* See All card at end of mobile carousel */}
          <div className="flex-none" style={{ width:"calc(50% - 8px)", scrollSnapAlign:"start" }}>
            <SeeAllCard catId={catId} name={cat.name} onNavigate={onNavigate} />
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Service Discovery (Airbnb "Experiences" style) ───────────────────────────
export function ServiceCard({ title, sub, pid, nav, onNavigate }: { title:string; sub:string; pid:string; nav:string; onNavigate:(p:string)=>void }) {
  const [h,setH] = useState(false);
  return (
    <button
      onClick={()=>onNavigate(nav)}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      className="w-full text-left overflow-hidden"
      style={{
        borderRadius:12, border:"none", cursor:"pointer", display:"block",
        boxShadow:h?"0 8px 28px rgba(0,0,0,0.14)":"0 2px 10px rgba(0,0,0,0.07)",
        transform:h?"translateY(-3px)":"translateY(0)",
        transition:`all 0.28s ${EASE_OUT}`,
      }}
    >
      {/* Compact landscape image */}
      <div style={{ height:72, overflow:"hidden", position:"relative", background:CHARCOAL }}>
        <img src={img(pid,400,144)} alt={title} className="w-full h-full object-cover"
          style={{ opacity:h?0.6:0.78, transform:h?"scale(1.06)":"scale(1)", transition:`all 0.55s ${EASE_OUT}` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 70%)" }} />
      </div>
      {/* Text below */}
      <div style={{ padding:"9px 11px 11px", backgroundColor:h?CHARCOAL:WHITE, transition:`background-color 0.28s ${EASE_OUT}` }}>
        <h3 style={{ fontFamily:DISPLAY, fontSize:"0.88rem", fontWeight:600, color:h?"white":CHARCOAL, marginBottom:2 }}>{title}</h3>
        <p style={{ fontFamily:BODY, fontSize:"0.68rem", fontWeight:300, color:h?"rgba(255,255,255,0.6)":MID, lineHeight:1.4, marginBottom:6 }}>{sub}</p>
        <span style={{ fontFamily:SANS, fontSize:"0.52rem", letterSpacing:"0.14em", textTransform:"uppercase", color:GOLD_LIGHT }}>
          Explore →
        </span>
      </div>
    </button>
  );
}

// ─── Compact category card for the right column ───────────────────────────────
export function CollectionMiniCard({ cat, onNavigate }: { cat:typeof CATS[0]; onNavigate:(p:string)=>void }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={()=>onNavigate(cat.id)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      className="relative overflow-hidden w-full text-left"
      style={{ height:72, borderRadius:8, background:CHARCOAL, border:"none", cursor:"pointer",
        boxShadow:h?"0 4px 16px rgba(0,0,0,0.18)":"0 1px 6px rgba(0,0,0,0.08)",
        transform:h?"translateY(-2px)":"translateY(0)", transition:`all 0.24s ${EASE_OUT}` }}>
      <img src={img(cat.pid,300,144)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity:h?0.52:0.68, transform:h?"scale(1.06)":"scale(1)", transition:`all 0.5s ${EASE_OUT}` }} />
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(0,0,0,0.78) 0%,transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 flex items-end justify-between">
        <span style={{ fontFamily:DISPLAY, fontSize:"0.78rem", fontWeight:600, color:"white" }}>{cat.name}</span>
        <ArrowRight size={10} color={GOLD_LIGHT} style={{ opacity:h?1:0, transition:"opacity 0.2s", flexShrink:0 }} />
      </div>
    </button>
  );
}

// ─── Services + Collections side by side ─────────────────────────────────────
export function ServicesAndCollections({ onNavigate }: { onNavigate:(p:string)=>void }) {
  return (
    <section style={{ backgroundColor:WHITE, paddingTop:32, paddingBottom:32 }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>

        {/* Services — full width, 4 cards in a row */}
        <SectionHdr eyebrow="What We Do" heading="How can we help you today?" tight />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {SVC_CARDS.map(s=><ServiceCard key={s.title} {...s} onNavigate={onNavigate} />)}
        </div>

      </div>
    </section>
  );
}

// ─── Spaces Showcase (editorial asymmetric grid) ──────────────────────────────
export function SpaceCard({ name, tag, pid, tall }: { name:string; tag:string; pid:string; tall?:boolean }) {
  const [h,setH] = useState(false);
  return (
    <div className="relative overflow-hidden" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ borderRadius:14, background:"#111", height:"100%" }}>
      <img src={img(pid, tall?600:900, tall?800:500)} alt={name} className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity:h?0.52:0.68, transform:h?"scale(1.05)":"scale(1)", transition:`all 0.58s ${EASE_OUT}` }} />
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 style={{ fontFamily:DISPLAY, fontSize:"1.2rem", fontWeight:600, color:"white", marginBottom:3 }}>{name}</h3>
        <p className="flex items-center gap-1.5" style={{ fontFamily:BODY, fontSize:"0.75rem", fontWeight:300, color:"rgba(255,255,255,0.55)" }}>
          <MapPin size={11} /> {tag}
        </p>
      </div>
    </div>
  );
}

export function SpacesShowcase() {
  return (
    <section style={{ backgroundColor:CHARCOAL, paddingTop:40, paddingBottom:48 }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
        <SectionHdr light eyebrow="Our Work" heading="Spaces we have transformed"
          sub="Every room tells the story of a life well-designed. From first sketch to final touch." tight />

        {/* Desktop asymmetric grid — shorter rows */}
        <div className="hidden lg:grid gap-3" style={{ gridTemplateColumns:"1fr 1fr 1fr", gridTemplateRows:"180px 180px" }}>
          <div style={{ gridRow:"1 / 3" }}>
            <SpaceCard {...SPACES[0]} tall />
          </div>
          <div><SpaceCard {...SPACES[1]} /></div>
          <div><SpaceCard {...SPACES[2]} /></div>
          <div style={{ gridColumn:"2 / 4" }}>
            <SpaceCard {...SPACES[3]} />
          </div>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4" style={{ scrollSnapType:"x mandatory", scrollbarWidth:"none" }}>
          {SPACES.map(s=>(
            <div key={s.name} className="flex-none" style={{ width:"72vw", height:200, scrollSnapAlign:"start" }}>
              <SpaceCard {...s} />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <OutlineBtn>View All Projects</OutlineBtn>
        </div>
      </div>
    </section>
  );
}

// ─── Design Journey ───────────────────────────────────────────────────────────
export function DesignJourney() {
  const [step, setStep] = useState(0);
  const s = JOURNEY[step];
  return (
    <section style={{ backgroundColor:CREAM_D, paddingTop:80, paddingBottom:80 }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
        <SectionHdr eyebrow="Our Process" heading="The NGB Design Journey" sub="A seamless, fully managed experience — from vision to reality." />

        {/* Step tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {JOURNEY.map((j,i)=>{
            const active = step===i;
            return (
              <button key={j.title} onClick={()=>setStep(i)}
                className="p-5 text-left rounded-lg transition-all duration-300"
                style={{ backgroundColor:active?CHARCOAL:"white", border:`1px solid ${active?CHARCOAL:"rgba(0,0,0,0.08)"}`, transform:active?"translateY(-2px)":"translateY(0)", boxShadow:active?"0 8px 28px rgba(0,0,0,0.18)":"0 2px 12px rgba(0,0,0,0.05)" }}>
                <span style={{ fontFamily:SANS, fontSize:"0.52rem", letterSpacing:"0.2em", color:active?"rgba(255,255,255,0.55)":MID, display:"block", marginBottom:6 }}>{j.n}</span>
                <span style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:600, color:active?"white":CHARCOAL }}>{j.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active step */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-hidden" style={{ borderRadius:14, aspectRatio:"16/9" }}>
            <img src={img(s.pid,900,510)} alt={s.title} className="w-full h-full object-cover"
              style={{ transition:`opacity 0.4s ${EASE_OUT}` }} />
          </div>
          <div>
            <p style={{ fontFamily:SANS, fontSize:"0.52rem", letterSpacing:"0.26em", color:GOLD, marginBottom:10 }}>STEP {s.n}</p>
            <h3 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.5rem,2.8vw,2rem)", fontWeight:600, color:CHARCOAL, marginBottom:14 }}>{s.title}</h3>
            <p style={{ fontFamily:BODY, fontSize:"0.9rem", fontWeight:300, lineHeight:1.9, color:MID, marginBottom:28 }}>{s.desc}</p>
            <div className="flex gap-2">
              {JOURNEY.map((_,i)=>(
                <button key={i} onClick={()=>setStep(i)} style={{ width:step===i?28:8, height:8, borderRadius:4, backgroundColor:step===i?GOLD:"rgba(0,0,0,0.18)", border:"none", cursor:"pointer", transition:`all 0.3s ${EASE_OUT}` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────
export function StatsStrip() {
  return (
    <section style={{ backgroundColor:CHARCOAL, paddingTop:56, paddingBottom:56 }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ n, label }, idx)=>{
            const Icon = STATS_ICONS[idx];
            return (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor:"rgba(184,147,74,0.15)" }}>
                <Icon size={20} color={GOLD} />
              </div>
              <p style={{ fontFamily:DISPLAY, fontSize:"2.2rem", fontWeight:700, color:"white", lineHeight:1 }}>{n}</p>
              <p style={{ fontFamily:SANS, fontSize:"0.62rem", letterSpacing:"0.14em", textTransform:"uppercase", color:GOLD_LIGHT, marginTop:6 }}>{label}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function ContactSection({ id }: { id?:string }) {
  return (
    <section id={id} style={{ backgroundColor:"#111", paddingTop:80, paddingBottom:80 }}>
      <div className="max-w-5xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p style={{ fontFamily:SANS, fontSize:"0.56rem", letterSpacing:"0.3em", color:GOLD_LIGHT, marginBottom:12, fontWeight:600, textTransform:"uppercase" }}>Ready to Transform?</p>
            <h2 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.8rem,3.5vw,2.6rem)", fontWeight:600, color:"white", lineHeight:1.2, marginBottom:16 }}>
              Let&apos;s bring your vision to life.
            </h2>
            <p style={{ fontFamily:BODY, fontSize:"0.88rem", fontWeight:300, lineHeight:1.9, color:"rgba(255,255,255,0.55)", marginBottom:28 }}>
              Whether you need a single statement piece or a complete interior transformation — our team is ready. Start with a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="https://wa.me/256782042866" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 px-6 py-4 font-semibold hover:opacity-90 transition-opacity"
                style={{ fontFamily:SANS, fontSize:"0.72rem", letterSpacing:"0.08em", backgroundColor:"#25D366", color:"white", borderRadius:2 }}>
                <PhoneCall size={15} /> WhatsApp Us Now
              </a>
              <a href="tel:+256782042866" className="flex items-center justify-center gap-2.5 px-6 py-4 font-semibold transition-colors"
                style={{ fontFamily:SANS, fontSize:"0.72rem", letterSpacing:"0.08em", color:"rgba(255,255,255,0.8)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:2 }}>
                <Phone size={15} /> Call Us
              </a>
            </div>
            <div className="space-y-3">
              {[ { Icon:Phone,  text:"+256 782042866" }, { Icon:Phone, text:"+256 785644830" }, { Icon:Mail, text:"ngbinteriors@gmail.com" }, { Icon:MapPin, text:"Plot 14, Acacia Avenue, Kololo, Kampala" } ].map(({Icon,text})=>(
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} style={{ color:GOLD_LIGHT, flexShrink:0 }} />
                  <span style={{ fontFamily:BODY, fontSize:"0.82rem", fontWeight:300, color:"rgba(255,255,255,0.5)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick inquiry form */}
          <div style={{ backgroundColor:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, padding:32 }}>
            <h3 style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:600, color:"white", marginBottom:20 }}>Request a Free Consultation</h3>
            <div className="space-y-4">
              {[{ label:"Full Name", type:"text", ph:"e.g. Sarah Nakato" }, { label:"Phone / WhatsApp", type:"tel", ph:"+256 700 000 000" }, { label:"Email", type:"email", ph:"you@example.com" }].map(({label,type,ph})=>(
                <div key={label}>
                  <label style={{ fontFamily:SANS, fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", display:"block", marginBottom:6 }}>{label}</label>
                  <input type={type} placeholder={ph} className="w-full px-4 py-3 rounded text-sm"
                    style={{ fontFamily:BODY, backgroundColor:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"white", outline:"none", fontSize:"0.84rem" }} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily:SANS, fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", display:"block", marginBottom:6 }}>Tell us about your space</label>
                <textarea rows={3} placeholder="e.g. Master bedroom, 4×5m, modern aesthetic..." className="w-full px-4 py-3 rounded resize-none"
                  style={{ fontFamily:BODY, backgroundColor:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"white", outline:"none", fontSize:"0.82rem" }} />
              </div>
              <GoldBtn fullW>Send Request</GoldBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label:"Home",            id:"home"      },
  { label:"Furniture",       id:"furniture" },
  { label:"Interior Design", id:"contact"   },
  { label:"Projects",        id:"contact"   },
  { label:"Contact",         id:"contact"   },
];

export function Navbar({ active, onNav, openDrawer, cart, openSearch }: { active:string; onNav:(p:string)=>void; openDrawer:()=>void; cart:number; openSearch:()=>void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ height:68, boxShadow:"0 1px 0 rgba(0,0,0,0.07),0 2px 18px rgba(0,0,0,0.04)" }}>
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between" style={{ paddingInline:"clamp(1.25rem,4vw,3rem)" }}>

        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button onClick={openDrawer} className="hover:opacity-60 transition-opacity" style={{ color:CHARCOAL }} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <button onClick={()=>onNav("home")} className="hover:opacity-75 transition-opacity" aria-label="Home">
            <NGBLogo compact />
          </button>
        </div>

        {/* Centre: desktop nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {NAV_LINKS.map(({ label, id })=>(
            <button key={label} onClick={()=>onNav(id)} style={{ fontFamily:SANS, fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, color:active===id?GOLD:MID, borderTop:"none", borderLeft:"none", borderRight:"none", borderBottom:`1.5px solid ${active===id?GOLD:"transparent"}`, paddingBottom:2, transition:"all 0.2s ease", cursor:"pointer", background:"none" }}>
              {label}
            </button>
          ))}
        </nav>

        {/* Right: search + cart */}
        <div className="flex items-center gap-4">
          <button onClick={openSearch} className="hover:opacity-60 transition-opacity" style={{ color:CHARCOAL }} aria-label="Search"><Search size={20} /></button>
          <button className="relative hover:opacity-60 transition-opacity" style={{ color:CHARCOAL }} aria-label="Wishlist">
            <ShoppingBag size={20} />
            {cart>0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center" style={{ fontSize:"0.52rem", fontFamily:SANS, fontWeight:700, backgroundColor:GOLD }}>{cart}</span>}
          </button>
        </div>

      </div>
    </header>
  );
}

// ─── Hamburger Drawer (slides from left) ─────────────────────────────────────
export function HamburgerDrawer({ open, onClose, onNav }: { open:boolean; onClose:()=>void; onNav:(p:string)=>void }) {
  const items = [
    { id:"home",      label:"Home"            },
    { id:"furniture", label:"Furniture"       },
    { id:"contact",   label:"Interior Design" },
    { id:"contact",   label:"Projects"        },
    { id:"contact",   label:"Contact Us"      },
    ...CATS.map(c=>({ id:c.id, label:c.name })),
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}
        style={{ backgroundColor:"rgba(0,0,0,0.55)", backdropFilter:open?"blur(4px)":"none", opacity:open?1:0, pointerEvents:open?"auto":"none", transition:`opacity 0.35s ${EASE_OUT}` }} />
      <div className="fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-white" style={{ width:"min(340px,50vw)", transform:open?"translateX(0)":"translateX(-100%)", transition:`transform 0.4s ${EASE_OUT}`, boxShadow:"6px 0 40px rgba(0,0,0,0.18)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor:"rgba(0,0,0,0.07)" }}>
          <NGBLogo compact />
          <button onClick={onClose} className="hover:opacity-60 transition-opacity" style={{ color:CHARCOAL }}><X size={22} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {items.map(({ id, label }, i)=>(
            <button key={`${id}-${i}`} onClick={()=>{ onNav(id); onClose(); }}
              className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors duration-150">
              <span style={{ fontFamily:SANS, fontSize:"0.84rem", fontWeight:500, letterSpacing:"0.05em", color:label==="Contact Us"?GOLD:CHARCOAL }}>{label}</span>
              <ChevronRight size={14} style={{ color:"#ccc" }} />
            </button>
          ))}
        </nav>

        <div className="px-6 py-5 border-t space-y-3" style={{ borderColor:"rgba(0,0,0,0.07)" }}>
          <a href="https://wa.me/256782042866" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full py-3 rounded font-semibold"
            style={{ fontFamily:SANS, fontSize:"0.76rem", letterSpacing:"0.08em", backgroundColor:"#25D366", color:"white", borderRadius:4 }}>
            <PhoneCall size={15} /> WhatsApp Us
          </a>
          <p style={{ fontFamily:BODY, fontSize:"0.74rem", color:MID, lineHeight:1.7, fontWeight:300 }}>📞 +256 782042866<br />📞 +256 785644830<br />✉️ ngbinteriors@gmail.com</p>
        </div>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function HeroBtn({ onClick, variant, icon, children }: {
  onClick:()=>void; variant:"gold"|"outline"; icon:ReactNode; children:ReactNode;
}) {
  const [h, setH] = useState(false);
  const gold = variant === "gold";
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        fontFamily:SANS, fontSize:"0.6rem", letterSpacing:"0.14em",
        textTransform:"uppercase", fontWeight:600,
        padding:"0.6rem 1rem", borderRadius:50, cursor:"pointer",
        flex:1, maxWidth:180,
        backgroundColor: gold ? (h?"#9a7a3a":GOLD) : (h?"rgba(255,255,255,0.12)":"transparent"),
        color:"white",
        border: gold ? `1.5px solid ${h?"#9a7a3a":GOLD}` : "1.5px solid rgba(255,255,255,0.55)",
        transform: h?"translateY(-1px)":"translateY(0)",
        transition:`all 0.24s ${EASE_OUT}`,
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

export function Hero({ onShop, onDesign }: { onShop:()=>void; onDesign:()=>void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section style={{ position:"relative", height:"42vh", minHeight:320, background:CHARCOAL, overflow:"hidden" }}>

      {/* Sliding photo stack — crossfade between slides */}
      {HERO_SLIDES.map((s, i) => (
        <div key={s.pid} style={{ position:"absolute", inset:0, transition:"opacity 1.4s ease-in-out", opacity:i===current?1:0, zIndex:i===current?1:0 }}>
          <img
            src={img(s.pid, 1600, 900)}
            alt={s.project}
            style={{
              width:"100%", height:"100%", objectFit:"cover", opacity:0.5,
              animation: i===current ? "kenburns 6s ease-in-out forwards" : "none",
              transformOrigin:"center center",
            }}
          />
        </div>
      ))}

      {/* Dark gradient overlay — always on top of photos */}
      <div style={{ position:"absolute", inset:0, zIndex:2, background:"linear-gradient(to bottom,rgba(4,4,4,0.25) 0%,rgba(4,4,4,0.6) 55%,rgba(4,4,4,0.88) 100%)" }} />

      {/* Before / After badge — top right */}
      <div style={{ position:"absolute", top:14, right:16, zIndex:4, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
        <span style={{
          padding:"3px 10px", borderRadius:20,
          backgroundColor: slide.label==="Before" ? "rgba(20,20,20,0.82)" : GOLD,
          color:"white", fontFamily:SANS, fontSize:"0.52rem", fontWeight:700,
          letterSpacing:"0.18em", textTransform:"uppercase",
        }}>{slide.label}</span>
        <span style={{ fontFamily:BODY, fontSize:"0.6rem", fontWeight:300, color:"rgba(255,255,255,0.7)" }}>{slide.project}</span>
      </div>

      {/* Slide dot indicators — bottom centre */}
      <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", zIndex:4, display:"flex", gap:6 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={()=>setCurrent(i)} style={{
            width:i===current?20:6, height:6, borderRadius:3,
            backgroundColor:i===current?"white":"rgba(255,255,255,0.38)",
            border:"none", cursor:"pointer", padding:0,
            transition:`all 0.35s ${EASE_OUT}`,
          }} />
        ))}
      </div>

      {/* Text content */}
      <div style={{ position:"absolute", inset:0, zIndex:3, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", padding:"0 1.5rem", maxWidth:520 }}>
          <p style={{ fontFamily:SANS, fontSize:"0.54rem", letterSpacing:"0.36em", textTransform:"uppercase", color:GOLD_LIGHT, marginBottom:10, fontWeight:600 }}>NGB Interiors</p>
          <h1 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.7rem,4.2vw,3rem)", fontWeight:700, lineHeight:1.1, color:"white", letterSpacing:"-0.01em", marginBottom:10 }}>
            Your vision,&nbsp;<em style={{ fontStyle:"italic", fontWeight:400 }}>our craft.</em>
          </h1>
          <p style={{ fontFamily:BODY, fontSize:"0.84rem", fontWeight:300, lineHeight:1.65, color:"rgba(255,255,255,0.66)", marginBottom:20, maxWidth:380, marginInline:"auto" }}>
            We design and furnish spaces that reflect who you are.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <HeroBtn onClick={onDesign} variant="gold"    icon={<Home     size={13} />}>Design My Space</HeroBtn>
            <HeroBtn onClick={onShop}   variant="outline" icon={<Armchair size={13} />}>Explore Furniture</HeroBtn>
          </div>
        </div>
      </div>

    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer({ onNav }: { onNav:(p:string)=>void }) {
  return (
    <footer style={{ backgroundColor:"#0d0d0d" }}>
      <div className="max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)", paddingTop:48, paddingBottom:32 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <NGBLogo inv />
            <p style={{ fontFamily:BODY, fontSize:"0.78rem", fontWeight:300, lineHeight:1.8, color:"rgba(255,255,255,0.38)", maxWidth:240, marginTop:14 }}>
              Kampala&apos;s premier interior design and custom furniture studio. Transforming spaces since 2015.
            </p>
          </div>
          <div>
            <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD_LIGHT, marginBottom:12 }}>Services</p>
            {["Furniture","Interior Design","Custom Pieces","Projects","Consultation"].map(x=>(
              <p key={x} style={{ fontFamily:BODY, fontSize:"0.8rem", fontWeight:300, color:"rgba(255,255,255,0.42)", marginBottom:8, cursor:"pointer" }}>{x}</p>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD_LIGHT, marginBottom:12 }}>Collections</p>
            {CATS.map(c=>(
              <p key={c.id} onClick={()=>onNav(c.id)} style={{ fontFamily:BODY, fontSize:"0.8rem", fontWeight:300, color:"rgba(255,255,255,0.42)", marginBottom:8, cursor:"pointer" }}>{c.name}</p>
            ))}
          </div>
        </div>
        <div className="border-t flex flex-col md:flex-row items-center justify-between gap-4 pt-5" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily:BODY, fontSize:"0.7rem", color:"rgba(255,255,255,0.25)", fontWeight:300 }}>© 2024 NGB Interior Concepts &amp; Craft. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy","Terms","Contact"].map(x=>(
              <button key={x} style={{ fontFamily:SANS, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", background:"none", border:"none", cursor:"pointer" }}>{x}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Category Page ────────────────────────────────────────────────────────────
export function CategoryPage({ catId, fav, onFav, onView }: { catId:CatId; fav:Set<number>; onFav:(id:number)=>void; onView:(p:Prod)=>void }) {
  const cat = CATS.find(c=>c.id===catId)!;
  const products = PRODS[catId];
  const [sort,setSort] = useState("featured");

  const sorted = [...products].sort((a,b)=>{
    if (sort==="price-asc")  return parseInt(a.price.replace(/\D/g,""))-parseInt(b.price.replace(/\D/g,""));
    if (sort==="price-desc") return parseInt(b.price.replace(/\D/g,""))-parseInt(a.price.replace(/\D/g,""));
    if (sort==="rating")     return b.rating-a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="relative flex items-center justify-center" style={{ height:180, background:CHARCOAL }}>
        <img src={img(cat.pid,1600,500)} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" style={{ opacity:0.38 }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0.65) 100%)" }} />
        <div className="relative text-center z-10 px-6 w-full" style={{ zIndex:2 }}>
          <div className="flex items-center justify-center max-w-6xl mx-auto" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
            <div className="text-center">
              <h1 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.2rem,3vw,2rem)", fontWeight:700, color:"white", lineHeight:1.1 }}>{cat.name}</h1>
              <p style={{ fontFamily:BODY, fontSize:"0.72rem", fontWeight:300, color:"rgba(255,255,255,0.5)", marginTop:4 }}>{products.length} pieces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b" style={{ borderColor:"rgba(0,0,0,0.07)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 py-4" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
          <p style={{ fontFamily:BODY, fontSize:"0.8rem", color:MID, fontWeight:300 }}>Showing {products.length} results</p>
          <div className="flex items-center gap-3">
            <label style={{ fontFamily:SANS, fontSize:"0.64rem", letterSpacing:"0.1em", textTransform:"uppercase", color:MID }}>Sort by:</label>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{ fontFamily:BODY, color:CHARCOAL, borderColor:"rgba(0,0,0,0.14)", outline:"none", padding:"8px 12px", fontSize:"0.82rem", border:"1px solid rgba(0,0,0,0.14)", borderRadius:4 }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto py-14" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map(p=><ProductCard key={p.id} p={p} fav={fav.has(p.id)} onFav={onFav} onView={onView} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Furniture Page (/furniture) — all category discovery sliders ─────────────
export function FurniturePage({ fav, onFav, onNavigate, onView }: { fav:Set<number>; onFav:(id:number)=>void; onNavigate:(p:string)=>void; onView:(p:Prod)=>void }) {
  return (
    <div>
      {/* Page header strip */}
      <div style={{ backgroundColor:CHARCOAL, paddingTop:28, paddingBottom:22, textAlign:"center" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p style={{ fontFamily:SANS, fontSize:"0.54rem", letterSpacing:"0.28em", textTransform:"uppercase", color:GOLD_LIGHT, marginBottom:6, fontWeight:600 }}>
            NGB Interiors
          </p>
          <h1 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:700, color:"white", lineHeight:1.12 }}>
            Our Collections
          </h1>
        </div>
      </div>

      {/* Sticky category nav */}
      <div className="sticky top-[68px] z-30 border-b" style={{ backgroundColor:WHITE, borderColor:"rgba(0,0,0,0.07)" }}>
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-3" style={{ paddingInline:"clamp(1.5rem,5vw,4rem)", scrollbarWidth:"none" }}>
          {CATS.map(cat=>(
            <a key={cat.id} href={`#cat-${cat.id}`}
              className="flex-none px-4 py-2 rounded-full text-xs font-semibold uppercase transition-all duration-200 hover:bg-secondary"
              style={{ fontFamily:SANS, letterSpacing:"0.1em", color:MID, whiteSpace:"nowrap", textDecoration:"none" }}>
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Six category sliders, alternating backgrounds */}
      <div id="cat-beds">
        <CategorySlider catId="beds"          bg={WHITE}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
      <div id="cat-sofas">
        <CategorySlider catId="sofas"         bg={CREAM}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
      <div id="cat-wardrobes">
        <CategorySlider catId="wardrobes"     bg={WHITE}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
      <div id="cat-tv-units">
        <CategorySlider catId="tv-units"      bg={CREAM}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
      <div id="cat-dining">
        <CategorySlider catId="dining"        bg={WHITE}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
      <div id="cat-coffee-tables">
        <CategorySlider catId="coffee-tables" bg={CREAM}   fav={fav} onFav={onFav} onNavigate={onNavigate} onView={onView} />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
// ─── Product Detail Modal ─────────────────────────────────────────────────────
// ─── Custom order data ────────────────────────────────────────────────────────
const WOOD_OPTIONS = ["Solid Mahogany","African Teak","White Oak","Walnut","Reclaimed Pine","Painted MDF"];
const FINISH_OPTIONS = [
  { label:"Natural",     hex:"#c8a06a" },
  { label:"Dark Walnut", hex:"#3d2010" },
  { label:"Ebony",       hex:"#181818" },
  { label:"Ivory White", hex:"#f4f0e6" },
  { label:"Charcoal",    hex:"#383838" },
  { label:"Gold Accent", hex:"#b8934a" },
];
const FABRIC_OPTIONS = ["None","Premium Linen","Velvet","Top-grain Leather","Cotton Blend","Suede"];
const FABRIC_COLORS = [
  { label:"Cream",      hex:"#f5efe0" },
  { label:"Charcoal",   hex:"#2e2e2e" },
  { label:"Navy",       hex:"#1a2a4a" },
  { label:"Olive",      hex:"#6b7355" },
  { label:"Beige",      hex:"#c8b896" },
  { label:"Terracotta", hex:"#c06040" },
  { label:"Blush Pink", hex:"#d4a0a0" },
  { label:"Sage",       hex:"#8faa8a" },
];
const SIZE_OPTIONS = ["Single","Double","Queen","King","Standard","Custom"];

export function PillSel({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 12px", borderRadius:20, border:`1.5px solid ${active?GOLD:"rgba(0,0,0,0.15)"}`,
      backgroundColor:active?GOLD:"white", color:active?"white":CHARCOAL,
      fontFamily:BODY, fontSize:"0.74rem", cursor:"pointer", transition:"all 0.2s ease",
      whiteSpace:"nowrap" as const,
    }}>{label}</button>
  );
}

export function ColorSel({ hex, label, active, onClick }: { hex:string; label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} title={label} style={{
      width:28, height:28, borderRadius:"50%", backgroundColor:hex, border:`none`, cursor:"pointer",
      outline:active?`3px solid ${GOLD}`:"3px solid transparent",
      outlineOffset:2, transition:"outline 0.15s ease",
    }} aria-label={label} />
  );
}

export function FormRow({ label, children }: { label:string; children:ReactNode }) {
  return (
    <div style={{ marginBottom:16 }}>
      <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:CHARCOAL, fontWeight:600, marginBottom:8 }}>{label}</p>
      <div style={{ display:"flex", flexWrap:"wrap" as const, gap:6, alignItems:"center" }}>{children}</div>
    </div>
  );
}

// ─── Custom Order Panel (inside ProductModal) ─────────────────────────────────
export function CustomOrderPanel({ prod, onBack, onClose }: { prod:Prod; onBack:()=>void; onClose:()=>void }) {
  const [wood,      setWood]      = useState("");
  const [finish,    setFinish]    = useState("");
  const [fabric,    setFabric]    = useState("None");
  const [fabColor,  setFabColor]  = useState("");
  const [size,      setSize]      = useState("Standard");
  const [customSz,  setCustomSz]  = useState("");
  const [qty,       setQty]       = useState(1);
  const [notes,     setNotes]     = useState("");

  const handleOrder = () => {
    const lines = [
      `Hi NGB Interiors! I'd like to request a *custom ${prod.name}*.`,
      "",
      "*My Custom Specifications:*",
      wood      ? `• Wood / Frame: ${wood}`        : null,
      finish    ? `• Colour / Finish: ${finish}`   : null,
      fabric && fabric !== "None" ? `• Upholstery: ${fabric}` : null,
      fabColor && fabric !== "None" ? `• Upholstery Colour: ${fabColor}` : null,
      `• Size: ${size === "Custom" ? (customSz || "Custom — to be discussed") : size}`,
      `• Quantity: ${qty}`,
      notes     ? `• Notes: ${notes}`              : null,
      "",
      "Please advise on pricing and timeline. Thank you!",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/256782042866?text=${encodeURIComponent(lines)}`, "_blank");
    onClose();
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-1.5 hover:opacity-60 transition-opacity"
          style={{ fontFamily:SANS, fontSize:"0.65rem", letterSpacing:"0.1em", color:MID, background:"none", border:"none", cursor:"pointer" }}>
          ← Back
        </button>
        <button onClick={onClose} className="hover:opacity-60 transition-opacity" style={{ color:CHARCOAL, background:"none", border:"none", cursor:"pointer" }}>
          <X size={18} />
        </button>
      </div>

      <p style={{ fontFamily:SANS, fontSize:"0.54rem", letterSpacing:"0.22em", textTransform:"uppercase", color:GOLD, marginBottom:4, fontWeight:600 }}>Custom Order</p>
      <h3 style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:700, color:CHARCOAL, marginBottom:4 }}>{prod.name}</h3>
      <p style={{ fontFamily:BODY, fontSize:"0.76rem", color:MID, fontWeight:300, marginBottom:20 }}>Customise every detail — we build it exactly to your spec.</p>

      {/* Wood / Frame */}
      <FormRow label="Wood / Frame Material">
        {WOOD_OPTIONS.map(w=><PillSel key={w} label={w} active={wood===w} onClick={()=>setWood(wood===w?"":w)} />)}
      </FormRow>

      {/* Colour / Finish */}
      <FormRow label="Colour / Finish">
        {FINISH_OPTIONS.map(f=>(
          <div key={f.label} style={{ display:"flex", flexDirection:"column" as const, alignItems:"center", gap:3 }}>
            <ColorSel hex={f.hex} label={f.label} active={finish===f.label} onClick={()=>setFinish(finish===f.label?"":f.label)} />
            <span style={{ fontFamily:BODY, fontSize:"0.58rem", color:MID, textAlign:"center" as const }}>{f.label}</span>
          </div>
        ))}
      </FormRow>

      {/* Upholstery */}
      <FormRow label="Upholstery Fabric">
        {FABRIC_OPTIONS.map(f=><PillSel key={f} label={f} active={fabric===f} onClick={()=>{ setFabric(f); if(f==="None") setFabColor(""); }} />)}
      </FormRow>

      {/* Upholstery colour — only if fabric chosen */}
      {fabric !== "None" && (
        <FormRow label="Upholstery Colour">
          {FABRIC_COLORS.map(c=>(
            <div key={c.label} style={{ display:"flex", flexDirection:"column" as const, alignItems:"center", gap:3 }}>
              <ColorSel hex={c.hex} label={c.label} active={fabColor===c.label} onClick={()=>setFabColor(fabColor===c.label?"":c.label)} />
              <span style={{ fontFamily:BODY, fontSize:"0.58rem", color:MID, textAlign:"center" as const }}>{c.label}</span>
            </div>
          ))}
        </FormRow>
      )}

      {/* Size */}
      <FormRow label="Size">
        {SIZE_OPTIONS.map(s=><PillSel key={s} label={s} active={size===s} onClick={()=>setSize(s)} />)}
      </FormRow>
      {size === "Custom" && (
        <input value={customSz} onChange={e=>setCustomSz(e.target.value)}
          placeholder="e.g. 6ft × 6.5ft or 180 cm × 200 cm"
          style={{ width:"100%", fontFamily:BODY, fontSize:"0.82rem", padding:"8px 12px", border:"1px solid rgba(0,0,0,0.15)", borderRadius:6, outline:"none", marginBottom:16, color:CHARCOAL }} />
      )}

      {/* Quantity */}
      <FormRow label="Quantity">
        <div style={{ display:"flex", alignItems:"center", gap:0, border:"1px solid rgba(0,0,0,0.15)", borderRadius:8, overflow:"hidden" }}>
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ padding:"6px 14px", fontFamily:SANS, fontSize:"1rem", background:"none", border:"none", cursor:"pointer", color:CHARCOAL }}>−</button>
          <span style={{ padding:"6px 18px", fontFamily:SANS, fontSize:"0.88rem", fontWeight:600, color:CHARCOAL, borderLeft:"1px solid rgba(0,0,0,0.1)", borderRight:"1px solid rgba(0,0,0,0.1)" }}>{qty}</span>
          <button onClick={()=>setQty(q=>q+1)} style={{ padding:"6px 14px", fontFamily:SANS, fontSize:"1rem", background:"none", border:"none", cursor:"pointer", color:CHARCOAL }}>+</button>
        </div>
      </FormRow>

      {/* Notes */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:CHARCOAL, fontWeight:600, marginBottom:8 }}>Additional Notes</p>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3}
          placeholder="Delivery address, specific requirements, timeline needs..."
          style={{ width:"100%", fontFamily:BODY, fontSize:"0.82rem", padding:"10px 12px", border:"1px solid rgba(0,0,0,0.15)", borderRadius:6, outline:"none", resize:"none", color:CHARCOAL }} />
      </div>

      {/* Order via WhatsApp */}
      <button onClick={handleOrder}
        className="flex items-center justify-center gap-2.5 py-4 w-full font-semibold mt-auto"
        style={{ fontFamily:SANS, fontSize:"0.76rem", letterSpacing:"0.1em", backgroundColor:"#25D366", color:"white", border:"none", borderRadius:6, cursor:"pointer" }}>
        <PhoneCall size={16} /> Order via WhatsApp
      </button>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
export function ProductModal({ prod, onClose, fav, onFav }: { prod:Prod; onClose:()=>void; fav:boolean; onFav:(id:number)=>void }) {
  const [showCustom, setShowCustom] = useState(false);
  const mats = MATERIALS[prod.id] ?? [];
  const waMsg = encodeURIComponent(`Hi NGB Interiors! I'm interested in the ${prod.name} (${prod.price}). Can you share more details?`);

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
      style={{ backgroundColor:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)" }}
      onClick={onClose}>
      <div className="relative bg-white w-full lg:max-w-3xl lg:rounded-2xl overflow-hidden flex flex-col lg:flex-row"
        style={{ maxHeight:"92vh" }}
        onClick={e=>e.stopPropagation()}>

        {/* Product image — always visible on left / top */}
        <div className="flex-none lg:w-5/12" style={{ aspectRatio:"4/3", minHeight:190, background:CHARCOAL, position:"relative" }}>
          <img src={img(prod.pid,700,530)} alt={prod.name} className="w-full h-full object-cover" />
          <button onClick={()=>onFav(prod.id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor:"rgba(255,255,255,0.9)", backdropFilter:"blur(4px)", border:"none", cursor:"pointer" }}>
            <Heart size={17} fill={fav?"#e53e3e":"none"} stroke={fav?"#e53e3e":"#555"} />
          </button>
          {/* Badge showing which panel is active */}
          <div className="absolute bottom-3 left-3">
            <span style={{ fontFamily:SANS, fontSize:"0.54rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"white", backgroundColor:"rgba(0,0,0,0.55)", padding:"3px 8px", borderRadius:20 }}>
              {showCustom ? "Custom Order" : "Product Details"}
            </span>
          </div>
        </div>

        {/* Right panel — toggles between details and custom form */}
        {showCustom
          ? <CustomOrderPanel prod={prod} onBack={()=>setShowCustom(false)} onClose={onClose} />
          : (
            <div className="flex flex-col flex-1 overflow-y-auto p-6">
              <button onClick={onClose} className="self-end mb-3 hover:opacity-60 transition-opacity" style={{ color:CHARCOAL, background:"none", border:"none", cursor:"pointer" }}>
                <X size={20} />
              </button>

              <p style={{ fontFamily:SANS, fontSize:"0.55rem", letterSpacing:"0.24em", textTransform:"uppercase", color:GOLD, marginBottom:6, fontWeight:600 }}>NGB Interiors</p>
              <h2 style={{ fontFamily:DISPLAY, fontSize:"clamp(1.2rem,2.5vw,1.7rem)", fontWeight:700, color:CHARCOAL, marginBottom:4, lineHeight:1.2 }}>{prod.name}</h2>
              <p style={{ fontFamily:SANS, fontSize:"1rem", fontWeight:700, color:GOLD, marginBottom:12 }}>{prod.price}</p>
              <p style={{ fontFamily:BODY, fontSize:"0.83rem", fontWeight:300, lineHeight:1.75, color:MID, marginBottom:16 }}>{prod.desc}</p>

              {/* Materials tags */}
              {mats.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:CHARCOAL, fontWeight:600, marginBottom:8 }}>Materials &amp; Finish</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {mats.map(m=>(
                      <span key={m} style={{ padding:"4px 10px", borderRadius:20, backgroundColor:CREAM_D, fontFamily:BODY, fontSize:"0.71rem", color:CHARCOAL }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[1,2,3,4,5].map(n=><Star key={n} size={13} fill={n<=Math.floor(prod.rating)?GOLD:"none"} stroke={n<=Math.floor(prod.rating)?GOLD:"#ccc"} />)}
                <span style={{ fontFamily:BODY, fontSize:"0.74rem", color:MID, marginLeft:4 }}>{prod.rating} / 5</span>
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:"auto" }}>
                <a href={`https://wa.me/256782042866?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3.5"
                  style={{ fontFamily:SANS, fontSize:"0.7rem", letterSpacing:"0.1em", backgroundColor:"#25D366", color:"white", textDecoration:"none", borderRadius:6 }}>
                  <PhoneCall size={15} /> Order via WhatsApp
                </a>
                <button onClick={()=>setShowCustom(true)}
                  className="flex items-center justify-center gap-2.5 py-3"
                  style={{ fontFamily:SANS, fontSize:"0.7rem", letterSpacing:"0.1em", color:CHARCOAL, border:`1.5px solid ${CHARCOAL}`, borderRadius:6, background:"none", cursor:"pointer" }}>
                  ✏️ Request Custom Piece
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────
// Maps common search terms to category IDs
const CAT_ALIASES: Record<string, CatId> = {
  bed:"beds", beds:"beds",
  sofa:"sofas", sofas:"sofas", couch:"sofas", lounge:"sofas",
  wardrobe:"wardrobes", wardrobes:"wardrobes", closet:"wardrobes", cabinet:"wardrobes",
  tv:"tv-units", "tv unit":"tv-units", "tv units":"tv-units", media:"tv-units", entertainment:"tv-units",
  dining:"dining", "dining table":"dining", "dining tables":"dining", table:"dining",
  coffee:"coffee-tables", "coffee table":"coffee-tables", "coffee tables":"coffee-tables",
};

function resolveCategory(q: string): CatId | null {
  const t = q.trim().toLowerCase();
  if (CAT_ALIASES[t]) return CAT_ALIASES[t];
  // partial match
  for (const [key, id] of Object.entries(CAT_ALIASES)) {
    if (t.includes(key) || key.includes(t)) return id;
  }
  return null;
}

export function SearchOverlay({ onClose, fav, onFav, onView, onNavigate }: {
  onClose:()=>void; fav:Set<number>; onFav:(id:number)=>void; onView:(p:Prod)=>void; onNavigate:(p:string)=>void;
}) {
  const [query, setQuery] = useState("");
  const all = getAllProducts();
  const q = query.trim().toLowerCase();
  const results = q.length < 2 ? [] : all.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.catId.replace("-"," ").includes(q)
  );

  const matchedCat = q.length >= 2 ? resolveCategory(q) : null;

  const handleEnter = () => {
    if (!q) return;
    if (matchedCat) {
      onNavigate(matchedCat);
      onClose();
      return;
    }
    // If exactly one result, open it directly
    if (results.length === 1) {
      onView(results[0]);
      onClose();
    }
  };

  useEffect(() => {
    const onKey = (e:KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleEnter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, results]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }}
      onClick={onClose}>
      <div className="w-full" style={{ backgroundColor:"white" }} onClick={e=>e.stopPropagation()}>
        {/* Search bar */}
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-5 py-4">
          <Search size={20} style={{ color:MID, flexShrink:0 }} />
          <input
            autoFocus
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") handleEnter(); }}
            placeholder='Try "beds", "sofa", "wardrobe", or a product name...'
            style={{ flex:1, fontFamily:BODY, fontSize:"1rem", color:CHARCOAL, border:"none", outline:"none", background:"transparent" }}
          />
          <button onClick={onClose} style={{ color:MID, background:"none", border:"none", cursor:"pointer" }}><X size={20} /></button>
        </div>

        {/* Enter-to-navigate hint */}
        {matchedCat && (
          <div className="max-w-3xl mx-auto px-5 pb-3 flex items-center gap-2">
            <span style={{ fontFamily:SANS, fontSize:"0.62rem", color:MID }}>Press</span>
            <kbd style={{ fontFamily:SANS, fontSize:"0.58rem", padding:"2px 7px", borderRadius:4, backgroundColor:CREAM_D, border:`1px solid ${CREAM_D}`, color:CHARCOAL, fontWeight:600 }}>Enter</kbd>
            <span style={{ fontFamily:SANS, fontSize:"0.62rem", color:MID }}>to browse all <strong style={{ color:GOLD }}>{CATS.find(c=>c.id===matchedCat)?.name}</strong></span>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="max-w-3xl mx-auto px-5 py-6">
          {q.length < 2 && (
            <p style={{ fontFamily:BODY, fontSize:"0.88rem", color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:40 }}>
              Start typing to search all furniture...
            </p>
          )}
          {q.length >= 2 && results.length === 0 && (
            <p style={{ fontFamily:BODY, fontSize:"0.88rem", color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:40 }}>
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
          {results.length > 0 && (
            <>
              <p style={{ fontFamily:SANS, fontSize:"0.62rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:16 }}>
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:12 }}>
                {results.map((p)=>(
                  <div key={p.id} onClick={()=>{ onView(p); onClose(); }}
                    className="cursor-pointer overflow-hidden rounded-xl bg-white"
                    style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.15)" }}>
                    <div style={{ aspectRatio:"4/3", overflow:"hidden", background:CHARCOAL }}>
                      <img src={img(p.pid,300,225)} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div style={{ padding:"8px 10px 10px" }}>
                      <span style={{ display:"inline-block", fontFamily:SANS, fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase", color:GOLD, fontWeight:600, marginBottom:3 }}>
                        {p.catId.replace("-"," ")}
                      </span>
                      <p style={{ fontFamily:DISPLAY, fontSize:"0.85rem", fontWeight:600, color:CHARCOAL, lineHeight:1.3, marginBottom:2 }}>{p.name}</p>
                      <p style={{ fontFamily:SANS, fontSize:"0.72rem", color:GOLD, fontWeight:600 }}>{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
