create database bulldb;

-- Table E20, élement de rémuneration(gain et retenu)
CREATE TABLE IF NOT EXISTS e20 (
   e20_id serial PRIMARY KEY,
   matricule char(7) NOT NULL,
   annee varchar(4) NOT NULL,
   mois  varchar(2) NOT NULL,
   codeelement varchar(3) NOT NULL,
   montant varchar(8) NOT NULL
);

-- Table A20, entête du bulletin
CREATE TABLE IF NOT EXISTS a20 (
    a20_id serial PRIMARY KEY,
    matricule char(7),
    annee character varying(4),
    mois character varying(2),     
    grade character varying(5),  
    logement character varying(1)  ,
    emploi character varying(4)  ,
    affectation character varying(4)  ,
    minservice character varying(7)  ,
    positiongest character varying(2)  ,
    positionsolde character varying(2)  ,
    nbenfants character varying(2)  ,
    situfamiliale character varying(1)  ,
    modereglement character varying(5)  ,
    nocompte character varying(12) ,
    indicegrade character varying(4)  ,
    indicesolde character varying(4)  ,
    classe character varying(1)  ,
    echelon character varying(2)  ,
    noordre character varying(7)  ,
    noemission character varying(7)  ,
    igrmensuel character varying(9)  ,
    igrcumule character varying(9)  ,
    netapayer character varying(9)

);

-- Table agent, Informations personnelles des agents de l'état.
CREATE TABLE IF NOT EXISTS agt(
    agt_id SERIAL PRIMARY KEY,
    matricule varchar(7),
    nom varchar(35),
    prenom varchar(35),
    sexe character(1) CHECK (sexe IN ('F', 'M', 'f','H','m','h')),     
    aanaissance character varying(4), 
    mmnaissance character varying(2),
    jjnaissance character varying(2),
    lieunaissance character varying(7)
);
alter table agt alter column sexe set null;

-- Table des LibelleE20
CREATE TABLE IF NOT EXISTS libelleE20(
    libelleE20_id SERIAL PRIMARY KEY,
    code char(3),
    libelle varchar(40),
    nature char(1)
);

-- CREATE TABLE accounts (
-- 	user_id serial PRIMARY KEY,
-- 	username VARCHAR ( 50 ) UNIQUE NOT NULL,
-- 	password VARCHAR ( 50 ) NOT NULL,
-- 	email VARCHAR ( 255 ) UNIQUE NOT NULL,
-- 	created_on TIMESTAMP NOT NULL,
--         last_login TIMESTAMP 
-- );

-- SERIE DES IMPORTS AVEC LES FICHIERS TRANSFORMES PAR LES SCRIPTS

-- OUT_libellee20.txt /tmp
-- cp OUT_e20.txt /tmp
-- cp OUT_a20.txt /tmp
-- cp OUT_agt.txt /tmp

COPY libellee20(code,libelle,nature)
FROM '/tmp/OUT_libellee20.txt'
DELIMITER ';'
CSV;

COPY e20(e20_id,matricule,annee,mois,codeelement,montant)
FROM '/tmp/OUT_e20.txt'
DELIMITER ';'
CSV;

COPY a20(a20_id,matricule,annee,mois,grade,logement,emploi,affectation,minservice,positiongest,positionsolde,nbenfants,situfamiliale,modereglement,nocompte,indicegrade,indicesolde,classe,echelon,noordre, noemission,igrmensuel,igrcumule,netapayer)
FROM '/tmp/OUT_a20.txt'
DELIMITER ';'
CSV;

COPY agt(matricule,nom,prenom,sexe,aanaissance,mmnaissance,jjnaissance,lieunaissance)
FROM '/tmp/OUT_agt.txt'
DELIMITER ';'
CSV;



