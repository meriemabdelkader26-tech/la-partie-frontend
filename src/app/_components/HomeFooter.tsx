import Link from "next/link";
import { APP_NAME, FOOTER_SECTIONS } from "@/constant";

export default function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-rose-50 border-t border-rose-200 text-rose-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {FOOTER_SECTIONS.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              {section.description && (
                <p className="text-sm">{section.description}</p>
              )}
              {section.links && section.links.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="hover:text-pink-400 transition-colors"
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
        <div className="border-t border-rose-200 pt-8 text-center text-sm">
          <p>
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
