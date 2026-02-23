import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../config';
import socket from '../socket';

const Debug = () => {
    const [status, setStatus] = useState({
        api: { status: 'checking...', details: null },
        socket: { status: 'checking...', details: null },
        config: { API_URL, SOCKET_URL }
    });

    useEffect(() => {
        // Test API connection
        const testAPI = async () => {
            try {
                const startTime = Date.now();
                const response = await axios.get(`${API_URL}/health`);
                const duration = Date.now() - startTime;
                setStatus(prev => ({
                    ...prev,
                    api: {
                        status: '✅ Connected',
                        details: `Response time: ${duration}ms`,
                        data: response.data
                    }
                }));
            } catch (error) {
                setStatus(prev => ({
                    ...prev,
                    api: {
                        status: '❌ Failed',
                        details: error.message,
                        error: error.response?.data || error.message
                    }
                }));
            }
        };

        // Test Socket connection
        const testSocket = () => {
            if (socket.connected) {
                setStatus(prev => ({
                    ...prev,
                    socket: {
                        status: '✅ Connected',
                        details: `Socket ID: ${socket.id}`
                    }
                }));
            } else {
                setStatus(prev => ({
                    ...prev,
                    socket: {
                        status: '⏳ Connecting...',
                        details: 'Waiting for connection'
                    }
                }));
            }
        };

        testAPI();
        testSocket();

        // Socket event listeners
        socket.on('connect', () => {
            setStatus(prev => ({
                ...prev,
                socket: {
                    status: '✅ Connected',
                    details: `Socket ID: ${socket.id}`
                }
            }));
        });

        socket.on('connect_error', (error) => {
            setStatus(prev => ({
                ...prev,
                socket: {
                    status: '❌ Connection Error',
                    details: error.message
                }
            }));
        });

        socket.on('disconnect', (reason) => {
            setStatus(prev => ({
                ...prev,
                socket: {
                    status: '⚠️ Disconnected',
                    details: reason
                }
            }));
        });

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">
                    🔧 System Debug Information
                </h1>

                {/* Configuration */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">📋 Configuration</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="text-gray-300">
                            <span className="text-blue-400">API URL:</span>{' '}
                            <span className="text-green-300">{status.config.API_URL}</span>
                        </div>
                        <div className="text-gray-300">
                            <span className="text-blue-400">Socket URL:</span>{' '}
                            <span className="text-green-300">{status.config.SOCKET_URL}</span>
                        </div>
                        <div className="text-gray-300">
                            <span className="text-blue-400">Hostname:</span>{' '}
                            <span className="text-green-300">{window.location.hostname}</span>
                        </div>
                        <div className="text-gray-300">
                            <span className="text-blue-400">Protocol:</span>{' '}
                            <span className="text-green-300">{window.location.protocol}</span>
                        </div>
                    </div>
                </div>

                {/* API Status */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">🌐 API Status</h2>
                    <div className="space-y-2">
                        <div className="text-xl text-white">{status.api.status}</div>
                        <div className="text-gray-300">{status.api.details}</div>
                        {status.api.data && (
                            <pre className="bg-black/30 p-4 rounded text-green-400 text-sm overflow-auto">
                                {JSON.stringify(status.api.data, null, 2)}
                            </pre>
                        )}
                        {status.api.error && (
                            <pre className="bg-red-900/30 p-4 rounded text-red-300 text-sm overflow-auto">
                                {JSON.stringify(status.api.error, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>

                {/* Socket Status */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">🔌 Socket.IO Status</h2>
                    <div className="space-y-2">
                        <div className="text-xl text-white">{status.socket.status}</div>
                        <div className="text-gray-300">{status.socket.details}</div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-500/20 backdrop-blur-lg rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold text-yellow-300 mb-3">💡 Troubleshooting</h2>
                    <ul className="text-gray-200 space-y-2 text-sm">
                        <li>• If API fails: Check if your Render backend is awake (free tier sleeps)</li>
                        <li>• If Socket fails: Render may take 30-60 seconds to wake up on first request</li>
                        <li>• Check browser console for detailed error messages</li>
                        <li>• Verify CORS settings on backend allow your frontend URL</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Debug;
