import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Recycle, ArrowRight, Award, Truck, ShieldCheck, Star, Users, Briefcase } from 'lucide-react';
import { apiService } from '../services/api';

export const Beranda = ({ onOpenForm, homepageData }) => {
  // Fetch partners list
  const { data: partnersData } = useQuery({
    queryKey: ['publicPartners'],
    queryFn: apiService.getPartners,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch testimonials list
  const { data: testimonialsData } = useQuery({
    queryKey: ['publicTestimonials'],
    queryFn: apiService.getTestimonials,
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

  const partners = partnersData?.partners || [];
  const testimonials = testimonialsData?.testimonials || [];

  // Custom visual fallback for partners if they don't have real logos uploaded
  const getPartnerLogo = (partner) => {
    // Return custom SVG mock logo
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 rounded-card shadow-soft hover:shadow-hover transition-all duration-300 w-full h-24 hover:-translate-y-1">
        <span className="font-heading text-sm font-bold text-neutral-700 text-center line-clamp-1">{partner.nama}</span>
        <span className="text-[10px] text-primary font-semibold uppercase tracking-wider mt-1">{partner.kategori || 'Mitra'}</span>
      </div>
    );
  };

  // Star rating helper
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 5) ? 'text-warning fill-warning' : 'text-neutral-200'
          }`}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32 bg-gradient-brand">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary/30 rounded-full shadow-soft">
              <Recycle className="w-4 h-4 text-primary animate-spin-slow" />
              <span className="font-body text-xs font-semibold text-neutral-900 tracking-wide uppercase">
                Ekonomi Sirkular Indonesia
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900">
              {settings.judul_utama}
            </h1>

            <p className="font-body text-base md:text-lg text-neutral-700 leading-relaxed max-w-xl">
              {settings.deskripsi}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-4">
              <button
                onClick={onOpenForm}
                className="px-8 py-4 bg-secondary hover:bg-secondary-dark text-neutral-900 font-body text-base font-bold rounded-lg shadow-soft hover:shadow-hover transition-all duration-150 active:scale-[0.98]"
              >
                {settings.teks_cta}
              </button>

              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-neutral-100 text-neutral-900 font-body text-base font-semibold rounded-lg transition-colors"
              >
                Pelajari Alur Kami
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center p-8 animate-pulse-slow">
              <div className="w-full h-full rounded-full bg-white/70 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-6 border border-white">
                <Recycle className="w-24 h-24 text-primary mb-4 animate-spin-slow" />
                <span className="font-heading text-2xl font-bold text-neutral-900">RUV INDONESIA</span>
                <span className="font-body text-xs text-neutral-500 font-medium uppercase tracking-widest mt-1">Daur Ulang Premium</span>
              </div>

              {/* Micro badge float */}
              <div className="absolute top-10 right-2 bg-white px-4 py-2.5 rounded-card border border-neutral-200 shadow-soft flex items-center gap-2 animate-bounce-slow">
                <Award className="w-5 h-5 text-primary" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase leading-none">Timbangan</span>
                  <span className="text-xs text-neutral-900 font-bold">100% Akurat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Bar */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 w-full mt-[-80px] z-10 relative">
        <div className="bg-white rounded-modal shadow-lg border border-neutral-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-premium-glass">
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-4xl md:text-5xl font-bold text-primary">
              {stats.mitra}+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700">
              Mitra Bisnis Terpercaya
            </span>
            <span className="font-body text-xs text-neutral-400">
              Perusahaan & Kemitraan Lokal
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 border-t md:border-t-0 md:border-x border-neutral-200 pt-6 md:pt-0">
            <span className="font-heading text-4xl md:text-5xl font-bold text-secondary">
              {(stats.kg_barang / 1000).toFixed(1)} Ton+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700">
              Barang Bekas Terbeli
            </span>
            <span className="font-body text-xs text-neutral-400">
              Membantu Mengurangi Sampah TPA
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 border-t md:border-t-0 pt-6 md:pt-0">
            <span className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
              {stats.transaksi_harian}+
            </span>
            <span className="font-body text-sm font-semibold text-neutral-700">
              Transaksi Harian
            </span>
            <span className="font-body text-xs text-neutral-400">
              Layanan Penjemputan Cepat
            </span>
          </div>
        </div>
      </section>

      {/* 3. Core Values / Features */}
      <section id="cara-kerja" className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">
            Mengapa Memilih RUV?
          </h2>
          <p className="font-body text-base text-neutral-700 max-w-xl leading-relaxed">
            Layanan pengelolaan barang bekas profesional pertama di Jakarta Utara yang menjamin kepuasan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-neutral-100 rounded-card border border-neutral-200 text-left flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-900">Jemput Gratis ke Lokasi</h3>
            <p className="font-body text-sm text-neutral-700 leading-relaxed">
              Anda tidak perlu repot mengantar barang. Cukup isi form di website kami, kurir RUV siap menjemput langsung ke tempat Anda secara gratis.
            </p>
          </div>

          <div className="p-8 bg-neutral-100 rounded-card border border-neutral-200 text-left flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-900">Timbangan Jujur & Transparan</h3>
            <p className="font-body text-sm text-neutral-700 leading-relaxed">
              Kami menggunakan timbangan digital terkalibrasi. Proses penimbangan dilakukan langsung di hadapan Anda demi kejujuran transaksi.
            </p>
          </div>

          <div className="p-8 bg-neutral-100 rounded-card border border-neutral-200 text-left flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center text-success">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-900">Harga Terbaik & Instan</h3>
            <p className="font-body text-sm text-neutral-700 leading-relaxed">
              Dapatkan estimasi harga barang rongsok terbaik berdasarkan kategori produk yang dinamis. Pembayaran dilakukan instan tunai atau transfer di tempat.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Partners Section (Dynamic) */}
      {partners.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 w-full flex flex-col gap-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-heading text-2xl font-bold text-neutral-900">Mitra Bisnis Kami</h2>
            <p className="font-body text-sm text-neutral-700">
              RUV dipercaya oleh berbagai perusahaan dan institusi dalam ekosistem daur ulang.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {partners.map((partner) => (
              <div key={partner.id} className="flex justify-center w-full">
                {partner.link ? (
                  <a href={partner.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    {getPartnerLogo(partner)}
                  </a>
                ) : (
                  getPartnerLogo(partner)
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Testimonials Section (Dynamic) */}
      {testimonials.length > 0 && (
        <section className="bg-neutral-100 py-24 border-y border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="font-heading text-3xl font-bold text-neutral-900">Apa Kata Mereka?</h2>
              <p className="font-body text-base text-neutral-700 max-w-md">
                Kisah kepuasan dari para penjual barang bekas dan mitra usaha yang bermitra dengan RUV.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-card border border-neutral-200 shadow-soft flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-1">
                    {renderStars(item.rating)}
                  </div>
                  <p className="font-body text-sm text-neutral-700 leading-relaxed flex-1 italic">
                    "{item.isi}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 mt-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-heading font-bold text-neutral-700 overflow-hidden text-sm uppercase shrink-0">
                      {item.nama.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-sm font-bold text-neutral-900">{item.nama}</span>
                      {item.jabatan && (
                        <span className="font-body text-xs text-neutral-400">{item.jabatan}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default Beranda;
