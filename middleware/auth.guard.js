const jwt = require('../utils/jwt');
const cache = require('../utils/cache');

module.exports = async (req, res, next) => {

    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            /* ---------------------- Check For Blacklisted Tokens ---------------------- */
            const isBlackListed = await cache.get(token.trim());
            if (isBlackListed) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            
            const decoded = await jwt.verifyToken(token.trim());
            req.user = decoded;
            req.token = token;
            next();

        } catch (error) { 
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(400).json({ error: 'Authorization header is missing.' })
    }
}