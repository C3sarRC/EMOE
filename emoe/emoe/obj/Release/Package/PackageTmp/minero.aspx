<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="minero.aspx.cs" Inherits="emoe.minero" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>EmoeMinero</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="robots" content="index, follow" />
    <meta name="title" content="EMOE" />
    <meta name="author" content="Instituto Nacional de Estadística y Geografía (INEGI)" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <link href="css/bootstrap.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/minero.js"></script>
    <link type="text/css" href="css/minero.css" rel="stylesheet" />
</head>
<body>
    <form id="formMinero" runat="server">
        <div class="container">
            <div id="actContainer" class="section">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="ribbon text-center"><strong>Actividades</strong></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-4">
                        <label for="">Actividad</label>
                        <br />
                        <select id="slctAct" class="">
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="">Contenido</label>
                        <br />
                    </div>
                    <div class="col-xs-12">
                        <div id="contentAct" class="content" hidden="hidden">
                            <ul id="listAct"></ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="varContainer" class="section" hidden="hidden">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="ribbon text-center"><strong>Consulta de información</strong></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-4">
                        <label for="">Variable</label>
                        <br />
                        <select id="slctVar" class="">
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="">Contenido</label>
                        <br />
                    </div>
                    <div class="col-xs-12">
                        <div id="contentVar" class="content" hidden="hidden">
                            <ul id="listVar"></ul>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12">
                        <div class="ribbon text-center"><strong>Periodo</strong></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-4">
                        <div id="contentTipo" hidden="hidden">
                            <label for="">Tipo de dato</label>
                            <br />
                            <select id="slctTipo" class="">
                            </select>
                        </div>
                    </div>
                    <div id="contentAnios" class="col-xs-4">
                        <label for="">Años</label>
                        <br />
                        <div>
                            <strong>Desde: </strong><span class="range-description"></span>
                            <input id="anioFrom" type="range" min="" max="" />
                        </div>
                        <br />
                        <div>
                            <strong>Hasta: </strong><span class="range-description"></span>
                            <input id="anioUntil" type="range" min="" max="" />
                        </div>
                    </div>
                    <div id="contentMeses" class="col-xs-4">
                        <label for="">Meses</label>
                        <br />
                        <div><strong>Desde: </strong><span class="range-description">Junio</span><input id="mesFrom" type="range" min="1" max="12" value="6" /></div>
                        <br />
                        <div><strong>Hasta: </strong><span class="range-description">Junio</span><input id="mesUntil" type="range" min="1" max="12" value="6" /></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div class="ribbon text-center">
                            <button id="btnConsultar" class="btn btn-default btn-sm" type="button">Consultar <span class="glyphicon glyphicon-ok-circle"></span></button>
                            <br />
                            <br />
                            <button id="btnExportar" class="btn btn-default btn-sm" type="button" runat="server" onserverclick="btnExportar_ServerClick">Exportar <span class="glyphicon glyphicon-download"></span></button>
                        </div>
                        <asp:HiddenField ID = "parser" Value = "" runat = "server" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12">
                        <div id="tableContainer">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12">
                        <div id="tableDescription"></div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
