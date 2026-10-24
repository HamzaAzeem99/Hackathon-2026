import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

export const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
        }
        next();
    };
};