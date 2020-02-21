var Residenza = /** @class */ (function() {
    function Residenza() {}
    Residenza.cambioResidenza = function(vecchioIndirizzo, nuovoIndirizzo, vecchiaResidenza, nuovaResidenza, persona) {
        if (persona.carta != undefined && persona.carta.tuttiDati[2][0] == vecchiaResidenza && persona.carta.tuttiDati[3] == vecchioIndirizzo) {
            var copia = JSON.stringify(persona);
            persona.carta = new cartaIdentita([persona.carta.tuttiDati[0], persona.carta.tuttiDati[1],
                [nuovaResidenza, persona.carta.tuttiDati[2][1], persona.carta.tuttiDati[2][2]], nuovoIndirizzo, persona.carta.tuttiDati[4], persona.carta.tuttiDati[5], c
            ]);
            var a = JSON.parse(copia);
            a.residenza.a = new Date(Date.now());
            return a;
        }
    };
    return Residenza;
}());
var Persona = /** @class */ (function() {
    function Persona(carta) {
        this.carta = carta;
        this.residenza = new certificatoResidenza(new Date(Date.now()));
        this.nome = carta.tuttiDati[0];
        this.cognome = carta.tuttiDati[1];
    }
    Persona.prototype.Prova = function() { return false; };
    return Persona;
}());
var Matrimonio = /** @class */ (function() {
    function Matrimonio(valore3) {
        this.nomeSposo = valore3[0];
        this.cognomeSposo = valore3[1];
        this.nomeSposa = valore3[2];
        this.cognomeSposa = valore3[3];
        this.data = valore3[4];
        this.comune = valore3[5];
    }
    Object.defineProperty(Matrimonio.prototype, "tuttiDati", {
        get: function() {
            return [this.nomeSposo, this.cognomeSposo, this.nomeSposa, this.nomeSposa, this.data, this.comune];
        },
        enumerable: true,
        configurable: true
    });
    return Matrimonio;
}());
var certificatoResidenza = /** @class */ (function() {
    function certificatoResidenza(da) {
        this.da = da;
    }
    return certificatoResidenza;
}());
var cartaIdentita = /** @class */ (function() {
    function cartaIdentita(valore) {
        this.nome = valore[0];
        this.cognome = valore[1];
        this.luogoNascita = valore[2];
        this.indirizzo = valore[3];
        this.annoNascita = valore[4];
        this.annoRilascio = valore[5];
        this.id = "AU" + valore[6];
    }
    Object.defineProperty(cartaIdentita.prototype, "tuttiDati", {
        get: function() {
            return [this.nome, this.cognome, this.luogoNascita, this.indirizzo, this.annoNascita, this.annoRilascio, this.id];
        },
        enumerable: true,
        configurable: true
    });
    return cartaIdentita;
}());
var persone = new Array();
var datiPie = new Array();
var datiBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var regioni = new Array();
var chartPie;
var regSelected = "";
var provSelected = "";
var comSelected = "";
var annoSelected = 0;
var chartBar;
var arrayTerritory = new Array();

$(function() {
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
            });
            downloadDataPie();
            document.getElementById("loading_screen").style.display = 'none';
        }
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
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'left',
            target: $body,
            visibleClass: 'navPanel-visible'
        });
    $(".regioni").on("click", function() {
        $(".regioni").css("color", "black");
    })
    $(".province").on("click", function() {
        $(".province").css("color", "black");
    })
    $(".comuni").on("click", function() {
        $(".comuni").css("color", "black");
    })
    $(".anno").on("click", function() {
        $(".anno").css("color", "black");
    })

    for (let i = 1940; i < (new Date).getFullYear() + 1; i++) $(".anno").append("<option value='" + i + "'>" + i + "</option>");

    $(".regioni").on("change", function() {
        provSelected = "";
        comSelected = "";
        $(".regioni option:selected").each(function() {
            regSelected = $(this).text().toString();
            downloadDataBar();
        });
        $(".province").attr("disabled", false);
    });
    $(".province").on("change", function() {
        comSelected = "";
        $(".province option:selected").each(function() {
            provSelected = $(this).text().toString();
            downloadDataBar();
        });
        $(".comuni").attr("disabled", false);
    });
    $(".comuni").on("change", function() {
        $(".comuni option:selected").each(function() {
            comSelected = $(this).text().toString();
            downloadDataBar();
        });
        $(".comuni").attr("disabled", false);
    });
    $(".anno").on("change", function() {
        $(".anno option:selected").each(function() {
            annoSelected = parseInt($(this).text());
            downloadDataBar();
        });
    });
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
});

