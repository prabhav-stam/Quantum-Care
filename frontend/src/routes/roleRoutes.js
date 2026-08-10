export const roleRoutes = {
  PATIENT: [
    { label: 'Dashboard', path: '/patient', icon: '◉' },
    { label: 'My Appointments', path: '/patient/appointments', icon: '▪' },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: '▪' },
    { label: 'My Prescriptions', path: '/patient/prescriptions', icon: '▪' },
    { label: 'Medical History', path: '/patient/medical-history', icon: '▪' },
    { label: 'My Bills', path: '/patient/bills', icon: '▪' },
    { label: 'Profile', path: '/patient/profile', icon: '▪' }
  ],
  DOCTOR: [
    { label: 'Dashboard', path: '/doctor', icon: '◉' },
    { label: 'Today\'s Queue', path: '/doctor/appointments', icon: '▪' },
    { label: 'Emergency Queue', path: '/doctor/emergency-queue', icon: '▪' },
    { label: 'My Patients', path: '/doctor/patients', icon: '▪' },
    { label: 'Medical Records', path: '/doctor/medical-records', icon: '▪' },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: '▪' },
    { label: 'My Schedule', path: '/doctor/schedule', icon: '▪' }
  ],
  RECEPTIONIST: [
    { label: 'Dashboard', path: '/receptionist', icon: '◉' },
    { label: 'Register Patient', path: '/receptionist/register-patient', icon: '▪' },
    { label: 'Book Appointment', path: '/receptionist/book-appointment', icon: '▪' },
    { label: 'Emergency Queue', path: '/receptionist/emergency-queue', icon: '▪' },
    { label: 'Check-In', path: '/receptionist/check-in', icon: '▪' },
    { label: 'Billing', path: '/receptionist/billing', icon: '▪' }
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin', icon: '◉' },
    { label: 'Manage Doctors', path: '/admin/doctors', icon: '▪' },
    { label: 'Manage Patients', path: '/admin/patients', icon: '▪' },
    { label: 'Appointments', path: '/admin/appointments', icon: '▪' },
    { label: 'Emergency Queue', path: '/admin/emergency-queue', icon: '▪' },
    { label: 'Inventory', path: '/admin/inventory', icon: '▪' },
    { label: 'Billing', path: '/admin/billing', icon: '▪' },
    { label: 'Reports', path: '/admin/reports', icon: '▪' }
  ]
};
