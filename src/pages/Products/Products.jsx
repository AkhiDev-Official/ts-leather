import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Products.css';

const _BASE = [
  // ── Winter ──
  { id: 1,  name: 'The Aviator Jacket',      cat: 'men',       season: 'winter', leather: 'calfskin',  price: 1250, material: 'Burnished Calfskin',    img: '/assets/jacket.jpg' },
  { id: 9,  name: 'The Kids Bomber',          cat: 'kids',      season: 'winter', leather: 'lambskin',  price: 420,  material: 'Soft Lambskin',          img: '/assets/jacket.jpg' },
  { id: 12, name: 'The Heritage Duffle',       cat: 'men',       season: 'winter', leather: 'steerhide', price: 1100, material: 'Steerhide Leather',      img: '/assets/winter.jpg' },
  { id: 17, name: 'The Zip-Around Wallet',     cat: 'wallets',   season: 'winter', leather: 'calfskin',  price: 210,  material: 'Burnished Calfskin',     img: '/assets/wallet.png' },
  { id: 19, name: 'The Shearling Coat',        cat: 'women',     season: 'winter', leather: 'lambskin',  price: 1890, material: 'Shearling Lambskin',     img: '/assets/winter.jpg' },
  { id: 20, name: 'The Alpine Gloves',         cat: 'men',       season: 'winter', leather: 'nappa',     price: 195,  material: 'Cashmere-Lined Nappa',   img: '/assets/winter.jpg' },
  { id: 21, name: 'The Kids Snow Mittens',     cat: 'kids',      season: 'winter', leather: 'lambskin',  price: 85,   material: 'Soft Lambskin',          img: '/assets/winter.jpg' },
  // ── Spring ──
  { id: 2,  name: 'The Minimalist Bifold',    cat: 'wallets',   season: 'spring', leather: 'nappa',     price: 180,  material: 'Full Grain Nappa',       img: '/assets/wallet.png' },
  { id: 4,  name: 'The Spring Tote',           cat: 'women',     season: 'spring', leather: 'nappa',     price: 620,  material: 'Soft Nappa Leather',     img: '/assets/spring.jpg' },
  { id: 11, name: 'The Cardholder Slim',       cat: 'wallets',   season: 'spring', leather: 'nappa',     price: 95,   material: 'Full Grain Nappa',       img: '/assets/wallet.png' },
  { id: 13, name: 'The Bespoke Messenger',     cat: 'customize', season: 'spring', leather: 'calfskin',  price: 980,  material: 'Custom Calfskin',        img: '/assets/custom.jpg' },
  { id: 18, name: 'The Kids Crossbody',        cat: 'kids',      season: 'spring', leather: 'suede',     price: 145,  material: 'Italian Suede',          img: '/assets/spring.jpg' },
  { id: 22, name: 'The Pastel Satchel',        cat: 'women',     season: 'spring', leather: 'nappa',     price: 540,  material: 'Soft Nappa Leather',     img: '/assets/spring.jpg' },
  { id: 23, name: 'The Linen-Trim Blazer',     cat: 'men',       season: 'spring', leather: 'calfskin',  price: 890,  material: 'Burnished Calfskin',     img: '/assets/jacket.jpg' },
  // ── Summer ──
  { id: 6,  name: 'The Summer Gloves',        cat: 'men',       season: 'summer', leather: 'lambskin',  price: 220,  material: 'Perforated Lambskin',    img: '/assets/summer.jpg' },
  { id: 10, name: 'The Suede Weekender',       cat: 'women',     season: 'summer', leather: 'suede',     price: 750,  material: 'Italian Suede',          img: '/assets/summer.jpg' },
  { id: 14, name: 'The Kids Travel Wallet',    cat: 'kids',      season: 'summer', leather: 'nappa',     price: 75,   material: 'Soft Nappa',             img: '/assets/wallet.png' },
  { id: 24, name: 'The Riviera Belt',          cat: 'men',       season: 'summer', leather: 'calfskin',  price: 175,  material: 'Burnished Calfskin',     img: '/assets/summer.jpg' },
  { id: 25, name: 'The Beach Clutch',          cat: 'women',     season: 'summer', leather: 'suede',     price: 320,  material: 'Italian Suede',          img: '/assets/summer.jpg' },
  { id: 26, name: 'The Ventilated Racer',      cat: 'men',       season: 'summer', leather: 'lambskin',  price: 980,  material: 'Perforated Lambskin',    img: '/assets/jacket.jpg' },
  // ── Autumn ──
  { id: 3,  name: 'The Moto Heritage',        cat: 'men',       season: 'autumn', leather: 'steerhide', price: 950,  material: 'Steerhide Leather',      img: '/assets/jacket.jpg' },
  { id: 5,  name: 'The Classic Zip Wallet',    cat: 'wallets',   season: 'autumn', leather: 'calfskin',  price: 145,  material: 'Burnished Calfskin',     img: '/assets/wallet.png' },
  { id: 7,  name: 'The Explorer Backpack',     cat: 'men',       season: 'autumn', leather: 'steerhide', price: 890,  material: 'Rugged Steerhide',       img: '/assets/fall.jpg' },
  { id: 8,  name: 'The Cognac Belt',           cat: 'men',       season: 'autumn', leather: 'calfskin',  price: 165,  material: 'Burnished Calfskin',     img: '/assets/fall.jpg' },
  { id: 15, name: 'The Monogram Clutch',       cat: 'customize', season: 'autumn', leather: 'lambskin',  price: 540,  material: 'Custom Lambskin',        img: '/assets/custom.jpg' },
  { id: 16, name: 'The Riding Jacket',         cat: 'women',     season: 'autumn', leather: 'steerhide', price: 1180, material: 'Steerhide Leather',      img: '/assets/jacket.jpg' },
  { id: 27, name: 'The Harvest Saddlebag',     cat: 'women',     season: 'autumn', leather: 'calfskin',  price: 680,  material: 'Burnished Calfskin',     img: '/assets/fall.jpg' },
];

