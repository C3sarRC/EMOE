var jsonActividad;
var jsonVariable;
var jsonTipo;
var jsonAnio;
var jsonMes = [{ idPeriodicidad: 1, descripcion: "Enero" },
{ idPeriodicidad: 2, descripcion: "Febrero" },
{ idPeriodicidad: 3, descripcion: "Marzo" },
{ idPeriodicidad: 4, descripcion: "Abril" },
{ idPeriodicidad: 5, descripcion: "Mayo" },
{ idPeriodicidad: 6, descripcion: "Junio" },
{ idPeriodicidad: 7, descripcion: "Julio" },
{ idPeriodicidad: 8, descripcion: "Agosto" },
{ idPeriodicidad: 9, descripcion: "Septiembre" },
{ idPeriodicidad: 10, descripcion: "Octubre" },
{ idPeriodicidad: 11, descripcion: "Noviembre" },
{ idPeriodicidad: 12, descripcion: "Diciembre" }];
var jsonTabulado;
var htmlTable="";



$(function () {
    paintAct();
    paintAnio();


    $("#mesFrom,#mesUntil,#anioFrom,#anioUntil").change(refreshTime)
    $("#slctAct").change(paintActContent);
    $("#slctVar").change(paintVarContent);

    $("#btnConsultar").click(function () {
        var acts = $("#listAct :checked").size();
        var vars = $("#listVar :checked").size();

        $("#tableContainer").empty();
        htmlTable = "";
        if (acts > 0 && vars > 0) {

            var anioFrom = $("#anioFrom").val();
            var anioUntil = $("#anioUntil").val();
            var mesFrom = $("#mesFrom").val();
            var mesUntil = $("#mesUntil").val();
            if (mesFrom.length == 1)
            {
                mesFrom = "0" + mesFrom;
            }
            if (mesUntil.length == 1)
            {
                mesUntil = "0" + mesUntil;
            }

            if (parseInt(anioFrom+mesFrom)<= parseInt(anioUntil+mesUntil))
            {
                var tipo = $("#slctTipo :checked").val();

                var acts = "";
                $("#listAct :checked").each(function () {
                    acts += "'" + $(this).val() + "',";
                })
                acts = acts.substr(0, acts.length - 1);
                var vars = ""
                $("#listVar :checked").each(function () {
                    vars += "'" + $(this).val() + "',";
                })
                vars = vars.substr(0, vars.length - 1);
                var json = JSON.stringify({ tipo: tipo, vars: vars, acts: acts, anioInit: anioFrom, anioEnd: anioUntil, mesInit: mesFrom, mesEnd: mesUntil })
                $.ajax({
                    type: "POST",
                    url: "minero.aspx/getTable",
                    contentType: "application/json; charset=utf-8",
                    data: json,
                    dataType: "json",
                    success: function (d) {

                        if (d.d != null || d.d == "")
                        {
                            jsonTabulado = JSON.parse(d.d);

                            var master = getmaster(jsonTabulado);
                            var acts = master[0];
                            var vars = master[1];
                            var periodos = master[2];
                            var htmlDesc = master[3];

                            var html = "<table class='table table-responsive table-condensed table-bordered table-striped'>";


                            html += "<tr>"
                            html += "<th></th>"
                            for (a = 0; a < acts.length; a++) {
                                html += "<th colspan='" + vars.length + "'>" + acts[a].label + "</th>";
                            }
                            html += "</tr>";

                            html += "<tr>";
                            html += "<th>Periodo</th>"
                            for (a = 0; a < acts.length; a++) {
                                for (v = 0; v < vars.length; v++) {
                                    html += "<th>" + vars[v].label + "</th>";
                                }
                            }
                            html += "</tr>";

                            for (p = 0; p < periodos.length; p++) {
                                html += "<tr>";
                                html += "<td>" + periodos[p] + "</td>"
                                for (a = 0; a < acts.length; a++) {
                                    for (v = 0; v < vars.length; v++) {
                                        for (m = 0; m < jsonTabulado.length; m++) {
                                            if (jsonTabulado[m].idVariableCompuesta == vars[v].id && jsonTabulado[m].idActividadCompuesta == acts[a].id && periodos[p] == (jsonTabulado[m].anio + "/" + jsonTabulado[m].descripcionPeriodicidad + "/" + jsonTabulado[m].presentacionEstatus)) {
                                                html += "<td>" + jsonTabulado[m].valorPresentacion + "</td>";
                                                jsonTabulado.splice(m, 1);
                                                break;
                                            }
                                        }
                                    }
                                }
                                html += "</tr>";
                            }

                            html += "<table>";
                           
                            htmlTable = html;
                            $("#parser").attr("Value",htmlTable);
                            var n = $("#parser").attr("Value");

                            $("#tableContainer").append(html);
                            paintTableDescription(htmlDesc);
                        }
                        else {
                            alert("La consulta no devolvio datos");
                        }
                    }

                })
            }
            else {
                alert("Verifique que los periodos seleccionados sean validos");
            }
           
        }
        else {
            alert("La selección esta incompleta");
        }

    })
});

