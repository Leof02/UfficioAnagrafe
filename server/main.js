/*
    # 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 #
    # 0 0 0 0 Variabili globali server. 0 0 0 0 0 #
    # 0 0 Rimangono anche quando il server  0 0 0 #
    # 0 0 0 0 0 0 0 si riavvia. 0 0 0 0 0 0 0 0 0 #
    # 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 #
*/

state.anagrafiche = state.anagrafiche || [];
state.UID = state.UID || 0
var anagrafiche = state.anagrafiche;
var territorio = require("territorio.json");
var auth = require("auth.js");
var settings = require("settings.js");
var Hashes = require("./crypto/hashes.js");
var SHA512 = new Hashes.SHA512;

/*
    # 0 0 0 0 0 0 * * * * * * * * 0 0 0 0 0 0 0 0 #
    # 0 0 0 0 0 * E N D P O I N T * * 0 0 0 0 0 0 #
    # 0 0 0 0 * A N A G R A F I C H E * 0 0 0 0 0 #
    # 0 0 0 0 0 * * * * * * * * * * * 0 0 0 0 0 0 #
    # 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 #
*/

////////////////////////// Ritorna una lista di anagrafiche /////////////////////////////////////////////
Sandbox.define('/anagrafiche','GET', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!req.is('application/json')) {
        return res.send(400, 'Invalid content type, expected application/json');
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    // Set the type of response, sets the content type.
    res.type('application/json');
    
    // Set the status code of the response.
    res.status(200);
    // Send the response body.
    res.json(anagrafiche);
});

////////////////////////// Ritorna una lista di anagrafiche /////////////////////////////////////////
////////////////////////////// data una specifica regione. //////////////////////////////////////////
Sandbox.define("/anagrafiche/{regione}", "GET", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    res.type("application/json");
    
    res.status(200);
    
    var persone = [];
    for(var persona in anagrafiche) {
        if(anagrafiche[persona].luogo_residenza.regione == req.params.regione) persone.push(anagrafiche[persona]);
    }
    
    res.json(persone);
});

////////////////////////// Aggiunge un matrimonio ad una ////////////////////////////////////////////
////////////////////////////// persona sul server. //////////////////////////////////////////////////
Sandbox.define("/anagrafiche/add/{id}/matrimonio/", "POST", function(req, res) {
   if (!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/add/id/matrimonio/", req);
    if(err) {
        return res.json(err);
    }
    
    if(req.body.nome_coniuge !== undefined && req.body.cognome_coniuge !== undefined &&
        req.body.anno !== undefined && req.params.id !== undefined && req.body.comune !== undefined) {
            _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni.unshift({
                    "nome_coniuge": req.body.nome_coniuge,
                    "cognome_coniuge": req.body.cognome_coniuge,
                    "anno": req.body.anno,
                    "comune": req.body.comune,
                    "codice": req.body.codice
            })
            if(_.has(req.body, "codice")) {
                _.find(anagrafiche, ["codice", req.body.codice]).matrimoni.unshift({
                    "nome_coniuge": _.find(anagrafiche, ["id", parseInt(req.params.id)]).nome,
                    "cognome_coniuge": _.find(anagrafiche, ["id", parseInt(req.params.id)]).cognome,
                    "anno": req.body.anno,
                    "comune": req.body.comune,
                    "codice": _.find(anagrafiche, ["id", parseInt(req.params.id)]).codice
                })
            }
            return res.send(200, "Matrimonio aggiunto!");
        }
    return res.send(400, "Errore nella richiesta!");
});

////////////////////////// Aggiunge una residenza ad una ///////////////////////////////////////////
////////////////////////////// anagrafica sul server. //////////////////////////////////////////////
Sandbox.define('/anagrafiche/add/{id}/residenza/', 'POST', function(req, res) {
    if (!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/add/id/residenza/", req);
    if(err) {
        return res.json(err);
    }
    
    if (req.body.regione !== undefined && req.body.provincia !== undefined &&
        req.body.comune !== undefined && req.body.regione !== undefined && 
        req.body.anno_residenza !== undefined && req.body.indirizzo !== undefined
        && req.params.id !== undefined) {
            _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza.unshift({
                    "regione": req.body.regione,
                    "provincia": req.body.provincia,
                    "comune": req.body.comune,
                    "indirizzo": req.body.indirizzo,
                    "anno": req.body.anno_residenza
            })
            return res.send(200, "Residenza aggiornata!");
    }
    return res.send(400, "Errore nella ricezione dei dati.");
});

////////////////////////// Aggiunge una persona alla ///////////////////////////////////////////////
///////////////////////////// lista di anagrafiche ////////////////////////////////////////////////
Sandbox.define('/anagrafiche/add/', 'POST', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!req.is('application/json')) {
        return res.send(400, 'Invalid content type, expected application/json');
    }
    /*
    var sessionId = (req.cookies) ? req.cookies.sessionId : undefined;
    if(sessionId === undefined || sessionId.length === 0 || auth.sessionsList[sessionId] === undefined || auth.sessionsList[sessionId].length === 0) {
        auth.returnError(res, 401, "Devi autenticarti per poter aggiungere dati.");
        return undefined;
    }*/
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/add/", req);
    if(err) {
        return res.json(err);
    }
    
    state.UID++;
    anagrafiche.push(
        {
            "id": state.UID,
            "nome" : req.body.nome,
            "cognome": req.body.cognome,
            "codice": req.body.codice,
            "matrimoni": [],
            "anno_nascita": req.body.anno_nascita,
            "luoghi_residenza": [
                { /* Il primo elemento della lista è sempre la residenza corrente. */
                    "regione": req.body.regione,
                    "provincia": req.body.provincia,
                    "comune": req.body.comune,
                    "indirizzo": req.body.indirizzo,
                    "anno": req.body.anno_residenza,
                    "ultimo": true
                }
            ],
            "anno_rilascio": req.body.anno_residenza,
            "data_morte": req.body.data_morte
        });
        // Send the response body.
        return res.send(200, "Utente aggiunto!");
});

