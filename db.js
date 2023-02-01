const Pool = require("pg").Pool; //import du pool
const {Client} = require("pg");
//on crée un pool de connexion à la base de données
const client = new Client ({ 
    user:"postgres",
    password: "youmssoft",
    database: "bulldb",
    host: "localhost",
    port: 5432//the defaul port of postgres
});

const pool = new Pool ({ 
    user:"postgres",
    password: "youmssoft",
    database: "bulldb",
    host: "localhost",
    port: 5432//the defaul port of postgres
});

//const pgClient = new pg.Client()
//exportation du pool de connexion pour l'utiliser dans les requetes
module.exports = {pool,client};


