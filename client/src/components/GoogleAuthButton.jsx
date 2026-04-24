import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '../config';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

const loadGoogleScript = () => new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
        resolve();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = GOOGLE_SCRIPT_ID;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
});

const GoogleAuthButton = ({ onSuccess, mode = 'signin' }) => {
    const buttonRef = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const renderGoogleButton = async () => {
            try {
                if (!GOOGLE_CLIENT_ID) {
                    setError('Google sign-in is not configured');
                    return;
                }

                await loadGoogleScript();
                if (!isMounted || !window.google?.accounts?.id || !buttonRef.current) {
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: ({ credential }) => {
                        if (credential && onSuccess) {
                            onSuccess(credential);
                        }
                    }
                });

                buttonRef.current.innerHTML = '';
                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    text: mode === 'signup' ? 'signup_with' : 'signin_with',
                    shape: 'pill',
                    width: 340
                });
            } catch {
                if (isMounted) {
                    setError('Google sign-in is currently unavailable');
                }
            }
        };

        renderGoogleButton();

        return () => {
            isMounted = false;
        };
    }, [onSuccess, mode]);

    if (error) {
        return <p className="text-center text-xs text-red-400">{error}</p>;
    }

    return (
        <div className="flex justify-center">
            <div ref={buttonRef} />
        </div>
    );
};

export default GoogleAuthButton;
