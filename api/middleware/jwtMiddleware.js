const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtkey = process.env.JWT_KEY;

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7); 
            
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, jwtkey, (error, decoded) => {
                    if (error) return reject(error);
                    resolve(decoded);
                });
            });

            req.user = payload;
            next();
        } else {
            res.status(403).json({
                status: "fail",
                message: "Token manquant ou format incorrect",
            });
        }
    } catch (error) {
        res.status(403).json({
            status: "fail",
            message: "Token invalid",
        });
    }
};