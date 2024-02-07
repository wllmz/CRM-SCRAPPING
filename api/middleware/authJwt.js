exports.requireAdminRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé : nécessite le rôle d'administrateur" });
    }
};