import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await register(formData.name, formData.email, formData.password, formData.phone);
        setIsSubmitting(false);
        if (success) {
            setOtpSent(true);
        }
    };

    const handleVerifyParams = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await verifyOTP(formData.email, otp);
        setIsSubmitting(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 py-24">
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
                        {otpSent ? 'Verify Email' : 'Create an account'}
                    </h1>
                    <p className="text-[#666]">
                        {otpSent ? `Enter the OTP sent to ${formData.email}` : 'Get started with CampusBuddy'}
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8">
                    {!otpSent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Email Address
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
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <p className="text-[#555] text-xs mt-2">Must be at least 6 characters</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#eee] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Get OTP
                                        <FaArrowRight className="text-xs" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyParams} className="space-y-5">
                            <div>
                                <label className="block text-[#888] text-sm font-medium mb-2">
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors text-center text-2xl tracking-widest"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-lg font-semibold text-sm hover:bg-[#eee] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Verify Email
                                        <FaArrowRight className="text-xs" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="w-full text-[#666] text-sm hover:text-white transition-colors mt-4"
                            >
                                Back to Registration
                            </button>
                        </form>
                    )}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#222]" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-[#0a0a0a] text-[#666]">OR</span>
                        </div>
                    </div>

                    <p className="text-center text-[#666] text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Terms */}
                <p className="text-center text-[#555] text-xs mt-6">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
