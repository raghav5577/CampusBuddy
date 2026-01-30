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
        <div>
            {/* Hero Section */}
            <div className="hero">
                <div style={{ zIndex: 10 }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Hungry? We've got you covered.</h1>
                    <p style={{ fontSize: '1.2rem' }}>Order from your favorite campus outlets and skip the line.</p>
                </div>
            </div>

            <div className="container" id="outlets" style={{ marginTop: '20px', marginBottom: '50px', maxWidth: '100%' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Campus Outlets</h2>

                {/* Replaced Grid with FlowingMenu */}
                {outlets.length === 0 ? (
                    <p>No outlets found. Please check back later.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF" // White text
                        bgColor="transparent"
                        marqueeBgColor="#FF6B6B"
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.2)" // Subtle white border
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
