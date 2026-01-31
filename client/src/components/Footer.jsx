import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        { name: 'Linktree', url: '#' },
        { name: 'GitHub', url: 'https://github.com/raghav5577' },
        { name: 'LinkedIn', url: '#' },
        { name: 'Instagram', url: '#' },
    ];

    return (
        <footer className="w-full py-8 mt-20 border-t border-white/5 relative z-10 bg-transparent">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-['Figtree']">

                {/* Left Side */}
                <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2 mb-1 opacity-80">
                        <span className="text-xl">🍔</span>
                        <span className="text-white font-medium text-lg tracking-tight">CampusBuddy</span>
                    </div>
                    <p className="text-white/60">
                        Made with <FaHeart className="inline text-red-500 mx-1 w-3 h-3" /> by <span className="text-[#A78BFA] font-medium">Raghav</span>
                    </p>
                    <p className="text-white/30 text-xs">
                        © {currentYear} CampusBuddy
                    </p>
                </div>

                {/* Right Side - Links */}
                <div className="flex flex-wrap justify-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors font-medium tracking-wide"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