////////////////////////// Modifica la residenza corrente //////////////////////////////////////////
///////////////////////////// di una persona sul server. ///////////////////////////////////////////
Sandbox.define('/anagrafiche/edit/{id}/residenza/', 'POST', function(req, res) {
    if (!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    
    var err = settings.checkValidity("/anagrafiche/edit/id/residenza/", req);
    if(err) {
        return res.json(err);
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    _.find(_.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza, ["ultimo", true]).regione = req.body.regione;
    _.find(_.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza, ["ultimo", true]).provincia = req.body.provincia;
    _.find(_.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza, ["ultimo", true]).comune = req.body.comune;
    _.find(_.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza, ["ultimo", true]).indirizzo = req.body.indirizzo;
    _.find(_.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza, ["ultimo", true]).anno = req.body.anno;
    res.send(200, "Modifica effettuata!");
});

////////////////////////// Modifica il matrimonio di una ///////////////////////////////////////////
////////////////////////////// persona sul server. /////////////////////////////////////////////////
Sandbox.define("/anagrafiche/edit/{id}/matrimonio/{n}/", "POST", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/edit/id/matrimonio/", req);
    if(err) {
        return res.json(err);
    }
    
    if (_.has(req.params, "id") && _.has(req.params, "n") &&
        (
            _.has(req.body, "nome_coniuge") || 
            _.has(req.body, "cognome_coniuge") ||
            _.has(req.body, "anno") ||
            _.has(req.body, "codice")
        ))
        {
            if (_.has(req.body, "nome_coniuge")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni[req.params.n - 1].nome_coniuge = req.body.nome_coniuge;
            if (_.has(req.body, "cognome_coniuge")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni[req.params.n - 1].cognome_coniuge = req.body.cognome_coniuge;
            if (_.has(req.body, "anno")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni[req.params.n - 1].anno = req.body.anno;
            if (_.has(req.body, "comune")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni[req.params.n - 1].comune = req.body.comune;
            if (_.has(req.body, "codice")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni[req.params.n - 1].codice = req.body.codice;
            return res.send(200, "Matrimonio modificato!");
        }
    return res.send(400, "Errore nella richiesta.");
});

////////////////////////// Modifica la residenza n /////////////////////////////////////////////////
///////////////////////// di una persona sul server. ///////////////////////////////////////////////
Sandbox.define("/anagrafiche/edit/{id}/residenza/{n}/", "POST", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/edit/id/residenza/", req);
    if(err) {
        return res.json(err);
    }
    
    if (_.has(req.params, "id") && _.has(req.params, "n") &&
        (
            _.has(req.body, "regione") || 
            _.has(req.body, "provincia") ||
            _.has(req.body, "comune") ||
            _.has(req.body, "indirizzo") ||
            _.has(req.body, "anno") 
        ))
        {
            if (_.has(req.body, "regione")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza[req.params.n - 1].regione = req.body.regione;
            if (_.has(req.body, "provincia")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza[req.params.n - 1].provincia = req.body.provincia;
            if (_.has(req.body, "comune")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza[req.params.n - 1].comune = req.body.comune;
            if (_.has(req.body, "indirizzo")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza[req.params.n - 1].indirizzo = req.body.indirizzo;
            if (_.has(req.body, "anno")) _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza[req.params.n - 1].anno = req.body.anno;
            return res.send(200, "Residenza modificata!");
        }
    return res.send(400, "Errore nella richiesta.");
});

////////////////////////// Rimuovi la residenza di una /////////////////////////////////////////////
/////////////////////////////// persona sul server. ////////////////////////////////////////////////
Sandbox.define("/anagrafiche/remove/{id}/residenza/{n}/", "DELETE", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    res.header("Access-Control-Allow-Origin", "*");
    
    if (_.has(req.params, "id") && _.has(req.params, "n"))
    {
         _.find(anagrafiche, ["id", parseInt(req.params.id)]).luoghi_residenza.splice(req.params.n - 1, 1);
         return res.send(200, "Residenza eliminata!");
    }
    return res.send(400, "Errore nella richiesta.");
});

////////////////////////// Rimuovi il matrimonio di una ////////////////////////////////////////////
/////////////////////////////// persona sul server. ////////////////////////////////////////////////
Sandbox.define("/anagrafiche/remove/{id}/matrimonio/{n}/", "DELETE", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    res.header("Access-Control-Allow-Origin", "*");
    
    if (_.has(req.params, "id") && _.has(req.params, "n"))
    {
        /*
         for(var anagrafica in anagrafiche) {
             if( _.has(anagrafiche[anagrafica].matrimoni, ["codice", _.find(anagrafiche, ["codice", _.find(anagrafiche, ["id", parseInt(req.params.id)]).codice] )])) {
                 for(var i = 0; i < anagrafiche[anagrafica].matrimoni.lenght; i++) {
                     if(anagrafiche[anagrafica].matrimoni[i].codice == _.find(anagrafiche, ["id", parseInt(req.params.id)]).codice) {
                         anagrafiche[anagrafica].matrimoni.unshift(i, 1);
                     }
                 }
             }
         }
         */
         for(var anagrafica in anagrafiche) {
             for(var matrimonio in anagrafiche[anagrafica].matrimoni) {
                 if( anagrafiche[anagrafica].matrimoni[matrimonio].codice == _.find(anagrafiche, ["id", parseInt(req.params.id)]).codice ) {
                     anagrafiche[anagrafica].matrimoni.splice(matrimonio, 1);
                 }
             }
         }
         
         _.find(anagrafiche, ["id", parseInt(req.params.id)]).matrimoni.splice(req.params.n - 1, 1);
         return res.send(200, "Matrimonio eliminato!");
    }
    return res.send(400, "Errore nella richiesta.");
});

Sandbox.define("/anagrafiche/remove/{id}/", "DELETE", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    res.header("Access-Control-Allow-Origin", "*");
    
    /*
    var sessionId = (req.cookies) ? req.cookies.sessionId : undefined;
    if(sessionId === undefined || sessionId.length === 0 || auth.sessionsList[sessionId] === undefined || auth.sessionsList[sessionId].length === 0) {
        auth.returnError(res, 401, "Devi autenticarti per poter aggiungere dati.");
        return undefined;
    }*/
    if(req.params.id !== undefined) {
        var rimosso = false;
            if(anagrafiche.length === 0) {
                state.anagrafiche = [];
            }else {
                for(var i = 0; i <= anagrafiche.length; i++) {
                    if (_.has(anagrafiche[i], "id")) {
                        if(anagrafiche[i].id == req.params.id) {
                        anagrafiche.splice(i, 1);
                        rimosso = true;
                    }
                    }
                }
            }
            if(rimosso) { return res.json({messaggio: "Utente Rimosso!"}); }
            return res.send(404, "Nessuna anagrafica trovata.");
    }else {
        return res.send(400, "Formato della richiesta errato.");
    }
});

////////////////////////// Modifica l'anagrafica di una ////////////////////////////////////////////
/////////////////////////////// persona sul server. ////////////////////////////////////////////////
Sandbox.define("/anagrafiche/edit/{id}/", "POST", function(req, res) {
    if(!req.is("application/json")) {
        return res.send(400, "Invalid content type, expected application/json");
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    var err = settings.checkValidity("/anagrafiche/edit/id/", req);
    if(err) {
        return res.json(err);
    }
    
    var modifica = false;
    
    for(var anagrafica in anagrafiche) {
        if(_.has(anagrafiche[anagrafica], "id")) {
            if(anagrafiche[anagrafica].id == req.params.id) {
                if(_.has(req.body, "nome")) anagrafiche[anagrafica].nome = req.body.nome;
                if(_.has(req.body, "cognome")) anagrafiche[anagrafica].cognome = req.body.cognome;
                if(_.has(req.body, "anno_nascita")) anagrafiche[anagrafica].anno_nascita = req.body.anno_nascita;
                if(_.has(req.body, "anno_rilascio")) anagrafiche[anagrafica].anno_rilascio = req.body.anno_rilascio;
                if(_.has(req.body, "nome_coniuge")) anagrafiche[anagrafica].matrimoni[0].nome_coniuge = req.body.nome_coniuge;
                if(_.has(req.body, "cognome_coniuge")) anagrafiche[anagrafica].matrimoni[0].cognome_coniuge = req.body.nome_coniuge;
                if(_.has(req.body, "anno_matrimonio")) anagrafiche[anagrafica].matrimoni[0].anno = req.body.anno_matrimonio;
                if(_.has(req.body, "regione")) anagrafiche[anagrafica].luoghi_residenza[0].regione = req.body.regione;
                if(_.has(req.body, "provincia")) anagrafiche[anagrafica].luoghi_residenza[0].provincia = req.body.provincia;
                if(_.has(req.body, "comune")) anagrafiche[anagrafica].luoghi_residenza[0].comune = req.body.comune;
                if(_.has(req.body, "indirizzo")) anagrafiche[anagrafica].luoghi_residenza[0].indirizzo = req.body.indirizzo;
                if(_.has(req.body, "data_morte")) anagrafiche[anagrafica].data_morte = req.body.data_morte;
                anagrafiche[anagrafica].id = parseInt(req.params.id);
                modifica = !modifica;
            }
        }
    }
    
    if(modifica) return res.send(200, "Modifica effettuata!");
    
    return res.send(400, "Errore nella richiesta.");
    
    
})

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

Sandbox.define("/users/register/", "POST", function(req, res) {
    if (req.body.isInvalid || !req.is("application/json")) {
        return res.json(400, req.body);
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    var username = req.body.username;
    if(_.has(req.body, "username") && _.has(req.body, "password")) {
        if(auth.findUser(username) !== undefined){
        return auth.returnError(res, 400, "User already exists");
    }
        req.body.password = SHA512.hex(req.body.password);
        auth.usersList.push(req.body);
        res.send(200, "Utente registrato!");
    }
    return auth.returnError(res, 400, "Errore nella richiesta.");
});

Sandbox.define('/territorio','GET', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!req.is('application/json')) {
        return res.send(400, 'Invalid content type, expected application/json');
    }
    
    res.header("Access-Control-Allow-Origin", "*");
    
    // Set the type of response, sets the content type.
    res.type('application/json');
    
    // Set the status code of the response.
    res.status(200);
    
    // Send the response body.
    res.json(territorio);
});

Sandbox.define('/users/login/', 'POST', function(req, res) {
    if (req.body.isInvalid) {
        return res.json(400, req.body);
    }
    
    if(_.has(req.body, "username") && _.has(req.body, "password")){
        var username = req.body.username;
        var user = auth.findUser(username);

        //if password matches, create session and cookie
        if(user.password == SHA512.hex(req.body.password)){
            var sessionId = auth.guid();
            auth.sessionsList[sessionId] = username;
            res.header("Set-Cookie","sessionId="+sessionId);
            return res.send(200, "Utente autenticato! - Header di sessione settato: " + sessionId);

        }else{
            return auth.returnError(res, 401, "Credenziali Invalide");
        }
    }
    return auth.returnError(res, 400, "Errore nella richiesta.");
    
});
