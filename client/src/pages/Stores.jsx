import { useState, useEffect } from 'react';
import axios from 'axios';
import FlowingMenu from '../components/FlowingMenu';
import { API_URL } from '../config';

const Stores = () => {
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

    // Transform outlets to FlowingMenu items format
    const menuItems = outlets.map(outlet => ({
        text: outlet.name,
        link: `/outlet/${outlet._id}`,
        image: outlet.image === 'no-photo.jpg' ? 'https://via.placeholder.com/400x250?text=Outlet' : outlet.image
    }));

    return (
        <div className="pt-24 min-h-screen">
            <div className="container" id="outlets" style={{ marginTop: '20px', marginBottom: '50px', maxWidth: '100%' }}>
                <h2 className="text-4xl font-['Figtree'] font-bold text-white text-center mb-10">Campus Outlets & Stores</h2>

                {loading ? (
                    <div className="text-white text-center">Loading stores...</div>
                ) : outlets.length === 0 ? (
                    <p className="text-white text-center">No outlets found.</p>
                ) : (
                    <FlowingMenu
                        items={menuItems}
                        textColor="#FFFFFF"
                        bgColor="transparent"
                        marqueeBgColor="linear-gradient(to right, #2563EB, #7C3AED)"
                        marqueeTextColor="#fff"
                        borderColor="rgba(255,255,255,0.2)"
                    />
                )}
            </div>
        </div>
    );
};

export default Stores;
