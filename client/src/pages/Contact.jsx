import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate sending
        setTimeout(() => {
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: 'Email',
            value: 'support@campusbuddy.com',
            description: 'We reply within 24 hours'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Location',
            value: 'University Campus',
            description: 'Block A, Ground Floor'
        },
        {
            icon: FaPhone,
            title: 'Phone',
            value: '+91 98765 43210',
            description: 'Mon-Fri, 9am-6pm'
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#111] mb-8"
                    >
                        <span className="text-sm text-[#888]">Contact Us</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
                    >
                        Get in touch
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#666] text-lg max-w-xl mx-auto"
                    >
                        Have a question or feedback? We'd love to hear from you.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {contactInfo.map((info, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] hover:border-[#333] transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-[#111] border border-[#222]">
                                        <info.icon className="text-lg text-[#0070f3]" />
                                    </div>
                                    <div>
                                        <p className="text-[#666] text-sm mb-1">{info.title}</p>
                                        <p className="text-white font-medium">{info.value}</p>
                                        <p className="text-[#555] text-sm mt-1">{info.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-3"
                    >
                        <div className="p-8 rounded-xl border border-[#222] bg-[#0a0a0a]">
                            <h2 className="text-xl font-semibold text-white mb-6">Send us a message</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[#888] text-sm font-medium mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#888] text-sm font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[#888] text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors resize-none"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#eee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <FaArrowRight className="text-xs" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
