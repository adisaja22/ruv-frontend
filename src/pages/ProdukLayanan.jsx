import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { ShoppingBag, Truck, Cpu, Recycle, ArrowRight, Loader2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ProdukLayanan = ({ onOpenForm }) => {
  const [activeTab, setActiveTab] = useState('ruv-buy');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['publicProducts', selectedCategory],
    queryFn: () => apiService.getProducts(selectedCategory),
    staleTime: 2 * 60 * 1000,
  });

  const products = productsData?.products || [];
  const counts = productsData?.counts || { Semua: 0, Plastik: 0, Besi: 0, Elektronik: 0, Kertas: 0, Logam: 0 };

  const categories = [
    { name: 'Semua', label: 'Semua Kategori' },
    { name: 'Plastik', label: 'Plastik' },
    { name: 'Besi', label: 'Besi' },
    { name: 'Elektronik', label: 'Elektronik' },
    { name: 'Kertas', label: 'Kertas' },
    { name: 'Logam', label: 'Logam' },
  ];

  // Helper for product category badges style
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

  return (
    <div className="flex flex-col gap-12 py-16 max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 text-left">
      {/* Page Header */}
      <div className="flex flex-col gap-3 text-center">
        <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">
          Katalog & Layanan
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
          Produk & Layanan RUV
        </h1>
        <p className="font-body text-base text-neutral-700 max-w-xl mx-auto leading-relaxed mt-2">
          Jelajahi harga beli komoditas barang rongsok kami dan pilih layanan pengelolaan sampah yang sesuai dengan kebutuhan Anda.
        </p>
      </div>

      {/* Tabs Controller */}
      <div className="flex border-b border-neutral-200 mt-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ruv-buy')}
          className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${
            activeTab === 'ruv-buy'
              ? 'border-primary text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          RUV BUY
        </button>
        <button
          onClick={() => setActiveTab('ruv-pick')}
          className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${
            activeTab === 'ruv-pick'
              ? 'border-primary text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Truck className="w-5 h-5" />
          RUV PICK
        </button>
        <button
          onClick={() => setActiveTab('ruv-gen')}
          className={`flex items-center gap-2 py-4 px-6 font-heading text-sm md:text-base font-bold transition-all relative border-b-2 whitespace-nowrap ${
            activeTab === 'ruv-gen'
              ? 'border-primary text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Cpu className="w-5 h-5" />
          RUV GEN
        </button>
      </div>

      {/* Tab Contents */}
      <div className="py-6 min-h-[500px]">
        {/* ========================================================
            TAB 1: RUV BUY (Katalog Harga)
            ======================================================== */}
        {activeTab === 'ruv-buy' && (
          <div className="flex flex-col gap-8 animate-modal-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-xl font-bold text-neutral-900">Katalog Harga Beli RUV</h3>
                <p className="font-body text-xs text-neutral-400">Harga dapat berubah sewaktu-waktu sesuai kondisi pasar daur ulang global.</p>
              </div>
              <button 
                onClick={onOpenForm}
                className="self-start px-5 py-2.5 bg-secondary text-neutral-900 font-body text-xs font-bold rounded-lg shadow-soft hover:bg-secondary-dark transition-colors flex items-center gap-2"
              >
                Jual Barang Sekarang
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Category Chips */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all flex items-center gap-2 ${
                    selectedCategory === cat.name
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {cat.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.name ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {counts[cat.name] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                <span className="font-body text-sm text-neutral-400">Memuat katalog produk...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-neutral-100 rounded-card border border-neutral-200">
                <Recycle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h4 className="font-heading text-base font-bold text-neutral-700">Belum ada data produk</h4>
                <p className="font-body text-xs text-neutral-400 mt-1">Belum ada item terdaftar di kategori ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-6 bg-white border border-neutral-200 rounded-card shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-3">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(prod.kategori)}`}>
                          {prod.kategori}
                        </span>
                        {prod.perubahan_harga && (
                          <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">
                            {prod.perubahan_harga}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading text-base font-bold text-neutral-900 mb-1">{prod.nama}</h4>
                    </div>

                    <div className="border-t border-neutral-100 pt-3 mt-4 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest leading-none font-bold">Harga Beli</span>
                        <span className="font-heading text-lg font-bold text-neutral-900 mt-1">
                          Rp {prod.harga.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <span className="font-body text-xs text-neutral-500 font-semibold mb-1">
                        / {prod.satuan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: RUV PICK (Layanan Jemput)
            ======================================================== */}
        {activeTab === 'ruv-pick' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-modal-in">
            {/* Description */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                Layanan Penjemputan RUV PICK
              </h3>
              <p className="font-body text-base text-neutral-700 leading-relaxed">
                RUV PICK adalah solusi praktis untuk menjual barang bekas dalam volume kecil maupun besar. Kami mengerahkan tim kurir profesional langsung ke rumah, kantor, atau gudang Anda di area Jakarta.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-heading text-sm font-bold text-neutral-900">Timbangan Digital Terbuka</span>
                    <span className="font-body text-xs text-neutral-500">Proses timbang transparan menggunakan timbangan digital resmi di hadapan Anda.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-heading text-sm font-bold text-neutral-900">Bebas Biaya Transport</span>
                    <span className="font-body text-xs text-neutral-500">Layanan penjemputan sepenuhnya gratis tanpa potongan biaya transportasi.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-heading text-sm font-bold text-neutral-900">Pembayaran Instan</span>
                    <span className="font-body text-xs text-neutral-500">Terima pembayaran langsung setelah penimbangan melalui tunai atau transfer bank lokal.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenForm}
                className="self-start mt-4 px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 font-body text-sm font-bold rounded-lg shadow-soft transition-colors"
              >
                Pesan Penjemputan Sekarang
              </button>
            </div>

            {/* Steps Timeline visual */}
            <div className="lg:col-span-6 flex flex-col gap-8 bg-neutral-100 p-8 rounded-modal border border-neutral-200">
              <h4 className="font-heading text-base font-bold text-neutral-900 mb-2">3 Langkah Mudah Jual Rongsok</h4>
              
              <div className="relative border-l border-neutral-300 pl-6 flex flex-col gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute left-[-35px] top-0 w-[18px] h-[18px] bg-white border-2 border-primary rounded-full flex items-center justify-center font-heading text-[10px] font-bold text-neutral-900 shadow-soft">
                    1
                  </span>
                  <div className="flex flex-col text-left gap-1">
                    <span className="font-heading text-sm font-bold text-neutral-900">Isi Form Penjualan</span>
                    <span className="font-body text-xs text-neutral-700">Isi data diri, estimasi berat, dan alamat Anda di tombol form halaman ini.</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute left-[-35px] top-0 w-[18px] h-[18px] bg-white border-2 border-primary rounded-full flex items-center justify-center font-heading text-[10px] font-bold text-neutral-900 shadow-soft">
                    2
                  </span>
                  <div className="flex flex-col text-left gap-1">
                    <span className="font-heading text-sm font-bold text-neutral-900">Konfirmasi & Penjemputan</span>
                    <span className="font-body text-xs text-neutral-700">Tim kami akan mengonfirmasi penjemputan dan meluncur ke lokasi sesuai jadwal yang disepakati.</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute left-[-35px] top-0 w-[18px] h-[18px] bg-white border-2 border-primary rounded-full flex items-center justify-center font-heading text-[10px] font-bold text-neutral-900 shadow-soft">
                    3
                  </span>
                  <div className="flex flex-col text-left gap-1">
                    <span className="font-heading text-sm font-bold text-neutral-900">Timbang & Terima Uang</span>
                    <span className="font-body text-xs text-neutral-700">Barang rongsok ditimbang, dicocokkan kategori, dan uang langsung dibayar cash/transfer.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: RUV GEN (Pengolahan Plastik)
            ======================================================== */}
        {activeTab === 'ruv-gen' && (
          <div className="flex flex-col gap-10 animate-modal-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Description */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                  Unit Pengolahan Plastik RUV GEN
                </h3>
                <p className="font-body text-base text-neutral-700 leading-relaxed">
                  RUV GEN (Generation) adalah divisi pengolahan sampah anorganik sekunder RUV. Kami mengkhususkan diri dalam pencacahan dan penggilingan sampah plastik jenis PET, PP, dan HDPE menjadi cacahan plastik (plastic flakes) berkualitas tinggi.
                </p>
                <p className="font-body text-sm text-neutral-600 leading-relaxed">
                  Cacahan plastik hasil olahan RUV GEN kemudian dipasok ke berbagai pabrik daur ulang nasional maupun internasional untuk dijadikan benang poliester, kemasan baru, serta produk plastik berkelanjutan lainnya.
                </p>
              </div>

              {/* Stat card */}
              <div className="lg:col-span-5 bg-gradient-brand p-8 rounded-modal border border-neutral-200 flex flex-col items-center justify-center text-center shadow-soft relative overflow-hidden">
                <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px] pointer-events-none" />
                <Cpu className="w-16 h-16 text-primary mb-3 animate-pulse-slow relative z-10" />
                <h4 className="font-heading text-lg font-bold text-neutral-900 relative z-10">Kapasitas Produksi Giling</h4>
                <span className="font-heading text-3xl font-extrabold text-neutral-900 mt-2 relative z-10">Up to 2.5 Ton / Hari</span>
                <p className="font-body text-xs text-neutral-700 mt-1 max-w-[240px] relative z-10">Kapasitas giling optimal didukung oleh mesin crusher modern & kolam pencucian steril.</p>
              </div>
            </div>

            {/* Diagram Alur */}
            <div className="flex flex-col gap-6 border-t border-neutral-200 pt-8 mt-4">
              <h4 className="font-heading text-lg font-bold text-neutral-900 text-center">Diagram Alur Pengolahan RUV GEN</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch mt-2">
                {/* Step 1 */}
                <div className="bg-neutral-100 p-6 rounded-card border border-neutral-200 flex flex-col items-center text-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-heading font-bold text-neutral-900 border border-neutral-200">1</div>
                  <h5 className="font-heading text-sm font-bold text-neutral-900">Pilah & Sortir</h5>
                  <p className="font-body text-xs text-neutral-600">Sampah plastik bekas dibersihkan dari label dan dipilah berdasarkan jenis polimer & warna.</p>
                </div>

                {/* Step 2 */}
                <div className="bg-neutral-100 p-6 rounded-card border border-neutral-200 flex flex-col items-center text-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-heading font-bold text-neutral-900 border border-neutral-200">2</div>
                  <h5 className="font-heading text-sm font-bold text-neutral-900">Giling & Crusher</h5>
                  <p className="font-body text-xs text-neutral-600">Plastik dimasukkan ke mesin crusher untuk digiling menjadi serpihan berukuran 8mm - 12mm.</p>
                </div>

                {/* Step 3 */}
                <div className="bg-neutral-100 p-6 rounded-card border border-neutral-200 flex flex-col items-center text-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-heading font-bold text-neutral-900 border border-neutral-200">3</div>
                  <h5 className="font-heading text-sm font-bold text-neutral-900">Cuci & Kering</h5>
                  <p className="font-body text-xs text-neutral-600">Serpihan plastik dicuci bersih di kolam friksi untuk membuang zat kontaminan, lalu dikeringkan.</p>
                </div>

                {/* Step 4 */}
                <div className="bg-neutral-100 p-6 rounded-card border border-neutral-200 flex flex-col items-center text-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-heading font-bold text-neutral-900 border border-neutral-200">4</div>
                  <h5 className="font-heading text-sm font-bold text-neutral-900">Cacahan Plastik</h5>
                  <p className="font-body text-xs text-neutral-600">Cacahan plastik kering dikemas ke jumbo bag dan siap dikirim ke pabrik manufaktur daur ulang.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProdukLayanan;
