const requireTrustedAdmin = (req, res, next) => {
  if (
    !req.user ||
    req.user.role !== 'admin' ||
    req.user.isTrustedAdmin !== true
  ) {
    return res.status(403).json({
      success: false,
      message: 'Trusted administrator access is required'
    });
  }

  return next();
};

module.exports = requireTrustedAdmin;
