import { motion } from 'framer-motion';
import { useEffect } from 'react';

const PageTransition = ({ children }) => {
    useEffect(() => {
        // Scroll to top on every page transition
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
