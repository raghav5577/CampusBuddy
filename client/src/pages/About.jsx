import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="pt-24 min-h-screen text-white px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-['Figtree'] font-bold mb-6"
                >
                    About CampusBuddy
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 font-['Figtree'] text-lg max-w-2xl"
                >
                    CampusBuddy is your ultimate companion for navigating campus life.
                    Order food, check store availability, and stay connected with ease.
                </motion.p>
            </div>
        </div>
    );
};

export default About;
