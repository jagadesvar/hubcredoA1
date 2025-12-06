const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
