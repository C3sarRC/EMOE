
var app = angular.module("emoe", ['ngMessages']);

app.controller("inicioCtrl", function ($scope, $http) {
    var v = JSON.stringify({ tipo: "iat"});
    $http.post('ws_emoe.asmx/getIndicadorAT',v).success(function ($response) {
        data = JSON.parse($response.d);
        datosN = [];
        var meses = alasql('select distinct mesa from ?', [JSON.parse($response.d)]);
        var mesesT = alasql('select distinct mesa,anio, anioAct from ?', [JSON.parse($response.d)]);
        $scope.mesT1 = mesesT[1].mesa + " " + mesesT[1].anio;
        $scope.mesT2 = mesesT[0].mesa + " " + mesesT[0].anioAct;
        $scope.mesT3 = mesesT[1].mesa + " " + mesesT[1].anioAct;

        var i = 0;
        for (i = 0; i < data.length;i) {
            if (data[i + 1] == undefined) {
                i = data.length;
            } else {
                if (data[i]["DESCRIPCION"] == data[i + 1]["DESCRIPCION"]) {
                    if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {
                        datosAux = [];
                        datosAux.push(data[i]["DESCRIPCION"]);
                        for (var x = 0; x < meses.length; x++) {
                            if (x == 0) {
                                if (data[i][meses[x].mesa] > 0) {
                                    datosAux.push(data[i][meses[x].mesa]);
                                } else {
                                    if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                }
                            } else {
                                if (data[i][meses[x].mesa] > 0) {
                                    datosAux.push(data[i][meses[x].mesa]);
                                } else {
                                    if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                }
                                if (data[i][meses[x - 1].mesa + "1"] > 0) {
                                    datosAux.push(data[i][meses[x - 1].mesa + "1"]);
                                }
                                else {
                                    if (data[i + 1][meses[x - 1].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x - 1].mesa + "1"]); }
                                }
                                if (data[i][meses[x].mesa + "1"] > 0) {
                                    datosAux.push(data[i][meses[x].mesa + "1"]);
                                }
                                else {
                                    if (data[i + 1][meses[x].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x].mesa + "1"]); }
                                }
                            }
                        }
                        datosAux.push(data[i]["Diferencia mensual"]);
                        datosAux.push(data[i]["Diferencia anual"]);
                        datosN.push(datosAux);
                        data.splice(i + 1, 1);
                        i = i;
                    }

                } else { i=i+1}
                
            }
          
        }
        $scope.ia = datosN;
        var labels = alasql('select distinct DESCRIPCION from ?', [JSON.parse($response.d)]);
        var dm = alasql('select * from ?', [$scope.ia]);
        var da = alasql('select *  from ?', [$scope.ia]);

        labelsT = [];
        dmT = [];
        dmA = [];
        for (var i = 0; i < labels.length; i++) {
            labelsT.push({"label":labels[i].DESCRIPCION});
        }
        for (var i = 0; i < dm.length; i++) {
            dmT.push({ "value": dm[i][4] });
        }
        for (var i = 0; i < da.length; i++) {
            dmA.push({ "value": da[i][5] });
        }
       
        FusionCharts.ready(function () {
            var gr1 = new FusionCharts({
                "type": "msbar2d",
                "renderAt": "chartContainer",
                "width": "90%",
                "height": "300",
                "dataFormat": "json",
                "dataSource": 
                                    {
                                        "chart": {
                                            "caption":'' ,
                                            "subcaption":'', 
                                            "xaxisname":'' ,
                                            "yaxisname":'' ,
                                            "yAxisMinValue":'-0.5', 
                                            "yAxisMaxValue":'1.2' ,
                                            "basefont":'Arial' ,
                                            "decimals":'1' ,
                                            "forceDecimals":'1', 
                                            "numberprefix":'',
                                            "bgalpha":'0' ,
                                            "borderalpha":'20', 
                                            "canvasborderalpha":'0',
                                            "theme":'fint',
                                            "useplotgradientcolor":'0',
                                            "plotborderalpha":'10',
                                            "placevaluesinside":'0',
                                            "rotatevalues":'0',
                                            "useroundedges":'1',
                                            "valuefontcolor":'#000000',
                                            "captionpadding":'20',
                                            "showaxislines":'1',
                                            "axislinealpha":'25',
                                            "divlinealpha":'10'
                                             
                                                },
                                    "categories": [
                                        {
                                            "category": labelsT
                                        }
                                    ],
                        "dataset": [
                            {
                                "seriesname": "Diferencia mensual",
                                "color":'#38b2ff',
                                "data": dmT
                            },
                            {
                                "seriesname": "Diferencia anual",
                                "color": '#a4e02f',
                                "data": dmA
                            }
                        ]
                        }
            });
            gr1.render("graph1");
        });
        var v = JSON.stringify({ tipo: "ice" });
        $http.post('ws_emoe.asmx/getIndicadorAT', v).success(function ($response) {;
            data = JSON.parse($response.d);
            datosN = [];
            var meses = alasql('select distinct mesa from ?', [JSON.parse($response.d)]);
            var i = 0;
            for (i = 0; i < data.length; i) {
                if (data[i + 1] == undefined) {
                    i = data.length;
                } else {
                    if (data[i]["DESCRIPCION"] == data[i + 1]["DESCRIPCION"]) {
                        if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {
                            datosAux = [];
                            datosAux.push(data[i]["DESCRIPCION"]);
                            for (var x = 0; x < meses.length; x++) {
                                if (x == 0) {
                                    if (data[i][meses[x].mesa] > 0) {
                                        datosAux.push(data[i][meses[x].mesa]);
                                    } else {
                                        if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                    }
                                } else {
                                    if (data[i][meses[x].mesa] > 0) {
                                        datosAux.push(data[i][meses[x].mesa]);
                                    } else {
                                        if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                    }
                                    if (data[i][meses[x - 1].mesa + "1"] > 0) {
                                        datosAux.push(data[i][meses[x - 1].mesa + "1"]);
                                    }
                                    else {
                                        if (data[i + 1][meses[x - 1].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x - 1].mesa + "1"]); }
                                    }
                                    if (data[i][meses[x].mesa + "1"] > 0) {
                                        datosAux.push(data[i][meses[x].mesa + "1"]);
                                    }
                                    else {
                                        if (data[i + 1][meses[x].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x].mesa + "1"]); }
                                    }
                                }
                            }
                            datosAux.push(data[i]["Diferencia mensual"]);
                            datosAux.push(data[i]["Diferencia anual"]);
                            datosN.push(datosAux);
                            data.splice(i + 1, 1);
                            i = i;
                        }

                    } else { i = i + 1 }

                }

            }
            $scope.ice = datosN;
            var labels = alasql('select distinct DESCRIPCION from ?', [JSON.parse($response.d)]);
            var dm = alasql('select * from ?', [$scope.ice]);
            var da = alasql('select *  from ?', [$scope.ice]);

            labelsT = [];
            dmT = [];
            dmA = [];
            for (var i = 0; i < labels.length; i++) {
                labelsT.push({ "label": labels[i].DESCRIPCION });
            }
            for (var i = 0; i < dm.length; i++) {
                dmT.push({ "value": dm[i][4] });
            }
            for (var i = 0; i < da.length; i++) {
                dmA.push({ "value": da[i][5] });
            }

            FusionCharts.ready(function () {
                var gr1 = new FusionCharts({
                    "type": "msbar2d",
                    "renderAt": "chartContainer",
                    "width": "90%",
                    "height": "300",
                    "dataFormat": "json",
                    "dataSource":
                                        {
                                            "chart": {
                                                "caption": '',
                                                "subcaption": '',
                                                "xaxisname": '',
                                                "yaxisname": '',
                                                "yAxisMinValue": '-0.5',
                                                "yAxisMaxValue": '1.2',
                                                "basefont": 'Arial',
                                                "decimals": '1',
                                                "forceDecimals": '1',
                                                "numberprefix": '',
                                                "bgalpha": '0',
                                                "borderalpha": '20',
                                                "canvasborderalpha": '0',
                                                "theme": 'fint',
                                                "useplotgradientcolor": '0',
                                                "plotborderalpha": '10',
                                                "placevaluesinside": '0',
                                                "rotatevalues": '0',
                                                "useroundedges": '1',
                                                "valuefontcolor": '#000000',
                                                "captionpadding": '20',
                                                "showaxislines": '1',
                                                "axislinealpha": '25',
                                                "divlinealpha": '10'

                                            },
                                            "categories": [
                                                {
                                                    "category": labelsT
                                                }
                                            ],
                                            "dataset": [
                                                {
                                                    "seriesname": "Diferencia mensual",
                                                    "color": '#38b2ff',
                                                    "data": dmT
                                                },
                                                {
                                                    "seriesname": "Diferencia anual",
                                                    "color": '#a4e02f',
                                                    "data": dmA
                                                }
                                            ]
                                        }
                });
                gr1.render("graph2");
            });
            var v = JSON.stringify({ tipo: "ipt" });
            $http.post('ws_emoe.asmx/getIndicadorAT', v).success(function ($response) {

                data = JSON.parse($response.d);
                datosN = [];
                var meses = alasql('select distinct mesa from ?', [JSON.parse($response.d)]);
                var i = 0;
                for (i = 0; i < data.length; i) {
                    if (data[i + 1] == undefined) {
                        i = data.length;
                    } else {
                        if (data[i]["DESCRIPCION"] == data[i + 1]["DESCRIPCION"]) {
                            if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {
                                datosAux = [];
                                datosAux.push(data[i]["DESCRIPCION"]);
                                for (var x = 0; x < meses.length; x++) {
                                    if (x == 0) {
                                        if (data[i][meses[x].mesa] > 0) {
                                            datosAux.push(data[i][meses[x].mesa]);
                                        } else {
                                            if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                        }
                                    } else {
                                        if (data[i][meses[x].mesa] > 0) {
                                            datosAux.push(data[i][meses[x].mesa]);
                                        } else {
                                            if (data[i + 1][meses[x].mesa] > 0) { datosAux.push(data[i + 1][meses[x].mesa]); }
                                        }
                                        if (data[i][meses[x - 1].mesa + "1"] > 0) {
                                            datosAux.push(data[i][meses[x - 1].mesa + "1"]);
                                        }
                                        else {
                                            if (data[i + 1][meses[x - 1].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x - 1].mesa + "1"]); }
                                        }
                                        if (data[i][meses[x].mesa + "1"] > 0) {
                                            datosAux.push(data[i][meses[x].mesa + "1"]);
                                        }
                                        else {
                                            if (data[i + 1][meses[x].mesa + "1"] > 0) { datosAux.push(data[i + 1][meses[x].mesa + "1"]); }
                                        }
                                    }


                                }
                                datosAux.push(data[i]["Diferencia mensual"]);
                                datosAux.push(data[i]["Diferencia anual"]);
                                datosN.push(datosAux);
                                data.splice(i + 1, 1);
                                i = i;
                            }

                        } else { i = i + 1 }

                    }

                }
                $scope.ipt = datosN;
                var labels = alasql('select distinct DESCRIPCION from ?', [JSON.parse($response.d)]);
                var dm = alasql('select * from ?', [$scope.ipt]);
                var da = alasql('select *  from ?', [$scope.ipt]);
    
                labelsT = [];
                dmT = [];
                dmA = [];
                for (var i = 0; i < labels.length; i++) {
                    labelsT.push({ "label": labels[i].DESCRIPCION });
                }
                for (var i = 0; i < dm.length; i++) {
                    dmT.push({ "value": dm[i][4] });
                }
                for (var i = 0; i < da.length; i++) {
                    dmA.push({ "value": da[i][5] });
                }
                
                FusionCharts.ready(function () {
                    var gr1 = new FusionCharts({
                        "type": "msbar2d",
                        "renderAt": "chartContainer",
                        "width": "90%",
                        "height": "300",
                        "dataFormat": "json",
                        "dataSource":
                                            {
                                                "chart": {
                                                    "caption": '',
                                                    "subcaption": '',
                                                    "xaxisname": '',
                                                    "yaxisname": '',
                                                    "yAxisMinValue": '-0.5',
                                                    "yAxisMaxValue": '1.2',
                                                    "basefont": 'Arial',
                                                    "decimals": '1',
                                                    "forceDecimals": '1',
                                                    "numberprefix": '',
                                                    "bgalpha": '0',
                                                    "borderalpha": '20',
                                                    "canvasborderalpha": '0',
                                                    "theme": 'fint',
                                                    "useplotgradientcolor": '0',
                                                    "plotborderalpha": '10',
                                                    "placevaluesinside": '0',
                                                    "rotatevalues": '0',
                                                    "useroundedges": '1',
                                                    "valuefontcolor": '#000000',
                                                    "captionpadding": '20',
                                                    "showaxislines": '1',
                                                    "axislinealpha": '25',
                                                    "divlinealpha": '10'

                                                },
                                                "categories": [
                                                    {
                                                        "category": labelsT
                                                    }
                                                ],
                                                "dataset": [
                                                    {
                                                        "seriesname": "Diferencia mensual",
                                                        "color": '#38b2ff',
                                                        "data": dmT
                                                    },
                                                    {
                                                        "seriesname": "Diferencia anual",
                                                        "color": '#a4e02f',
                                                        "data": dmA
                                                    }
                                                ]
                                            }
                    });
                    gr1.render("graph3");
                });
            });
        });
    });



    $scope.sectores = [{ "id": "400", "desc": "Comercio" }, { "id": "23", "desc": "Construcción" }, { "id": "300", "desc": "Industrias manufactureras" }];
    $scope.sector = $scope.sectores[0];
    var x = JSON.stringify({ sec: $scope.sector.id });
    $http.post('ws_emoe.asmx/getVariables',x).success(function ($response) {
        $scope.variables = JSON.parse($response.d);
        $scope.vari = $scope.variables[0];

        var x = JSON.stringify({ sec: $scope.sector.id, vari: $scope.vari.ID_VARIABLE + '%', tipo_dato: "4" });
        $http.post('ws_emoe.asmx/getConsulta', x).success(function ($response) {
            data = JSON.parse($response.d);
            datosN = [];

            var mesesT = alasql('select distinct mesa,anio, anioAct from ?', [JSON.parse($response.d)]);
            var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

            var i = 0;
            datosAux = [];
            for (i = 0; i < data.length; i) {
                if (data[i + 1] == undefined) {
                    if (data[i]["descripcion"] == datosAux[i]["descripcion"]) {
                        for (key in data[i]) {
                            if (datosAux.length == 0) {
                                datosAux.push(data[i]);

                                break;
                            } else {
                                for (var x = 0; x < datosAux.length; x++) {
                                    if (datosAux[x][key] == null) {
                                        datosAux[x][key] = data[i][key];
                                    }
                                }

                            }
                        }
                        data.splice(i, 1);
                        datosN.push(datosAux);
                        datosAux = [];
                        i = i;
                    } else {
                        datosAux.push(data[i]);
                        data.splice(i, 1);
                        i = i;
                    }
                } else {

                    if (data[i]["descripcion"] == data[i + 1]["descripcion"]) {
                        if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {

                            for (key in data[i]) {
                                if (datosAux.length == 0) {
                                    datosAux.push(data[i]);

                                    break;
                                } else {
                                    for (var x = 0; x < datosAux.length; x++) {
                                        if (datosAux[x][key] == null) {
                                            datosAux[x][key] = data[i][key];
                                        }
                                    }
                                }
                            }
                            data.splice(i, 1);
                            i = i;
                        }

                    } else {
                        if (datosAux.length == 0) {
                            datosAux.push(data[i]);
                            data.splice(i, 1);
                            i = i;
                        } else {
                            if (data[i]["descripcion"] == datosAux[i]["descripcion"]) {
                                for (key in data[i]) {
                                    if (datosAux.length == 0) {
                                        datosAux.push(data[i]);

                                        break;
                                    } else {
                                        for (var x = 0; x < datosAux.length; x++) {
                                            if (datosAux[x][key] == null) {
                                                datosAux[x][key] = data[i][key];
                                            }
                                        }

                                    }
                                }
                                data.splice(i, 1);
                                datosN.push(datosAux);
                                datosAux = [];
                                i = i;
                            } else {
                                datosAux.push(data[i]);
                                data.splice(i, 1);
                                i = i;

                            }
                        }

                    }
                }
            }
            if (datosAux.length != 0) {
                datosN = datosAux;
            }
            dataset = [];
            dataCat = [];
            var datosCateg = alasql('select anio,anioAct,Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic,EneAct,FebAct,MarAct,AbrAct,MayAct,JunAct,JulAct,AgoAct,SepAct,OctAct,NovAct,DicAct from ?', [datosN[0]]);
            for (key in datosCateg[0]) {
                if (datosCateg[0][key] != null && key != "anio" && key != "anioAct") {
                    if (key.length == 3) {
                        dataCat.push({ "label": key + " " + datosCateg[0].anio });
                    } else {
                        dataCat.push({ "label": key.substring(0, 3) + " " + datosCateg[0].anioAct });
                    }
                }
            }
            for (var j = 0; j < datosN.length; j++) {
                datosClean = [];
                var name = alasql('select descripcion from ?', [datosN[j]]);
                var datosDataset = alasql('select anio,anioAct,Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic,EneAct,FebAct,MarAct,AbrAct,MayAct,JunAct,JulAct,AgoAct,SepAct,OctAct,NovAct,DicAct from ?', [datosN[j]]);

                for (key in datosDataset[0]) {
                    if (datosDataset[0][key] != null && key != "anio" && key != "anioAct") {
                        datosClean.push({ "value": datosDataset[0][key] });
                    }
                }

                dataset.push({ "seriesname": name[0].descripcion, "data": datosClean });
            }

            FusionCharts.ready(function () {
                var gr4 = new FusionCharts({
                    "type": "msline",
                    "renderAt": "chartContainer",
                    "width": "90%",
                    "height": "500",
                    "dataFormat": "json",
                    "dataSource":
                    {
                        "chart": {
                            'caption': 'Indicador agregado de tendencia y sus componentes',
                            'subcaption': '',
                            'xaxisname': '',
                            'yaxisname': '',
                            'numberprefix': '',
                            'rotateLabels': '1',
                            'formatNumberScale': '0',
                            'basefont': 'Arial',
                            'bgalpha': '0',
                            'borderalpha': '20',
                            'canvasborderalpha': '0',
                            'theme': 'fint',
                            'useplotgradientcolor': '0',
                            'plotborderalpha': '10',
                            'placevaluesinside': '0',
                            'rotatevalues': '0',
                            'valuefontcolor': '#000000',
                            'captionpadding': '20',
                            'showaxislines': '1',
                            'showvalues': '0',
                            'axislinealpha': '25',
                            'divlinealpha': '10'
                        },
                        "categories": [
                            {
                                "category": dataCat
                            }
                        ],
                        "dataset": dataset,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": "17022",
                                        "color": "#6baa01",
                                        "valueOnRight": "1",
                                        "displayvalue": "Average"
                                    }
                                ]
                            }
                        ]
                    }


                });
                gr4.render("graph4");
            })



        });


        var x = JSON.stringify({ sec: $scope.sector.id, vari: $scope.vari.ID_VARIABLE + '%', tipo_dato: "7" });
        $http.post('ws_emoe.asmx/getConsultaGraaf', x).success(function ($response) {
            data = JSON.parse($response.d);
            mesAct = alasql('select distinct mes from ?', [data]);
            anio = alasql('select distinct ANIO from ?', [data]);
            datosN = [];

            var i = 0;
            datosAux = [];
            for (i = 0; i < data.length; i) {
                if (data[i + 1] == undefined) {
                    if (data[i]["DESCRIPCION"] == datosAux[i]["DESCRIPCION"]) {
                        for (key in data[i]) {
                            if (datosAux.length == 0) {
                                datosAux.push(data[i]);

                                break;
                            } else {
                                for (var x = 0; x < datosAux.length; x++) {
                                    if (datosAux[x][key] == null) {
                                        datosAux[x][key] = data[i][key];
                                    }
                                }

                            }
                        }
                        data.splice(i, 1);
                        datosN.push(datosAux);
                        datosAux = [];
                        i = i;
                    } else {
                        datosAux.push(data[i]);
                        data.splice(i, 1);
                        i = i;
                    }
                } else {

                    if (data[i]["DESCRIPCION"] == data[i + 1]["DESCRIPCION"]) {
                        if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {

                            for (key in data[i]) {
                                if (datosAux.length == 0) {
                                    datosAux.push(data[i]);

                                    break;
                                } else {
                                    for (var x = 0; x < datosAux.length; x++) {
                                        if (datosAux[x][key] == null) {
                                            datosAux[x][key] = data[i][key];
                                        }
                                    }
                                }
                            }
                            data.splice(i, 1);
                            i = i;
                        }

                    } else {
                        if (datosAux.length == 0) {
                            datosAux.push(data[i]);
                            data.splice(i, 1);
                            i = i;
                        } else {
                            if (data[i]["DESCRIPCION"] == datosAux[i]["DESCRIPCION"]) {
                                for (key in data[i]) {
                                    if (datosAux.length == 0) {
                                        datosAux.push(data[i]);

                                        break;
                                    } else {
                                        for (var x = 0; x < datosAux.length; x++) {
                                            if (datosAux[x][key] == null) {
                                                datosAux[x][key] = data[i][key];
                                            }
                                        }

                                    }
                                }
                                data.splice(i, 1);
                                datosN.push(datosAux);
                                datosAux = [];
                                i = i;
                            } else {
                                datosAux.push(data[i]);
                                data.splice(i, 1);
                                i = i;

                            }
                        }

                    }
                }
            }

            dataset = [];
            if (datosAux.length!=0) {
                datosN = datosAux;
            }
            
            for (var j = 0; j < datosN.length; j++) {
                dataset.push({ "label": datosN[j]["DESCRIPCION"], "value": datosN[j]["VALOR_PRESENTACION"] });
            }
            dataT = [];
            for (var d = 0; d < dataset.length; d++) {
                dataT.push(dataset[d]);
            }
       
              FusionCharts.ready(function(){
                  var gr5 = new FusionCharts({
                      "type": "bar2d",
                      "renderAt": "chartContainer",
                      "width": "90%",
                      "height": "300",
                      "dataFormat": "json",
                      "dataSource":
                          {
                              "chart": {
                                  'caption':'Diferencia anual', 
                                  'subcaption':mesAct[0]["mes"] +' '+ anio[0]["ANIO"], 
                                  'xaxisname':'', 
                                  'yaxisname':'', 
                                  'basefont':'Arial', 
                                  'numberprefix':'', 
                                  'bgalpha':'0', 
                                  'borderalpha':'20', 
                                  'canvasborderalpha':'0', 
                                  'theme':'fint', 
                                  'useplotgradientcolor':'0', 
                                  'plotborderalpha':'10', 
                                  'placevaluesinside':'0', 
                                  'rotatevalues':'0', 
                                  'useroundedges':'1', 
                                  'valuefontcolor':'#000000', 
                                  'captionpadding':'20', 
                                  'showaxislines':'1', 
                                  'axislinealpha':'25', 
                                  'divlinealpha':'10'
                              },
                              "data": dataT                          }

                      });
                  gr5.render("graph5");
              })

        });
    });
    $scope.getVariables = function () {
        var x = JSON.stringify({ sec: $scope.sector.id });
        $http.post('ws_emoe.asmx/getVariables', x).success(function ($response) {
            $scope.variables = JSON.parse($response.d);
            $scope.vari = $scope.variables[0];
        });
    }





    $scope.getGranjero = function () {
        var x = JSON.stringify({ sec: $scope.sector.id, vari: $scope.vari.ID_VARIABLE+'%', tipo_dato: "4" });
        $http.post('ws_emoe.asmx/getConsulta', x).success(function ($response) {
            data = JSON.parse($response.d);
            datosN = [];
            
            var mesesT = alasql('select distinct mesa,anio, anioAct from ?', [JSON.parse($response.d)]);
            var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

            var i = 0;
            datosAux = [];
            for (i = 0; i < data.length; i) {
                if (data[i + 1] == undefined) {
                    if (data[i]["descripcion"] == datosAux[i]["descripcion"]) {
                        for (key in data[i]) {
                            if (datosAux.length == 0) {
                                datosAux.push(data[i]);

                                break;
                            } else {
                                for (var x = 0; x < datosAux.length; x++) {
                                    if (datosAux[x][key] == null) {
                                        datosAux[x][key] = data[i][key];
                                    }
                                }

                            }
                        }
                        data.splice(i, 1);
                        datosN.push(datosAux);
                        datosAux = [];
                        i = i;
                    } else {
                        datosAux.push(data[i]);
                        data.splice(i, 1);
                        i = i;
                    }
                } else {

                    if (data[i]["descripcion"] == data[i + 1]["descripcion"]) {
                        if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {

                            for (key in data[i]) {
                                if (datosAux.length == 0) {
                                    datosAux.push(data[i]);

                                    break;
                                } else {
                                    for (var x = 0; x < datosAux.length; x++) {
                                        if (datosAux[x][key] == null) {
                                            datosAux[x][key] = data[i][key];
                                        }
                                    }
                                }
                            }
                            data.splice(i, 1);
                            i = i;
                        }

                    } else {
                        if (datosAux.length == 0) {
                            datosAux.push(data[i]);
                            data.splice(i, 1);
                            i = i;
                        } else {
                            if (data[i]["descripcion"] == datosAux[i]["descripcion"]) {
                                for (key in data[i]) {
                                    if (datosAux.length == 0) {
                                        datosAux.push(data[i]);

                                        break;
                                    } else {
                                        for (var x = 0; x < datosAux.length; x++) {
                                            if (datosAux[x][key] == null) {
                                                datosAux[x][key] = data[i][key];
                                            }
                                        }

                                    }
                                }
                                data.splice(i, 1);
                                datosN.push(datosAux);
                                datosAux = [];
                                i = i;
                            } else {
                                datosAux.push(data[i]);
                                data.splice(i, 1);
                                i = i;

                            }
                        }

                    }
                }
            }

            dataset = [];
            dataCat = [];
            if (datosAux.length != 0) {
                datosN = datosAux;
            }
            var datosCateg = alasql('select anio,anioAct,Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic,EneAct,FebAct,MarAct,AbrAct,MayAct,JunAct,JulAct,AgoAct,SepAct,OctAct,NovAct,DicAct from ?', [datosN[0]]);
            for (key in datosCateg[0]) {
                if (datosCateg[0][key] != null && key != "anio" && key != "anioAct") {
                    if (key.length == 3) {
                        dataCat.push({ "label": key + " " + datosCateg[0].anio });
                    } else {
                        dataCat.push({ "label": key.substring(0, 3) + " " + datosCateg[0].anioAct });
                    }
                }
            }
            for (var j = 0; j < datosN.length; j++) {
                datosClean = [];
                var name=alasql('select descripcion from ?',[datosN[j]]);
                var datosDataset = alasql('select anio,anioAct,Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic,EneAct,FebAct,MarAct,AbrAct,MayAct,JunAct,JulAct,AgoAct,SepAct,OctAct,NovAct,DicAct from ?', [datosN[j]]);

                for (key in datosDataset[0]) {
                    if (datosDataset[0][key] != null && key != "anio" && key != "anioAct") {
                        datosClean.push({"value":datosDataset[0][key]});
                    }
                }

                dataset.push({"seriesname":name[0].descripcion,"data":datosClean});
            }

          FusionCharts.ready(function(){
              var gr4 = new FusionCharts({
                  "type": "msline",
                  "renderAt": "chartContainer",
                  "width": "90%",
                  "height": "500",
                  "dataFormat": "json",
                  "dataSource": 
                  {
            "chart": {
                'caption':'Indicador agregado de tendencia y sus componentes' ,
                'subcaption':'' ,
                'xaxisname':'' ,
                'yaxisname':'' ,
                'numberprefix':'' ,
                'rotateLabels':'1' ,
                'formatNumberScale':'0' ,
                'basefont': 'Arial',
                'bgalpha':'0' ,
                'borderalpha':'20' ,
                'canvasborderalpha':'0' ,
                'theme':'fint' ,
                'useplotgradientcolor':'0' ,
                'plotborderalpha':'10' ,
                'placevaluesinside':'0' ,
                'rotatevalues':'0' ,
                'valuefontcolor':'#000000' ,
                'captionpadding':'20' ,
                'showaxislines':'1' ,
                'showvalues':'0' ,
                'axislinealpha':'25' ,
                'divlinealpha': '10'
                      },
            "categories": [
                {
                    "category": dataCat
                }
            ],
            "dataset": dataset,
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "17022",
                            "color": "#6baa01",
                            "valueOnRight": "1",
                            "displayvalue": "Average"
                        }
                    ]
                }
            ]
                }


              });
              gr4.render("graph4");
          })



        });


        var x = JSON.stringify({ sec: $scope.sector.id, vari: $scope.vari.ID_VARIABLE + '%', tipo_dato: "7" });
        $http.post('ws_emoe.asmx/getConsultaGraaf', x).success(function ($response) {
            data = JSON.parse($response.d);
            mesAct = alasql('select distinct mes from ?', [data]);
            anio = alasql('select distinct ANIO from ?', [data]);
            datosN = [];

            var i = 0;
            datosAux = [];
            for (i = 0; i < data.length; i) {
                if (data[i + 1] == undefined) {
                    if (data[i]["DESCRIPCION"] == datosAux[i]["DESCRIPCION"]) {
                        for (key in data[i]) {
                            if (datosAux.length == 0) {
                                datosAux.push(data[i]);

                                break;
                            } else {
                                for (var x = 0; x < datosAux.length; x++) {
                                    if (datosAux[x][key] == null) {
                                        datosAux[x][key] = data[i][key];
                                    }
                                }

                            }
                        }
                        data.splice(i, 1);
                        datosN.push(datosAux);
                        datosAux = [];
                        i = i;
                    } else {
                        datosAux.push(data[i]);
                        data.splice(i, 1);
                        i = i;
                    }
                } else {

                    if (data[i]["DESCRIPCION"] == data[i + 1]["DESCRIPCION"]) {
                        if (data[i]["ID_ESTATUS"] < data[i + 1]["ID_ESTATUS"]) {

                            for (key in data[i]) {
                                if (datosAux.length == 0) {
                                    datosAux.push(data[i]);

                                    break;
                                } else {
                                    for (var x = 0; x < datosAux.length; x++) {
                                        if (datosAux[x][key] == null) {
                                            datosAux[x][key] = data[i][key];
                                        }
                                    }
                                }
                            }
                            data.splice(i, 1);
                            i = i;
                        }

                    } else {
                        if (datosAux.length == 0) {
                            datosAux.push(data[i]);
                            data.splice(i, 1);
                            i = i;
                        } else {
                            if (data[i]["DESCRIPCION"] == datosAux[i]["DESCRIPCION"]) {
                                for (key in data[i]) {
                                    if (datosAux.length == 0) {
                                        datosAux.push(data[i]);

                                        break;
                                    } else {
                                        for (var x = 0; x < datosAux.length; x++) {
                                            if (datosAux[x][key] == null) {
                                                datosAux[x][key] = data[i][key];
                                            }
                                        }

                                    }
                                }
                                data.splice(i, 1);
                                datosN.push(datosAux);
                                datosAux = [];
                                i = i;
                            } else {
                                datosAux.push(data[i]);
                                data.splice(i, 1);
                                i = i;

                            }
                        }

                    }
                }
            }

            dataset = [];
            if (datosAux.length != 0) {
                datosN = datosAux;
            }

            for (var j = 0; j < datosN.length; j++) {
                dataset.push({ "label": datosN[j]["DESCRIPCION"], "value": datosN[j]["VALOR_PRESENTACION"] });
            }
            dataT = [];
            for (var d = 0; d < dataset.length; d++) {
                dataT.push(dataset[d]);
            }

            FusionCharts.ready(function () {
                var gr5 = new FusionCharts({
                    "type": "bar2d",
                    "renderAt": "chartContainer",
                    "width": "90%",
                    "height": "300",
                    "dataFormat": "json",
                    "dataSource":
                        {
                            "chart": {
                                'caption': 'Diferencia anual',
                                'subcaption': mesAct[0]["mes"] + ' ' + anio[0]["ANIO"],
                                'xaxisname': '',
                                'yaxisname': '',
                                'basefont': 'Arial',
                                'numberprefix': '',
                                'bgalpha': '0',
                                'borderalpha': '20',
                                'canvasborderalpha': '0',
                                'theme': 'fint',
                                'useplotgradientcolor': '0',
                                'plotborderalpha': '10',
                                'placevaluesinside': '0',
                                'rotatevalues': '0',
                                'useroundedges': '1',
                                'valuefontcolor': '#000000',
                                'captionpadding': '20',
                                'showaxislines': '1',
                                'axislinealpha': '25',
                                'divlinealpha': '10'
                            },
                            "data": dataT
                        }

                });
                gr5.render("graph5");
            })

        });
    }
    
});
