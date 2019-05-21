const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // get token
  const token = req.header('x-auth-token');
  console.log('helo');
  //check token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log(decoded.user);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ msg: 'token is not valid' });
  }
};
