import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Recycle, ArrowRight, Award, Truck, ShieldCheck,
  Star, Mail, MapPin, Phone, Instagram, Send, Cpu,
  ShoppingBag, CheckCircle2, ArrowUp, ArrowDown, ExternalLink, Loader2
} from 'lucide-react';
import { apiService, getStorageUrl } from '../services/api';

// Background & Logos
import fotoLapak from '../assets/foto lapak.webp';
import logoPrimer from '../assets/logo-ruv-brown.png';

// ==========================================
// 1. ANIMATED COUNTER COMPONENT
// ==========================================
const AnimatedCounter = ({ end, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const numMatch = end.toString().match(/[\d.]+/);
    if (!numMatch) {
      setCount(end);
      return;
    }

    const endVal = parseFloat(numMatch[0]);
    const isFloat = end.toString().includes('.');

    let start = 0;
    const totalSteps = 50;
    const stepTime = duration / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeProgress = progress * (2 - progress); // easeOutQuad
      const currentVal = easeProgress * endVal;

      if (currentStep >= totalSteps) {
        setCount(endVal);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  const numMatch = end.toString().match(/[\d.]+/);
  const nonNumMatch = end.toString().replace(/[\d.]+/, '');

  return (
    <span ref={ref}>
      {count}
      {nonNumMatch}
      {suffix}
    </span>
  );
};

// ==========================================
// 2. SCROLL REVEAL WRAPPER COMPONENT
// ==========================================
const ScrollReveal = ({ children, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const getDirectionClass = () => {
    switch (direction) {
      case 'left':
        return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0';
      case 'right':
        return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0';
      case 'up':
      default:
        return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${getDirectionClass()}`}
    >
      {children}
    </div>
  );
};

// ==========================================
// MAIN LANDING PAGE COMPONENT
// ==========================================
export const LandingPage = ({ onOpenForm, homepageData, contactData }) => {
  const [activeProductTab, setActiveProductTab] = useState('ruv-buy');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [itemsToShow, setItemsToShow] = useState(10);

  // Hover states to restart statistic counters
  const [hoverMitra, setHoverMitra] = useState(0);
  const [hoverKg, setHoverKg] = useState(0);
  const [hoverTx, setHoverTx] = useState(0);

  // Fetch partners
  const { data: partnersData } = useQuery({
    queryKey: ['publicPartners'],
    queryFn: apiService.getPartners,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch testimonials
  const { data: testimonialsData } = useQuery({
    queryKey: ['publicTestimonials'],
    queryFn: apiService.getTestimonials,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch products (for catalog tab)
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['publicProducts', selectedCategory],
    queryFn: () => apiService.getProducts(selectedCategory),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch about content
  const { data: aboutData } = useQuery({
    queryKey: ['publicAbout'],
    queryFn: apiService.getAbout,
    staleTime: 5 * 60 * 1000,
  });

  const settings = homepageData?.settings || {
    judul_utama: 'Dari Barang Bekas, Lahir Nilai Baru',
    deskripsi: 'Kami menjemput langsung barang bekas Anda ke lokasi. Timbangan transparan, harga kompetitif, dan pembayaran instan.',
    teks_cta: 'Jual Sekarang!',
  };

  const stats = homepageData?.statistics || {
    mitra: 12,
    kg_barang: 2450,
    transaksi_harian: 45,
  };

  const about = aboutData?.about || {
    konten_teks: "Rongsok Utama Vrakasa (RUV) didirikan untuk menjawab kebutuhan pengelolaan sampah anorganik yang transparan, mudah, dan bernilai ekonomis di wilayah Jakarta.\n\nKami mengusung ekonomi sirkular berkelanjutan di mana sampah rumah tangga, kantor, gudang, maupun pabrik disortir dan diolah kembali menjadi bahan baku industri baru. Khususnya untuk jenis plastik, kami mengoperasikan unit penggilingan modern (RUV GEN) untuk memproduksi cacahan plastik premium siap ekspor.\n\nDengan memadukan timbangan digital akurat, armada penjemputan profesional, serta komitmen terhadap kelestarian bumi, RUV hadir sebagai mitra terbaik Anda dalam menyalurkan barang bekas.",
    foto_path: null
  };

  const contact = contactData?.contact || {
    alamat: 'Jl. Raya Cilincing No. 45, Marunda, Kecamatan Cilincing, Jakarta Utara, DKI Jakarta 14150',
    email: 'info@ruv.co.id',
    instagram: 'ruv.indonesia',
    tiktok: 'ruv.indonesia',
    whatsapp: '6285353285071',
    maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.0425714349377!2d106.9458283!3d-6.124976799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a200788ad7c6f%3A0xe5fa9c18d34dcbf6!2sMarunda%2C%20Cilincing%2C%20North%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  };

  const partners = partnersData?.partners || [];
  const testimonials = testimonialsData?.testimonials || [];
  const products = productsData?.products || [];
  const counts = productsData?.counts || { Semua: 0, Plastik: 0, Besi: 0, Elektronik: 0, Kertas: 0, Logam: 0 };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const aboutImage = about.foto_path
    ? getStorageUrl(about.foto_path)
    : null;

  const aboutParagraphs = about.konten_teks.split('\n\n').filter(p => p.trim() !== '');

  const getBadgeStyle = (category) => {
    switch (category) {
      case 'Plastik':
        return 'bg-secondary/15 text-neutral-900 border-secondary/30';
      case 'Besi':
        return 'bg-neutral-200/60 text-neutral-700 border-neutral-300';
      case 'Elektronik':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'Kertas':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'Logam':
        return 'bg-primary/20 text-neutral-900 border-primary/30';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getInstagramUrl = (username) => {
    return username ? `https://instagram.com/${username}` : '#';
  };

  const getTiktokUrl = (username) => {
    return username ? `https://tiktok.com/@${username}` : '#';
  };

  const getWhatsappUrl = (number) => {
    return number ? `https://wa.me/${number}` : '#';
  };

  const doublePartners = [...partners, ...partners, ...partners];
  const doubleTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      {/* ========================================================
          1. HERO SECTION (With parallax background & glassmorphism details)
          ======================================================== */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-neutral-950 text-white"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={fotoLapak}
            alt="Lapak Rongsok Utama Vrakasa"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* Ambient Moving Elements (Floating shapes for richer aesthetics) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] -top-10 -left-10 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] bottom-10 right-10 animate-pulse" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Left Column: Headline and CTA */}
          <div className="lg:col-span-8 flex flex-col items-start gap-6 text-left">
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full">
                <Recycle className="w-4 h-4 text-secondary animate-spin-slow" />
                <span className="font-heading text-xs font-bold text-secondary uppercase tracking-wider">
                  Ekonomi Sirkular Indonesia
                </span>
              </div>
            </ScrollReveal>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm">
              {settings.judul_utama}
            </h1>

            <p className="font-body text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl drop-shadow-sm">
              {settings.deskripsi}
            </p>

            {/* Glowing / Sleek CTA Button (No black stroke) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto mt-4">
              <button
                onClick={onOpenForm}
                className="px-10 py-5 bg-[#EFC075] hover:bg-[#e7b25e] text-neutral-900 font-heading text-lg font-black rounded-xl shadow-lg shadow-[#EFC075]/35 hover:shadow-xl hover:shadow-[#EFC075]/50 active:scale-[0.97] transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {settings.teks_cta}
              </button>

              <a
                href="#tentang-kami"
                onClick={(e) => handleSmoothScroll(e, 'tentang-kami')}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-body text-base font-bold rounded-xl transition-all border border-white/15"
              >
                Tentang RUV
                <ArrowRight className="w-4 h-4 text-secondary" />
              </a>
            </div>
          </div>

          {/* Right Column: Clean Visual Spacer */}
          <div className="hidden lg:block lg:col-span-4" />

        </div>
      </section>

      {/* ========================================================
          2. STATISTIK SECTION (Hover Replays Count-up)
          ======================================================== */}
      <section
        id="statistik"
        className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 w-full mt-[-64px] z-20 relative"
      >
        <div className="bg-white rounded-modal shadow-lg border border-neutral-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-premium-glass">

          {/* Stat 1 */}
          <div
            onMouseEnter={() => setHoverMitra(prev => prev + 1)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <span className="font-heading text-4xl md:text-5xl font-extrabold text-neutral-900 group-hover:text-primary transition-colors">
              <AnimatedCounter key={hoverMitra} end={stats.mitra} />+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700 mt-1">
              Mitra Bisnis Terpercaya
            </span>
            <span className="font-body text-xs text-neutral-400">
              Kemitraan Semua Industri
            </span>
          </div>

          {/* Stat 2 */}
          <div
            onMouseEnter={() => setHoverKg(prev => prev + 1)}
            className="flex flex-col items-center gap-1 border-t md:border-t-0 md:border-x border-neutral-200 pt-6 md:pt-0 cursor-pointer group"
          >
            <span className="font-heading text-4xl md:text-5xl font-extrabold text-neutral-900 group-hover:text-primary transition-colors">
              <AnimatedCounter key={hoverKg} end={stats.kg_barang} /> Kg+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700 mt-1">
              Barang Bekas Dibeli
            </span>
            <span className="font-body text-xs text-neutral-400">
              Total Barang Harian
            </span>
          </div>

          {/* Stat 3 */}
          <div
            onMouseEnter={() => setHoverTx(prev => prev + 1)}
            className="flex flex-col items-center gap-1 border-t md:border-t-0 pt-6 md:pt-0 cursor-pointer group"
          >
            <span className="font-heading text-4xl md:text-5xl font-extrabold text-neutral-900 group-hover:text-primary transition-colors">
              <AnimatedCounter key={hoverTx} end={stats.transaksi_harian} />+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700 mt-1">
              Transaksi Penjemputan
            </span>
            <span className="font-body text-xs text-neutral-400">
              Pelayanan Armada Setiap Hari
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. TENTANG KAMI SECTION (#tentang-kami)
          ======================================================== */}
      <section
        id="tentang-kami"
        className="py-24 max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Visual column with Left Slide reveal */}
        <div className="lg:col-span-5 flex justify-center">
          <ScrollReveal direction="left">
            {aboutImage ? (
              <div className="relative rounded-modal overflow-hidden shadow-lg border border-neutral-200 aspect-[4/3] w-full max-w-md group hover:shadow-2xl transition-all duration-300">
                <img
                  src={aboutImage}
                  alt="Operasional RUV"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="w-full max-w-md aspect-[4/3] rounded-modal bg-neutral-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group shadow-lg border border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-neutral-900 to-secondary/30 opacity-70" />
                <Recycle className="w-20 h-20 text-white/90 animate-spin-slow mb-4 relative z-10" />
                <h4 className="font-heading text-lg font-bold relative z-10">Rongsok Utama Vrakasa</h4>
                <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest mt-1 relative z-10">Unit Sortir & Giling</span>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Right Narration column with Right Slide reveal */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          <ScrollReveal direction="right">
            <div className="flex flex-col gap-2">
              <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">Kisah Perusahaan</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">Misi & Sejarah RUV</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="flex flex-col gap-4 font-body text-base text-neutral-700 leading-relaxed">
              {aboutParagraphs.map((p, index) => (
                <p key={index} className="transition-all hover:text-neutral-900">
                  {p}
                </p>
              ))}
            </div>
          </ScrollReveal>

          {/* Simple Mission Cards */}
          <ScrollReveal direction="right" delay={300}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
              <div className="p-5 border border-neutral-200 bg-white rounded-card shadow-soft flex items-start gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-8 h-8 rounded bg-secondary/15 flex items-center justify-center text-neutral-900 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-neutral-900">Pelayanan Terbaik</span>
                  <span className="font-body text-xs text-neutral-500 mt-0.5">Penjemputan terjadwal & timbangan digital pas.</span>
                </div>
              </div>

              <div className="p-5 border border-neutral-200 bg-white rounded-card shadow-soft flex items-start gap-3 hover:-translate-y-0.5 transition-transform">
                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-neutral-900 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-neutral-900">Berdampak Nyata</span>
                  <span className="font-body text-xs text-neutral-500 mt-0.5">Mengolah barang bekas menjadi bahan baku bernilai.</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* ========================================================
          4. PRODUK & LAYANAN SECTION (#produk)
          ======================================================== */}
      <section id="produk" className="bg-neutral-100 py-24 border-y border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-10">

          {/* Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-3 text-center">
              <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">Katalog Harga & Operasional</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">Produk & Layanan</h2>
              <p className="font-body text-sm text-neutral-700 max-w-md mx-auto">
                Ketahui harga terkini komoditas anorganik yang kami beli, alur RUV PICK, dan pengolahan plastik RUV GEN.
              </p>
            </div>
          </ScrollReveal>

          {/* Centered Tab Container */}
          <ScrollReveal direction="up" delay={100}>
            <div className="flex justify-center border-b border-neutral-200 mt-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveProductTab('ruv-buy')}
                  className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${activeProductTab === 'ruv-buy'
                    ? 'border-primary text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  RUV BUY
                </button>

                <button
                  onClick={() => setActiveProductTab('ruv-pick')}
                  className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${activeProductTab === 'ruv-pick'
                    ? 'border-primary text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                >
                  <Truck className="w-4 h-4" />
                  RUV PICK
                </button>

                <button
                  onClick={() => setActiveProductTab('ruv-gen')}
                  className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${activeProductTab === 'ruv-gen'
                    ? 'border-primary text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                >
                  <Cpu className="w-4 h-4" />
                  RUV GEN
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Centered Contents */}
          <ScrollReveal direction="up" delay={200}>
            <div className="min-h-[420px] mt-6 text-left">
              {/* TABS 1: BUY */}
              {activeProductTab === 'ruv-buy' && (
                <div className="flex flex-col gap-6 animate-modal-in">
                  {/* Category Filter and Limit Selector */}
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-neutral-100 pb-4">
                    {/* Category Buttons */}
                    <div className="flex flex-wrap gap-2 justify-start">
                      {['Semua', 'Plastik', 'Besi', 'Elektronik', 'Kertas', 'Logam'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${selectedCategory === cat
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-soft'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                            }`}
                        >
                          {cat} ({counts[cat] || 0})
                        </button>
                      ))}
                    </div>

                    {/* Limit Selector */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 self-start md:self-center shrink-0">
                      <span>Tampilkan:</span>
                      <select
                        value={itemsToShow}
                        onChange={(e) => {
                          const val = e.target.value;
                          setItemsToShow(val === 'all' ? 'all' : parseInt(val, 10));
                        }}
                        className="bg-transparent border-0 focus:outline-none focus:ring-0 font-bold text-neutral-900 cursor-pointer text-xs"
                      >
                        <option value={10}>10 Item</option>
                        <option value={20}>20 Item</option>
                        <option value="all">Semua</option>
                      </select>
                    </div>
                  </div>

                  {productsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-6 h-6 text-secondary animate-spin" />
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-neutral-200 rounded-card">
                      <span className="font-body text-sm text-neutral-400">Tidak ada produk dalam kategori ini.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(() => {
                        const displayedProducts = itemsToShow === 'all' ? products : products.slice(0, itemsToShow);
                        return displayedProducts.map((prod) => {
                          const isPriceUp = prod.perubahan_harga && prod.perubahan_harga.includes('+');
                          const isPriceDown = prod.perubahan_harga && prod.perubahan_harga.includes('-');

                          return (
                            <div
                              key={prod.id}
                              className="p-6 bg-white border border-neutral-200 rounded-card shadow-soft hover:shadow-hover hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(prod.kategori)}`}>
                                    {prod.kategori}
                                  </span>

                                  {prod.perubahan_harga && (
                                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1 ${isPriceUp ? 'bg-success/15 text-success' : isPriceDown ? 'bg-error/15 text-error' : 'bg-neutral-100 text-neutral-500'
                                      }`}>
                                      {isPriceUp ? <ArrowUp className="w-3.5 h-3.5 text-success" /> : isPriceDown ? <ArrowDown className="w-3.5 h-3.5 text-error" /> : null}
                                      {prod.perubahan_harga}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-heading text-base font-bold text-neutral-900">{prod.nama}</h4>
                              </div>

                              <div className="border-t border-neutral-100 pt-3 mt-4 flex items-end justify-between">
                                <div className="flex flex-col text-left">
                                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Harga Beli RUV</span>
                                  <span className="font-heading text-lg font-bold text-neutral-900 mt-0.5">
                                    Rp {prod.harga.toLocaleString('id-ID')}
                                  </span>
                                </div>
                                <span className="font-body text-xs text-neutral-500 mb-0.5">/ {prod.satuan}</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* TABS 2: PICK */}
              {activeProductTab === 'ruv-pick' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-modal-in">
                  <div className="lg:col-span-6 flex flex-col gap-5">
                    <h3 className="font-heading text-xl font-bold text-neutral-900">Panggilan Penjemputan RUV PICK</h3>
                    <p className="font-body text-sm text-neutral-700 leading-relaxed">
                      Kami melayani jemput rongsok anorganik rumah tangga maupun gudang secara profesional di area Jakarta Utara. Kurir kami dibekali timbangan digital terkalibrasi pas.
                    </p>

                    <ul className="flex flex-col gap-3 mt-1">
                      <li className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span><strong>Timbangan Akurat:</strong> Ditimbang langsung menggunakan timbangan digital resmi.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span><strong>Transportasi Gratis:</strong> Tidak ada potongan ongkos jemput.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span><strong>Uang Tunai Instan:</strong> Pembayaran langsung cair di tempat setelah ditimbang.</span>
                      </li>
                    </ul>

                    <button
                      onClick={onOpenForm}
                      className="self-start mt-2 px-6 py-3 bg-neutral-900 text-white font-body text-xs font-bold rounded-lg shadow-soft hover:bg-neutral-800"
                    >
                      Jadwalkan Jemput Sekarang
                    </button>
                  </div>

                  <div className="lg:col-span-6 bg-white p-6 rounded-card border border-neutral-200 shadow-soft">
                    <h4 className="font-heading text-sm font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">3 Langkah Alur Jual</h4>
                    <div className="flex flex-col gap-6 relative border-l border-neutral-200 pl-6">
                      <div className="relative">
                        <div className="absolute left-[-33px] w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-neutral-900">1</div>
                        <span className="font-heading text-xs font-bold text-neutral-900 block">Kirim Form WA</span>
                        <span className="font-body text-xs text-neutral-500">Isi data lengkap Anda melalui tombol CTA Jual Sekarang.</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-33px] w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-neutral-900">2</div>
                        <span className="font-heading text-xs font-bold text-neutral-900 block">Kurir Meluncur</span>
                        <span className="font-body text-xs text-neutral-500">Kurir mengonfirmasi jadwal keberangkatan penjemputan.</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-33px] w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-neutral-900">3</div>
                        <span className="font-heading text-xs font-bold text-neutral-900 block">Timbang & Bayar</span>
                        <span className="font-body text-xs text-neutral-500">Timbang di tempat, catat berat, cairkan rejeki instan.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TABS 3: GEN */}
              {activeProductTab === 'ruv-gen' && (
                <div className="flex flex-col gap-8 animate-modal-in">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <h3 className="font-heading text-xl font-bold text-neutral-900">Penggilingan Plastik RUV GEN</h3>
                      <p className="font-body text-sm text-neutral-700 leading-relaxed">
                        RUV GEN (Generation) merupakan lini produksi modern untuk mencacah, menggiling, dan mencuci sampah plastik menjadi serpihan (*flakes*) siap daur ulang berskala industri ekspor.
                      </p>
                    </div>
                    <div className="lg:col-span-5 bg-white p-6 rounded-card border border-neutral-200 text-center shadow-soft">
                      <span className="font-heading text-2xl font-black text-neutral-900">2.5 Ton / Hari</span>
                      <p className="font-body text-xs text-neutral-500 mt-1 uppercase tracking-widest font-semibold">Kapasitas Giling RUV GEN</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                    {[
                      { id: 1, name: 'Pilah Botol', desc: 'Plastik disortir dari kontaminan tutup/label.' },
                      { id: 2, name: 'Mesin Crusher', desc: 'Plastik dihancurkan berkeping 8mm-12mm.' },
                      { id: 3, name: 'Friksi Cuci', desc: 'Keping dicuci bersih steril dari bahan kimia.' },
                      { id: 4, name: 'Packing Flakes', desc: 'Serpihan dikeringkan & siap didistribusikan.' },
                    ].map((step) => (
                      <div key={step.id} className="p-5 bg-white border border-neutral-200 rounded-card flex flex-col gap-2 relative">
                        <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-heading text-xs font-bold text-neutral-900">
                          {step.id}
                        </span>
                        <span className="font-heading text-xs font-bold text-neutral-900">{step.name}</span>
                        <span className="font-body text-[11px] text-neutral-500 leading-relaxed">{step.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ========================================================
          5. MITRA SECTION (Infinite Slide Carousel to RIGHT)
          ======================================================== */}
      {partners.length > 0 && (
        <section id="mitra" className="py-16 bg-white overflow-hidden border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 mb-8 text-center md:text-left">
            <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">Jaringan Kerja Sama</span>
            <h3 className="font-heading text-xl font-bold text-neutral-900 mt-1">Dipercaya Oleh Berbagai Mitra</h3>
          </div>

          <div className="relative w-full flex items-center py-6 bg-neutral-50/50 border-y border-neutral-100">
            <div className="animate-marquee-right flex gap-12">
              {doublePartners.map((partner, index) => {
                const isLinkable = !!partner.link;
                const Component = isLinkable ? 'a' : 'div';
                const extraProps = isLinkable ? { href: partner.link, target: '_blank', rel: 'noopener noreferrer' } : {};

                return (
                  <Component
                    key={`${partner.id}-${index}`}
                    {...extraProps}
                    className={`flex items-center gap-6 w-96 shrink-0 bg-transparent border-0 transition-transform ${isLinkable ? 'hover:-translate-y-1 hover:scale-105 cursor-pointer' : ''}`}
                  >
                    <div className="w-28 h-20 bg-transparent flex items-center justify-center shrink-0">
                      <img
                        src={getStorageUrl(partner.logo_path)}
                        alt={partner.nama}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="font-heading text-lg md:text-xl font-black text-neutral-900 truncate">{partner.nama}</span>
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest truncate mt-1">{partner.kategori || 'Mitra RUV'}</span>
                    </div>
                  </Component>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          6. TESTIMONI SECTION (Infinite Slide Carousel to LEFT)
          ======================================================== */}
      {testimonials.length > 0 && (
        <section id="testimoni" className="py-20 bg-neutral-100 border-b border-neutral-200 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 mb-10 text-center">
            <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">Kepuasan Pelanggan</span>
            <h3 className="font-heading text-2xl font-bold text-neutral-900 mt-1">Ulasan Mitra & Penjual</h3>
          </div>

          <div className="relative w-full flex items-center py-4">
            <div className="animate-marquee-left flex gap-6">
              {doubleTestimonials.map((item, index) => {
                const imageURL = item.foto_path
                  ? getStorageUrl(item.foto_path)
                  : null;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-6 bg-white border border-neutral-200 rounded-card shadow-soft w-80 shrink-0 flex flex-col justify-between gap-4 text-left transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'text-warning fill-warning' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                      <p className="font-body text-xs text-neutral-700 leading-relaxed italic">
                        "{item.isi}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 border-t border-neutral-100 pt-3 mt-1">
                      {imageURL ? (
                        <img src={imageURL} alt={item.nama} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center font-heading font-bold text-neutral-600 text-xs uppercase shrink-0">
                          {item.nama.substring(0, 2)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-heading text-xs font-bold text-neutral-900">{item.nama}</span>
                        <span className="font-body text-[9px] text-neutral-400 font-semibold">{item.jabatan || 'Pelanggan RUV'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          7. KONTAK SECTION (#kontak)
          ======================================================== */}
      <section
        id="kontak"
        className="py-24 max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch"
      >
        {/* Left column info shapes with Left slide reveal */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-2">
              <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">Saluran Komunikasi</span>
              <h2 className="font-heading text-3xl font-bold text-neutral-900">Kontak Kami</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-4">

            {/* Shape 1: Alamat Map Link (Fully clickable container with hover) */}
            <ScrollReveal direction="left" delay={150}>
              <a
                href={contact.alamat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.alamat)}` : "https://maps.google.com"}
                target="_blank"
                rel="noreferrer"
                className="p-6 border border-neutral-200 bg-white rounded-card shadow-soft flex items-start gap-4 hover:shadow-hover hover:-translate-y-1 hover:border-secondary transition-all group block"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-neutral-900">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-neutral-900">Alamat Lapak</span>
                  <span className="font-body text-xs text-neutral-700 leading-relaxed mt-1">{contact.alamat}</span>
                </div>
              </a>
            </ScrollReveal>

            {/* Shape 2: Email (Fully clickable container with hover) */}
            <ScrollReveal direction="left" delay={250}>
              <a
                href={`mailto:${contact.email}`}
                className="p-6 border border-neutral-200 bg-white rounded-card shadow-soft flex items-start gap-4 hover:shadow-hover hover:-translate-y-1 hover:border-secondary transition-all group block"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0 transition-colors group-hover:bg-secondary group-hover:text-neutral-900">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-neutral-900">Email Hubungan</span>
                  <span className="font-body text-xs text-neutral-700 hover:text-secondary mt-1">
                    {contact.email}
                  </span>
                </div>
              </a>
            </ScrollReveal>

            {/* Shape 3: WhatsApp Chat (Fully clickable container with hover) */}
            <ScrollReveal direction="left" delay={350}>
              <a
                href={getWhatsappUrl(contact.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="p-6 border border-neutral-200 bg-white rounded-card shadow-soft flex items-start gap-4 hover:shadow-hover hover:-translate-y-1 hover:border-secondary transition-all group block"
              >
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0 transition-colors group-hover:bg-success group-hover:text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.436 0 9.852-4.414 9.855-9.855.001-2.636-1.024-5.112-2.89-6.98S14.646 1.01 12.008 1.01c-5.44 0-9.859 4.414-9.862 9.858-.001 1.61.425 3.179 1.232 4.584l-.979 3.578 3.658-.96zM17.65 14.93c-.305-.153-1.805-.89-2.083-.99-.278-.1-.482-.15-.683.15-.202.3-.78.99-.956 1.19-.176.2-.352.226-.657.075-.305-.153-1.287-.475-2.45-1.514-.906-.807-1.517-1.805-1.695-2.11-.178-.306-.019-.47.133-.62.138-.135.305-.353.457-.53.152-.177.202-.303.303-.506.102-.203.05-.38-.025-.53-.075-.15-.683-1.647-.936-2.254-.246-.593-.497-.512-.683-.512-.177-.002-.38-.002-.583-.002-.203 0-.533.076-.812.38-.28.304-1.066 1.042-1.066 2.54 0 1.498 1.09 2.946 1.242 3.148.152.203 2.146 3.277 5.198 4.593.726.313 1.293.5 1.734.64.73.23 1.39.198 1.916.12.583-.087 1.805-.738 2.058-1.453.253-.715.253-1.327.177-1.452-.076-.127-.278-.203-.583-.356z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-neutral-900">Hubungi WhatsApp</span>
                  <span className="font-body text-xs text-neutral-700 hover:text-secondary mt-1 font-bold">
                    +{contact.whatsapp}
                  </span>
                </div>
              </a>
            </ScrollReveal>
          </div>

          {/* Socials Link buttons with hover */}
          <ScrollReveal direction="left" delay={400}>
            <div className="flex flex-col gap-3 mt-2">
              <span className="font-heading text-sm font-bold text-neutral-900">Sosial Media Resmi</span>
              <div className="flex items-center gap-3">
                {contact.instagram && (
                  <a
                    href={getInstagramUrl(contact.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-neutral-100 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white text-neutral-900 border border-neutral-200 font-body text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                {contact.tiktok && (
                  <a
                    href={getTiktokUrl(contact.tiktok)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-neutral-100 hover:bg-black hover:text-white text-neutral-900 border border-neutral-200 font-body text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:-translate-y-0.5 transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.24-.24V14c0 3.31-2.3 6.44-5.69 7.04-3.13.6-6.62-1.12-7.66-4.26-1.17-3.4.77-7.64 4.31-8.37.89-.19 1.83-.17 2.72.06v4.11a4.917 4.917 0 00-2.73.75c-1.66 1.11-2.11 3.48-.96 5.18 1.1 1.7 3.58 2.16 5.23.99 1.54-1.03 1.92-3.23 1.84-5.04V.02z" />
                    </svg>
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Google Maps iframe with Right slide reveal */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ScrollReveal direction="right">
            <h3 className="font-heading text-xl font-bold text-neutral-900 text-left">Peta Lokasi</h3>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            {(() => {
              const mapsIframeUrl = contact.maps_embed_url || (contact.alamat ? `https://maps.google.com/maps?q=${encodeURIComponent(contact.alamat)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '');
              return mapsIframeUrl ? (
                <div className="w-full h-full min-h-[340px] rounded-modal border border-neutral-200 overflow-hidden shadow-soft relative bg-neutral-50 hover:shadow-lg transition-shadow duration-300">
                  <iframe
                    title="Peta Lokasi RUV"
                    src={mapsIframeUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                <div className="w-full h-full min-h-[340px] rounded-modal border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400 font-body text-sm font-semibold">
                  Peta Lokasi Belum Diunggah.
                </div>
              );
            })()}
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};
export default LandingPage;
