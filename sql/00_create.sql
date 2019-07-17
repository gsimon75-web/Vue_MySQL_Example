DROP DATABASE IF EXISTS dbTest2;
CREATE DATABASE dbTest2;
--GRANT ALL PRIVILEGES ON `dbTest2`.* TO 'test'@'%' IDENTIFIED BY 'Start!123' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON `dbTest2`.* TO 'test'@'localhost' IDENTIFIED BY 'Start!123' WITH GRANT OPTION;

CONNECT dbTest2;


DROP VIEW IF EXISTS GanzeAnsehen;
DROP TABLE IF EXISTS Ansehen;
DROP TABLE IF EXISTS Kunde;
DROP TABLE IF EXISTS Wohnung;

-- Kunde

CREATE TABLE Kunde (
	KNR		INTEGER AUTO_INCREMENT PRIMARY KEY,
	Name		VARCHAR(64) NOT NULL,
	Adresse		VARCHAR(128) NOT NULL,
	Telefonnr	VARCHAR(32) NOT NULL UNIQUE
);

CREATE UNIQUE INDEX Kunde_bei_Telefonnr
	ON Kunde (Telefonnr);

CREATE INDEX Kunde_bei_Name
	ON Kunde (Name);

CREATE INDEX Kunde_bei_Adresse
	ON Kunde (Adresse);


-- Wohnung

CREATE TABLE Wohnung (
	WNR		INTEGER AUTO_INCREMENT PRIMARY KEY,
	Adresse		VARCHAR(128) NOT NULL,
	Größe		FLOAT NOT NULL,
	Zimmeranzahl	INT NOT NULL,
	Mietpreis	FLOAT
);

CREATE INDEX Wohnung_bei_Adresse
	ON Wohnung (Adresse);

CREATE INDEX Wohnung_bei_Zimmeranzahl
	ON Wohnung (Zimmeranzahl);
	
CREATE INDEX Wohnung_bei_Zimmeranzahl_Mietpreis
	ON Wohnung (Zimmeranzahl, Mietpreis);
	
CREATE INDEX Wohnung_bei_Größe
	ON Wohnung (Größe);
	
CREATE INDEX Wohnung_bei_Mietpreis
	ON Wohnung (Mietpreis);
	

-- Ansehen

CREATE TABLE Ansehen (
	KNR		INTEGER REFERENCES Kunde ON UPDATE CASCADE,
	WNR		INTEGER REFERENCES Wohnung ON UPDATE CASCADE,
	Angebot		FLOAT NOT NULL,
	PRIMARY KEY (KNR, WNR)
);

CREATE INDEX Ansehen_by_Angebot
	ON Ansehen (Angebot);


-- Views

CREATE VIEW GanzeAnsehen AS 
	SELECT	k.KNR,
		k.Name,
		k.Adresse AS KundeAdresse,
		k.Telefonnr,
		w.WNR,
		w.Adresse AS WohnungAdresse,
		w.Größe,
		w.Zimmeranzahl,
		w.Mietpreis,
		a.Angebot
	FROM Ansehen a JOIN Kunde k USING (KNR) JOIN Wohnung w USING (WNR);



