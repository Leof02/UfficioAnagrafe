/*
	Dopetrope by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
$(function() {
    var posizioneCorrente = 1;
    var numeropagine;
    var persone = new Array();
    var cercaList = new Array();
    var arrayTerritory = new Array();
    var idedit;
    var selectedID;
    var numero = localStorage.getItem("idprova");
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
        url: "https://late-frost-5190.getsandbox.com/anagrafiche",
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, value) {
                persone.push(Object.assign({}, value))
            });
            for (let i = 0; i < persone.length; i++) {
                if (persone[i].id == localStorage.getItem("idprova")) {
                    persone = persone[i];
                    i = persone.length;
                }
            }
            if (persone.id == localStorage.getItem("idprova") && persone.data_morte != undefined) {
                $('#aggiungiResidenza').hide();
                $('#aggiungiResidenza').attr("data-target", "");
            }
            CalcPag(persone);
            document.getElementById("loading_screen").style.display = 'none';
        }
    });
    if (!$.active) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "https://late-frost-5190.getsandbox.com/territorio",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    arrayTerritory.push(Object.assign({}, value))
                    arrayTerritory = arrayTerritory[0];
                    for (let h = 0; h < 20; h++) {
                        $(".regioni").append(new Option(arrayTerritory[h].nome, arrayTerritory[h].nome));
                        $(".regioniEdit").append(new Option(arrayTerritory[h].nome, arrayTerritory[h].nome));
                        for (let j = 0; j < arrayTerritory[h].province.length; j++) {
                            $(".province").append(new Option(arrayTerritory[h].province[j].nome));
                            $(".provinceEdit").append(new Option(arrayTerritory[h].province[j].nome));
                            for (let o = 0; o < arrayTerritory[h].province[j].comuni.length; o++) {
                                $(".comuni").append(new Option(arrayTerritory[h].province[j].comuni[o]));
                                $(".comuniEdit").append(new Option(arrayTerritory[h].province[j].comuni[o]));
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
    });
    $(document).on("click")
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
    });
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
    });
    /*FILTRO REGIONI EDIT*/
    $(document).on("change", ".regioniEdit", function() {
        $(".provinceEdit").empty();
        $(".comuniEdit").empty();
        $(".provinceEdit").append(new Option("Seleziona provincia"));
        $(".comuniEdit").append(new Option("Seleziona comune"));
        var selectedRegion = $(".regioniEdit").val();
        for (var i = 0; i < 20; i++) {
            if (arrayTerritory[i].nome == selectedRegion) {
                for (let j = 0; j < arrayTerritory[i].province.length; j++) {
                    $(".provinceEdit").append(new Option(arrayTerritory[i].province[j].nome, arrayTerritory[i].province[j].nome));
                    for (let o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                        $(".comuniEdit").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                    }
                }
            }
        }
    });
    $(document).on("click")
        /*FILTRO PROVINCE EDIT*/
    $(document).on("change", ".provinceEdit", function() {
        $(".comuniEdit").empty();
        $(".comuniEdit").append(new Option("Seleziona comune"));
        var selectedProvince = $(".provinceEdit").val();
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                if (arrayTerritory[i].province[j].nome == selectedProvince) {
                    $(".regioniEdit").val(arrayTerritory[i].nome);
                    for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                        $(".comuniEdit").append(new Option(arrayTerritory[i].province[j].comuni[o], arrayTerritory[i].province[j].comuni[o]));
                    }
                }
            }
        }
    });
    /*FILTRO COMUNI EDIT*/
    $(document).on("change", ".comuniEdit", function() {
        var selectedDistrict = $(".comuniEdit").val();
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < arrayTerritory[i].province.length; j++) {
                for (var o = 0; o < arrayTerritory[i].province[j].comuni.length; o++) {
                    if (arrayTerritory[i].province[j].comuni[o] == selectedDistrict) {
                        $(".regioniEdit").val(arrayTerritory[i].nome);
                        $(".provinceEdit").val(arrayTerritory[i].province[j].nome);
                        $(".comuniEdit").val(selectedDistrict);
                    }
                }
            }
        }
    });
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
                if (obj.luoghi_residenza[lunghezzaResidenze - 1].regione.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].provincia.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].comune.toLowerCase().indexOf(val) != -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].anno.toLowerCase().indexOf(val) > -1 || obj.luoghi_residenza[lunghezzaResidenze - 1].indirizzo.toLowerCase().indexOf(val) != -1) {
                    cercaList[i] = obj;
                    i++;
                }
            });
            CalcPag(cercaList);
        } else
            CalcPag(persone);
    });

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
        $("#nomePersonaSelezionata").text(array.nome + " " + array.cognome);
        AggiornaTabella();
        if (array.luoghi_residenza.length < (numShow * indicePartenza)) arrivo = array.luoghi_residenza.length;
        else arrivo = (numShow * indicePartenza);
        for (let i = ((indicePartenza * numShow) - numShow); i < arrivo; i++) {
            let arrayData = array.luoghi_residenza[i].anno.split("-")[2] + "-" + array.luoghi_residenza[i].anno.split("-")[1] + "-" + array.luoghi_residenza[i].anno.split("-")[0];
            $("#persone").append("<tr><td>" + array.luoghi_residenza[i].regione + "</td><td>" + array.luoghi_residenza[i].provincia + "</td><td>" + array.luoghi_residenza[i].comune + "</td><td>" + array.luoghi_residenza[i].indirizzo + "</td><td>" + arrayData + "</td><td class=\"d-flex justify-content-center bottoni\"><i class=\"fas fa-trash-alt delete rounded\" title=\"Elimina\" id=\"" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#modalEliminaRes\"></i><i class=\"fas fa-edit edit rounded\" title=\"Modifica\" id=\"" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#exampleModalEdit\"></i></td></tr>");
        }
    }

    /*AGGIUNTA RESIDENZA*/
    $(document).on("click", ".btnAggiungiResidenza", function() {
        dt = '{"regione":"' + $('#regioneNuovaRes').val().toString() + '","provincia":"' + $('#provinciaNuovaRes').val().toString() + '","comune":"' + $('#comuneNuovaRes').val().toString() + '","indirizzo":"' + $('#indirizzoNuovaRes').val().toString() + '","anno_residenza":"' + $('#dataNuovaRes').val().toString() + '"}';
        $.ajax({
            type: "POST",
            headers: { "Access-Control-Allow-Origin": "*" },
            data: dt,
            /* Per poter aggiungere una entry bisogna prima autenticarsi. */
            contentType: "application/json",
            crossDomain: true,
            url: "https://late-frost-5190.getsandbox.com/anagrafiche/add/" + localStorage.getItem("idprova") + "/residenza/",
            dataType: "json",
            success: function(data) {},
            error: function(xhr, status, error) {
                $('#modalNuovaResidenza').modal('toggle');
                document.getElementById("loading_screen").style.display = 'block';
                AggiornaTabella();
                persone = [];
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "https://late-frost-5190.getsandbox.com/anagrafiche",
                    dataType: "json",
                    success: function(data) {
                        $.each(data, function(i, value) {
                            persone.push(Object.assign({}, value))
                        });
                        for (let i = 0; i < persone.length; i++) {
                            if (persone[i].id == localStorage.getItem("idprova")) {
                                persone = persone[i];
                                i = persone.length;
                            }
                        }
                        CalcPag(persone);
                        document.getElementById("loading_screen").style.display = 'none';
                    }
                });
            }
        })
    });
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
    /*EDIT*/
    var idriga;
    var idPERSONALE;
    $(document).on("click", ".edit", function() {
        idriga = $(this).attr("id");
        idPERSONALE = localStorage.getItem("idprova");

        $("#regione").val(persone.luoghi_residenza[idriga - 1].regione);
        $("#provincia").val(persone.luoghi_residenza[idriga - 1].provincia);
        $("#comune").val(persone.luoghi_residenza[idriga - 1].comune);
        $("#viamod").val(persone.luoghi_residenza[idriga - 1].indirizzo);
        $("#annomod").val(persone.luoghi_residenza[idriga - 1].anno);

    });
    $(document).on("click", ".inviaModifica", function() {
        dt = '{"regione":"' + $('#regione').val().toString() + '","provincia":"' + $('#provincia').val().toString() + '","comune":"' + $('#comune').val().toString() + '","indirizzo":"' + $('#viamod').val().toString() + '","anno":"' + $('#annomod').val().toString() + '"}';
        $.ajax({
            type: "POST",
            headers: { "Access-Control-Allow-Origin": "*" },
            data: dt,
            /* Per poter aggiungere una entry bisogna prima autenticarsi. */
            contentType: "application/json",
            crossDomain: true,
            url: "https://late-frost-5190.getsandbox.com/anagrafiche/edit/" + idPERSONALE + "/residenza/" + idriga + "/",
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
            url: "https://late-frost-5190.getsandbox.com/anagrafiche",
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, value) {
                    persone.push(Object.assign({}, value))
                });
                for (let i = 0; i < persone.length; i++) {
                    if (persone[i].id == localStorage.getItem("idprova")) {
                        persone = persone[i];
                        i = persone.length;
                    }
                }
                CalcPag(persone);
                document.getElementById("loading_screen").style.display = 'none';
            }
        });
    });

    /*DELETE*/
    $(document).on("click", ".delete", function() {
        idriga = $(this).attr("id");
        idPERSONALE = localStorage.getItem("idprova");
    });
    $(document).on("click", ".btnElimina", function() {
        $.ajax({
            type: "DELETE",
            headers: { "Access-Control-Allow-Origin": "*" },
            /* Per poter rimuovere una entry bisogna prima autenticarsi con un'account di amministratore. */
            contentType: "application/json",
            url: "https://late-frost-5190.getsandbox.com/anagrafiche/remove/" + idPERSONALE + "/residenza/" + idriga + "/",
            dataType: "json",
        }).then(function(data) {
            $(".bottoni .delete").each(function() {
                if ($(this).attr("id") == idriga) $(this).parent().parent().remove();
            });
        }, function(jqXHR, textStatus, errorThrown) {
            $(".bottoni .delete").each(function() {
                if ($(this).attr("id") == idriga) $(this).parent().parent().remove();
            });
        })
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