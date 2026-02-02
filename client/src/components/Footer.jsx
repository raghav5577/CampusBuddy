import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Stores', path: '/stores' },
            { name: 'Menu', path: '/stores' },
            { name: 'Orders', path: '/orders' },
        ],
        company: [
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' },
        ],
    };

    const socialLinks = [
        { icon: FaGithub, url: 'https://github.com/raghav5577', label: 'GitHub' },
        { icon: FaLinkedin, url: '#', label: 'LinkedIn' },
        { icon: FaInstagram, url: '#', label: 'Instagram' },
    ];

    return (
        <footer className="w-full border-t border-[#222] bg-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🍔</span>
                            <span className="text-white font-semibold text-lg">CampusBuddy</span>
                        </div>
                        <p className="text-[#666] text-sm leading-relaxed mb-4">
                            The fastest way to order food on campus.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#666] hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-medium text-sm mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-[#666] hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-medium text-sm mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-[#666] hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="text-white font-medium text-sm mb-4">Status</h4>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-[#50e3c2] rounded-full animate-pulse" />
                            <span className="text-[#666]">All systems operational</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#666] text-sm">
                        © {currentYear} CampusBuddy. All rights reserved.
                    </p>
                    <p className="text-[#666] text-sm flex items-center gap-1">
                        Made with <FaHeart className="text-[#e00] mx-1" /> by{' '}
                        <a
                            href="https://github.com/raghav5577"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#0070f3] transition-colors"
                        >
                            Raghav
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
