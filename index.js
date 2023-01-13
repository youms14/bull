//const { response } = require("express");
//const { query } = require("express");
const express = require("express");//import de la bibliothèque
const app = express();//définition de l'application à partir de a bibliothèque de base express
const pool = require("./db");//import du pool de connextion à la base de données.
const PDFDocument = require('pdfkit');
const fs = require('fs');

const {queryrentete,queryElementdeGain,queryElementdeRetenu}= require("./queries");
// const queryrentete= require("./queries");
// const queryElementdeGain= require("./queries");
// const queryElementdeRetenu=require("./queries");

//pour donner acces au request.body
//(utiliser pour récuperer et analyser les requêtes entrantes avec les payload JSON)
app.use(express.json());





app.get("/bonjour", async(req,res)=>{
    res.json("BONJOUR")
})
//--------------------------------get all (READ)--------------------------------------------


app.get("/newbullpdf/:matricule/:annee/:mois", async (requete, reponse)=>{
    try {
        const {matricule,annee,mois} = requete.params;
        // const entete= await pool.query(queryrentete,[matricule,annee,mois]);
        // const gains= await pool.query(queryElementdeGain,[matricule,annee,mois]);
        // const retenues= await pool.query(queryElementdeRetenu,[matricule,annee,mois]);
        
        const doc = new PDFDocument();
 
        doc.pipe(fs.createWriteStream('Bulletin-'+matricule+'_'+annee+'_'+mois  +'.pdf'));
        
         doc.fontSize(27)
            .text('This is sample PDF', 100, 100);
 
 
            doc.addPage()
                .fontSize(15)
                .text('Generating PDF with the help of PDFKit package', 100, 100);
            
            doc.addPage()
            .fillColor('blue')
            .text('Click here to visit the cluemediator.com website', 100, 100)
            .link(100, 100, 300, 27, 'https://www.cluemediator.com/');
            
            doc.end();
            reponse.writeHead(200, {
                'Content-Type': 'application/pdf',
              });
    } catch (error) {
        console.log(error.message);
    }
})
app.get("/newbull/:matricule/:annee/:mois", async (requete, reponse) => {
    var object;
    try{
        const {matricule,annee,mois} = requete.params;
        

        //allons chercher les données blabalablaba    
        const entete= await pool.query(queryrentete,[matricule,annee,mois]);
        const gains= await pool.query(queryElementdeGain,[matricule,annee,mois]);
        const retenues= await pool.query(queryElementdeRetenu,[matricule,annee,mois]);
              
        var objectGain=gains.rowCount==0?{
            "statutCode":201,
            "message":"Aucun élément de Gain trouvé.",
            "datas":[]
        }:{
            "statutCode":200,
            "message":"Eléments de Gain trouvés.",
            "datas":gains.rows
        };

        var objectRetenue=retenues.rowCount==0?{
            "statutCode":201,
            "message":"Aucun élément de Retenue trouvé.",
            "datas":[]
        }:{
            "statutCode":200,
            "message":"Eléments de Retenue trouvés.",
            "datas":retenues.rows
        };
        if (entete.rowCount==0){
            object = {
                "statutCode":"201",
                "message":"Pas de données entêtes associées au matricule "+ matricule +" pour le mois "+ mois +" de l'année "+annee + ".",
                "datas":[]
            }
    
        }else{
            object = {
                "statutCode":"200",
                "message":"Elements d'entête et/ou de rémunérations trouvés",
                "datas":{
                    "entete":[entete.rows[0]],
                    "gains":objectGain,
                    "retenues":objectRetenue
                }
            }
            
        }
      
    }catch(erreur){
        console.log(erreur.message);
        object = {
            "statutCode":"500",
            "message":erreur.message,
            "datas":[]
        }
    }
    reponse.json(object);
})








app.listen(6000, () =>{
    console.log("Le serveur est lancé au port 6000")
})