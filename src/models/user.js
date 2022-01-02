const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userShema = new Schema({
    username: {
        type: String,
        required: true,   
        unique: true     
    },
    email: {
        type: String,

    },
    password: {
        type: String,
        
    }
});

userShema.methods.encryptPassword = async (password) => {
    try {
        // Permite generar un hash, definimos las veses que quieras ejecutarlo, en este caso le pondre 10 veses
        const salt = await bcrypt.genSalt(10);

        // Luego tomamos ese patron de la variable salt para poder generar nuestra cifrado
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log("Ha ocurrido un error", error); 
    }
};

userShema.methods.comparePassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword)    ;
    } catch (error) {
        console.log("Ha ocurrido un error", error);
    }
};

module.exports = model("users", userShema);