function paintTableDescription(htmlDesc) {
    $("#tableDescription").empty();
    var html = "<strong>Instituto Nacional de Estadística y Geografía (INEGI)</strong><br/>";
    html += "<strong>Encuesta:</strong> Encuesta Mensual de Opinion Empresarial (EMOE)<br/>";
    html += htmlDesc;

    $("#tableDescription").append(html);

}



function getmaster(json) {
    master = [];
    var idvar = []
    var retvar = [];
    var idact = [];
    var retact = [];
    var retper = [];
    var est = [];
    var html = "";

    for (i = 0; i < json.length; i++) {
        if (idact.indexOf(json[i].idActividadCompuesta) == -1) {
            idact.push(json[i].idActividadCompuesta);
            retact.push({ id: json[i].idActividadCompuesta, label: json[i].descripcionActividad })
        }
        if (idvar.indexOf(json[i].idVariableCompuesta) == -1) {
            idvar.push(json[i].idVariableCompuesta);
            retvar.push({ id: json[i].idVariableCompuesta, label: json[i].descripcionVariable });
        }
        var x = json[i].anio + "/" + json[i].descripcionPeriodicidad + "/" + json[i].presentacionEstatus;
        if (retper.indexOf(x) == -1) {
            retper.push(x);
        }

        if (est.indexOf(json[i].idEstatus) == -1) {
            est.push(json[i].idEstatus);
            html += json[i].presentacionEstatus + ": " + json[i].descripcionEstatus + "<br/>";
        }
    }
    master.push(retact);
    master.push(retvar);
    master.push(retper);
    master.push(html);


    return master;
}


function refreshTime() {
    var val;
    var x = $(this).val();
    length = x.length;
    if (length <= 2) {
        jsonMes.forEach(function (i) {
            if (i.idPeriodicidad == x) {
                val = i.descripcion;
            }
        })
    }
    else {
        val = x;
    }

    $(this).siblings(".range-description").html(val);
}

function paintAct() {



    $.ajax({
        type: "POST",
        url: "minero.aspx/getActividades",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (d) {
            jsonActividad = JSON.parse(d.d);

            var html = "";
            html += "<option value='-1'>Seleccione</option>";

            for (i = 0; i < jsonActividad.length; i++) {
                if (jsonActividad[i].clasificador == "S")
                    html += "<option value='" + jsonActividad[i].idActividadCompuesta + "'>" + jsonActividad[i].descripcion + "</option>";

            }

            $("#slctAct").append(html);
        }

    })
}