function downloadDataPie() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://late-frost-5190.getsandbox.com/territorio",
        dataType: "json",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
        },
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
            $.each(data.regioni, function(i, value) {
                regioni.push(value.nome);
            });
            for (var reg in regioni) {
                var regione = regioni[reg];
                var i = 0;
                for (var persona in persone)
                    if (persone[persona].data_morte == undefined && persone[persona].luoghi_residenza[0].regione == regione) i++;
                datiPie.push(i);
                datiBar.push(i);
            }
            //avvio creazione grafico a torta
            addPieChart();
        },
        error: function(xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
            return err.Message;
        }
    });
}

function downloadDataBar() {
    //controlal se è stato selezionato anno e regione
    if (annoSelected != 0 && regSelected != "" && provSelected == "") {
        datiBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var residenza;
        //scorre tutte le persone
        for (var persona in persone) {
            if (persone[persona].data_morte == undefined) {
                if (persone[persona].luoghi_residenza.length > 1) {
                    //scorre tutte le residenze della persona
                    for (residenza in persone[persona].luoghi_residenza) {
                        if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] < annoSelected && persone[persona].luoghi_residenza[residenza].regione == regSelected) {
                            if (persone[persona].luoghi_residenza[parseInt(residenza) - 1] != undefined && annoSelected < persone[persona].luoghi_residenza[residenza - 1].anno.split("-")[0]) {
                                for (var i = 0; i < 12; i++) datiBar[i]++;
                                break;
                            } else if (residenza == 0) {
                                for (var i = 0; i < 12; i++) datiBar[i]++;
                                break;
                            }
                        }
                        if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].regione == regSelected) {
                            var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                            addDataBar(mese);
                            break;
                        }
                        if (persone[persona].luoghi_residenza[1 + parseInt(residenza)] != undefined && persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].regione != regSelected && persone[persona].luoghi_residenza[parseInt(residenza) + 1].regione == regSelected) {
                            var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                            removeDataBar(mese);
                            break;
                        }
                    }
                } else {
                    //se l'anno è minore di quello selezionato aggiunge persona a tutti i mesi dell'anno
                    if (persone[persona].luoghi_residenza[0].regione == regSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] < annoSelected)
                        for (var i = 0; i < 12; i++) datiBar[i]++;
                    //se l'anno è uguale a quello selezionato aggiunge fino al mese selezionato
                    if (persone[persona].luoghi_residenza[0].regione == regSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] == annoSelected) {
                        var mese = persone[persona].luoghi_residenza[0].anno.split("-")[1];
                        addDataBar(mese);
                    }
                }
            }
        }
        addBarChart(regSelected);
    }
    //oppure anno e provincia
    else if (annoSelected != 0 && provSelected != "" && comSelected == "") {
        datiBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var persona in persone) {
            if (persone[persona].luoghi_residenza.length > 1) {
                //scorre tutte le residenze della persona
                for (residenza in persone[persona].luoghi_residenza) {
                    if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] < annoSelected && persone[persona].luoghi_residenza[residenza].provincia == provSelected) {
                        if (persone[persona].luoghi_residenza[parseInt(residenza) - 1] != undefined && annoSelected < persone[persona].luoghi_residenza[residenza - 1].anno.split("-")[0]) {
                            for (var i = 0; i < 12; i++) datiBar[i]++;
                            break;
                        } else if (residenza == 0) {
                            for (var i = 0; i < 12; i++) datiBar[i]++;
                            break;
                        }
                    }
                    if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].provincia == provSelected) {
                        var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                        addDataBar(mese);
                        break;
                    }
                    if (persone[persona].luoghi_residenza[1 + parseInt(residenza)] != undefined && persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].provincia != provSelected && persone[persona].luoghi_residenza[parseInt(residenza) + 1].provincia == provSelected) {
                        var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                        removeDataBar(mese);
                        break;
                    }
                }
            } else {
                //se l'anno è minore di quello selezionato aggiunge persona a tutti i mesi dell'anno
                if (persone[persona].luoghi_residenza[0].provincia == provSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] < annoSelected)
                    for (var i = 0; i < 12; i++) datiBar[i]++;
                //se l'anno è uguale a quello selezionato aggiunge fino al mese selezionato
                if (persone[persona].luoghi_residenza[0].provincia == provSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] == annoSelected) {
                    var mese = persone[persona].luoghi_residenza[0].anno.split("-")[1];
                    addDataBar(mese);
                }
            }
        }
        addBarChart("provincia di " + provSelected);
    }
    //oppure anno e comune
    else if (annoSelected != 0 && comSelected != "") {
        datiBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //scorre tutte le persone
        for (var persona in persone) {
            if (persone[persona].luoghi_residenza.length > 1) {
                //scorre tutte le residenze della persona
                for (residenza in persone[persona].luoghi_residenza) {
                    if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] < annoSelected && persone[persona].luoghi_residenza[residenza].comune == comSelected) {
                        if (persone[persona].luoghi_residenza[parseInt(residenza) - 1] != undefined && annoSelected < persone[persona].luoghi_residenza[residenza - 1].anno.split("-")[0]) {
                            for (var i = 0; i < 12; i++) datiBar[i]++;
                            break;
                        } else if (residenza == 0) {
                            for (var i = 0; i < 12; i++) datiBar[i]++;
                            break;
                        }
                    }
                    if (persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].comune == comSelected) {
                        var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                        addDataBar(mese);
                        break;
                    }
                    if (persone[persona].luoghi_residenza[1 + parseInt(residenza)] != undefined && persone[persona].luoghi_residenza[residenza].anno.split("-")[0] == annoSelected && persone[persona].luoghi_residenza[residenza].comune == comSelected && persone[persona].luoghi_residenza[parseInt(residenza) + 1].comune == comSelected) {
                        var mese = persone[persona].luoghi_residenza[residenza].anno.split("-")[1];
                        removeDataBar(mese);
                        break;
                    }
                }
            } else {
                //se l'anno è minore di quello selezionato aggiunge persona a tutti i mesi dell'anno
                if (persone[persona].luoghi_residenza[0].comune == comSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] < annoSelected)
                    for (var i = 0; i < 12; i++) datiBar[i]++;
                //se l'anno è uguale a quello selezionato aggiunge fino al mese selezionato
                if (persone[persona].luoghi_residenza[0].comune == comSelected && persone[persona].luoghi_residenza[0].anno.split("-")[0] == annoSelected) {
                    var mese = persone[persona].luoghi_residenza[0].anno.split("-")[1];
                    addDataBar(mese);
                }
            }
        }
        addBarChart("comune di " + comSelected);
    }
}

