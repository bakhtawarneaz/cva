import React, { useState, useEffect } from 'react';
import { FaChevronUp } from "react-icons/fa6";

const BackToTopButton = () => {

    /* UseState Here...*/
    const [showButton, setShowButton] = useState(false);


    /* Hooks Here...*/
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /* Functions Here...*/
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        showButton && (
            <button
                onClick={scrollToTop}
                style={{
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    borderRadius: '50px',
                    background: 'var(--primary-color)',
                    color: '#fff',
                    border: 'none',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FaChevronUp />
            </button>
        )
    );
};

export default BackToTopButton;
