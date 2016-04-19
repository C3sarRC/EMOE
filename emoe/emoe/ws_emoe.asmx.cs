using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data.OleDb;

namespace emoe
{
    /// <summary>
    /// Descripción breve de emoe
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class emoe : System.Web.Services.WebService
    {
        cnx cnx;
        SqlDataReader rdr;
        [WebMethod]
        public string getIndicadorAT(string tipo)
        {
            try
            {
                cnx = new cnx();
                SqlParameter[] parameters = new SqlParameter[2];
                string variable = "";
                if (tipo == "iat")
                {
                    variable = "39,9,21";
                }
                else if (tipo == "ice")
                {
                    variable = "44,15,26";
                }
                else
                {
                    variable = "28";
                }

                string actividad = "23,300,400";
                parameters[0] = new SqlParameter() { ParameterName = "@VARIABLE", Value = variable };
                parameters[1] = new SqlParameter() { ParameterName = "@ACTIVIDAD", Value = actividad };
                rdr = cnx.ExecuteCommand("PR_EMOE_TURISTA", CommandType.StoredProcedure, parameters);
                DataTable dt = new DataTable("AT");
                dt.Load(rdr);
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(dt);
                return (JSONresult);
            }
            catch (Exception)
            {
                
                throw;
            }
            

        }
        [WebMethod]
        public string getVariables(string sec)
        {
            try
            {
                cnx = new cnx();
                SqlParameter[] parameters = new SqlParameter[1];
                parameters[0] = new SqlParameter() { ParameterName = "@ACTIVIDAD", Value = sec };
                rdr = cnx.ExecuteCommand("PR_OBTIENE_PRIMER_DESGLOSE_ACTIVIDAD", CommandType.StoredProcedure, parameters);
                DataTable dt = new DataTable("AT");
                dt.Load(rdr);
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(dt);
                return(JSONresult);
            }
            catch (Exception)
            {
                
                throw;
            }
            

        }

         [WebMethod]
        public string getConsulta(string sec, string vari,string tipo_dato)
        {
            try
            {
                cnx = new cnx();
                SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter() { ParameterName = "@TIPO_DATO", Value = tipo_dato };
                parameters[1] = new SqlParameter() { ParameterName = "@VARIABLE", Value = vari };
                parameters[2] = new SqlParameter() { ParameterName = "@ACTIVIDAD", Value = sec };
                rdr = cnx.ExecuteCommand("PR_EMOE_CONSULTA_GRANJERO", CommandType.StoredProcedure, parameters);
                DataTable dt = new DataTable("AT");
                dt.Load(rdr);
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(dt);
                return(JSONresult);
            }
            catch (Exception)
            {
                
                throw;
            }
            

        }

    
        [WebMethod]
        public string getConsultaGraaf(string sec, string vari,string tipo_dato)
        {
            try
            {
                cnx = new cnx();
                SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter() { ParameterName = "@TIPO_DATO", Value = tipo_dato };
                parameters[1] = new SqlParameter() { ParameterName = "@VARIABLE", Value = vari };
                parameters[2] = new SqlParameter() { ParameterName = "@ACTIVIDAD", Value = sec };
                rdr = cnx.ExecuteCommand("PR_EMOE_CONSULTA_GRANJERO_MACTUAL", CommandType.StoredProcedure, parameters);
                DataTable dt = new DataTable("AT");
                dt.Load(rdr);
                string JSONresult;
                JSONresult = JsonConvert.SerializeObject(dt);
                return(JSONresult);
            }
            catch (Exception)
            {
                
                throw;
            }
            

        }

    }
}
