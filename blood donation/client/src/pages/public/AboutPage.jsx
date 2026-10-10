import React from 'react';
import { Heart, ShieldCheck, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">Our Mission</span>
        <h1 className="text-4xl font-black text-slate-900 mt-2">
          Empowering Communities Through Transparent Blood Donation
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          The Community Blood Donation Campaign Management System connects volunteer donors, local hospitals, and civic organizations to eliminate critical blood shortages during emergencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">100% Voluntary</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every drop is generously contributed by volunteer community members motivated by altruism and community solidarity.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Safety</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            All drives are staffed by licensed healthcare professionals complying with national health authority donation standards.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Capacity</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Digital slot management avoids overcrowding at donation camps, respecting your valuable time and schedule.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black">Ready to make a difference?</h2>
          <p className="text-slate-400 text-sm mt-1">Register today and receive alerts when local camps need your blood group.</p>
        </div>
        <Link
          to="/register"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-md"
        >
          Join as a Donor
        </Link>
      </div>
    </div>
  );
};
