import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './style.scss';
import logo from '../../../assets/images/logo.png';

interface LoadingPageProps {
  isLoading: boolean;
}

const quotes = [
  "Thấu hiểu làn da - Nâng tầm vẻ đẹp",
  "Preparing your beauty ritual...",
  "Vẻ đẹp thực sự bắt đầu từ lúc bạn quyết định là chính mình",
  "Radiance is a reflection of your inner balance",
  "Nâng niu vẻ đẹp nguyên bản của bạn"
];

const LoadingPage: React.FC<LoadingPageProps> = ({ isLoading }) => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="luxury-loading-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            filter: 'blur(10px)', 
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            <div className="logo-wrapper">
              <div className="glow-effect"></div>
              <img src={logo} alt="BeautyCare Logo" className="pulse-logo" />
            </div>
            
            <motion.p 
              className="beauty-quote"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            >
              {quote}
            </motion.p>
          </div>

          <div className="progress-container">
            <motion.div 
              className="minimal-progress-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
