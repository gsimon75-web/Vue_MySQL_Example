CONNECT dbTest2;

DELETE FROM Ansehen;
DELETE FROM Kunde;
DELETE FROM Wohnung;

INSERT INTO Kunde (Name, Adresse, Telefonnr) VALUES
	("Karl Schneider",	"Frankfurt, Schiller str. 2",	"1111111"),
	("Heinz Müller",	"Berlin, Frankfurter str. 55.",	"2222222"),
	("Johannes Schwarz",	"Dresden, Goethe plz. 4.",	"3333333"),
	("Nicholas Hoffer",	"Stuttgart, Niedergasse 23.",	"4444444");

INSERT INTO Wohnung (Adresse, Größe, Zimmeranzahl, Mietpreis) VALUES
	("Köngen, Schwanenstr. 11.",		54.5,	2,	1000),
	("Erding, Hauptstr. 52.",		97.0,	4,	1800),
	("Augsburg, Konrad Lorenz str. 31.",	68.5,	3,	1800),
	("Hamburg, Königsplatz 11.",		120.0,	4,	2500);

INSERT INTO Ansehen (KNR, WNR, Angebot) VALUES
	(	(SELECT KNR FROM Kunde WHERE Name="Heinz Müller" AND Telefonnr="2222222"),
		(SELECT WNR FROM Wohnung WHERE Adresse="Köngen, Schwanenstr. 11."),
		1200),
	(	(SELECT KNR FROM Kunde WHERE Name="Nicholas Hoffer" AND Telefonnr="4444444"),
		(SELECT WNR FROM Wohnung WHERE Adresse="Erding, Hauptstr. 52."),
		2000),
	(	(SELECT KNR FROM Kunde WHERE Name="Johannes Schwarz" AND Telefonnr="3333333"),
		(SELECT WNR FROM Wohnung WHERE Adresse="Köngen, Schwanenstr. 11."),
		1200);

