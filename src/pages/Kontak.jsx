import React from 'react';
import { Mail, MapPin, Phone, Instagram, Send, MessageSquare } from 'lucide-react';

export const Kontak = ({ contactData }) => {
  const contact = contactData?.contact || {
    alamat: 'Jl. Raya Cilincing No. 45, Marunda, Kecamatan Cilincing, Jakarta Utara, DKI Jakarta 14150',
    email: 'info@ruv.co.id',
    instagram: 'ruv.indonesia',
    tiktok: 'ruv.indonesia',
    whatsapp: '6285353285071',
    maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.0425714349377!2d106.9458283!3d-6.124976799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a200788ad7c6f%3A0xe5fa9c18d34dcbf6!2sMarunda%2C%20Cilincing%2C%20North%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
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

  return (
    <div className="flex flex-col gap-16 py-16 max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 text-left">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center">
        <span className="font-body text-xs font-bold text-primary tracking-widest uppercase">
          Hubungi Kami
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900">
          Kontak RUV
        </h1>
        <p className="font-body text-base text-neutral-700 max-w-xl mx-auto leading-relaxed mt-2">
          Kami siap melayani pertanyaan seputar penjemputan barang bekas, kemitraan daur ulang, atau harga komoditas produk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mt-6">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">Informasi Kontak</h2>
          
          <div className="flex flex-col gap-4">
            {/* Alamat */}
            <a
              href={contact.alamat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.alamat)}` : "https://maps.google.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-neutral-200 rounded-card bg-white shadow-soft flex items-start gap-4 hover:shadow-hover hover:-translate-y-1 hover:border-secondary transition-all group block"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-neutral-900">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="font-heading text-sm font-bold text-neutral-900">Alamat Kantor & Gudang</span>
                <span className="font-body text-sm text-neutral-700 leading-relaxed">{contact.alamat}</span>
              </div>
            </a>

            {/* Email */}
            <div className="p-6 border border-neutral-200 rounded-card bg-white shadow-soft flex items-start gap-4 hover:shadow-hover transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="font-heading text-sm font-bold text-neutral-900">Email Resmi</span>
                <a href={`mailto:${contact.email}`} className="font-body text-sm text-neutral-700 hover:text-secondary transition-colors">
                  {contact.email}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 border border-neutral-200 rounded-card bg-white shadow-soft flex items-start gap-4 hover:shadow-hover transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.436 0 9.852-4.414 9.855-9.855.001-2.636-1.024-5.112-2.89-6.98S14.646 1.01 12.008 1.01c-5.44 0-9.859 4.414-9.862 9.858-.001 1.61.425 3.179 1.232 4.584l-.979 3.578 3.658-.96zM17.65 14.93c-.305-.153-1.805-.89-2.083-.99-.278-.1-.482-.15-.683.15-.202.3-.78.99-.956 1.19-.176.2-.352.226-.657.075-.305-.153-1.287-.475-2.45-1.514-.906-.807-1.517-1.805-1.695-2.11-.178-.306-.019-.47.133-.62.138-.135.305-.353.457-.53.152-.177.202-.303.303-.506.102-.203.05-.38-.025-.53-.075-.15-.683-1.647-.936-2.254-.246-.593-.497-.512-.683-.512-.177-.002-.38-.002-.583-.002-.203 0-.533.076-.812.38-.28.304-1.066 1.042-1.066 2.54 0 1.498 1.09 2.946 1.242 3.148.152.203 2.146 3.277 5.198 4.593.726.313 1.293.5 1.734.64.73.23 1.39.198 1.916.12.583-.087 1.805-.738 2.058-1.453.253-.715.253-1.327.177-1.452-.076-.127-.278-.203-.583-.356z"/>
                </svg>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="font-heading text-sm font-bold text-neutral-900">WhatsApp Admin</span>
                <a 
                  href={getWhatsappUrl(contact.whatsapp)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-body text-sm text-neutral-700 hover:text-secondary transition-colors"
                >
                  +{contact.whatsapp}
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Link Grid */}
          <div className="flex flex-col gap-3 mt-4">
            <span className="font-heading text-sm font-bold text-neutral-900">Media Sosial Kami</span>
            <div className="flex items-center gap-3">
              {contact.instagram && (
                <a
                  href={getInstagramUrl(contact.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white text-neutral-900 rounded-lg border border-neutral-200 font-body text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              )}
              {contact.tiktok && (
                <a
                  href={getTiktokUrl(contact.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-900 rounded-lg border border-neutral-200 font-body text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.24-.24V14c0 3.31-2.3 6.44-5.69 7.04-3.13.6-6.62-1.12-7.66-4.26-1.17-3.4.77-7.64 4.31-8.37.89-.19 1.83-.17 2.72.06v4.11a4.917 4.917 0 00-2.73.75c-1.66 1.11-2.11 3.48-.96 5.18 1.1 1.7 3.58 2.16 5.23.99 1.54-1.03 1.92-3.23 1.84-5.04V.02z"/>
                  </svg>
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">Lokasi Google Maps</h2>
          {(() => {
            const mapsIframeUrl = contact.maps_embed_url || (contact.alamat ? `https://maps.google.com/maps?q=${encodeURIComponent(contact.alamat)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '');
            return mapsIframeUrl ? (
              <div className="w-full flex-grow min-h-[360px] rounded-modal overflow-hidden border border-neutral-200 shadow-soft relative bg-neutral-100">
                <iframe
                  title="Google Maps Lokasi RUV"
                  src={mapsIframeUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div className="w-full flex-grow min-h-[360px] rounded-modal border border-neutral-200 bg-neutral-100 flex items-center justify-center text-neutral-400 font-body text-sm font-medium">
                Peta belum dikonfigurasi.
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
export default Kontak;
