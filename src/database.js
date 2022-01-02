const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tc0kn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

(async () => {
    try {
        const conn = await mongoose.connect(uri);
        console.log("Estas conectado a la base de datos",conn.connection.name);
    } catch (error) {
        console.log("Ha ocurrido un error", error);
    }
})();
