using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Runtime.Remoting.Contexts;
using System.IO;
using System.Text;

namespace emoe
{
    public partial class minero : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static string getActividades()
        {
            SqlDataReader dr = null;
            cnx c = new cnx();
            List<Actividad> list = new List<Actividad>();
            try
            {
                dr = c.ExecuteCommand("PR_OBTIENE_ACTIVIDAD_MINERO", CommandType.StoredProcedure);
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        Actividad x = new Actividad()
                        {
                            idActividadCompuesta = dr["ID_ACTIVIDAD_COMPUESTA"].ToString(),
                            idActividadPadre = dr["ID_ACTIVIDAD_PADRE"].ToString(),
                            descripcion = dr["DESCRIPCION"].ToString(),
                            clasificador = dr["CLASIFICADOR"].ToString(),
                        };

                        list.Add(x);

                    }
                    JavaScriptSerializer jss = new JavaScriptSerializer();

                    string json = jss.Serialize(list);

                    return json;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
            }

            return null;
        }

        [WebMethod]
        public static string getVariables(string actividad)
        {
            SqlDataReader dr = null;
            cnx c = new cnx();
            List<Variable> list = new List<Variable>();
            try
            {
                var cmdParams = new SqlParameter[]{
                new SqlParameter (){ParameterName="@ACTIVIDAD",Value=actividad}};
                dr = c.ExecuteCommand("PR_OBTIENE_VARIABLE_MINERO", CommandType.StoredProcedure, cmdParams);
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        Variable x = new Variable()
                        {
                            idVariableCompuesta = dr["ID_VARIABLE_COMPUESTA"].ToString(),
                            idVariablePadre = dr["ID_VARIABLE_PADRE"].ToString(),
                            descripcion = dr["DESCRIPCION"].ToString(),
                            nivelDesglose = dr["NIVEL_DESGLOSE"].ToString(),
                            presenta = dr["PRESENTA"].ToString()
                        };

                        list.Add(x);

                    }
                    JavaScriptSerializer jss = new JavaScriptSerializer();

                    string json = jss.Serialize(list);

                    return json;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
            }

            return null;
        }

        [WebMethod]
        public static string getTipos(string actividad, string variable)
        {
            SqlDataReader dr = null;
            cnx c = new cnx();
            List<Tipodato> list = new List<Tipodato>();
            try
            {
                var cmdParams = new SqlParameter[]{
                new SqlParameter (){ParameterName="@ACTIVIDAD",Value=actividad},
                new SqlParameter (){ParameterName="@VARIABLE",Value=variable}};
                dr = c.ExecuteCommand("PR_OBTIENE_TIPO_MINERO", CommandType.StoredProcedure, cmdParams);
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        Tipodato x = new Tipodato()
                        {
                            idTipoDato = dr["ID_TIPO_DATO"].ToString(),
                            descripcion = dr["DESCRIPCION"].ToString(),
                        };

                        list.Add(x);

                    }
                    JavaScriptSerializer jss = new JavaScriptSerializer();

                    string json = jss.Serialize(list);

                    return json;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
            }

            return null;
        }

        [WebMethod]
        public static string getAnios()
        {
            SqlDataReader dr = null;
            cnx c = new cnx();
            List<int> list = new List<int>();
            try
            {
                dr = c.ExecuteCommand("PR_OBTIENE_ANIO_MINERO", CommandType.StoredProcedure);
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        int x = dr.GetInt32(0);
                        list.Add(x);

                    }
                    JavaScriptSerializer jss = new JavaScriptSerializer();

                    string json = jss.Serialize(list);

                    return json;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
            }

            return null;
        }


       

        [WebMethod]
        public static string getTable(string vars, string acts, string tipo, string anioInit, string anioEnd, string mesInit, string mesEnd)
        {
            SqlDataReader dr = null;
            cnx c = new cnx();
            List<Tabulado> list = new List<Tabulado>();
            try
            {
                var cmdParams = new SqlParameter[]{
                new SqlParameter (){ParameterName="@ACT",Value=acts},
                new SqlParameter (){ParameterName="@VAR",Value=vars},
                new SqlParameter (){ParameterName="@TIPO",Value=tipo},
                 new SqlParameter (){ParameterName="@ANIOINIT",Value=anioInit},
                 new SqlParameter (){ParameterName="@ANIOEND",Value=anioEnd},
                 new SqlParameter (){ParameterName="@MESINIT",Value=mesInit},
                 new SqlParameter (){ParameterName="@MESEND",Value=mesEnd},

                };
                dr = c.ExecuteCommand("PR_OBTIENE_TABULADO_MINERO", CommandType.StoredProcedure, cmdParams);
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        Tabulado x = new Tabulado()
                        {
                            idActividadCompuesta = dr["ID_ACTIVIDAD_COMPUESTA"].ToString(),
                            descripcionActividad = dr["DESCRIPCION_ACTIVIDAD"].ToString(),
                            idVariableCompuesta = dr["ID_VARIABLE_COMPUESTA"].ToString(),
                            descripcionVariable = dr["DESCRIPCION_VARIABLE"].ToString(),
                            idTipoDato = dr["ID_TIPO_DATO"].ToString(),
                            descripcionTipoDato = dr["DESCRIPCION_TIPO_DATO"].ToString(),
                            anio = dr["ANIO"].ToString(),
                            idPeriodicidad = dr["ID_PERIODICIDAD"].ToString(),
                            descripcionPeriodicidad = dr["DESCRIPCION_PERIODICIDAD"].ToString(),
                            valorPresentacion = dr["VALOR_PRESENTACION"].ToString(),
                            idEstatus = dr["ID_ESTATUS"].ToString(),
                            descripcionEstatus = dr["DESCRIPCION_ESTATUS"].ToString(),
                            presentacionEstatus = dr["PRESENTACION_ESTATUS"].ToString()
                        };
                        list.Add(x);

                    }
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    jss.MaxJsonLength = 99999999;
                    string json = jss.Serialize(list);


                    return json;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
            }

            return null;
        }

        protected void btnExportar_ServerClick(object sender, EventArgs e)
        {


            string output = parser.Value;



            if (output != "")
            {
                output = output.Replace("table", "table style='font:9pt arial' ");
                output = output.Replace("th", "th style='background-color:rgb(209, 239, 246);border:1px solid white' ");
                output = output.Replace("td", "td style='border:1px solid rgb(245, 245, 245)' ");
                Response.Clear();
                Response.AddHeader("content-disposition", "attachment;filename=EMOE.xls");
                Response.ContentEncoding = System.Text.Encoding.Unicode;
                Response.BinaryWrite(System.Text.Encoding.Unicode.GetPreamble());
                Response.ContentType = "application/vnd.xls";
                Response.Write(output);

                Response.End();

            }
            else
            {

            }


        }

    }



    public class Tabulado
    {
        public string idActividadCompuesta { get; set; }
        public string descripcionActividad { get; set; }
        public string idVariableCompuesta { get; set; }
        public string descripcionVariable { get; set; }
        public string idTipoDato { get; set; }
        public string descripcionTipoDato { get; set; }
        public string valor { get; set; }
        public string valorPresentacion { get; set; }
        public string anio { get; set; }
        public string idPeriodicidad { get; set; }
        public string descripcionPeriodicidad { get; set; }
        public string idEstatus { get; set; }
        public string descripcionEstatus { get; set; }
        public string presentacionEstatus { get; set; }
    }



    public class Actividad
    {
        public string idActividadCompuesta { get; set; }
        public string idActividadPadre { get; set; }
        public string descripcion { get; set; }
        public string clasificador { get; set; }
    }

    public class Tipodato
    {
        public string idTipoDato { get; set; }
        public string descripcion { get; set; }
    }

    public class Variable
    {
        public string idVariableCompuesta { get; set; }
        public string idVariablePadre { get; set; }
        public string descripcion { get; set; }
        public string nivelDesglose { get; set; }
        public string presenta { get; set; }
    }
}