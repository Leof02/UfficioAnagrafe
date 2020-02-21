/*
	Dopetrope by HTML5 UP
	html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

*/
var c = 0;
$(function() {
    //creazione carta d'identità
    $('.btnAddID').on('click', function() { //METTERE BOTTONE DELL'AGGIUNTA PERSONA
        var check = true;
        //controllo che il form sia stato completato
        $('#form1 input').each(function() {
            if ($(this).val() === '')
                check = false;
        });
        $('#nome-input').popover('hide');
        $('#cognome-input').popover('hide');
        var letters = /^[A-Za-z]+$/;
        if ($("#nome-input").val().toString().match(letters)) {
            if ($('#cognome-input').val().toString().match(letters)) {
                if (check) {
                    //regione provincia e codice
                    var dt = '{"nome": "' + $("#nome-input").val().toString() + '", "cognome": "' + $('#cognome-input').val().toString() +
                        '", "anno_nascita": "' + $('#anno-input').val().toString() + '", "regione": "' + $('#regione-input').val().toString() +
                        '","provincia": "' + $('#provincia-input').val().toString() + '", "comune": "' + $('#residenza').val().toString() + '", "anno_residenza": "' + $('#rilascio-input').val().toString() +
                        '", "indirizzo": "' + $('#indirizzo-input').val().toString() + '", "anno_rilascio": "' + $('#rilascio-input').val().toString() +
                        '", "codice": "' + "AU" + c + '"}';
                    $.ajax({
                        type: "POST",
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Cache-Control": "no-store"
                        },
                        data: dt,
                        /* Per poter aggiungere una entry bisogna prima autenticarsi. */
                        contentType: "application/json",
                        url: "https://late-frost-5190.getsandbox.com/anagrafiche/add/",
                        dataType: "json",
                        success: function(data) {
                            $.ajax({
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Cache-Control": "no-store"
                                },
                                type: "GET",
                                contentType: "application/json",
                                url: "https://late-frost-5190.getsandbox.com/anagrafiche",
                                dataType: "json",
                                success: function(data) {
                                    $.each(data, function(i, value) {
                                        persone.push(Object.assign({}, value));
                                    }); //Object.assign({}, value)
                                    downloadDataPie();
                                }
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            var a = 0;
                        }
                    });
                    c++;

                    $('#exampleModalCenter').modal('toggle');
                    document.getElementById("loading_screen").style.display = 'block';
                    AggiornaTabella();
                    persone = [];
                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Cache-Control": "no-store"
                        },
                        url: "https://late-frost-5190.getsandbox.com/anagrafiche",
                        dataType: "json",
                        success: function(data) {
                            $.each(data, function(i, value) {
                                persone.push(Object.assign({}, value))
                                document.getElementById("loading_screen").style.display = 'none';
                            });
                            CalcPag(persone);
                        }
                    });

                } else
                    alert("Compila tutti i campi");
                $('#form1').trigger("reset");
            } else $('#cognome-input').popover('show');
        } else $('#nome-input').popover('show');
    });
    //cambio residenza
    $('#form2 button').on('click', function() {
        var check = true;
        //controllo che il form sia stato completato
        $('#form2 input').each(function() {
            if ($(this).val() === '')
                check = false;
        });
        if (check) {
            var esiste = false;
            for (var i = 0; i < persone.length; i++) {
                if (persone[i].nome == $('#nome2').val().toString() &&
                    persone[i].cognome == $('#cognome2').val().toString() &&
                    persone[i].carta.luogoNascita[0] == $('#vecchiaresidenza').val().toString() &&
                    persone[i].carta.indirizzo == $('#vecchioindirizzo').val().toString()) {
                    persone[c++] = Residenza.cambioResidenza(persone[i].carta.indirizzo, $('#nuovoindirizzo').val().toString(), persone[i].carta.luogoNascita[0], $('#nuovaresidenza').val().toString(), persone[i]);
                    localStorage.setItem("persone", JSON.stringify(persone));
                    break;
                }
            };
        } else
            alert("Compila tutti i campi");
        $('#form2').trigger("reset");
    });
    $('#form3 button').on('click', function() {
        var check = true;
        //controllo che il form sia stato completato
        $('#form3 input').each(function() {
            if ($(this).val() === '')
                check = false;
        });
        if (check) {
            var appoggio = [1, 1];
            var esiste = false;
            for (var i = 0; i < persone.length; i++) {
                if (persone[i].nome == $('#nome3').val().toString() && persone[i].cognome == $('#cognome3').val().toString()) {
                    if (appoggio[0] == 1)
                        appoggio[0] = persone[i];
                    else if (appoggio[1] == 1 && appoggio[0].identificativo != persone[i].identificativo)
                        appoggio[1] = persone[i];
                }
                if (persone[i].nome == $('#nome4').val().toString() && persone[i].cognome == $('#cognome4').val().toString()) {
                    if (appoggio[0] == 1)
                        appoggio[0] = persone[i];
                    else if (appoggio[1] == 1 && appoggio[0].identificativo != persone[i].identificativo)
                        appoggio[1] = persone[i];
                }
                if (appoggio[1] != 1) {
                    appoggio[0].sposo = appoggio[1].identificativo;
                    appoggio[1].sposo = appoggio[0].identificativo;
                    esiste = true;
                    break;
                }
            };
            if (!esiste)
                alert("utente non trovato");
            localStorage.setItem("persone", JSON.stringify(persone));
        } else
            alert("Compila tutti i campi");
        $('#form3').trigger("reset");
    });
    $('#form6 button').on('click', function() {
        var check = true;
        //controllo che il form sia stato completato
        $('#form6 input').each(function() {
            if ($(this).val() === '')
                check = false;
        });
        if (check) {
            for (var i = 0; i < persone.length; i++) {
                if (persone[i].nome == $('#nome7').val().toString() && persone[i].cognome == $('#cognome7').val().toString()) {
                    persone[i].residenza.a = new Date(Date.now());
                    break;
                }
            }
            localStorage.setItem("persone", JSON.stringify(persone));
        } else
            alert("Compila tutti i campi");
        $('#form6').trigger("reset");
    });

    var posizioneCorrente = 1;
    var numeropagine;
    var persone = new Array();
    var cercaList = new Array();
    var arrayTerritory = new Array();
    var idedit;
    var selectedID;
    /*FALSE ORDINATO CRESCENTE TRUE DECRESCENTE*/
    var nomeorder = false,
        cognomeorder = false,
        regioneorder = false,
        provinciaorder = false,
        comuneorder = false,
        annoorder = false;
    var siteScroll = function() {
        var title = false;
        $(window).scroll(function() {

            var st = $(this).scrollTop();

            if (st > 100) {
                if (!title) {
                    $("#nav>ul").prepend("<li class='titolo'>Ufficio Anagrafe</li>")
                    title = true;
                }
                $('#nav').addClass('shrink');
            } else {
                if (title) {
                    $("#nav>ul").find(":first").remove();
                    title = false;
                }
                $('#nav').removeClass('shrink');
            }

        })
    };
    $.ajax({
        type: "GET",
        contentType: "application/json",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
        },
        url: "https://late-frost-5190.getsandbox.com/anagrafiche",
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, value) {
                persone.push(Object.assign({}, value))
                c = value.id + 1;
            });
            CalcPag(persone);
            document.getElementById("loading_screen").style.display = 'none';
        }
    });
    if (!$.active) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            url: "https://late-frost-5190.getsandbox.com/territorio",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    arrayTerritory.push(Object.assign({}, value))
                    arrayTerritory = arrayTerritory[0];
                    for (let h = 0; h < 20; h++) {
                        $(".regioni").append(new Option(arrayTerritory[h].nome, arrayTerritory[h].nome));
                        $("#regionemod").append(new Option(arrayTerritory[h].nome, arrayTerritory[h].nome));
                        for (let j = 0; j < arrayTerritory[h].province.length; j++) {
                            $(".province").append(new Option(arrayTerritory[h].province[j].nome));
                            $("#provinciamod").append(new Option(arrayTerritory[h].province[j].nome));
                            for (let o = 0; o < arrayTerritory[h].province[j].comuni.length; o++) {
                                $(".comuni").append(new Option(arrayTerritory[h].province[j].comuni[o]));
                                $("#comunemod").append(new Option(arrayTerritory[h].province[j].comuni[o]));
                                $("#birthPlace").append(new Option(arrayTerritory[h].province[j].comuni[o]));
                            }
                        }
                    }
                });
            }
        })
    }
    /*FILTRO REGIONI*/
    $(document).on("change", ".regioni", function() {
            $(".province").empty();
            $(".comuni").empty();
            $(".province").append(new Option("Seleziona provincia"));
            $(".comuni").append(new Option("Seleziona comune"));
            var selectedRegion = $(".regioni").val();
            for (var i = 0; i < 20; i++) {
                if (arrayTerritory[i].nome == selectedRegion) {
                    for (let j = 0; j < arrayTerritory[i].province.length; j++) {
                        $(".province").append(new Option(arrayTerritory[i].province[j].nome, arrayTerritory[i].province[j].nome));
                        for (let o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                            $(".comuni").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                        }
                    }
                }
            }
        })
        /*FILTRO PROVINCE*/
    $(document).on("change", ".province", function() {
            $(".comuni").empty();
            $(".comuni").append(new Option("Seleziona comune"));
            var selectedProvince = $(".province").val();
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                    if (arrayTerritory[i].province[j].nome == selectedProvince) {
                        $(".regioni").val(arrayTerritory[i].nome);
                        for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                            $(".comuni").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                        }
                    }
                }
            }
        })
        /*FILTRO COMUNI*/
    $(document).on("change", ".comuni", function() {
            var selectedDistrict = $(".comuni").val();
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                    for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                        if (arrayTerritory[i].province[j].comuni[o] == selectedDistrict) {
                            $(".regioni").val(arrayTerritory[i].nome);
                            $(".province").val(arrayTerritory[i].province[j].nome);
                            $(".comuni").val(selectedDistrict);
                        }
                    }
                }
            }
        })
        /*FILTRO REGIONI*/
    $(document).on("change", "#regionemod", function() {
            $("#provinciamod").empty();
            $("#comunemod").empty();
            $("#provinicamod").append(new Option("Seleziona provincia"));
            $("#comunemod").append(new Option("Seleziona comune"));
            var selectedRegion = $("#regionemod").val();
            for (var i = 0; i < 20; i++) {
                if (arrayTerritory[i].nome == selectedRegion) {
                    for (let j = 0; j < arrayTerritory[i].province.length; j++) {
                        $("#provinciamod").append(new Option(arrayTerritory[i].province[j].nome, arrayTerritory[i].province[j].nome));
                        for (let o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                            $("#comunemod").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                        }
                    }
                }
            }
        })
        /*FILTRO PROVINCE*/
    $(document).on("change", "#provinciamod", function() {
            $("#comunemod").empty();
            $("#comunemod").append(new Option("Seleziona comune"));
            var selectedProvince = $("#provinciamod").val();
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                    if (arrayTerritory[i].province[j].nome == selectedProvince) {
                        $("#regionemod").val(arrayTerritory[i].nome);
                        for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                            $("#comunemod").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                        }
                    }
                }
            }
        })
        /*FILTRO COMUNI*/
    $(document).on("change", "#comunemod", function() {
            var selectedDistrict = $("#comunemod").val();
            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                    for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                        if (arrayTerritory[i].province[j].comuni[o] == selectedDistrict) {
                            $("#regionemod").val(arrayTerritory[i].nome);
                            $("#provinciamod").val(arrayTerritory[i].province[j].nome);
                            $("#comunemod").val(selectedDistrict);
                        }
                    }
                }
            }
        })
        /*CERCA*/
    $(document).on("keyup", "#search", function() {
        cercaList.length = 0;
        AggiornaTabella();
        var i = 0;
        var val = $(this).val();
        if (val) {
            val = val.toLowerCase();
            $.each(persone, function(_, obj) {
                // console.log(val,obj.name.toLowerCase().indexOf(val),obj)
                let lunghezzaResidenze = obj.luoghi_residenza.length;
                if (obj.nome.toLowerCase().indexOf(val) != -1 || obj.cognome.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].regione.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].provincia.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].comune.toLowerCase().indexOf(val) != -1 || obj.anno_nascita.toString().indexOf(val) > -1) {
                    cercaList[i] = obj;
                    i++;
                }
            });
            CalcPag(cercaList);
        } else
            CalcPag(persone);
    });
    /*CALCOLO NUMERO DELLE PAGINE*/
    function CalcPag(array) {
        $(".pagination").empty();
        if (((array.length) % $("#shownumber").val()) == 0) numeropagine = parseInt(array.length / $("#shownumber").val());
        else numeropagine = parseInt((array.length / $("#shownumber").val()) + 1);
        if (numeropagine != 1) {
            $(".pagination").append('<li class="page-item" id="previous"> <a class="page-link" href="#main" tabindex="-1"  style="text-decoration:none"aria-disabled="true">Precedente</a> </li>');
            for (let i = 0; i < numeropagine; i++) {
                $(".pagination").append('<li class="page-item numeri"><a class="page-link" style="text-decoration:none" href="#main">' + (i + 1) + '</a></li>');
            }
            $(".pagination").append('<li class="page-item" id="next"> <a class="page-link" href="#main" style="text-decoration:none"tabindex="-1" aria-disabled="true">Successivo</a> </li>');
        }
        StampaTabella(1, $("#shownumber").val(), array);
    }
    /*SVOTA TABELLA*/
    function AggiornaTabella() {
        $("#persone").empty();
    }
    /*STAMPA*/
    function StampaTabella(indicePartenza, numShow, array) {
        let arrivo = 0;
        AggiornaTabella();
        if (array.length < (numShow * indicePartenza)) arrivo = array.length;
        else arrivo = (numShow * indicePartenza);
        for (let i = ((indicePartenza * numShow) - numShow); i < arrivo; i++) {
            let arrayData = array[i].anno_nascita.split("-")[2] + "-" + array[i].anno_nascita.split("-")[1] + "-" + array[i].anno_nascita.split("-")[0];
            let lunghezzaResidenze = array[i].luoghi_residenza.length;
            if (array[i].data_morte == undefined) $("#persone").append("<tr><td>" + array[i].nome + "</td><td>" + array[i].cognome + "</td><td>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].regione + "</td><td>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].provincia + "</td><td>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].comune + "</td><td>" + arrayData + "</td><td class=\"d-flex justify-content-center bottoni\"><i class=\"fas fa-trash-alt delete rounded\" title=\"Elimina\" id=\"" + array[i].id + "\" data-toggle=\"modal\" data-target=\"#exampleModal\"></i><i class=\"fas fa-edit edit rounded\" title=\"Modifica\" id=\"" + array[i].id + "\" data-toggle=\"modal\" data-target=\"#exampleModalEdit\"></i><a href=\"indexMatrimonioPersona.html\"><i class=\"fas fa-church wedding rounded\" id=\"" + array[i].id + "\" title=\"Matrimoni Personali\"></i></a><a href=\"indexResidenzePersona.html\"><i class=\"fas fa-home home rounded\" title=\"Residenza\" id=\"" + array[i].id + "\"></i></a><i class=\"fas fa-skull morte rounded\" title=\"Decesso\" id=\"" + array[i].id + "\" data-toggle=\"modal\" data-target=\"#modalMorte\"></i></td></tr>");
            else $("#persone").append("<tr><td style='text-decoration: line-through'>" + array[i].nome + "</td><td style='text-decoration: line-through'>" + array[i].cognome + "</td><td style='text-decoration: line-through'>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].regione + "</td><td style='text-decoration: line-through'>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].provincia + "</td><td style='text-decoration: line-through'>" + array[i].luoghi_residenza[lunghezzaResidenze - 1].comune + "</td><td style='text-decoration: line-through'>" + arrayData + "</td><td class=\"d-flex justify-content-center bottoni\"><i class=\"fas fa-trash-alt delete rounded\" title=\"Elimina\" id=\"" + array[i].id + "\" data-toggle=\"modal\"data-target=\"#exampleModal\"></i><i class=\"fas fa-edit edit rounded\" title=\"Modifica\" id=\"" + array[i].id + "\" data-toggle=\"modal\"></i><a href=\"indexMatrimonioPersona.html\"><i class=\"fas fa-church wedding rounded\" id=\"" + array[i].id + "\" title=\"Matrimoni Personali\"></i></a><a href=\"indexResidenzePersona.html\"><i class=\"fas fa-home home rounded\" title=\"Residenza\" id=\"" + array[i].id + "\"></i></a><i class=\"fas fa-skull morte rounded\" title=\"Decesso\" id=\"" + array[i].id + "\" data-toggle=\"modal\" data-target=\"#modalMorteConfermata\"></i></td></tr>");

        }
    }
    /*CONTROLLA CAMBIO NUM DI NOMI DA VEDERE NELLA PAGINA*/
    $("#shownumber").change(function() {
        CalcPag(persone);
    });
    /*COMPARA*/
    function compare(a, b) {
        let comparison = 0;
        if (a > b) {
            comparison = 1;
        } else if (a < b) {
            comparison = -1;
        }
        return comparison;
    }

    $(document).on("click", ".tutti", function() {
        persone = [];
        $.ajax({
            type: "GET",
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            url: "https://late-frost-5190.getsandbox.com/anagrafiche",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    persone.push(Object.assign({}, value))
                    c = value.id + 1;
                });
                CalcPag(persone);
                document.getElementById("loading_screen").style.display = 'none';
            }
        });
    });
    $(document).on("click", ".vivi", function() {
        persone = [];
        $.ajax({
            type: "GET",
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            url: "https://late-frost-5190.getsandbox.com/anagrafiche",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    if (value.data_morte == undefined) {
                        persone.push(Object.assign({}, value))
                        c = value.id + 1;
                    }
                });
                CalcPag(persone);
                document.getElementById("loading_screen").style.display = 'none';
            }
        });
    });
    $(document).on("click", ".morti", function() {
        persone = [];
        $.ajax({
            type: "GET",
            contentType: "application/json",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            url: "https://late-frost-5190.getsandbox.com/anagrafiche",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    if (value.data_morte != undefined) {
                        persone.push(Object.assign({}, value))
                        c = value.id + 1;
                    }
                });
                CalcPag(persone);
                document.getElementById("loading_screen").style.display = 'none';
            }
        });
    });
    /*EDIT*/
    $(document).on("click", ".edit", function() {
        idedit = $(this).attr("id");
        for (let i = 0; i < persone.length; i++) {
            if (persone[i].id == idedit) {
                var trovato = persone[i];
                break;
            }
        }
        $("#nomemod").val(trovato.nome);
        $("#cognomemod").val(trovato.cognome);
        let lunghezzaResidenze = trovato.luoghi_residenza.length;
        $("#comunemod").val(trovato.luoghi_residenza[lunghezzaResidenze - 1].comune);
        $("#provinciamod").val(trovato.luoghi_residenza[lunghezzaResidenze - 1].provincia);
        $("#regionemod").val(trovato.luoghi_residenza[lunghezzaResidenze - 1].regione);
        $("#annomod").val(trovato.anno_nascita);
        $("#viamod").val(trovato.luoghi_residenza[lunghezzaResidenze - 1].indirizzo);
        $("#datadocumentomod").val(trovato.luoghi_residenza[lunghezzaResidenze - 1].anno);

    });
    $(document).on("click", ".inviaModifica", function() {
        $('#nomemod').popover('hide');
        $('#cognomemod').popover('hide');
        var letters = /^[A-Za-z]+$/;
        if ($("#nomemod").val().toString().match(letters)) {
            if ($('#cognomemod').val().toString().match(letters)) {
                dt = '{"regione":"' + $('#regionemod').val().toString() + '","provincia":"' + $('#provinciamod').val().toString() + '","comune":"' + $('#comunemod').val().toString() + '","indirizzo":"' + $('#viamod').val().toString() + '","anno":"' + $('#datadocumentomod').val().toString() + '"}';
                $.ajax({
                    type: "POST",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-store"
                    },
                    data: dt,
                    /* Per poter aggiungere una entry bisogna prima autenticarsi. */
                    contentType: "application/json",
                    crossDomain: true,
                    url: "https://late-frost-5190.getsandbox.com/anagrafiche/edit/" + idedit + "/residenza/",
                    dataType: "json",
                    success: function(data) {},
                });
                dt = '{"nome":"' + $("#nomemod").val().toString() + '","cognome":"' + $('#cognomemod').val().toString() + '","anno_nascita":"' + $('#annomod').val().toString() + '","anno_residenza":"2020"}';
                $.ajax({
                    type: "POST",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-store"
                    },
                    data: dt,
                    /* Per poter aggiungere una entry bisogna prima autenticarsi. */
                    contentType: "application/json",
                    crossDomain: true,
                    url: "https://late-frost-5190.getsandbox.com/anagrafiche/edit/" + idedit + "/",
                    dataType: "json",
                    success: function(data) {},
                });
                $('#exampleModalEdit').modal('toggle');
                document.getElementById("loading_screen").style.display = 'block';
                AggiornaTabella();
                persone = [];
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-store"
                    },
                    url: "https://late-frost-5190.getsandbox.com/anagrafiche",
                    dataType: "json",
                    success: function(data) {
                        $.each(data, function(i, value) {
                            persone.push(Object.assign({}, value))
                        });
                        CalcPag(persone);
                        document.getElementById("loading_screen").style.display = 'none';
                    }
                });
            } else $('#cognomemod').popover('show');
        } else $('#nomemod').popover('show');
    });
    /*ADD PERSONA*/
    $(document).on("click", ".btnAddID", function() {
            var letters = /^[A-Za-z]+$/;
            if ($("#nome-input").val().toString().match(letters)) {
                if ($('#cognome-input').val().toString().match(letters)) {

                }
            }
        })
        /*DELETE*/
    $(document).on("click", ".delete", function() {
        selectedID = $(this).attr("id");
    });
    $(document).on("click", ".btnElimina", function() {
        $.ajax({
            type: "DELETE",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            /* Per poter rimuovere una entry bisogna prima autenticarsi con un'account di amministratore. */
            contentType: "application/json",
            url: "https://late-frost-5190.getsandbox.com/anagrafiche/remove/" + selectedID + "/",
            dataType: "json",
        }).then(function(data) {
            $(".bottoni .delete").each(function() {
                if ($(this).attr("id") == selectedID) $(this).parent().parent().remove();
            });
        }, function(jqXHR, textStatus, errorThrown) {
            let x = 0;
            alert(jqXHR.responseText);
        })
    });

    /*DECESSO*/
    $(document).on("click", ".morte", function() {
        selectedID = $(this).attr("id");
        selectedEL = $(this);
        if (persone[foundPerson(selectedID)].data_morte != undefined) {
            $("#morteText").children().remove();
            $("#morteText").append("<label>Data di morte <span style='font-weight: 700'>" + morteText(selectedID) + "</span></label>");
        }
    });
    $(document).on("click", ".btnConfirmDeath", function() {
        if ($("#datamorte").val() > persone[foundPerson(selectedID)].anno_nascita) {
            selectedEL.parent().siblings().css("text-decoration", "line-through");
            $(selectedEL.siblings()).each(function(i) {
                if (i != 0) $(this).attr("data-target", "");
            })
            dt = $("#datamorte").val();
            $.ajax({
                type: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-store"
                },
                data: '{"data_morte":"' + dt + '"}"',
                /* Per poter rimuovere una entry bisogna prima autenticarsi con un'account di amministratore. */
                contentType: "application/json",
                url: "https://late-frost-5190.getsandbox.com/anagrafiche/edit/" + selectedID + "/",
                dataType: "json",
            })
            $('#modalMorte').modal('toggle');
            selectedEL.attr("data-target", "#modalMorteConfermata");
            for (let i = 0; i < persone.length; i++) {
                if (persone[i].id == selectedID) {
                    persone[i].data_morte = dt;
                }
            }
        } else {
            $('#datamorte').popover('show');
        }
    });
    /*STAMPA DECESSO MODAL*/
    function morteText(idPersona) {
        for (let i = 0; i < persone.length; i++) {
            if (persone[i].id == idPersona && persone[i].data_morte != undefined) {
                let arrayData = persone[i].data_morte.split("-")[2] + "-" + persone[i].data_morte.split("-")[1] + "-" + persone[i].data_morte.split("-")[0];
                return arrayData;
            }
        }
    }
    /*TROVA PERSONA */
    function foundPerson(idPersona) {
        for (let i = 0; i < persone.length; i++) {
            if (persone[i].id == idPersona) {
                return i;
            }
        }
    }

    /*ADD RESIDENZA*/
    $(document).on("click", ".home", function() {
        localStorage.setItem("idprova", $(this).attr("id"))
    });
    /*ADD MATRIMONIO*/
    $(document).on("click", ".wedding", function() {
        localStorage.setItem("idprova", $(this).attr("id"))
    });
    /*ORDINA*/
    $(document).on("click", ".order", function() {
        var temp = new Array();
        var f = $(this).attr("id");
        switch (f) {
            case "nome":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!nomeorder) {
                            if (compare(persone[i].nome, persone[j].nome) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].nome, persone[j].nome) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!nomeorder) nomeorder = true;
                else nomeorder = false;
                break;
            case "cognome":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!cognomeorder) {
                            if (compare(persone[i].cognome, persone[j].cognome) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].cognome, persone[j].cognome) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!cognomeorder) cognomeorder = true;
                else cognomeorder = false;
                break;
            case "regione":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        var lunghezzaResidenze = persone[i].luoghi_residenza.length;
                        var lunghezzaResidenzej = persone[j].luoghi_residenza.length;
                        if (!regioneorder) {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].regione, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].regione) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].regione, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].regione) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!regioneorder) regioneorder = true;
                else regioneorder = false;
                break;
            case "provincia":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        var lunghezzaResidenze = persone[i].luoghi_residenza.length;
                        var lunghezzaResidenzej = persone[j].luoghi_residenza.length;
                        if (!provinciaorder) {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].provincia, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].provincia) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].provincia, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].provincia) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!provinciaorder) provinciaorder = true;
                else provinciaorder = false;
                break;
            case "comune":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        var lunghezzaResidenze = persone[i].luoghi_residenza.length;
                        var lunghezzaResidenzej = persone[j].luoghi_residenza.length;
                        if (!comuneorder) {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].comune, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].comune) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luoghi_residenza[lunghezzaResidenze - 1].comune, persone[j].luoghi_residenza[lunghezzaResidenzej - 1].comune) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!comuneorder) comuneorder = true;
                else comuneorder = false;
                break;
            case "anno":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!annoorder) {
                            if (compare(persone[i].anno_nascita, persone[j].anno_nascita) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].anno_nascita, persone[j].anno_nascita) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!annoorder) annoorder = true;
                else annoorder = false;
                break;
            default:
                break;
        }
    });
    /*CLICK PRECEDENTE*/
    $(document).on("click", "#previous", function() {
        if (posizioneCorrente == 1) posizioneCorrente++;
        posizioneCorrente--;
        StampaTabella(posizioneCorrente, $("#shownumber").val(), persone);
    });
    /*CLICK SUCCESSIVO*/
    $(document).on("click", "#next", function() {
        if (posizioneCorrente == numeropagine) posizioneCorrente--;
        posizioneCorrente++;
        StampaTabella(posizioneCorrente, $("#shownumber").val(), persone);
    });
    /*CLICK NUMERO PAGINA*/
    $(document).on("click", ".numeri>.page-link", function() {
        var testo = $(this).text();
        posizioneCorrente = testo;
        StampaTabella(testo, $("#shownumber").val(), persone);
    });
    siteScroll();
    var $window = $(window),
        $body = $('body');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: [null, '736px']
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Dropdowns.
    $('#nav > ul').dropotron({
        mode: 'fade',
        noOpenerFade: true,
        alignment: 'center'
    });

    // Nav.

    // Title Bar.
    $(
            '<div id="titleBar">' +
            '<a href="#navPanel" class="toggle"></a>' +
            '</div>'
        )
        .appendTo($body);

    // Panel.
    $(
            '<div id="navPanel">' +
            '<nav>' +
            $('#nav').navList() +
            '</nav>' +
            '</div>'
        )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'left',
            target: $body,
            visibleClass: 'navPanel-visible'
        });
});