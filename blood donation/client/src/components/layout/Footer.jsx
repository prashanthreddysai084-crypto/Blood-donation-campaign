import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-white">LifeStream</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering communities through transparent, volunteer-driven blood donation campaign management.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Campaigns</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/campaigns" className="hover:text-red-400">Upcoming Drives</Link></li>
              <li><Link to="/campaigns" className="hover:text-red-400">By City</Link></li>
              <li><Link to="/campaigns" className="hover:text-red-400">Rare Blood Groups</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-red-400">About the Drive</Link></li>
              <li><Link to="/register" className="hover:text-red-400">Become a Donor</Link></li>
              <li><span className="text-slate-500">Emergency Helpline: 108</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Security & Trust</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Medical standards compliant. We never share sensitive contact records without voluntary authorization.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Community Blood Donation Campaign Management System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for saving lives with full-stack MERN reliability.</p>
        </div>
      </div>
    </footer>
  );
};
