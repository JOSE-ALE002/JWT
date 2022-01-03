const {
    Router
} = require('express');
const Users = require('../models/user');
const {  verifyToken } = require("../controllers/verifyToken");

// Permite crear token
// Un token es un string que se va intercambiar entre el cliente y el servidor para restringir o dar acceso a un usuario. 
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

        // GENERAMOS UN NUEVO TOKEN
        // jwt.sign({ idUsuario }, varible secreta, { expiresIn => Tiempo de expiracion en segundos })

        // Secret es una variable que le ayuda al algoritmo para poder cifralo y hacerlo unico para el sistema
        // Secret es un texto, simpre debe definirse como una variable de entorno.
        const token = jwt.sign({
            id: newUser._id // Id del usuario
        }, process.env.JWT_SECRET, { // Palabra secreta
            // Tiempo de expiracion en segundos
            expiresIn: 60 * 60 * 24 // Pasamos un objeto con la configuracion del token y cofiguramos su tiempo de expiracion 
        });

        res.json({
            auth: true,
            token
        });
    } catch (error) {
        console.log("Ha ocurrido un error", error);
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    
    if(!user) {
        return res.status(404).send("The email doesn't exists");        
    }
    
    const validPassword = await user.comparePassword(password, user.password);
    if(!validPassword) {
        return res.status(404).json({
            auth: false,
            token: null
        });
    } 

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ 
        auth: true,
        token
    })
});

router.get("/me", verifyToken ,async (req, res) => {
        

    const user = await Users.findById(req.userId, 
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


router.get("/profile", verifyToken ,async (req, res) => {

    const id = req.userId;

    // Alternativa
    // const user = await Users.findOne({_id: id})    
    
    const user = await Users.findById(id)    

    console.log(user);

    res.json({
        msg: `Welcome`,
        // user: user.username
    });
});

module.exports = router;