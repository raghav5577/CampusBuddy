import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="pt-24 min-h-screen text-white px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-['Figtree'] font-bold mb-6"
                >
                    Contact Us
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-xl"
                >
                    <div className="space-y-4 font-['Figtree']">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#5227FF]" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#5227FF]" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Message</label>
                            <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#5227FF]" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full py-3 bg-[#5227FF] rounded-xl font-bold hover:bg-[#4118e6] transition-colors mt-2">
                            Send Message
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
