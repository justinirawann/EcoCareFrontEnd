import { apiRequest } from './config.js';

// Laporan Sampah
export const getReports = () => apiRequest('/reports');
export const createReport = (data) => apiRequest('/reports', { method: 'POST', body: data });

// Penjualan Sampah Daur Ulang
export const getRecyclingItems = () => apiRequest('/recycling');
export const createRecyclingItem = (data) => apiRequest('/recycling', { method: 'POST', body: data });

// Jasa Pengangkutan
export const getPickupServices = () => apiRequest('/pickup');
export const orderPickupService = (data) => apiRequest('/pickup', { method: 'POST', body: data });

// Edukasi
export const getEducationContent = () => apiRequest('/education');