/*******************************************************************************
 * Kunde REST handlers
 */

exports.register = (router, db, logger) => {

    // GET without ID: list items
    router.get("/kunde", function(req, res, next) {
        logger.debug("GET kunde");
        db.query(
            "SELECT KNR, Name, Adresse, Telefonnr FROM Kunde",
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        );
    });

    // GET with ID: get one item
    router.get("/kunde/:KNR", function(req, res, next) {
        logger.debug("GET kunde/" + req.params.KNR);
        db.query(
            "SELECT KNR, Name, Adresse, Telefonnr FROM Kunde WHERE KNR=?",
            [ req.params.KNR ],
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        );
    });

    // POST without ID: create with auto-assigned ID
    router.post("/kunde", function(req, res, next) {
        logger.debug("POST kunde");
        db.query(
            "INSERT INTO Kunde (Name, Adresse, Telefonnr) VALUES (?, ?, ?)",
            ["Name", "Adresse", "Telefonnr"].map((a) => req.body[a]),
            (err, results, fields) => {
                if (err)
                    res.status(409).send(JSON.stringify(err));
                else
                    res.append("Location", "/kunde/" + results.insertId).send(JSON.stringify({ KNR: results.insertId}));
            }
        );
    });

    // POST with ID: create with ID
    router.post("/kunde/:KNR", function(req, res, next) {
        logger.debug("POST kunde/" + req.params.KNR);
        db.query(
            "INSERT INTO Kunde (Name, Adresse, Telefonnr, KNR) VALUES (?, ?, ?, ?)",
            ["Name", "Adresse", "Telefonnr"].map((a) => req.body[a]).concat(req.params.KNR),
            (err, results, fields) => {
                if (err)
                    res.status(409).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // PUT without ID: replace everything
    router.put("/kunde", function(req, res, next) {
        logger.debug("PUT kunde");
        res.status(405).end();
    });

    // PUT with ID: replace one item
    router.put("/kunde/:KNR", function(req, res, next) {
        logger.debug("PUT kunde/" + req.params.KNR);
        res.status(405).end();
    });

    // PATCH without ID: modify everything
    router.patch("/kunde", function(req, res, next) {
        logger.debug("PATCH kunde");
        res.status(405).end();
    });

    // PATCH with ID: modify one item
    router.patch("/kunde/:KNR", function(req, res, next) {
        logger.debug("PATCH kunde/" + req.params.KNR);

        var args = ["Name", "Adresse", "Telefonnr"].map((a) => req.body[a]).concat(req.params.KNR);

        logger.debug("query body: " + JSON.stringify(req.body));
        logger.debug("query args: " + JSON.stringify(args));
        db.query(
            "UPDATE Kunde SET Name=?, Adresse=?, Telefonnr=? WHERE KNR=?",
            ["Name", "Adresse", "Telefonnr"].map((a) => req.body[a]).concat(req.params.KNR),
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // DELETE without ID: delete everything
    router.delete("/kunde", function(req, res, next) {
        logger.debug("DELETE kunde");
        res.status(405).end();
    });

    // DELETE with ID: delete one item
    router.delete("/kunde/:KNR", function(req, res, next) {
        logger.debug("DELETE kunde/" + req.params.KNR);
        db.query(
            "DELETE FROM Kunde WHERE KNR=?",
            [ req.params.KNR ],
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

}

// vim: set sw=4 ts=4 et:
