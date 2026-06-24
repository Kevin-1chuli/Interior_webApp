import type { CatId, Prod } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// ─── Data ─────────────────────────────────────────────────────────────────────
export const CATS: { id:CatId; label:string; name:string; pid:string }[] = [
  { id:"beds",          label:"Beds",          name:"Beds",          pid:"1696762932825-2737db830bbe" },
  { id:"sofas",         label:"Sofas",         name:"Sofas",         pid:"1592401526914-7e5d94a8d6fa" },
  { id:"wardrobes",     label:"Wardrobes",     name:"Wardrobes",     pid:"1751806524616-47dd4fabd68d" },
  { id:"tv-units",      label:"TV Units",      name:"TV Units",      pid:"1688647063090-36f36f692d95" },
  { id:"dining",        label:"Dining",        name:"Dining Tables", pid:"1706820229870-f9a8c6dac193" },
  { id:"coffee-tables", label:"Coffee Tables", name:"Coffee Tables", pid:"1699901524281-423398392936" },
];

export const PRODS: Record<CatId, Prod[]> = {
  beds: [
    { id:1,  name:"Lagos King Bed",        price:"UGX 2,400,000", desc:"Solid mahogany frame with upholstered headboard",         pid:"1696762932825-2737db830bbe", rating:4.8 },
    { id:2,  name:"Serene Platform Bed",   price:"UGX 1,800,000", desc:"Low-profile platform design in African teak",              pid:"1632829401795-2745c905ac77", rating:4.6 },
    { id:3,  name:"Kampala Classic Bed",   price:"UGX 2,100,000", desc:"Hand-carved wooden posts with linen upholstery",          pid:"1720420021124-4e18564e070f", rating:4.7 },
    { id:4,  name:"Signature Sleigh Bed",  price:"UGX 3,200,000", desc:"Sweeping sleigh design in premium hardwood",              pid:"1600210491305-7396500b5b31", rating:4.9 },
    { id:25, name:"Royale Canopy Bed",     price:"UGX 4,800,000", desc:"Four-post canopy in solid African blackwood",             pid:"1633809365429-2fa048a02119", rating:4.9 },
    { id:26, name:"Nordic Low Bed",        price:"UGX 1,600,000", desc:"Scandinavian-inspired low-profile with oak slats",        pid:"1750420556288-d0e32a6f517b", rating:4.5 },
    { id:27, name:"Grand Upholstered Bed", price:"UGX 2,900,000", desc:"Fully upholstered frame in luxury fabric blend",          pid:"1648881806148-e5c51179c826", rating:4.7 },
    { id:28, name:"Heritage Brass Bed",    price:"UGX 3,500,000", desc:"Hand-forged brass frame with padded headboard",           pid:"1646987916641-1f3c8992daa2", rating:4.8 },
  ],
  sofas: [
    { id:5,  name:"Meridian 3-Seater",       price:"UGX 3,800,000", desc:"Deep-cushioned sofa in premium fabric blend",          pid:"1592401526914-7e5d94a8d6fa", rating:4.8 },
    { id:6,  name:"Comfort Cloud L-Shape",   price:"UGX 5,200,000", desc:"Expansive corner sofa with chaise extension",          pid:"1669387448840-610c588f003d", rating:4.7 },
    { id:7,  name:"Heritage Chesterfield",   price:"UGX 4,500,000", desc:"Button-tufted leather Chesterfield, handmade",         pid:"1616137422495-1e9e46e2aa77", rating:4.9 },
    { id:8,  name:"Studio 2-Seater",         price:"UGX 2,600,000", desc:"Compact loveseat with polished hardwood legs",         pid:"1757924461488-ef9ad0670978", rating:4.5 },
    { id:29, name:"Velvet Accent Sofa",      price:"UGX 4,100,000", desc:"Rich velvet upholstery on a chrome base frame",        pid:"1738168251394-9241984c8292", rating:4.8 },
    { id:30, name:"Comfort Plus Sectional",  price:"UGX 6,800,000", desc:"Modular sectional with adjustable armrests",           pid:"1680503397667-3877494708a1", rating:4.7 },
    { id:31, name:"Artisan Loveseat",        price:"UGX 2,200,000", desc:"Hand-stitched leather loveseat, aged brass feet",      pid:"1699901524281-423398392936", rating:4.6 },
    { id:32, name:"Contemporary 4-Seater",   price:"UGX 5,600,000", desc:"Clean-line sofa in performance linen blend",           pid:"1598928506311-c55ded91a20c", rating:4.7 },
  ],
  wardrobes: [
    { id:9,  name:"Prestige Sliding Wardrobe", price:"UGX 4,200,000", desc:"Floor-to-ceiling sliding doors with mirror panels",  pid:"1593069431672-f903a33c286f", rating:4.7 },
    { id:10, name:"Colonial Armoire",          price:"UGX 3,600,000", desc:"Double-door wardrobe in aged mahogany",              pid:"1737898422812-54c83e3811ff", rating:4.8 },
    { id:11, name:"Walk-in Wardrobe Unit",     price:"UGX 6,800,000", desc:"Custom modular shelving and hanging system",         pid:"1751806524616-47dd4fabd68d", rating:4.9 },
    { id:12, name:"Minimalist 4-Door",         price:"UGX 3,100,000", desc:"Clean-line design with soft-close hinges",           pid:"1648881806148-e5c51179c826", rating:4.6 },
    { id:33, name:"Heritage Armoire",          price:"UGX 4,500,000", desc:"Ornately carved solid wood armoire with brass pulls", pid:"1696762932825-2737db830bbe", rating:4.8 },
    { id:34, name:"Glass-Door Wardrobe",       price:"UGX 3,900,000", desc:"Frosted glass panels with interior lighting",        pid:"1632829401795-2745c905ac77", rating:4.6 },
    { id:35, name:"Corner Wardrobe",           price:"UGX 2,800,000", desc:"Space-optimising corner unit with full-length mirror",pid:"1646987916641-1f3c8992daa2", rating:4.5 },
    { id:36, name:"Executive Wardrobe",        price:"UGX 5,400,000", desc:"Built-in lighting, tie rack and velvet-lined drawers",pid:"1688647063090-36f36f692d95", rating:4.9 },
  ],
  "tv-units": [
    { id:13, name:"Floating Media Console",    price:"UGX 1,600,000", desc:"Wall-mounted unit with integrated cable management",  pid:"1688647063090-36f36f692d95", rating:4.7 },
    { id:14, name:"Kampala Entertainment Unit",price:"UGX 2,200,000", desc:"Full-width TV stand with open and closed storage",    pid:"1669387448840-610c588f003d", rating:4.6 },
    { id:15, name:"Corner TV Stand",           price:"UGX 1,400,000", desc:"Space-saving corner design with two shelves",         pid:"1592401526914-7e5d94a8d6fa", rating:4.5 },
    { id:16, name:"Ebony Media Unit",          price:"UGX 2,900,000", desc:"Dark-finish unit with brushed gold hardware",         pid:"1547062200-f195b1c77e30",   rating:4.8 },
    { id:37, name:"Oak Media Console",         price:"UGX 2,400,000", desc:"Solid white oak with hairpin steel legs",             pid:"1757924461488-ef9ad0670978", rating:4.7 },
    { id:38, name:"Minimalist TV Stand",       price:"UGX 1,800,000", desc:"Low-profile design with hidden cable trays",          pid:"1616137422495-1e9e46e2aa77", rating:4.6 },
    { id:39, name:"Rustic Media Unit",         price:"UGX 2,100,000", desc:"Reclaimed wood finish with open shelving",            pid:"1646987916641-1f3c8992daa2", rating:4.5 },
    { id:40, name:"Luxe Wall Unit",            price:"UGX 3,800,000", desc:"Floor-to-ceiling shelving with integrated TV panel",  pid:"1648881806148-e5c51179c826", rating:4.9 },
  ],
  dining: [
    { id:17, name:"Acacia 6-Seater",         price:"UGX 3,200,000", desc:"Live-edge acacia slab on steel hairpin legs",           pid:"1706820229870-f9a8c6dac193", rating:4.9 },
    { id:18, name:"Round Pedestal Table",    price:"UGX 2,400,000", desc:"Marble-top dining table with turned wooden base",        pid:"1681338764024-e6977bfd18db", rating:4.7 },
    { id:19, name:"Farmhouse Dining Set",    price:"UGX 4,100,000", desc:"Solid pine table with six matching chairs",              pid:"1758977404372-3b4b8adf7f7d", rating:4.8 },
    { id:20, name:"Glass-Top Table",         price:"UGX 2,800,000", desc:"Tempered glass top with polished chrome base",           pid:"1636138388621-258a72ecb07e", rating:4.5 },
    { id:41, name:"Marble Dining Table",     price:"UGX 5,200,000", desc:"Carrara marble top on blackened steel trestle",          pid:"1547062200-f195b1c77e30",   rating:4.8 },
    { id:42, name:"Live-Edge Round Table",   price:"UGX 3,600,000", desc:"Natural edge acacia round, seats up to 6",               pid:"1646987916641-1f3c8992daa2", rating:4.7 },
    { id:43, name:"Industrial Dining Set",   price:"UGX 3,000,000", desc:"Solid mango wood with matte black metal frame",          pid:"1680503397667-3877494708a1", rating:4.6 },
    { id:44, name:"Scandinavian Dining Set", price:"UGX 2,600,000", desc:"Clean-line beech wood, mid-century leg profile",         pid:"1616137422495-1e9e46e2aa77", rating:4.6 },
  ],
  "coffee-tables": [
    { id:21, name:"Nesting Coffee Tables",   price:"UGX 980,000",   desc:"Set of two nesting tables in walnut veneer",             pid:"1738168251394-9241984c8292", rating:4.6 },
    { id:22, name:"Travertine Coffee Table", price:"UGX 1,800,000", desc:"Natural travertine stone top on a brass frame",           pid:"1699901524281-423398392936", rating:4.8 },
    { id:23, name:"Oval Rattan Table",       price:"UGX 1,200,000", desc:"Hand-woven rattan with glass top insert",                 pid:"1636138388621-258a72ecb07e", rating:4.7 },
    { id:24, name:"Industrial Trunk Table",  price:"UGX 1,500,000", desc:"Reclaimed wood storage trunk with metal corners",         pid:"1688647063090-36f36f692d95", rating:4.5 },
    { id:45, name:"Marble Round Table",      price:"UGX 2,200,000", desc:"White marble disc on slim brass tripod legs",             pid:"1592401526914-7e5d94a8d6fa", rating:4.8 },
    { id:46, name:"Acacia Slab Table",       price:"UGX 1,650,000", desc:"Solid acacia slab with natural bark edge",               pid:"1757924461488-ef9ad0670978", rating:4.7 },
    { id:47, name:"Glass Coffee Table",      price:"UGX 1,400,000", desc:"Tempered glass oval on sculpted chrome frame",            pid:"1616137422495-1e9e46e2aa77", rating:4.5 },
    { id:48, name:"Brass & Marble Table",    price:"UGX 2,400,000", desc:"Round marble top on a hand-polished brass column",       pid:"1669387448840-610c588f003d", rating:4.9 },
  ],
};

