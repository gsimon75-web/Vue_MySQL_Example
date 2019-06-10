/*******************************************************************************
 * Ansehen REST handlers
 */

exports.register = (router, db, logger) => {

    // GET without ID: list items
    router.get("/ansehen", function(req, res, next) {
        logger.debug("GET ansehen");
        db.query(
            "SELECT KNR, Name, KundeAdresse, Telefonnr, WNR, WohnungAdresse, Größe, Zimmeranzahl, Mietpreis, Angebot FROM GanzeAnsehen",
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        );
    });

    // GET with ID: get one item
    router.get("/ansehen/:KNR/:WNR", function(req, res, next) {
        logger.debug("GET ansehen/" + req.params.KNR + "/" + req.params.WNR);
        var filters = [];
        var filter_args = [];
        var filter_clause;

        if (req.params.KNR >= 0) {
            filters.push("KNR=?");
            filter_args.push(req.params.KNR);
        }
        
        if (req.params.WNR >= 0) {
            filters.push("WNR=?");
            filter_args.push(req.params.WNR);
        }

        if (filters.length > 0)
            filter_clause = " WHERE " + filters.join(" AND ");
        else
            filter_clause = "";

        db.query(
            "SELECT KNR, Name, KundeAdresse, Telefonnr, WNR, WohnungAdresse, Größe, Zimmeranzahl, Mietpreis, Angebot " +
            "FROM GanzeAnsehen" + filter_clause,
            filter_args,
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.send(results);
            }
        );
    });

    // POST without ID: create with auto-assigned ID
    router.post("/ansehen", function(req, res, next) {
        logger.debug("POST ansehen");
        res.status(405).end();
    });

    // POST with ID: create with ID
    router.post("/ansehen/:KNR/:WNR", function(req, res, next) {
        logger.debug("POST ansehen/" + req.params.KNR + "/" + req.params.WNR);
        db.query(
            "INSERT INTO Ansehen (KNR, WNR, Angebot) VALUES (?, ?, ?)",
            [ req.params.KNR, req.params.WNR, req.body.Angebot ],
            (err, results, fields) => {
                if (err)
                    res.status(409).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // PUT without ID: replace everything
    router.put("/ansehen", function(req, res, next) {
        logger.debug("PUT ansehen");
        res.status(405).end();
    });

    // PUT with ID: replace one item
    router.put("/ansehen/:WNR", function(req, res, next) {
        logger.debug("PUT ansehen/" + req.params.WNR);
        res.status(405).end();
    });

    // PATCH without ID: modify everything
    router.patch("/ansehen", function(req, res, next) {
        logger.debug("PATCH ansehen");
        res.status(405).end();
    });

    // PATCH with ID: modify one item
    router.patch("/ansehen/:KNR/:WNR", function(req, res, next) {
        logger.debug("PATCH ansehen/" + req.params.KNR + "/" + req.params.WNR);
        db.query(
            "UPDATE Ansehen SET Angebot=? WHERE KNR=? AND WNR=?",
            [ req.body.Angebot, req.params.KNR, req.params.WNR ],
            (err, results, fields) => {
                if (err)
                    res.status(500).send(JSON.stringify(err));
                else
                    res.status(204).end();
            }
        );
    });

    // DELETE without ID: delete everything
    router.delete("/ansehen", function(req, res, next) {
        logger.debug("DELETE ansehen");
        res.status(405).end();
    });

    // DELETE with ID: delete one item
    router.delete("/ansehen/:KNR/:WNR", function(req, res, next) {
        logger.debug("DELETE ansehen/" + req.params.KNR + "/" + req.params.WNR);
        db.query(
            "DELETE FROM Ansehen WHERE KNR=? AND WNR=?",
            [ req.params.KNR, req.params.WNR ],
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
