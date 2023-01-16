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



app.get('/view-pdf-all', (req, res) => {
 
    const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
   
    const doc = new PDFDocument();
   
    // the following line is the one you're looking for
    doc.pipe(res);
   
    // draw some text
    doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
   
    // some vector graphics
    doc.save()
      .moveTo(100, 150)
      .lineTo(100, 250)
      .lineTo(200, 250)
      .fill('#FF3300');
   
    doc.circle(280, 200, 50).fill('#6600FF');
   
    // an SVG path
    doc.scale(0.6)
      .translate(470, 130)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore();
   
    // and some justified text wrapped into columns
    doc.text('And here is some wrapped text...', 100, 300)
      .font('Times-Roman', 13)
      .moveDown()
      .text(lorem, {
        width: 412,
        align: 'justify',
        indent: 30,
        columns: 2,
        height: 300,
        ellipsis: true
      });
   
    doc.end();
   
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
    });
  });
   


app.get("/newbullpdf/:matricule/:annee/:mois", (req, res) => {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
  const {matricule,annee,mois} = req.params;
    
  const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
 
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
} );
 
  // the following line is the one you're looking for
  doc.pipe(res);
 
  // draw some text
  const ylinePosition =doc.y;
  const xlinePosition = doc.x;
  doc.fontSize(11).text("ANTILOPE",  xlinePosition, ylinePosition, {width:140})
  doc.text('Date d\'édition: '+year + "-" + month + "-" + day, xlinePosition + 220, ylinePosition, {width: 140})
  
  //doc.moveDown();
  doc.text("Matricule: "+matricule,xlinePosition)
  doc.text("Année: "+annee)
  doc.text("Mois:" +mois)
  // some vector graphics
  doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill('#FF3300');
 
  doc.circle(280, 200, 50).fill('#6600FF');
 
  // an SVG path
  doc.scale(0.6)
    .translate(470, 130)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();
 
  // and some justified text wrapped into columns
  doc.text('And here is some wrapped text...', 100, 300)
    .font('Times-Roman', 13)
    .moveDown()
    .text(lorem, {
      width: 412,
      align: 'justify',
      indent: 30,
      columns: 2,
      height: 300,
      ellipsis: true
    });
 
  doc.end(res);
  const fileName = 'Bulletin-'+matricule+'_'+annee+'_'+mois  +'.pdf';
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename='+fileName
  });
});
 
app.get('/generate-pdf', (req, res) => {
 
  const doc = new PDFDocument();
 
  doc.pipe(fs.createWriteStream('pdf-example.pdf'));
 
  doc.fontSize(27)
    .text('This is sample PDF', 100, 100);
 
  doc.addPage()
    .fontSize(15)
    .text('Generating PDF with the help of PDFKit package', 100, 100);
 
  doc.addPage()
    .fillColor('blue')
    .text('Click here to visit the cluemediator.com website', 100, 100)
    .link(100, 100, 160, 27, 'https://www.cluemediator.com/');
 
  doc.end();
  res.send('PDF generated!');
});



app.get("/newbullpdf/:matricule/:annee/:mois", (requete, reponse)=>{

   /*
        // reponse.writeHead(200, {
        //     'Content-Type': 'application/pdf',
        // });
        reponse.set('Content-Type', 'application/pdf')
        //reponse.header('Content-Type', 'application/pdf');
        const {matricule,annee,mois} = requete.params;
    
         const doc =  new PDFDocument();
         console.log("1- Doc crée...");
        const fileName = 'Bulletin-'+matricule+'_'+annee+'_'+mois  +'.pdf';
        console.log("2- filename setted...");
         doc.pipe(fs.createWriteStream(fileName));
        console.log("3- File Piped...")
         doc.fontSize(27)
            .text('This is sample PDF', 100, 100);
 
        console.log("4- The first text is writted...")
          doc.addPage()
                .fontSize(15)
                .text('Generating PDF with the help of PDFKit package', 100, 100);
        console.log("5- Second page...")   
            doc.addPage()
            .fillColor('blue')
            .text('Click here to visit the cluemediator.com website', 100, 100)
            .link(100, 100, 300, 27, 'https://www.cluemediator.com/');
            console.log("6- Third page...") 
            doc.end();
            console.log("7- Last page...") 
            console.log("-------------------dir---------------");
            //console.log(__dirname);
            reponse.sendFile(__dirname+'/Bulletin-'+matricule+'_'+annee+'_'+mois  +'.pdf',(error) => {
                if(error){
                    console.log(error.message);
                }
                console.log("Bulletin Généré avec succès.");
            });
            */
   
})
app.get("/newbull/:matricule/:annee/:mois", async (requete, reponse) => {
    var object;
    try{
        const {matricule,annee,mois} = requete.params;
        // /addition | requete.query; | /addition?termes=1&proprietes=oui

        //allons chercher les données blablablaba    
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








app.listen(3000, () =>{
    console.log("Le serveur est lancé au port 3000")
})