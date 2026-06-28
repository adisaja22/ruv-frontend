import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Recycle } from 'lucide-react';
import logoWhite from '../assets/logo-white.png';

export const Footer = ({ contact }) => {
  const currentYear = new Date().getFullYear();

  const getInstagramUrl = (username) => {
    return username ? `https://instagram.com/${username}` : '#';
  };

  const getTiktokUrl = (username) => {
    return username ? `https://tiktok.com/@${username}` : '#';
  };

  const getWhatsappUrl = (number) => {
    return number ? `https://wa.me/${number}` : '#';
  };

  // Securely clear any saved session to force login when clicking the footer admin link
  const forceLoginAdmin = () => {
    localStorage.removeItem('ruv_admin_token');
    localStorage.removeItem('ruv_admin_user');
  };

  return (
    <footer className="bg-neutral-900 text-neutral-200 pt-16 pb-8 border-t border-neutral-800 font-body">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="flex flex-col items-start gap-4 text-left">
          <a href="/#beranda" className="flex items-center gap-2 group">
            <img 
              src={logoWhite} 
              alt="RUV Logo White" 
              className="h-10 w-auto object-contain" 
            />
          </a>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
            Rongsok Utama Vrakasa (RUV) adalah platform daur ulang profesional yang berkomitmen mendorong ekonomi sirkular berkelanjutan di Indonesia dengan menyulap barang bekas menjadi nilai baru.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            {contact?.instagram && (
              <a
                href={getInstagramUrl(contact.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-neutral-800 hover:bg-secondary text-neutral-300 hover:text-neutral-900 rounded-full transition-all"
                aria-label="Instagram RUV"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contact?.tiktok && (
              <a
                href={getTiktokUrl(contact.tiktok)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-neutral-800 hover:bg-secondary text-neutral-300 hover:text-neutral-900 rounded-full transition-all"
                aria-label="TikTok RUV"
              >
                <span className="font-bold text-xs">TT</span>
              </a>
            )}
            {contact?.whatsapp && (
              <a
                href={getWhatsappUrl(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-neutral-800 hover:bg-secondary text-neutral-300 hover:text-neutral-900 rounded-full transition-all"
                aria-label="WhatsApp RUV"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col items-start gap-4 text-left">
          <h3 className="font-heading text-sm font-bold text-white tracking-wide uppercase">
            Navigasi Cepat
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/#beranda" className="text-sm hover:text-secondary transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="/#tentang-kami" className="text-sm hover:text-secondary transition-colors">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="/#produk" className="text-sm hover:text-secondary transition-colors">
                Produk & Layanan
              </a>
            </li>
            <li>
              <a href="/#kontak" className="text-sm hover:text-secondary transition-colors">
                Kontak
              </a>
            </li>
            <li>
              <Link 
                to="/admin/login" 
                onClick={forceLoginAdmin}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors mt-2 block"
              >
                Portal Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="flex flex-col items-start gap-4 text-left">
          <h3 className="font-heading text-sm font-bold text-white tracking-wide uppercase">
            Hubungi Kami
          </h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-neutral-400 leading-relaxed">
                {contact?.alamat || 'Jl. Raya Cilincing No. 45, Marunda, Cilincing, Jakarta Utara'}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <a
                href={`mailto:${contact?.email || 'info@ruv.co.id'}`}
                className="text-sm text-neutral-400 hover:text-secondary transition-colors"
              >
                {contact?.email || 'info@ruv.co.id'}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <a
                href={getWhatsappUrl(contact?.whatsapp)}
                className="text-sm text-neutral-400 hover:text-secondary transition-colors"
              >
                +{contact?.whatsapp || '6285353285071'}
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-500 text-center md:text-left">
          &copy; {currentYear} Rongsok Utama Vrakasa (RUV). All rights reserved.
        </p>
        <p className="text-[10px] text-neutral-600 text-center md:text-right">
          Mendorong Kelestarian Lingkungan & Ekonomi Sirkular Indonesia.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
