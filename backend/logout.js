const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { path: '/' }); // Replace 'authToken' with your cookie name
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
