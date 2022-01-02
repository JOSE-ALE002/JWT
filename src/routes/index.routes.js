const {
    Router
} = require('express');
const Users = require('../models/user');
const controllerUser = require("../controllers/index.controller");
const jwt = require("jsonwebtoken");

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});


router.post("/signup", async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    const newUser = new Users({
        username: username,
        email: email,
        password: password
    });

    newUser.password = await newUser.encryptPassword(password);

    try {
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        });

        res.json({
            auth: true,
            token
        });
    } catch (error) {
        console.log("Ha ocurrido un error", error);
    }
});

router.post("/signin", (req, res) => {
    res.json("signin");
});

router.get("/me", async (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({
            auth: false,
            message: "No token provided"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findById(decoded.id, 
        // Para no devolver ciertos datos, les asignamos el valor de 0 de la siguiente manera
    {
        password: 0
    });

    if (!user) {
        return res.status(404).send("User not found");
    }

    res.json({
        user
    })
});

module.exports = router;