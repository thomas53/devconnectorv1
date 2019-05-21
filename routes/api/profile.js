const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

// @route   GET api/profile/me
// @desc    Get logged user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/me
// @desc    Create logged user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status field is required')
        .not()
        .isEmpty(),
      check('skills', 'skills field is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.company = company ? company : null;
    profileFields.website = website ? website : null;
    profileFields.location = location ? location : null;
    profileFields.bio = bio ? bio : null;
    profileFields.status = status ? status : null;
    profileFields.githubusername = githubusername ? githubusername : null;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social array
    profileFields.social = {};
    profileFields.social.youtube = youtube ? youtube : null;
    profileFields.social.facebook = facebook ? facebook : null;
    profileFields.social.twitter = twitter ? twitter : null;
    profileFields.social.linkedin = linkedin ? linkedin : null;
    profileFields.social.instagram = instagram ? instagram : null;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // udate data if already exist
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create new data
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/profile/me
// @desc    Get logged user profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (!profiles) {
      return res.status(400).json({ msg: 'There is no profile' });
    }

    res.json(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/user_id
// @desc    Get logged user profile
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'There is no profile' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
