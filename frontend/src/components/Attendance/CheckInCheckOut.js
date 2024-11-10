import React, { useState } from 'react';
import { checkIn, checkOut } from '../../api/attendance';

const CheckInCheckOut = () => {
  const [status, setStatus] = useState('Check-in');

  const handleAttendance = async () => {
    try {
      if (status === 'Check-in') {
        await checkIn();
        alert('Checked in successfully');
        setStatus('Check-out');
      } else {
        const { work_hours } = await checkOut();
        alert(`Checked out successfully. Work hours: ${work_hours}`);
        setStatus('Check-in');
      }
    } catch (error) {
      alert('Attendance error');
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleAttendance}>{status}</button>
    </div>
  );
};

export default CheckInCheckOut;
