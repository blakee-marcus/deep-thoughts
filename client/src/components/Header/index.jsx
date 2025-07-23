import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bell, User, LogOut, LogIn, UserPlus, MessageCircle, PlusCircle } from 'lucide-react';
import Auth from '../../utils/auth';

const navItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

const Header = () => {
  const location = useLocation();
  const loggedIn = Auth.loggedIn();
  const profile = loggedIn ? Auth.getProfile() : null;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  if (profile?.data?.username) {
    navLinks.push({
      to: `/profile/${profile.data.username}`,
      label: 'Profile',
      icon: User,
    });
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    Auth.logout();
  };

  return (
    <aside className='fixed top-0 left-0 h-screen w-20 md:w-64 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col justify-between px-3 py-6'>
      {/* Brand Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center gap-3 px-3 mb-4'>
        <MessageCircle className='w-6 h-6 text-primary' />
        <span className='hidden md:inline text-lg font-semibold tracking-tight'>Deep Thoughts</span>
      </motion.div>

      {/* Navigation Links */}
      <motion.nav
        initial='hidden'
        animate='visible'
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className='flex flex-col gap-2 flex-1'>
        {loggedIn ? (
          <>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <motion.div key={label} variants={navItemVariants}>
                <Link
                  to={to}
                  className={`flex items-center gap-4 px-4 py-2 rounded-md transition-all text-sm ${
                    isActive(to)
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}>
                  <Icon className='w-5 h-5' />
                  <span className='hidden md:inline'>{label}</span>
                </Link>
              </motion.div>
            ))}

            <motion.div variants={navItemVariants}>
              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-4 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition'>
                <LogOut className='w-5 h-5' />
                <span className='hidden md:inline'>Logout</span>
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={navItemVariants}>
              <Link
                to='/login'
                className='flex items-center gap-4 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition'>
                <LogIn className='w-5 h-5' />
                <span className='hidden md:inline'>Login</span>
              </Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link
                to='/signup'
                className='flex items-center gap-4 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition'>
                <UserPlus className='w-5 h-5' />
                <span className='hidden md:inline'>Signup</span>
              </Link>
            </motion.div>
          </>
        )}
      </motion.nav>

      {/* CTA */}
      {loggedIn && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='px-3'>
          <button className='w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium py-2 rounded-md hover:bg-primary/90 transition'>
            <PlusCircle className='w-4 h-4' />
            <span className='hidden md:inline'>New Post</span>
          </button>
        </motion.div>
      )}
    </aside>
  );
};

export default Header;
