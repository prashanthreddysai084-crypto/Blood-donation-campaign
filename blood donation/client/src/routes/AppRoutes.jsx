import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { PublicLayout } from '../layouts/PublicLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { CampaignListPage } from '../pages/public/CampaignListPage';
import { CampaignDetailPage } from '../pages/public/CampaignDetailPage';
import { AboutPage } from '../pages/public/AboutPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Donor Pages
import { DonorDashboardPage } from '../pages/donor/DonorDashboardPage';
import { ProfilePage } from '../pages/donor/ProfilePage';
import { DonationHistoryPage } from '../pages/donor/DonationHistoryPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCampaignsPage } from '../pages/admin/AdminCampaignsPage';
import { CampaignFormPage } from '../pages/admin/CampaignFormPage';
import { AdminRegistrationsPage } from '../pages/admin/AdminRegistrationsPage';
import { AdminDonorsPage } from '../pages/admin/AdminDonorsPage';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/campaigns" element={<CampaignListPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Donor Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']} />}>
          <Route path="/dashboard" element={<DonorDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-registrations" element={<DonorDashboardPage />} />
          <Route path="/donation-history" element={<DonationHistoryPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
          <Route path="/admin/campaigns/create" element={<CampaignFormPage />} />
          <Route path="/admin/campaigns/:id/edit" element={<CampaignFormPage />} />
          <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
          <Route path="/admin/donors" element={<AdminDonorsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
