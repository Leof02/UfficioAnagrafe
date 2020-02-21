
var params = {
      "/anagrafiche/add/": {
          "nome": "string",
          "cognome": "string",
          "codice": "string",
          "anno_nascita": "string",
          "indirizzo": "string",
          "regione": "string",
          "provincia": "string",
          "comune": "string",
          "anno_residenza": "string",
          "data_morte": "string"
      },
      "/anagrafiche/edit/id/": {
          "nome": "string",
          "cognome": "string",
          "codice": "string",
          "anno_rilascio": "string",
          "anno_nascita": "string",
          "nome_coniuge": "string",
          "cognome_coniuge": "string",
          "anno_matrimonio": "string",
          "regione": "string",
          "provincia": "string",
          "comune": "string",
          "indirizzo": "string",
          "data_morte": "string"
      },
      "/anagrafiche/add/id/residenza": {
          "regione": "string",
          "provincia": "string",
          "comune": "string",
          "anno": "string",
          "indirizzo": "string"
      },
      "/anagrafiche/add/id/matrimonio": {
          "nome_coniuge": "string",
          "cognome_coniuge": "string",
          "anno": "string",
          "comune": "string",
          "codice": "string"
      },
      "/anagrafiche/edit/id/residenza/": {
          "regione": "string",
          "provincia": "string",
          "comune": "string",
          "indirizzo": "string",
          "anno": "string"
      },
      "/anagrafiche/edit/id/matrimonio": {
          "nome_coniuge": "string",
          "cognome_coniuge": "string",
          "anno": "string",
          "comune": "string",
          "codice": "string"
      }
  }
  
  function checkValidity(endpoint ,req) {
                      var isValid = true;
                      var err = [];
                      for (var param in params[endpoint]) {
                          if(_.has(req.body, param.toString())) {
                                if (typeof req.body[param.toString()] !== params[endpoint][param.toString()] || req.body[param.toString()].length < 1) {
                                      isValid = false;
                                      err.push({"parametro": param, "messaggio": ("Il parametro deve essere di tipo " + params[endpoint][param.toString()]).toString() + " e di lunghezza minima di un carattere."})
                                }
                          }
                      }
                      if(!isValid) {err.unshift(true); return err};
          }
  
  exports.checkValidity = checkValidity;
  
  