import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Recycle } from 'lucide-react';
import logoPrimer from '../assets/logo-ruv-brown.png';

export const Navbar = ({ onOpenForm }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only run scroll spy on landing page
    if (location.pathname !== '/') return;

    const sections = ['beranda', 'tentang-kami', 'produk', 'kontak'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies mid-viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Beranda', path: '#beranda' },
    { name: 'Tentang Kami', path: '#tentang-kami' },
    { name: 'Produk & Layanan', path: '#produk' },
    { name: 'Kontak', path: '#kontak' },
  ];

  const handleLinkClick = (e, path) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const targetId = path.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(targetId);
        setIsOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-white/85 backdrop-blur-md shadow-soft py-2 border-b border-neutral-200'
        : 'bg-white/85 py-4'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 flex items-center justify-between">
        {/* Branding */}
        <a href="/#beranda" onClick={(e) => handleLinkClick(e, '#beranda')} className="flex items-center gap-2 group shrink-0">
          <img
            src={logoPrimer}
            alt="RUV Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
          />
        </a>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.path.replace('#', '');
            return (
              <a
                key={link.name}
                href={`/${link.path}`}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`font-body text-sm font-bold transition-all py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all ${
                  isActive
                    ? 'text-neutral-900 after:w-full font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-950 after:w-0 hover:after:w-full'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Standout CTA Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenForm}
            className="px-6 py-2.5 bg-[#EFC075] hover:bg-[#e7b25e] text-neutral-900 font-heading text-sm font-black rounded-lg shadow-md shadow-[#EFC075]/20 hover:shadow-[#EFC075]/45 hover:shadow-lg active:scale-[0.97] transition-all duration-150 transform hover:-translate-y-0.5"
          >
            Jual Sekarang!
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-neutral-200 shadow-lg p-6 flex flex-col gap-6 animate-modal-in z-50">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.path.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={`/${link.path}`}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`font-body text-base font-bold py-2 px-4 rounded-lg transition-colors text-left flex items-center justify-between ${
                    isActive
                      ? 'bg-primary/10 text-neutral-900 font-extrabold border-l-4 border-primary'
                      : 'hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  {link.name}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </a>
              );
            })}
          </nav>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenForm();
            }}
            className="w-full py-3.5 bg-[#EFC075] hover:bg-[#e7b25e] text-neutral-900 font-heading text-base font-black rounded-xl shadow-md shadow-[#EFC075]/20 hover:shadow-[#EFC075]/45 active:scale-[0.97] transition-all duration-150 text-center"
          >
            Jual Sekarang!
          </button>
        </div>
      )}
    </header>
  );
};
export default Navbar;
