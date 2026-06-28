import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Leaf, DollarSign, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';
import { apiService } from '../services/api';

export const TentangKami = () => {
  // Fetch About Content
  const { data, isLoading } = useQuery({
    queryKey: ['publicAbout'],
    queryFn: apiService.getAbout,
    staleTime: 5 * 60 * 1000,
  });

  const about = data?.about || {
    konten_teks: "Rongsok Utama Vrakasa (RUV) didirikan untuk menjawab kebutuhan pengelolaan sampah anorganik yang transparan, mudah, dan bernilai ekonomis di wilayah Jakarta.\n\nKami mengusung ekonomi sirkular berkelanjutan di mana sampah rumah tangga, kantor, gudang, maupun pabrik disortir dan diolah kembali menjadi bahan baku industri baru. Khususnya untuk jenis plastik, kami mengoperasikan unit penggilingan modern (RUV GEN) untuk memproduksi cacahan plastik premium siap ekspor.\n\nDengan memadukan timbangan digital akurat, armada penjemputan profesional, serta komitmen terhadap kelestarian bumi, RUV hadir sebagai mitra terbaik Anda dalam menyalurkan barang bekas.",
    foto_path: null
  };

  const imageURL = about.foto_path 
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${about.foto_path}`
    : null;

  // Split narrative by line breaks to support paragraph rendering
  const paragraphs = about.konten_teks.split('\n\n').filter(p => p.trim() !== '');

  const values = [
    {
      icon: Leaf,
      title: 'Ramah Lingkungan',
      desc: 'Setiap barang bekas yang kami kumpulkan diproses kembali demi mengurangi timbunan sampah di TPA, mendukung masa depan bumi yang hijau.',
      color: 'bg-success/10 text-success'
    },
    {
      icon: DollarSign,
      title: 'Berbagi Untung',
      desc: 'Kami menawarkan skema harga beli yang adil dan transparan kepada penjual barang rongsok. Mengubah sampah anorganik menjadi rejeki tambahan.',
      color: 'bg-primary/20 text-neutral-900'
    },
    {
      icon: Eye,
      title: 'Visi Berkelanjutan',
      desc: 'Fokus jangka panjang kami adalah memimpin modernisasi pengelolaan barang bekas di Indonesia dengan teknologi daur ulang ramah lingkungan.',
      color: 'bg-secondary/20 text-neutral-900'
    }
  ];

  return (
    <div className="flex flex-col gap-24 py-16">
      
      {/* 1. Header Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">
            Mengenal Lebih Dekat
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
            Tentang RUV
          </h1>
          <p className="font-body text-base text-neutral-700 max-w-xl leading-relaxed mt-2">
            Rumah terpercaya pengolahan barang bekas bernilai untuk mendorong terwujudnya ekonomi sirkular yang inklusif di Indonesia.
          </p>
        </div>
      </section>

      {/* 2. Brand Story / Description */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Story Text */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
            Kisah Kami & Misi RUV
          </h2>
          <div className="flex flex-col gap-4">
            {paragraphs.map((p, index) => (
              <p key={index} className="font-body text-base text-neutral-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Story Visual / Picture */}
        <div className="lg:col-span-5 flex justify-center">
          {imageURL ? (
            <div className="relative rounded-modal overflow-hidden shadow-lg border border-neutral-200 aspect-[4/3] w-full max-w-md group">
              <img 
                src={imageURL} 
                alt="Tentang RUV" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent pointer-events-none" />
            </div>
          ) : (
            // Premium gradient placeholder card
            <div className="w-full max-w-md aspect-[4/3] rounded-modal bg-gradient-brand-reverse flex flex-col items-center justify-center p-8 text-neutral-900 shadow-lg border border-white/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[4px] pointer-events-none" />
              <Recycle className="w-20 h-20 text-white animate-spin-slow mb-4 relative z-10" />
              <h3 className="font-heading text-xl font-bold text-neutral-900 relative z-10">RUV Visi & Misi</h3>
              <p className="font-body text-xs text-neutral-800 text-center mt-2 max-w-xs relative z-10">
                Mengintegrasikan inovasi dan kepedulian lingkungan untuk pengelolaan barang bekas profesional.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="bg-neutral-100 py-24 border-y border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12">
          
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900">Nilai-Nilai Utama</h2>
            <p className="font-body text-base text-neutral-700 max-w-md">
              Prinsip yang kami pegang teguh dalam menjalankan seluruh proses operasional penjemputan dan daur ulang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-card border border-neutral-200 shadow-soft flex flex-col gap-4 text-left hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${val.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-neutral-900">{val.title}</h3>
                  <p className="font-body text-sm text-neutral-700 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Company Vision & Mission Statements */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-8 md:p-12 border border-neutral-200 rounded-modal bg-white shadow-soft flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-neutral-900">Visi RUV</h3>
          <p className="font-body text-base text-neutral-700 leading-relaxed">
            Menjadi perusahaan pengelolaan barang bekas terdepan dengan keunggulan pelayanan yang mendorong terwujudnya ekonomi sirkular berkelanjutan di Indonesia.
          </p>
        </div>

        <div className="p-8 md:p-12 border border-neutral-200 rounded-modal bg-white shadow-soft flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-neutral-900">Misi RUV</h3>
          <ul className="flex flex-col gap-2 font-body text-sm text-neutral-700 list-disc pl-5 leading-relaxed">
            <li>Memberikan nilai terbaik — Menjadi "Rumah" yang memberi solusi mudah, cepat, dan bernilai tinggi bagi penjual barang bekas.</li>
            <li>Mengedepankan inovasi — Menerapkan sistem penjemputan, penyortiran, dan pengolahan daur ulang berbasis efisiensi.</li>
            <li>Melestarikan lingkungan — Aktif mengurangi sampah anorganik di TPA dengan mengubahnya menjadi bahan baku industri bernilai.</li>
            <li>Menjalin kemitraan yang saling menguntungkan dengan semua pihak dalam rantai nilai daur ulang.</li>
          </ul>
        </div>
      </section>

    </div>
  );
};
export default TentangKami;
