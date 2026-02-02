import { motion } from 'framer-motion';
import { FaRocket, FaHeart, FaBolt, FaUsers } from 'react-icons/fa';

const About = () => {
    const values = [
        {
            icon: FaBolt,
            title: 'Speed First',
            description: 'Every feature is designed to save you time. Order in seconds, not minutes.'
        },
        {
            icon: FaHeart,
            title: 'Student Focused',
            description: 'Built by students who understand the campus dining experience.'
        },
        {
            icon: FaRocket,
            title: 'Always Improving',
            description: 'We continuously iterate based on your feedback to make ordering better.'
        },
        {
            icon: FaUsers,
            title: 'Community Driven',
            description: 'Connecting students with their favorite campus food outlets.'
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#111] mb-8"
                >
                    <span className="text-sm text-[#888]">About Us</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6"
                >
                    Making campus dining
                    <br />
                    <span className="text-gradient-blue">effortless</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-[#666] max-w-2xl mx-auto leading-relaxed"
                >
                    CampusBuddy is your ultimate companion for navigating campus life.
                    Order food from multiple outlets, track your orders in real-time,
                    and never wait in long queues again.
                </motion.p>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-5xl mx-auto px-6 mb-20"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl border border-[#222] bg-[#0a0a0a]">
                    {[
                        { value: '1000+', label: 'Orders Placed' },
                        { value: '500+', label: 'Happy Students' },
                        { value: '5', label: 'Partner Outlets' },
                        { value: '99.9%', label: 'Uptime' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center py-4">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-[#666]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Values */}
            <div className="max-w-6xl mx-auto px-6 mb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
                    Our Values
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {values.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] hover:border-[#333] transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-[#111] border border-[#222] group-hover:border-[#333] transition-colors">
                                    <value.icon className="text-xl text-[#0070f3]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                    <p className="text-[#666] text-sm leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="p-8 md:p-12 rounded-xl border border-[#222] bg-gradient-to-b from-[#0a0a0a] to-black text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Our Mission
                    </h2>
                    <p className="text-[#888] text-lg leading-relaxed">
                        To transform how students experience campus dining by providing a seamless,
                        fast, and reliable food ordering platform that saves time and eliminates
                        the frustration of waiting in queues.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
