import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PatientList from '../features/patients/PatientList';
import PatientDetail from '../features/patients/PatientDetail';
import DoctorList from '../features/doctors/DoctorList';
import DoctorDetail from '../features/doctors/DoctorDetail';
import AppointmentList from '../features/appointments/AppointmentList';
import BookAppointment from '../features/appointments/BookAppointment';
import EmergencyQueue from '../features/emergency/EmergencyQueue';
import EmergencyTriage from '../features/emergency/EmergencyTriage';
import MedicalRecordList from '../features/records/MedicalRecordList';
import PrescriptionList from '../features/prescriptions/PrescriptionList';
import MedicineList from '../features/inventory/MedicineList';
import BillList from '../features/billing/BillList';
import AdminDashboard from '../features/dashboards/AdminDashboard';
import DoctorDashboard from '../features/dashboards/DoctorDashboard';
import ReceptionistDashboard from '../features/dashboards/ReceptionistDashboard';
import PatientDashboard from '../features/dashboards/PatientDashboard';

/**
 * Placeholder component for pages we haven't built yet.
 * Will be replaced with real components in Days 3-7.
 */
const Placeholder = ({ name }) => (
  <div style={{ padding: '24px' }}>
    <h2>{name}</h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>This page will be implemented soon.</p>
  </div>
);

/**
 * AppRouter — defines all routes for the application.
 * 
 * Route structure:
 * /login, /register           → Public (AuthLayout)
 * /patient/*                  → PATIENT role only (DashboardLayout)
 * /doctor/*                   → DOCTOR role only (DashboardLayout)
 * /receptionist/*             → RECEPTIONIST role only (DashboardLayout)
 * /admin/*                    → ADMIN role only (DashboardLayout)
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/unauthorized" element={
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <h2>403 — Unauthorized</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        } />

        {/* Root redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ============ PATIENT ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<AppointmentList />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/patient/prescriptions" element={<PrescriptionList />} />
            <Route path="/patient/medical-history" element={<MedicalRecordList />} />
            <Route path="/patient/bills" element={<BillList />} />
            <Route path="/patient/profile" element={<Placeholder name="Profile" />} />
          </Route>
        </Route>

        {/* ============ DOCTOR ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<AppointmentList />} />
            <Route path="/doctor/emergency-queue" element={<EmergencyQueue />} />
            <Route path="/doctor/patients" element={<Placeholder name="My Patients" />} />
            <Route path="/doctor/medical-records" element={<MedicalRecordList />} />
            <Route path="/doctor/prescriptions" element={<PrescriptionList />} />
            <Route path="/doctor/inventory" element={<MedicineList />} />
            <Route path="/doctor/schedule" element={<Placeholder name="My Schedule" />} />
          </Route>
        </Route>

        {/* ============ RECEPTIONIST ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/register-patient" element={<Placeholder name="Register Patient" />} />
            <Route path="/receptionist/book-appointment" element={<BookAppointment />} />
            <Route path="/receptionist/emergency-queue" element={<EmergencyQueue />} />
            <Route path="/receptionist/emergency-triage" element={<EmergencyTriage />} />
            <Route path="/receptionist/check-in" element={<Placeholder name="Check-In" />} />
            <Route path="/receptionist/billing" element={<BillList />} />
          </Route>
        </Route>

        {/* ============ ADMIN ROUTES ============ */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<DoctorList />} />
            <Route path="/admin/patients" element={<PatientList />} />
            <Route path="/admin/appointments" element={<AppointmentList />} />
            <Route path="/admin/emergency-queue" element={<EmergencyQueue />} />
            <Route path="/admin/inventory" element={<MedicineList />} />
            <Route path="/admin/billing" element={<BillList />} />
            <Route path="/admin/reports" element={<Placeholder name="Reports" />} />
          </Route>
        </Route>

        {/* ============ SHARED ENTITY ROUTES (ADMIN & RECEPTIONIST) ============ */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