function paintActContent() {
    var actRoot = $("#slctAct :selected").val();
    $("#listAct").empty();
    $("#slctVar").empty();
    $("#listVar").empty();
    $("#varContainer").hide(0);
    $("#contentAct").hide(0);

    if (actRoot != -1) {
        $("#contentVar").show("slow");
        jsonActContent = [];
        var maxActDesglose = 0;
        for (i = 0; i < jsonActividad.length; i++) {
            if (jsonActividad[i].idActividadCompuesta.indexOf(actRoot) == 0) {
                var clasificador
                switch (jsonActividad[i].clasificador) {
                    case 'S':
                        clasificador = 0;
                        maxActDesglose = 0;
                        break;
                    case 'SS':
                        clasificador = 1;
                        maxActDesglose = 1;
                        break;
                }
                jsonActContent.push({
                    idActividadCompuesta: jsonActividad[i].idActividadCompuesta,
                    idActividadPadre: jsonActividad[i].idActividadPadre,
                    clasificador: clasificador,
                    descripcion: jsonActividad[i].descripcion
                });

            }

        }

        listAct = document.getElementById("listAct");
        for (i = 0; i <= maxActDesglose; i++) {
            for (x = 0; x < jsonActContent.length; x++) {
                if (jsonActContent[x].clasificador == i) {
                    var html = "";
                    html += "<li><input type='checkbox' value='" + jsonActContent[x].idActividadCompuesta + "'> " + jsonActContent[x].descripcion;
                    var hasDesglose = hasActDesglose(jsonActContent[x].idActividadCompuesta, jsonActContent);

                    if (hasDesglose) {
                        html += "<ul id='" + jsonActContent[x].idActividadCompuesta + "'></ul></li>";
                    }
                    else {
                        html += "</li>";
                    }
                    if (listAct.innerHTML == "") {
                        listAct.innerHTML += html;
                    }
                    else {
                        ul = document.getElementById(jsonActContent[x].idActividadPadre);
                        ul.innerHTML += html;
                    }
                    jsonActContent.splice(x, 1);
                    x--;
                }
            }
        }
        checkBoxTree("listAct");

        paintVar();

        $("#varContainer").show("slow");
        $("#contentVar").hide(0);
        $("#contentAct").show("slow");
    }
    else {
        $("#contentTipo").hide("slow");
    }
}
function paintVarContent() {
    var varRoot = $("#slctVar :selected").val();
    $("#listVar").empty();
    if (varRoot != -1) {
        jsonVarContent = [];
        var maxVarDesglose = 0;
        for (i = 0; i < jsonVariable.length; i++) {
            if (jsonVariable[i].idVariableCompuesta.indexOf(varRoot) == 0) {
                jsonVarContent.push({
                    idVariableCompuesta: jsonVariable[i].idVariableCompuesta,
                    idVariablePadre: jsonVariable[i].idVariablePadre,
                    nivelDesglose: jsonVariable[i].nivelDesglose,
                    descripcion: jsonVariable[i].descripcion,
                    presenta: jsonVariable[i].presenta
                });
                if (parseInt(jsonVariable[i].nivelDesglose) > maxVarDesglose)
                    maxVarDesglose = parseInt(jsonVariable[i].nivelDesglose);
            }

        }

        listVar = document.getElementById("listVar");
        for (i = 0; i <= maxVarDesglose; i++) {
            for (x = 0; x < jsonVarContent.length; x++) {
                if (jsonVarContent[x].nivelDesglose == i) {
                    var html = "";
                    if(jsonVarContent[x].presenta == 0)
                    {
                        html += "<li>" + jsonVarContent[x].descripcion;
                    }
                    else {
                        html += "<li><input type='checkbox' value='" + jsonVarContent[x].idVariableCompuesta + "'/> " + jsonVarContent[x].descripcion;
                    }
                   
                    var hasDesglose = hasVarDesglose(jsonVarContent[x].idVariableCompuesta, jsonVarContent);

                    if (hasDesglose) {
                        html += "<ul id='" + jsonVarContent[x].idVariableCompuesta + "'></ul></li>";
                    }
                    else {
                        html += "</li>";
                    }
                    if (listVar.innerHTML == "") {
                        listVar.innerHTML += html;
                    }
                    else {
                        ul = document.getElementById(jsonVarContent[x].idVariablePadre);
                        ul.innerHTML += html;
                    }
                    jsonVarContent.splice(x, 1);
                    x--;
                }
            }
        }

        checkBoxTree("listVar");
        $("#contentVar").show("slow");

        paintTipo();
    }
    else {
        $("#contentTipo").hide("slow");
        $("#contentVar").hide("slow");
    }

}
function paintVar() {
    var actividad = "";
    actividad = $("#slctAct :checked").val();

    var json = JSON.stringify({ actividad: actividad })

    $.ajax({
        type: "POST",
        url: "minero.aspx/getVariables",
        contentType: "application/json; charset=utf-8",
        data: json,
        dataType: "json",
        success: function (d) {
            jsonVariable = JSON.parse(d.d);

            var html = "";
            html += "<option value='-1'>Seleccione</option>";

            for (i = 0; i < jsonVariable.length; i++) {
                if (jsonVariable[i].nivelDesglose == 0)
                    html += "<option value='" + jsonVariable[i].idVariableCompuesta + "'>" + jsonVariable[i].descripcion + "</option>";

            }

            $("#slctVar").append(html);
        }

    })
}

