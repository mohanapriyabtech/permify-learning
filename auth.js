import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

        req.user = decoded.userId; // Assume the token contains userId
        next();
    });
};
