const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'server error' });
  }
});

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.post(
  '/',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid Credential' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid Credential' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
