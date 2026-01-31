import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FlowingMenu from '../components/FlowingMenu';
import { API_URL } from '../config';

const Home = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/outlets`);
                setOutlets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlets();
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '20px' }}>Loading outlets...</div>;

    // Transform outlets to FlowingMenu items format
    const menuItems = outlets.map(outlet => ({
        text: outlet.name,
        link: `/outlet/${outlet._id}`,
        image: outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/400x250?text=Outlet' : outlet.image
    }));

    return (
        <div className="relative w-full">
            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-20">

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 font-['Figtree'] leading-tight">
                    Hungry? <br />
                    We've got you covered.
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-12">
                    Experience the future of campus dining. Order from your favorite outlets,
                    skip the long lines, and enjoy your meal.
                </p>

                {/* Optional CTA Buttons if needed later */}
            </div>

            <div className="w-full pb-64" id="outlets">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 font-['Figtree']">
                    Campus Outlets
                </h2>

                {/* Replaced Grid with FlowingMenu */}
                {outlets.length === 0 ? (
                    <p className="text-center text-white/60">No outlets found. Please check back later.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF" // White text
                        bgColor="transparent"
                        marqueeBgColor="linear-gradient(to right, #2563EB, #7C3AED)" // Blue to Violet Gradient
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.2)" // Subtle white border
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