export const SPACES = [
  { name:"Living Room",    tag:"Kololo, Kampala",    pid:"1598928506311-c55ded91a20c", span:"large" },
  { name:"Master Bedroom", tag:"Muyenga, Kampala",   pid:"1750420556288-d0e32a6f517b", span:"small" },
  { name:"Dining Room",    tag:"Bukoto, Kampala",    pid:"1706820229870-f9a8c6dac193", span:"small" },
  { name:"Home Office",    tag:"Naguru, Kampala",    pid:"1688647063090-36f36f692d95", span:"wide"  },
];

export const HERO_SLIDES = [
  { pid:"1444419988131-046ed4e5ffd6", label:"Before", project:"Kololo Residence",    phase:"Empty shell" },
  { pid:"1598928506311-c55ded91a20c", label:"After",  project:"Kololo Residence",    phase:"Complete transformation" },
  { pid:"1613668816690-546c6fa9ad42", label:"Before", project:"Muyenga Penthouse",   phase:"Unfurnished space" },
  { pid:"1648881806148-e5c51179c826", label:"After",  project:"Muyenga Penthouse",   phase:"NGB Interior finish" },
];

export const SVC_CARDS = [
  { title:"Furniture",        sub:"Handcrafted for your space",     pid:"1646987916641-1f3c8992daa2", nav:"furniture" },
  { title:"Interior Design",  sub:"Complete room transformations",  pid:"1648881806148-e5c51179c826", nav:"contact" },
  { title:"Custom Pieces",    sub:"Built to your exact vision",     pid:"1547609434-b732edfee020",   nav:"contact" },
  { title:"Projects",         sub:"Start to installation",          pid:"1608303588026-884930af2559", nav:"contact" },
];

