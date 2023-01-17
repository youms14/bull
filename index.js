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
   


app.get("/newbullpdf/:matricule/:annee/:mois", async (req, res) => {
   try {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
    const {matricule,annee,mois} = req.params;
   
      // /addition | requete.query; | /addition?termes=1&proprietes=oui

        //allons chercher les données blablablaba    
        const entete= await pool.query(queryrentete,[matricule,annee,mois]);
        const gains= await pool.query(queryElementdeGain,[matricule,annee,mois]);
        const retenues= await pool.query(queryElementdeRetenu,[matricule,annee,mois]);
  
        if (entete.rowCount==0){
          res.type('application/json');
          object = {
            "statutCode":"201",
            "message":"Pas de données entêtes associées au matricule "+ matricule +" pour le mois "+ mois +" de l'année "+annee + ".",
            "datas":[]
        }
        res.json(object);
        }else{
          
          const doc = new PDFDocument({
            size: 'A4',
            margin: 70
          });
         
          // the following line is the one you're looking for
          doc.pipe(res);
         
          //line---------------------------------------1
          const ylinePosition =doc.y;
          const xlinePosition = doc.x;
          doc.fontSize(11).text("ANTILOPE",  xlinePosition, ylinePosition, {width:140})
          doc.fontSize(10).text('Date d\'édition:  '+year + "-" + month + "-" + day, xlinePosition + 220, ylinePosition, {width: 140})
          const newY =doc.y;
          const newX= doc.x;
        
        //line------------------------------------------2
          doc.text("",xlinePosition,newY)
          doc.text("Matricule:   "+matricule+"              ",{
            align: 'left',
            continued:true,  
           }).text("no bulletin mm:  "+"NO_VALUE",{
            continued:true,  
           }).text("IGR mensuel : "+entete.rows[0].igrmensuel,{
            align: 'right'
           })
        //line-------------------------------------------3
          const newY1 =doc.y;
          const newX1= doc.x;
          doc.text("",xlinePosition,newY1)
          doc.text("Année:   "+annee+"                         " ,{
            align: 'left',
            continued:true,  
           }).text("no bulletin aa:  "+"NO_VALUE",{
            //align: 'center',
            continued:true,  
           }).text("IGR cumule : "+entete.rows[0].igrcumule,{
            align: 'right'
           })
          //line------------------------------------------4
          const newY2 =doc.y;
          const newX2= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY2)
          doc.text("Mois:   "+mois,{
            align: 'left',
            continued:true,  
           }).text("Net à percevoir: "+entete.rows[0].netapayer,{
            align: 'right',  
           });
        
          //line------------------------------------------5
          const newY3 =doc.y;
          const newX3= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY3)
          doc.text("Nom: "+entete.rows[0].nom,{
            align: 'left',
            continued:true,  
           }).text("Indice grade: "+entete.rows[0].indicegrade,{
            align: 'right',  
           })
        
           //line------------------------------------------6
          const newY4 =doc.y;
          const newX4= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY4)
          doc.text("Prénom: "+entete.rows[0].prenom,{
            align: 'left',
            continued:true,  
           }).text("Indice Solde: "+entete.rows[0].indicesolde,{
            align: 'right',  
           })
        
           //line------------------------------------------7
          const newY5 =doc.y;
          const newX5= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY5)
          doc.text("Classe: "+entete.rows[0].classe,{
            align: 'right',  
           })
           doc.moveUp()
           //line------------------------------------------8
          const newY6 =doc.y;
          const newX6= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY6)
          doc.text("Grade: "+entete.rows[0].grade,{ 
            width:500,
            align: 'left',  
           });
          //line------------------------------------------9
          const newY7 =doc.y;
          const newX7= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY7)
          doc.text("Echélon: "+entete.rows[0].echelon,{
            align: 'right',  
           });
        
           //line------------------------------------------10
          const newY8 =doc.y;
          const newX8= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY8)
          doc.text("Emploi: "+entete.rows[0].emploi,{
            align: 'left',
            continued:true,  
           }).text("Nombre d\'enfants: "+entete.rows[0].nbenfants,{
            align: 'right',  
           });
        
          //line------------------------------------------11
          const newY9 =doc.y;
          const newX9= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY9)
          doc.text("Service: "+entete.rows[0].minservice,{ 
            width:500,
            align: 'left',  
           });
           //doc.moveDown();
            //line------------------------------------------11
          const newY10 =doc.y;
          const newX10= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY10)
          doc.text("NO IDENTIF: "+"NO_VALUE",xlinePosition+300,newY10)
          //line------------------------------------------11
          const newY11 =doc.y;
          const newX11= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY11)
          doc.text("Résidence: "+"NO_VALUE",{ 
            align: 'left',  
           })
        
           //line------------------------------------------11
          const newY12 =doc.y;
          const newX12= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY12)
          doc.text("Position Solde: "+entete.rows[0].positionsolde,{ 
            align: 'left',  
           })
        
           //line------------------------------------------11
          const newY13 =doc.y;
          const newX13= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY13)
          doc.text("Position Gestion: "+entete.rows[0].positiongest,{ 
            align: 'left',  
           })
        
              //line------------------------------------------11
          const newY14 =doc.y;
          const newX14= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY14)
          doc.text("Situation Familiale: "+entete.rows[0].situfamiliale,{ 
            align: 'left',  
            continued:true,
           }).text("Logement: "+entete.rows[0].logement,xlinePosition+180,newY14);
        
          //line------------------------------------------11
          const newY15 =doc.y;
          const newX15= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY15)
          doc.text("Mode de Reglement: "+entete.rows[0].modereglement,{ 
            align: 'left',
            continued:true  
           })
           .text("no cpt: "+ entete.rows[0].nocompte,{ 
            align: 'right',
           });
        
           doc.moveDown();
           doc.moveDown();
           
           //line------------------------------------------11
          const newY17 =doc.y;
          const newX17= doc.x;
          //doc.text('\n')
          doc.text("",xlinePosition,newY17)
          doc.text("CODE ACTION:(F) FIN ou GAINS ou (R) RETENUES G",{ 
            align: 'left',
           });
        
        
           doc.moveDown();
           doc.moveDown();
           doc.moveDown();
           doc.moveDown();

          if(gains.rowCount!=0){
              //line------------------------------------------11
              const newY18 =doc.y;
              const newX18= doc.x;
              doc.text("",xlinePosition,newY18);
              doc.text("ELEMENT DE GAIN",{ 
                align: 'center',
              });
            
              //line--------------------entete E20----------------------E20
              const newY19 =doc.y;
              doc.text("Code-element",xlinePosition+40,newY19);
              doc.text("Libelle", xlinePosition+200,newY19);
              doc.text("Montant", xlinePosition+400,newY19);
              
              //line--------------------Données GAIN E20----------------------E20
              
              var newYGains =doc.y;
              gains.rows.forEach((row) => {
                newYGains =doc.y;
                doc.text(row.codeelement,xlinePosition+40+20,newYGains);
                doc.text(row.libelle, xlinePosition+120,newYGains);
                doc.text(row.montant, xlinePosition+400,newYGains);
              });
            
           }
        
          
        
        if (retenues.rowCount!=0){
          //line------------------------------------------
        const newY20 =doc.y;
        doc.text("",xlinePosition,newY20);
        doc.text("ELEMENT DE RETENU",{ 
          align: 'center',
        });
            //line--------------------entete E20(RETENUES)----------------------E20
            const newY21 =doc.y;
            doc.text("Code-element",xlinePosition+40,newY21);
            doc.text("Libelle", xlinePosition+200,newY21);
            doc.text("Montant", xlinePosition+400,newY21);
              
            //line--------------------Données (RETENUES) E20----------------------E20

            var newYRetenu =doc.y;
            retenues.rows.forEach((row) => {
              newYRetenu =doc.y;
              doc.text(row.codeelement,xlinePosition+40+20,newYRetenu);
              doc.text(row.libelle, xlinePosition+120,newYRetenu);
              doc.text(row.montant, xlinePosition+400,newYRetenu);
          });
        }
        
          
        
    
         
          doc.moveDown();
        
          doc.end(res);
          const fileName = 'Bulletin-'+matricule+'_'+annee+'_'+mois  +'.pdf';
          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename='+fileName
          });
        }
   } catch (error) {
    console.log(error.message);
        object = {
            "statutCode":"500",
            "message":error.message,
            "datas":[]
        }
      res.json(object);
   }
  
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