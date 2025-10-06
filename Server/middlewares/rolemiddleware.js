export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - no user found" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        error: `Access denied - only ${role}s can perform this action`,
      });
    }

    next();
  };
};
