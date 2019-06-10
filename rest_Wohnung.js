/*******************************************************************************
 * Wohnung REST handlers
 */

exports.register = (router, db, logger) => {

    // GET without ID: list items
    router.get("/wohnung", function(req, res, next) {
        logger.debug("GET wohnung");
        db.query(
            "SELECT WNR, Adresse, Größe, Zimmeranzahl, Mietpreis FROM Wohnung",
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        ); 
    });

    // GET with ID: get one item
    router.get("/wohnung/:WNR", function(req, res, next) {
        logger.debug("GET wohnung/" + req.params.WNR);
        db.query(
            "SELECT WNR, Adresse, Größe, Zimmeranzahl, Mietpreis FROM Wohnung WHERE WNR=?",
            [ req.params.WNR ],
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        );
    });

    // POST without ID: create with auto-assigned ID
    router.post("/wohnung", function(req, res, next) {
        logger.debug("POST wohnung");
        db.query(
            "INSERT INTO Wohnung (Adresse, Größe, Zimmeranzahl, Mietpreis) VALUES (?, ?, ?, ?)",
            ["Adresse", "Größe", "Zimmeranzahl", "Mietpreis"].map((a) => req.body[a]),
            (err, results, fields) => {
                if (err)
                    res.status(409).send(JSON.stringify(err));
                else
                    res.append("Location", "/wohnung/" + results.insertId).send(JSON.stringify({ WNR: results.insertId}));
            }
        );
    });

    // POST with ID: create with ID
    router.post("/wohnung/:WNR", function(req, res, next) {
        logger.debug("POST wohnung/" + req.params.WNR);
        db.query(
            "INSERT INTO Wohnung (Adresse, Größe, Zimmeranzahl, Mietpreis, WNR) VALUES (?, ?, ?, ?, ?)",
            ["Adresse", "Größe", "Zimmeranzahl", "Mietpreis"].map((a) => req.body[a]).concat(req.params.WNR),
            (err, results, fields) => {
                if (err)
                    res.status(409).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // PUT without ID: replace everything
    router.put("/wohnung", function(req, res, next) {
        logger.debug("PUT wohnung");
        res.status(405).end();
    });

    // PUT with ID: replace one item
    router.put("/wohnung/:WNR", function(req, res, next) {
        logger.debug("PUT wohnung/" + req.params.WNR);
        res.status(405).end();
    });

    // PATCH without ID: modify everything
    router.patch("/wohnung", function(req, res, next) {
        logger.debug("PATCH wohnung");
        res.status(405).end();
    });

    // PATCH with ID: modify one item
    router.patch("/wohnung/:WNR", function(req, res, next) {
        logger.debug("PATCH wohnung/" + req.params.WNR);
        db.query(
            "UPDATE Wohnung SET Adresse=?, Größe=?, Zimmeranzahl=?, Mietpreis=? WHERE WNR=?",
            ["Adresse", "Größe", "Zimmeranzahl", "Mietpreis"].map((a) => req.body[a]).concat(req.params.WNR),
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // DELETE without ID: delete everything
    router.delete("/wohnung", function(req, res, next) {
        logger.debug("DELETE wohnung");
        res.status(405).end();
    });

    // DELETE with ID: delete one item
    router.delete("/wohnung/:WNR", function(req, res, next) {
        logger.debug("DELETE wohnung/" + req.params.WNR);
        db.query(
            "DELETE FROM Wohnung WHERE WNR=?",
            [ req.params.WNR ],
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
