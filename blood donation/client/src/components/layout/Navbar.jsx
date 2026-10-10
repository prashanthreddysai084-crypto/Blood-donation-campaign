import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, User, LogOut, LayoutDashboard, Calendar, History, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isDonor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              LifeStream
            </span>
            <span className="text-xs text-red-600 font-semibold tracking-wider uppercase">
              Blood Community
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link to="/campaigns" className="hover:text-red-600 transition-colors">
            Find Campaigns
          </Link>
          <Link to="/about" className="hover:text-red-600 transition-colors">
            About
          </Link>

          {/* Donor Links */}
          {isDonor && (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Donor Dashboard
              </Link>
              <Link to="/my-registrations" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                <Calendar className="w-4 h-4" />
                My Registrations
              </Link>
              <Link to="/donation-history" className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                <History className="w-4 h-4" />
                History
              </Link>
            </>
          )}

          {/* Admin Links */}
          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-semibold"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* User CTA actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.bloodGroup || 'B'}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-red-600 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
              >
                Join as Donor
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
