const Pool = require("pg").Pool; //import du pool

//on crée un pool de connexion à la base de données
const pool = new Pool ({ 
    user:"postgres",
    password: "youmssoft",
    database: "bulldb",
    host: "localhost",
    port: 5432//the defaul port of postgres
});

//exportation du pool de connexion pour l'utiliser dans les requetes
module.exports = pool;


