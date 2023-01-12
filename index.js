//const { response } = require("express");
const express = require("express");//import de la bibliothèque
const app = express();//définition de l'application à partir de a bibliothèque de base express
const pool = require("./db");//import du pool de connextion à la base de données.

//pour donner acces au request.body
//(utiliser pour récuperer et analyser les requêtes entrantes avec les payload JSON)
app.use(express.json());

//--------------------------------get all (READ)--------------------------------------------
app.get("/listelibelle", async (requete, reponse) => {
    try{
        const allLibelle= await pool.query("SELECT * FROM libellee20");

        reponse.json(allLibelle.rows)
    }catch(erreur){
        console.log(erreur.message);
    }
})








app.listen(3000, () =>{
    console.log("Le serveur est lancé au port 3000")
})