function paintTipo() {
    $("#slctTipo").empty();
    var actividad = "";
    actividad = $("#slctAct :checked").val();
    var variable = $("#slctVar :checked").val();
    var json = JSON.stringify({
        actividad: actividad,
        variable: variable
    })

    $.ajax({
        type: "POST",
        url: "minero.aspx/getTipos",
        contentType: "application/json; charset=utf-8",
        data: json,
        dataType: "json",
        success: function (d) {
            jsonTipo = JSON.parse(d.d);

            var html = "";
            for (i = 0; i < jsonTipo.length; i++) {
                html += "<option value='" + jsonTipo[i].idTipoDato + "'>" + jsonTipo[i].descripcion + "</option>";

            }

            $("#slctTipo").append(html);
            $("#contentTipo").show("slow");
        }


    })
}

function paintAnio() {
    $.ajax({
        type: "POST",
        url: "minero.aspx/getAnios",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (d) {
            jsonAnio = JSON.parse(d.d);

            var min = jsonAnio[0], max = jsonAnio[0];

            jsonAnio.forEach(function (i) {
                if (i < min)
                    min = i;
                if (i > max)
                    max = i;
            })

            $("#anioFrom").attr("min", min);
            $("#anioFrom").attr("max", max);
            $("#anioFrom").attr("value", min);
            $("#anioFrom").siblings(".range-description").html(min)
            $("#anioUntil").attr("min", min);
            $("#anioUntil").attr("max", max);
            $("#anioUntil").attr("value", max);
            $("#anioUntil").siblings(".range-description").html(max)

        }

    })
}

function checkBoxTree(id) {

    $("#" + id + " ul").each(function () {
        $(this).hide("slow");
        $(this).parent().prepend("<span class='glyphicon glyphicon-triangle-right'></span>");
        $(this).siblings("span").click(function () {

            if ($(this).hasClass("glyphicon-triangle-right")) {
                $(this).removeClass("glyphicon-triangle-right");
                $(this).addClass("glyphicon-triangle-bottom");
                $(this).siblings("ul").show("slow");
            }
            else {
                $(this).removeClass("glyphicon-triangle-bottom");
                $(this).addClass("glyphicon-triangle-right");
                $(this).siblings("ul").hide("slow");
            }

        });
    });

    $("#" + id + " :checkbox").change(function () {

        var n = $(this).prop("checked");
        if ($(this).prop("checked") == true) {
            var chkbxval = $(this).val();
            $("#" + id + " :checkbox").each(function () {
                if (chkbxval.indexOf($(this).val()) == 0) {
                    $(this).prop("checked", "checked");
                }
            })
        }
        else {
            $(this).siblings("ul").find(":checkbox").each(function () {
                $(this).removeProp("checked");
            });
        }
    });
}

function hasActDesglose(x, json) {
    for (z = 0; z < json.length; z++) {
        if (json[z].idActividadPadre == x && json[z].idActividadCompuesta != x) {
            return true;
        }
    }
    return false;
}

function hasVarDesglose(x, json) {
    for (z = 0; z < json.length; z++) {
        if (json[z].idVariablePadre == x && json[z].idVariableCompuesta != x) {
            return true;
        }
    }
    return false;
}