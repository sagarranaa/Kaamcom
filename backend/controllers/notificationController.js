// controllers/notificationController.js
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService'); 
// Check-out reminder for employees who forgot
cron.schedule('0 18 * * *', async () => { 
  const unattended = await Attendance.find({ check_out: null, date: new Date().toDateString() }).populate('user_id');
  unattended.forEach(record => {
    sendEmail({
      to: record.user_id.email,
      subject: 'Check-Out Reminder',
      text: 'It seems you forgot to check out today. Please check out to complete your attendance.',
    });
  });
});

// Morning reminder to check in
cron.schedule('0 9 * * *', async () => { 
  const users = await User.find({ role: 'Employee' });
  users.forEach(user => {
    sendEmail({
      to: user.email,
      subject: 'Attendance Reminder',
      text: 'Please remember to log your attendance today by checking in.',
    });
  });
});
