import Link from "next/link";
import { APP_NAME, FOOTER_SECTIONS } from "@/constant";
import { ArrowUp } from "lucide-react";

export default function HomeFooter() {
  const year = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-20 px-4 relative">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute top-8 right-8 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-large group"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {FOOTER_SECTIONS.map((section, index) => (
            <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white"></span>
              </h4>
              {section.description && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {section.description}
                </p>
              )}
              {section.links && section.links.length > 0 && (
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-2">
              {APP_NAME}
            </h3>
            <p className="text-gray-400 text-sm">
              Connecting brands with influencers
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p>
              &copy; {year} {APP_NAME}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn', 'Instagram'].map((social, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                aria-label={social}
              >
                <span className="text-xs font-bold">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}