function addDataBar(mese) {
    switch (mese) {
        case "01":
            datiBar[0]++;
            break;
        case "02":
            for (var i = 1; i < 12; i++)
                datiBar[i]++;
            break;
        case "03":
            for (var i = 2; i < 12; i++)
                datiBar[i]++;
            break;
        case "04":
            for (var i = 3; i < 12; i++)
                datiBar[i]++;
            break;
        case "05":
            for (var i = 4; i < 12; i++)
                datiBar[i]++;
            break;
        case "06":
            for (var i = 5; i < 12; i++)
                datiBar[i]++;
            break;
        case "07":
            for (var i = 6; i < 12; i++)
                datiBar[i]++;
            break;
        case "08":
            for (var i = 7; i < 12; i++)
                datiBar[i]++;
            break;
        case "09":
            for (var i = 8; i < 12; i++)
                datiBar[i]++;
            break;
        case "10":
            for (var i = 9; i < 12; i++)
                datiBar[i]++;
            break;
        case "11":
            for (var i = 10; i < 12; i++)
                datiBar[i]++;
            break;
        case "12":
            for (var i = 11; i < 12; i++)
                datiBar[i]++;
            break;
    }
}

function addDataBarResidenza(mese) {
    switch (mese) {
        case "01":
            datiBar[0]++;
            break;
        case "02":
            for (var i = 0; i < 1; i++)
                datiBar[i]++;
            break;
        case "03":
            for (var i = 0; i < 2; i++)
                datiBar[i]++;
            break;
        case "04":
            for (var i = 0; i < 3; i++)
                datiBar[i]++;
            break;
        case "05":
            for (var i = 0; i < 4; i++)
                datiBar[i]++;
            break;
        case "06":
            for (var i = 0; i < 5; i++)
                datiBar[i]++;
            break;
        case "07":
            for (var i = 0; i < 6; i++)
                datiBar[i]++;
            break;
        case "08":
            for (var i = 0; i < 7; i++)
                datiBar[i]++;
            break;
        case "09":
            for (var i = 0; i < 8; i++)
                datiBar[i]++;
            break;
        case "10":
            for (var i = 0; i < 9; i++)
                datiBar[i]++;
            break;
        case "11":
            for (var i = 0; i < 10; i++)
                datiBar[i]++;
            break;
        case "12":
            for (var i = 0; i < 11; i++)
                datiBar[i]++;
            break;
    }
}

