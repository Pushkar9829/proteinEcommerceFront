import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer.jsx';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import Marquee from '../components/Marquee.jsx';
import DemoPixels from '../components/DemoPixels.jsx';
import PopupModal from '../components/PopupModal.jsx';
import { useCart } from '../context/CartContext';
import { useHome } from '../context/HomeContext';

export default function StoreLayout() {
  const { home } = useHome();
  const { toast } = useCart();
  const loc = useLocation();
  const announcement = home?.announcementBar?.body || home?.announcementBar?.title;
  const isHome = loc.pathname === '/';

  return (
    <div className="min-h-screen bg-grain">
      <div className="fixed inset-x-0 top-0 z-30">
        <Marquee text={announcement} />
        <Header />
      </div>
      <div className={isHome ? '' : 'pt-28'}>
        <AnimatePresence mode="wait">
          <motion.main
            key={loc.pathname}
            initial={{ opacity: 0, y: isHome ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isHome ? 0.55 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <CartDrawer />
      <PopupModal popup={home?.popup} />
      <DemoPixels ads={home?.shop?.ads} />
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 bg-ink px-5 py-3 text-[11px] tracking-[0.1em] uppercase text-paper"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