export const JOURNEY = [
  { n:"01", title:"Consultation",   desc:"We understand your vision, lifestyle, and budget through a deep listening session.",                    pid:"1608303588026-884930af2559" },
  { n:"02", title:"Design Concept", desc:"Mood boards, floor plans and 3D renders so you see the transformation before anything is built.",      pid:"1557243962-0a093922933f"   },
  { n:"03", title:"Production",     desc:"Skilled craftsmen in our Kampala workshop build every piece using premium hardwoods.",                  pid:"1547609434-b732edfee020"   },
  { n:"04", title:"Installation",   desc:"Our team delivers, installs and walks you through every element—with full after-care support.",         pid:"1598928506311-c55ded91a20c"},
];

export const STATS = [
  { n:"200+", label:"Projects Completed" },
  { n:"100%", label:"Custom Crafted"     },
  { n:"5 yr",  label:"Quality Guarantee" },
  { n:"98%",  label:"Client Satisfaction"},
];

// ─── Materials per product (by ID) ───────────────────────────────────────────
export const MATERIALS: Record<number, string[]> = {
  1:["Solid Mahogany","Memory Foam","Belgian Linen","Steel Slats"],
  2:["African Teak","Natural Latex","Cotton Linen","Pine Slats"],
  3:["Kiln-dried Hardwood","HR Foam","Linen Upholstery","Oak Feet"],
  4:["Premium Hardwood","Pocket Spring","Velvet Headboard","Steel Frame"],
  25:["Solid Blackwood","Luxury Foam","Silk Upholstery","Brass Accents"],
  26:["Scandinavian Oak","Open-cell Foam","Woven Cotton","Pine Slats"],
  27:["Hardwood Frame","Pillow-top Foam","Luxury Fabric","Oak Legs"],
  28:["Hand-forged Brass","Orthopedic Foam","Padded Linen","Solid Timber"],
  5:["Kiln-dried Hardwood","Sinuous Springs","Premium Woven Fabric","Oak Legs"],
  6:["Solid Timber Frame","Foam & Fibre Fill","Performance Linen","Chrome Feet"],
  7:["Beech Wood Frame","Hand-tied Springs","Top-grain Leather","Brass Nails"],
  8:["Solid Pine Frame","HR Foam","Cotton-blend Fabric","Turned Wood Legs"],
  29:["Walnut Frame","Memory Foam Cushions","Rich Velvet","Chrome Base"],
  30:["Engineered Hardwood","Sectional Springs","Performance Fabric","Metal Connectors"],
  31:["Hand-stitched Frame","Goose Down Mix","Full-grain Leather","Brass Feet"],
  32:["Solid Beech","Cold-cure Foam","Clean-weave Linen","Tapered Legs"],
  9:["18mm MDF","Mirror Glass","Soft-close System","Aluminium Track"],
  10:["Solid Mahogany","Dovetail Joints","Brass Handles","Cedar Lining"],
  11:["Birch Plywood","Melamine Shelves","Steel Rail","LED Lighting"],
  12:["HMR MDF","Lacquered Finish","Hydraulic Hinges","Chrome Handles"],
  33:["Solid Hardwood","Hand-carved Details","Antique Brass","Felt Drawers"],
  34:["MDF Carcass","Frosted Glass Panels","Touch-open System","Interior LED"],
  35:["Melamine Board","Adjustable Shelves","Full-length Mirror","Soft-close Hinges"],
  36:["Premium MDF","Glass-insert Doors","Velvet Drawer Lining","Gold Hardware"],
  13:["Birch Plywood","Cable Management","Push-open Doors","Wall-mount Bracket"],
  14:["Solid Acacia","Open Shelves","Soft-close Drawers","Anti-tip Strap"],
  15:["MDF + Veneer","Tempered Glass Shelf","Adjustable Legs","Cable Port"],
  16:["Solid Ebony","Brass Handles","Felt Drawers","Solid Oak Top"],
  37:["White Oak Solid","Steel Hairpin Legs","Open Shelf","Wax Finish"],
  38:["Lacquered MDF","Concealed Hinges","Cord Management","Gloss Finish"],
  39:["Reclaimed Pine","Iron Hardware","Open Cubbies","Natural Oil"],
  40:["Premium MDF","Full-height Frame","Integrated TV Panel","LED Backlight"],
  17:["Live-edge Acacia","Steel Hairpin Legs","Food-safe Oil","Anti-warp Bracing"],
  18:["Carrara Marble","Solid Walnut Base","Stainless Bolts","Felt Pads"],
  19:["Solid Pine","Pine Chair Frames","Padded Seat Cushions","Wax Finish"],
  20:["10mm Tempered Glass","Chrome Steel Base","Rubber-tip Feet","UV-resistant"],
  41:["White Carrara Marble","Blackened Steel","Non-slip Feet","Sealed Stone"],
  42:["Natural Acacia Edge","Solid Teak Base","Food-grade Lacquer","Steel Bolts"],
  43:["Solid Mango Wood","Matte Black Metal","Mortise-tenon Joints","Wax-oil"],
  44:["Solid Beech","Tapered Legs","Machine Sanded","Natural Oil"],
  21:["Walnut Veneer","Lacquered MDF","Nesting Mechanism","Felt Pads"],
  22:["Natural Travertine","Hand-polished Brass","Non-slip Pads","Sealed Stone"],
  23:["Woven Rattan","Tempered Glass Insert","Lacquered Steel","Rubber Tips"],
  24:["Reclaimed Timber","Steel Brackets","Hinged Lid","Wax Polish"],
  45:["White Marble Disc","Solid Brass Tripod","Non-slip Feet","Sealed Marble"],
  46:["Solid Acacia Slab","Natural Bark Edge","Teak Oil Finish","Steel Pin Legs"],
  47:["Tempered Oval Glass","Chrome Steel Frame","Rubber-tipped Feet","Polished Glass"],
  48:["Round Marble Top","Hand-polished Brass Column","Weighted Base","Sealed Marble"],
};

// Flat search helper — returns all products with their category
export function getAllProds(): (Prod & { catId:CatId })[] {
  return (Object.keys(PRODS) as CatId[]).flatMap(catId=>PRODS[catId].map(p=>({ ...p, catId })));
}

// ─── NGBLogo — matches actual brand mark exactly ─────────────────────────────
// Two overlapping rectangular frames where the fill of each rect masks the
// other's stroke in the overlap zone, producing the signature staircase mark.
// Proportions measured from the official logo: offset ≈ 24% of rect width.

