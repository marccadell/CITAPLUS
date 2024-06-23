import React from 'react';
import CreateAppointment from '../components/CreateAppointment';
import ViewAppointments from '../components/ViewAppointments';
import EditAppointment from '../components/EditAppointment';

const DoctorDashboard = () => {
  return (
    <div>
      <h2>Dashboard de Doctor</h2>
      <CreateAppointment />
      <EditAppointment />
    </div>
  );
};

export default DoctorDashboard;