function removeDataBar(mese) {
    switch (mese) {
        case "01":
            datiBar[0]++;
            break;
        case "02":
            for (var i = 0; i < 2; i++)
                datiBar[i]++;
            break;
        case "03":
            for (var i = 0; i < 3; i++)
                datiBar[i]++;
            break;
        case "04":
            for (var i = 0; i < 4; i++)
                datiBar[i]++;
            break;
        case "05":
            for (var i = 0; i < 5; i++)
                datiBar[i]++;
            break;
        case "06":
            for (var i = 0; i < 6; i++)
                datiBar[i]++;
            break;
        case "07":
            for (var i = 0; i < 7; i++)
                datiBar[i]++;
            break;
        case "08":
            for (var i = 0; i < 8; i++)
                datiBar[i]++;
            break;
        case "09":
            for (var i = 0; i < 9; i++)
                datiBar[i]++;
            break;
        case "10":
            for (var i = 0; i < 10; i++)
                datiBar[i]++;
            break;
        case "11":
            for (var i = 0; i < 11; i++)
                datiBar[i]++;
            break;
        case "12":
            for (var i = 0; i < 12; i++)
                datiBar[i]++;
            break;
    }
}

function addPieChart() {
    if (chartPie != undefined)
        chartPie.destroy();
    for (var i = 0; i < datiPie.length; i++) {
        if (datiPie[i] == undefined) {
            datiPie[i] = 0;
        }
    }
    for (var j = 0; j < datiPie.length; j++) {
        if (regioni[j] == undefined) {
            regioni[j] = "";
        }
    }
    chartPie = new Chart(document.getElementById("myChartPie"), {
        type: "pie",
        data: {
            labels: [regioni[0] || "", regioni[1] || "", regioni[2] || "", regioni[3] || "", regioni[4] || "", regioni[5] || "", regioni[6] || "", regioni[7] || "", regioni[8] || "", regioni[9] || "", regioni[10] || "", regioni[11] || "", regioni[12] || "", regioni[13] || "", regioni[14] || "", regioni[15] || "", regioni[16] || "", regioni[17] || "", regioni[18] || "", regioni[19] || ""],
            datasets: [{
                label: "Population",
                data: [
                    datiPie[0],
                    datiPie[1],
                    datiPie[2],
                    datiPie[3],
                    datiPie[4],
                    datiPie[5],
                    datiPie[6],
                    datiPie[7],
                    datiPie[8],
                    datiPie[9],
                    datiPie[10],
                    datiPie[11],
                    datiPie[12],
                    datiPie[13],
                    datiPie[14],
                    datiPie[15],
                    datiPie[16],
                    datiPie[17],
                    datiPie[18],
                    datiPie[19],
                ],
                backgroundColor: [
                    '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
                ],
                borderWidth: 1,
                borderColor: "#777",
                hoverBorderWidth: 2,
                hoverBorderColor: "#000"
            }]
        },
        options: {
            title: {
                display: true,
                text: "Popolazione regioni attuale",
                fontSize: 45,
                padding: 20,
            },
            legend: {
                display: true,
                position: "right",
                labels: {
                    fontSize: 20,
                    fontColor: "#000",
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 20
                }
            },
            tooltips: {
                enabled: true,
            }
        },
    });
    // Ridimensiono la torta
    $("#myChartPie").css("width", "900px");
    $("#myChartPie").css("height", "");
}

function addBarChart(luogo) {
    // Ridimensionamento dei grafici
    $("#myChart").parent().removeClass("d-none");
    $("#myChart").parent().addClass("d-flex");
    $("#myChartPie").parent().removeClass("col-lg-12");
    $("#myChartPie").parent().addClass("col-lg-6");

    luogo = "Popolazione annuale " + luogo;
    if (chartBar != undefined)
        chartBar.destroy();
    for (var i = 0; i < datiBar.length; i++) {
        if (datiBar[i] == undefined) {
            datiBar[i] = 0;
        }
    }
    chartBar = new Chart(document.getElementById("myChart"), {
        type: "bar",
        data: {
            labels: [
                "Gennaio",
                "Febbraio",
                "Marzo",
                "Aprile",
                "Maggio",
                "Giugno",
                "Luglio",
                "Agosto",
                "Settembre",
                "Ottobre",
                "Novembre",
                "Dicembre"
            ],
            datasets: [{
                label: luogo,
                data: [
                    datiBar[0],
                    datiBar[1],
                    datiBar[2],
                    datiBar[3],
                    datiBar[4],
                    datiBar[5],
                    datiBar[6],
                    datiBar[7],
                    datiBar[8],
                    datiBar[9],
                    datiBar[10],
                    datiBar[11],
                ],
                backgroundColor: [
                    '#0044ff', '#00bfff', '#00ffae', '#00ff26', '#5eff00', '#e1ff00', '#ffb700', '#ff3c00', '#c46200', '#c4b700', '#00c493', '#009dc4'
                ],
                borderWidth: 1,
                borderColor: "#777",
                hoverBorderWidth: 2,
                hoverBorderColor: "#000"
            }]
        },
        options: {
            title: {
                display: true,
                text: luogo,
                fontSize: 25
            },
            legend: {
                display: false,
                position: "right",
                labels: {
                    fontColor: "#000",
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                },
            },
            tooltips: {
                enabled: true,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });
}

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