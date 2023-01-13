const queryrentete= "SELECT a20.matricule,"+
                        " a20.annee, "+
                        " a20.mois, "+
                        " agt.nom, "+
                        " agt.prenom, "+
                        " a20.grade, "+
                        " a20.emploi, "+
                        " a20.minservice, "+
                        " a20.positionsolde, "+
                        " a20.positiongest, "+
                        " a20.situfamiliale, "+
                        " a20.modereglement, "+
                        " a20.igrmensuel, "+
                        " a20.igrcumule, "+
                        " a20.netapayer, "+
                        " a20.indicegrade, "+
                        " a20.indicesolde , "+
                        " a20.classe , "+
                        " a20.echelon , "+
                        " a20.nbenfants , "+
                        " a20.logement , "+
                        " a20.nocompte "+


                        " FROM a20,agt "+
                        " WHERE "+
                        " a20.matricule=agt.matricule AND "+
                        " a20.matricule=$1 AND "+
                        " a20.annee=$2 AND "+
                        " a20.mois=$3";

const queryElementdeGain= "SELECT "+
                        " e20.codeelement, "+
                        " libellee20.libelle, "+
                        " e20.montant "+

                        " FROM e20,libellee20 "+
                        " WHERE "+
                        " e20.codeelement=libellee20.code AND "+
                        " libellee20.nature='+' AND"+
                        " e20.matricule=$1 AND "+
                        " e20.annee=$2 AND "+
                        " e20.mois=$3";


const queryElementdeRetenu= "SELECT "+
                            " e20.codeelement, "+
                            " libellee20.libelle, "+
                            " e20.montant "+

                            " FROM e20,libellee20 "+
                            " WHERE "+
                            " e20.codeelement=libellee20.code AND "+
                            " libellee20.nature='-' AND"+
                            " e20.matricule=$1 AND "+
                            " e20.annee=$2 AND "+
                            " e20.mois=$3";


module.exports = {queryrentete,queryElementdeGain,queryElementdeRetenu};