const SZ_JACKET = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SZ_KIDS = ['4Y', '6Y', '8Y', '10Y', '12Y'];
const SZ_ONE = ['One Size'];
const SZ_GLOVE = ['S', 'M', 'L'];
const SZ_BELT = ['80cm', '85cm', '90cm', '95cm', '100cm', '105cm'];
const CARE_OUT = 'Professional leather cleaning recommended. Condition with leather balm every 3–6 months. Store on a padded hanger in a breathable garment bag away from direct sunlight.';
const CARE_ACC = 'Wipe clean with a soft, dry cloth. Apply leather conditioner seasonally. Avoid prolonged moisture exposure. Store in the provided dust bag.';
const CARE_SDE = 'Brush regularly with a suede brush to restore nap. Use a protective spray before first wear. Clean spots immediately with a damp cloth. Avoid water exposure.';

const _ENRICH = {
  1:  { slug: 'the-aviator-jacket', originalPrice: 1470, discount: 15, color: 'Cognac', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/jacket_main_full.jpg', '/assets/leather.jpg'], shortDesc: 'Iconic aviator silhouette in premium burnished calfskin with shearling collar.', description: 'Our signature aviator jacket combines timeless military-inspired design with the finest Italian calfskin leather. Features a genuine shearling collar, heavy-duty YKK zippers, and a satin-lined interior. Hand-finished by our master artisans.', colors: ['Cognac', 'Black', 'Dark Brown'], sizes: SZ_JACKET, stock: 18, rating: 4.8, reviewCount: 124, soldCount: 342, isFeatured: true, isCustomizable: false, careInstructions: CARE_OUT },
  9:  { slug: 'the-kids-bomber', originalPrice: 560, discount: 25, color: 'Camel', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/leather.jpg'], shortDesc: 'Junior bomber in buttery-soft lambskin with quilted lining.', description: 'Designed for the next generation of leather aficionados. Ultra-soft lambskin with a ribbed collar and cuffs, quilted lining for warmth, and interior pockets. Built to withstand any adventure.', colors: ['Camel', 'Black', 'Navy'], sizes: SZ_KIDS, stock: 22, rating: 4.3, reviewCount: 19, soldCount: 45, isFeatured: false, isCustomizable: false, careInstructions: CARE_OUT },
  12: { slug: 'the-heritage-duffle', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/winter.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg', '/assets/custom.jpg'], shortDesc: 'Oversized steerhide duffle built for weekends away.', description: 'Spacious steerhide duffle with solid brass hardware, waxed canvas lining, and a detachable padded shoulder strap. An heirloom-quality travel companion.', colors: ['Cognac', 'Dark Brown', 'Black'], sizes: SZ_ONE, stock: 9, rating: 4.5, reviewCount: 41, soldCount: 112, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  17: { slug: 'the-zip-around-wallet', originalPrice: 263, discount: 20, color: 'Black', images: ['/assets/wallet.png', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Full zip-around wallet in polished calfskin.', description: '12 card slots, 2 bill compartments, and a zip coin pocket. Features branded hardware, hand-painted edges, and RFID blocking technology.', colors: ['Black', 'Cognac', 'Burgundy'], sizes: SZ_ONE, stock: 33, rating: 4.4, reviewCount: 38, soldCount: 89, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  19: { slug: 'the-shearling-coat', originalPrice: null, discount: 0, color: 'Ivory', images: ['/assets/winter.jpg', '/assets/jacket_main.jpg', '/assets/leather.jpg', '/assets/jacket_main_full.jpg'], shortDesc: 'Full-length shearling coat in premium lambskin.', description: 'Luxurious shearling lambskin with oversized lapels, deep patch pockets, and tortoiseshell button closure. The ultimate winter statement piece.', colors: ['Ivory', 'Cognac', 'Charcoal'], sizes: SZ_JACKET, stock: 5, rating: 4.9, reviewCount: 112, soldCount: 312, isFeatured: true, isCustomizable: false, careInstructions: CARE_OUT },
  20: { slug: 'the-alpine-gloves', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/winter.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Cashmere-lined nappa gloves for extreme warmth.', description: 'Italian nappa exterior with pure cashmere lining. Touchscreen-compatible fingertips, snap closure at the wrist, and hand-stitched seams.', colors: ['Black', 'Dark Brown', 'Cognac'], sizes: SZ_GLOVE, stock: 24, rating: 4.5, reviewCount: 56, soldCount: 145, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  21: { slug: 'the-kids-snow-mittens', originalPrice: null, discount: 0, color: 'Camel', images: ['/assets/winter.jpg', '/assets/leather.jpg'], shortDesc: 'Cozy lambskin mittens for little hands.', description: 'Ultra-soft lambskin exterior with fleece lining and elastic wrist closure. Includes a clip attachment loop so they never get lost.', colors: ['Camel', 'Black', 'Red'], sizes: SZ_GLOVE, stock: 0, rating: 4.2, reviewCount: 8, soldCount: 67, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  2:  { slug: 'the-minimalist-bifold', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/wallet.png', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Slim bifold wallet in full grain nappa with RFID protection.', description: 'Minimalist 6-card bifold with RFID blocking. Full grain nappa with hand-painted edges and an embossed TS monogram. Slim enough for any pocket.', colors: ['Black', 'Tan', 'Cognac'], sizes: SZ_ONE, stock: 45, rating: 4.5, reviewCount: 67, soldCount: 156, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  4:  { slug: 'the-spring-tote', originalPrice: null, discount: 0, color: 'Ivory', images: ['/assets/spring.jpg', '/assets/leather.jpg', '/assets/custom.jpg', '/assets/leather_full.jpg'], shortDesc: 'Structured nappa tote with suede-lined interior.', description: 'A refined everyday tote in supple nappa leather. Interior suede lining, magnetic snap closure, zip pocket, and phone sleeve. Perfectly proportioned for work and weekend.', colors: ['Ivory', 'Tan', 'Blush'], sizes: SZ_ONE, stock: 28, rating: 4.3, reviewCount: 34, soldCount: 98, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  11: { slug: 'the-cardholder-slim', originalPrice: 112, discount: 15, color: 'Black', images: ['/assets/wallet.png', '/assets/leather.jpg'], shortDesc: 'Ultra-slim cardholder in full grain nappa.', description: '4-card capacity with center cash slot. Machine-stitched edges, debossed TS monogram, and a microfiber-lined interior.', colors: ['Black', 'Cognac', 'Olive'], sizes: SZ_ONE, stock: 38, rating: 4.4, reviewCount: 92, soldCount: 234, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  13: { slug: 'the-bespoke-messenger', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/custom.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg', '/assets/spring.jpg'], shortDesc: 'Fully customizable messenger in premium calfskin.', description: 'Choose your calfskin color, hardware finish, strap style, and add a personal monogram. Hand-assembled to your exact specifications by our master artisans.', colors: ['Cognac', 'Black', 'Dark Brown', 'Burgundy'], sizes: SZ_ONE, stock: 6, rating: 4.8, reviewCount: 63, soldCount: 178, isFeatured: true, isCustomizable: true, careInstructions: CARE_ACC },
  18: { slug: 'the-kids-crossbody', originalPrice: null, discount: 0, color: 'Sand', images: ['/assets/spring.jpg', '/assets/leather.jpg', '/assets/custom.jpg'], shortDesc: 'Playful crossbody bag in Italian suede.', description: 'Lightweight suede crossbody sized for kids. Adjustable strap, magnetic flap closure, and a front zip pocket for treasures.', colors: ['Sand', 'Olive', 'Camel'], sizes: SZ_ONE, stock: 19, rating: 4.0, reviewCount: 15, soldCount: 37, isFeatured: false, isCustomizable: false, careInstructions: CARE_SDE },
  22: { slug: 'the-pastel-satchel', originalPrice: 600, discount: 10, color: 'Blush', images: ['/assets/spring.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg', '/assets/custom.jpg'], shortDesc: 'Soft-structured satchel in pastel nappa tones.', description: 'Spring-ready satchel with top handle and detachable crossbody strap. Alcantara lining, gold-tone hardware, and three interior compartments.', colors: ['Blush', 'Ivory', 'Lavender'], sizes: SZ_ONE, stock: 4, rating: 4.1, reviewCount: 22, soldCount: 56, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  23: { slug: 'the-linen-trim-blazer', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/leather.jpg', '/assets/spring.jpg'], shortDesc: 'Tailored calfskin blazer with linen trim details.', description: 'A refined leather blazer with natural linen accents on collar and pocket edges. Half-lined for breathability. Smart casual perfection.', colors: ['Cognac', 'Tan', 'Charcoal'], sizes: SZ_JACKET, stock: 16, rating: 4.4, reviewCount: 31, soldCount: 78, isFeatured: false, isCustomizable: false, careInstructions: CARE_OUT },
  6:  { slug: 'the-summer-gloves', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/summer.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Perforated lambskin driving gloves for warm weather.', description: 'Classic driving gloves in breathable perforated lambskin. Snap closure at the wrist, knuckle vents, and a silk-blend lining.', colors: ['Black', 'Tan', 'Cognac'], sizes: SZ_GLOVE, stock: 15, rating: 4.4, reviewCount: 28, soldCount: 73, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  10: { slug: 'the-suede-weekender', originalPrice: null, discount: 0, color: 'Sand', images: ['/assets/summer.jpg', '/assets/leather.jpg', '/assets/custom.jpg', '/assets/leather_full.jpg'], shortDesc: 'Spacious Italian suede weekender for getaways.', description: 'Generous overnight bag in premium Italian suede. Rolled leather handles, detachable shoulder strap, cotton canvas lining with multiple pockets.', colors: ['Sand', 'Olive', 'Cognac'], sizes: SZ_ONE, stock: 14, rating: 4.6, reviewCount: 78, soldCount: 198, isFeatured: false, isCustomizable: false, careInstructions: CARE_SDE },
  14: { slug: 'the-kids-travel-wallet', originalPrice: null, discount: 0, color: 'Camel', images: ['/assets/wallet.png', '/assets/leather.jpg', '/assets/summer.jpg'], shortDesc: 'Compact travel wallet for young explorers.', description: 'A fun, durable nappa wallet with 3 card slots, ID window, and coin zip. Designed to survive the rigors of childhood adventures.', colors: ['Camel', 'Navy', 'Red'], sizes: SZ_ONE, stock: 2, rating: 3.9, reviewCount: 12, soldCount: 28, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  24: { slug: 'the-riviera-belt', originalPrice: 206, discount: 15, color: 'Tan', images: ['/assets/summer.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Sleek calfskin belt with brushed silver buckle.', description: 'A refined summer belt in burnished calfskin with a slim brushed-silver buckle. Hand-painted edges and tonal stitching throughout.', colors: ['Tan', 'Cognac', 'Black'], sizes: SZ_BELT, stock: 29, rating: 4.3, reviewCount: 47, soldCount: 167, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  25: { slug: 'the-beach-clutch', originalPrice: 400, discount: 20, color: 'Sand', images: ['/assets/summer.jpg', '/assets/leather.jpg', '/assets/custom.jpg'], shortDesc: 'Relaxed suede clutch with woven leather accent.', description: 'An effortless summer clutch in washed Italian suede. Woven leather accent panel, cotton lining, and magnetic snap closure.', colors: ['Sand', 'Coral', 'Olive'], sizes: SZ_ONE, stock: 21, rating: 4.5, reviewCount: 36, soldCount: 93, isFeatured: false, isCustomizable: false, careInstructions: CARE_SDE },
  26: { slug: 'the-ventilated-racer', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/summer.jpg', '/assets/leather.jpg'], shortDesc: 'Perforated lambskin racer jacket for warm rides.', description: 'A warm-weather racer jacket with strategically placed perforations for airflow. Snap collar, ribbed waistband, and two interior pockets.', colors: ['Black', 'Cognac', 'Dark Brown'], sizes: SZ_JACKET, stock: 10, rating: 4.7, reviewCount: 74, soldCount: 201, isFeatured: false, isCustomizable: false, careInstructions: CARE_OUT },
  3:  { slug: 'the-moto-heritage', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/jacket_main_full.jpg', '/assets/fall.jpg'], shortDesc: 'Classic moto jacket in heavy-grade steerhide.', description: 'The definitive motorcycle jacket. Heavyweight steerhide with asymmetric zip, quilted shoulder panels, and D-ring waist buckles. Develops a stunning patina with wear.', colors: ['Black', 'Cognac', 'Dark Brown'], sizes: SZ_JACKET, stock: 12, rating: 4.7, reviewCount: 89, soldCount: 287, isFeatured: true, isCustomizable: false, careInstructions: CARE_OUT },
  5:  { slug: 'the-classic-zip-wallet', originalPrice: 161, discount: 10, color: 'Cognac', images: ['/assets/wallet.png', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Timeless zip wallet in burnished calfskin.', description: 'Our best-selling zip wallet with 8 card slots, 2 note compartments, and a zip coin pocket. Edge-painted and hand-stitched for lasting durability.', colors: ['Cognac', 'Black', 'Burgundy'], sizes: SZ_ONE, stock: 52, rating: 4.6, reviewCount: 156, soldCount: 412, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  7:  { slug: 'the-explorer-backpack', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/fall.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg', '/assets/custom.jpg'], shortDesc: 'Rugged steerhide backpack built for daily use.', description: 'Heritage-inspired backpack in thick steerhide with brass roller buckles, padded laptop sleeve, and drawstring top closure. Ages magnificently over years of use.', colors: ['Cognac', 'Dark Brown', 'Olive'], sizes: SZ_ONE, stock: 8, rating: 4.9, reviewCount: 203, soldCount: 567, isFeatured: true, isCustomizable: false, careInstructions: CARE_ACC },
  8:  { slug: 'the-cognac-belt', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/fall.jpg', '/assets/leather.jpg', '/assets/leather_full.jpg'], shortDesc: 'Hand-finished cognac belt with antiqued brass buckle.', description: 'Classic dress belt in hand-dyed calfskin with a solid brass antiqued buckle. Feathered edges and blind-stitched detail for a refined finish.', colors: ['Cognac', 'Black', 'Dark Brown'], sizes: SZ_BELT, stock: 3, rating: 4.2, reviewCount: 45, soldCount: 189, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
  15: { slug: 'the-monogram-clutch', originalPrice: null, discount: 0, color: 'Black', images: ['/assets/custom.jpg', '/assets/leather.jpg', '/assets/fall.jpg', '/assets/leather_full.jpg'], shortDesc: 'Customizable lambskin clutch with monogram option.', description: 'An evening clutch in supple lambskin with optional hot-stamped monogram. Removable wrist strap, suede lining, and magnetic closure.', colors: ['Black', 'Burgundy', 'Gold'], sizes: SZ_ONE, stock: 11, rating: 4.7, reviewCount: 51, soldCount: 134, isFeatured: false, isCustomizable: true, careInstructions: CARE_ACC },
  16: { slug: 'the-riding-jacket', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/jacket.jpg', '/assets/jacket_main.jpg', '/assets/fall.jpg', '/assets/leather.jpg'], shortDesc: 'Equestrian-inspired riding jacket in heavyweight steerhide.', description: 'Beautifully structured riding jacket with fitted silhouette, mandarin collar, two-way zip, and leather-wrapped buttons. Fully lined in silk for supreme comfort.', colors: ['Cognac', 'Black', 'Burgundy'], sizes: SZ_JACKET, stock: 7, rating: 4.6, reviewCount: 87, soldCount: 245, isFeatured: true, isCustomizable: false, careInstructions: CARE_OUT },
  27: { slug: 'the-harvest-saddlebag', originalPrice: null, discount: 0, color: 'Cognac', images: ['/assets/fall.jpg', '/assets/leather.jpg', '/assets/custom.jpg', '/assets/leather_full.jpg'], shortDesc: 'Classic saddlebag silhouette in burnished calfskin.', description: 'An autumn essential — the structured saddlebag with flap closure, adjustable crossbody strap, and suede-lined interior. Antique brass hardware throughout.', colors: ['Cognac', 'Dark Brown', 'Tan'], sizes: SZ_ONE, stock: 17, rating: 4.4, reviewCount: 29, soldCount: 84, isFeatured: false, isCustomizable: false, careInstructions: CARE_ACC },
};

export const PRODUCTS = _BASE.map(p => ({ ...p, ..._ENRICH[p.id] }));

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

function sortProducts(products, sortBy) {
  const s = [...products];
  switch (sortBy) {
    case 'price-asc': return s.sort((a, b) => a.price - b.price);
    case 'price-desc': return s.sort((a, b) => b.price - a.price);
    case 'rating': return s.sort((a, b) => b.rating - a.rating);
    case 'bestselling': return s.sort((a, b) => b.soldCount - a.soldCount);
    case 'newest': return s.sort((a, b) => b.id - a.id);
    case 'featured': default: return s.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

export function StarRating({ rating, count, size = 'sm' }) {
  const pct = (rating / 5) * 100;
  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__stars">
        <div className="star-rating__empty">★★★★★</div>
        <div className="star-rating__filled" style={{ width: `${pct}%` }}>★★★★★</div>
      </div>
      {count != null && <span className="star-rating__count">({count})</span>}
    </div>
  );
}

const FILTER_GROUPS = [
  {
    name: 'cat', title: 'Category',
    options: ['men', 'women', 'kids', 'wallets', 'customize'],
  },
  {
    name: 'season', title: 'Season',
    options: ['winter', 'spring', 'summer', 'autumn'],
  },
  {
    name: 'leather', title: 'Leather',
    options: ['calfskin', 'nappa', 'steerhide', 'lambskin', 'suede'],
  },
  {
    name: 'price', title: 'Price',
    options: ['0-200', '200-500', '500-1000', '1000+'],
    labels: { '0-200': 'Under $200', '200-500': '$200 – $500', '500-1000': '$500 – $1,000', '1000+': 'Over $1,000' },
  },
];

function matchesPrice(price, range) {
  if (range === '0-200') return price < 200;
  if (range === '200-500') return price >= 200 && price < 500;
  if (range === '500-1000') return price >= 500 && price < 1000;
  if (range === '1000+') return price >= 1000;
  return false;
}

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const catParam = new URLSearchParams(location.search).get('cat');

  const [filters, setFilters] = useState(() => {
    const init = {};
    FILTER_GROUPS.forEach(g => { init[g.name] = new Set(); });
    if (catParam) init['cat'] = new Set([catParam]);
    return init;
  });

  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setFilters(prev => {
      const next = { ...prev };
      FILTER_GROUPS.forEach(g => { next[g.name] = new Set(); });
      if (catParam) next['cat'] = new Set([catParam]);
      return next;
    });
  }, [catParam]);

  function toggleFilter(group, value) {
    setFilters(prev => {
      const set = new Set(prev[group]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [group]: set };
    });
  }

  function removeTag(group, value) {
    setFilters(prev => {
      const set = new Set(prev[group]);
      set.delete(value);
      return { ...prev, [group]: set };
    });
  }

  function reset() {
    const cleared = {};
    FILTER_GROUPS.forEach(g => { cleared[g.name] = new Set(); });
    setFilters(cleared);
    setSearch('');
    navigate('/products');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = PRODUCTS.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.material.toLowerCase().includes(q)) return false;
      for (const g of FILTER_GROUPS) {
        const active = filters[g.name];
        if (active.size === 0) continue;
        if (g.name === 'price') {
          if (![...active].some(r => matchesPrice(p.price, r))) return false;
        } else {
          if (!active.has(p[g.name])) return false;
        }
      }
      return true;
    });
    return sortProducts(result, sort);
  }, [filters, search, sort]);

  const activeTags = [];
  FILTER_GROUPS.forEach(g => {
    filters[g.name].forEach(v => {
      const label = g.labels ? g.labels[v] : v;
      activeTags.push({ group: g.name, value: v, label });
    });
  });
  if (search.trim()) {
    activeTags.push({ group: '_search', value: search, label: `"${search}"` });
  }

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src="/assets/leather.jpg" alt="Leather texture" />
        </div>
        <div className="page-hero__content">
          <span className="label">Our Collection</span>
          <h1 className="page-hero__title">All <em>Products</em></h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="toolbar">
        <div className="container">
          <div className="toolbar__inner">
            <div className="toolbar__search">
              <span className="material-symbols-outlined toolbar__search-icon">search</span>
              <input
                type="text"
                className="toolbar__input"
                placeholder="Search leather goods..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar__meta">
              <span className="toolbar__count">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
              <select className="toolbar__sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button className="toolbar__reset" onClick={reset}>
                <span className="material-symbols-outlined">filter_list_off</span>
                Clear
              </button>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="toolbar__tags">
              {activeTags.map(({ group, value, label }) => (
                <button
                  key={`${group}-${value}`}
                  className="tag"
                  onClick={() => group === '_search' ? setSearch('') : removeTag(group, value)}
                >
                  {label}
                  <span className="material-symbols-outlined tag__x">close</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Catalog */}
      <section className="section section--dark">
        <div className="container">
          <div className="catalog">
            {/* Sidebar */}
            <aside className={`filters${sidebarOpen ? ' open' : ''}`}>
              <button className="filters__close" onClick={() => setSidebarOpen(false)} aria-label="Close filters">
                <span className="material-symbols-outlined">close</span>
              </button>

              {FILTER_GROUPS.map(group => (
                <div className="filter-group" key={group.name}>
                  <h3 className="filter-group__title">{group.title}</h3>
                  <div className="filter-group__options">
                    {group.options.map(opt => (
                      <label className="filter-opt" key={opt}>
                        <input
                          type="checkbox"
                          checked={filters[group.name].has(opt)}
                          onChange={() => toggleFilter(group.name, opt)}
                        />
                        <span>{group.labels ? group.labels[opt] : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main grid */}
            <div className="catalog__main">
              <button className="catalog__filter-btn" onClick={() => setSidebarOpen(true)}>
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>

              {filtered.length === 0 ? (
                <div className="catalog__empty">
                  <span className="material-symbols-outlined catalog__empty-icon">search_off</span>
                  <p className="catalog__empty-text">No products match your filters.</p>
                  <button className="btn btn--solid" onClick={reset}>Clear Filters</button>
                </div>
              ) : (
                <div className="products products--catalog">
                  {filtered.map(p => (
                    <Link to={`/product/${p.slug}`} className="product-card" key={p.id}>
                      <div className="product-card__img-wrap">
                        <img className="product-card__img" src={p.img} alt={p.name} loading="lazy" />
                        <span className="product-card__badge">{p.cat}</span>
                        {p.discount > 0 && <span className="product-card__discount">-{p.discount}%</span>}
                        {p.isFeatured && <span className="product-card__featured">Best Seller</span>}
                        <button className="product-card__cart" aria-label="Add to cart" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                          <span className="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                      </div>
                      <div className="product-card__meta">
                        <div>
                          <h3 className="product-card__name">{p.name}</h3>
                          <p className="product-card__material">{p.material}</p>
                          <StarRating rating={p.rating} count={p.reviewCount} />
                        </div>
                        <div className="product-card__pricing">
                          {p.originalPrice && <span className="product-card__original">${p.originalPrice.toLocaleString()}</span>}
                          <span className="product-card__price">${p.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="product-card__foot">
                        <span className={`stock ${p.stock === 0 ? 'stock--out' : p.stock <= 5 ? 'stock--low' : 'stock--in'}`}>
                          {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In Stock'}
                        </span>
                        {p.isCustomizable && <span className="product-card__custom">Customizable</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;
