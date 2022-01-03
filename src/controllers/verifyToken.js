const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        // Req.headers => Retorna las cabezeras
        // x-access-token => Cabezera para enviar tokens
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({
                auth: false,
                message: "No token provided"
            });
        }

        // Funcion para verificar y decoficar el token por medio de la palabra secreta
        // Ya que para crearlo se ocupa la palabra secreta para codificarlo, con esta funcion hacemos lo contrario, decodificamos.
        // Retorna la un objeto con la informacion del usuario en este caso el id, y demas datos del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        next();
    }
}