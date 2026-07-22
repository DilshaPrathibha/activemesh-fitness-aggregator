import { Outlet } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--color-bg))]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
