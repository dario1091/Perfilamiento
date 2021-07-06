
var cron = require('node-cron');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

const jwt = require('jsonwebtoken');
const request = require('request');

const { CONFIGURATION } = require('./utils/constants.js');
const { readWorkingSupport, readPaymentgSupport } = require('./utils/companies/emtelco.js');
const { readPaymentgSupportSalesLand, readWorkingSupportSalesLand, readDocumentSalesLand } = require('./utils/companies/sales_land');
const { readDocument, convertFormatDDMMMYYY } = require('./utils/utils.js');



const dbSequelize = require('./config/database_sequelize.js');
sequelize = dbSequelize.sequelize;



async function worker(newClient) {



  try {
    if (newClient) {
      console.log("Cliente bloqueado:" + newClient.idNewClient);
      let companySalaries = await dbSequelize.companysalaries.findOne({
        attributes: ['companyPaymentDates', 'companyPaymentNumber'],
        where: { idCompanySalaries: newClient.CompanySalaries_idCompanySalaries }
      });


      await newClient.update({ necl_approval_processed: true });
      try {
        let dataDocument = {};
        dataDocument.ccData_contentFirtsName = false;
        dataDocument.ccData_contentSecondName = false;
        dataDocument.ccData_contentFirtslastName = false;
        dataDocument.ccData_contentSecondlastName = false;
        dataDocument.ccData_contentIdentificationId = false;
        dataDocument.cifinData_containFirtsName = false;
        dataDocument.cifinData_containSecondName = false;
        dataDocument.cifinData_containFirtsLastName = false;
        dataDocument.cifinData_containSecondLastName = false;
        dataDocument.cifinData_containIdentification = false;
        dataDocument.cifinData_equalExpDate = false;

        var hoy = new Date();
        dia = hoy.getDate();
        mes = (hoy.getMonth() + 1);
        anio = hoy.getFullYear();


        /**
         * Validar cedula
         */
        if (newClient.file1) {



          var documentoJson = JSON.parse(newClient.file1);
          var cifinDataJson = JSON.parse(JSON.stringify(newClient.necl_cifindata));
          console.log("_-_-_-_-_-_-_-_-_-_---_-_---_-");
          // console.log(cifinDataJson);
          console.log(documentoJson);

          // se envia path del archivo y se envia si true si es la parte front del documento
          console.log("Se envia a leer frente del documento");
          await readDocument(`C:/projects/Avanzo/files/documents/${documentoJson.documentFront}`, true).then(response => {

            (async () => {
              /**
               * Se compara el frente de la cedula con la bd 
               * nombre
               * apellido
               * numero de cedula
               */

              let confianza = 0.0
              if (response.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[0]) > 0) {
                dataDocument.ccData_contentFirtsName = true;
                confianza += 5;
              }
              if (response.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[1]) > 0) {
                dataDocument.ccData_contentSecondName = true;
                confianza += 5;
              }
              if (response.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[0]) > 0) {
                dataDocument.ccData_contentFirtslastName = true;
                confianza += 5;
              }
              if (response.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[1]) > 0) {
                dataDocument.ccData_contentSecondlastName = true;
                confianza += 5;
              }
              if (response.replace(/\./g, '').indexOf(newClient.identificationId) > 0) {
                dataDocument.ccData_contentIdentificationId = true;
                confianza += 10;
              }

              console.log("se valida la respuesta con CIFIN");

              /**
               * Se compara el frente de la cedula con la informacion de cifin 
               * nombre1,nombre2
               * apellido1,apellido2
               * numero de cedula
               */
              if (cifinDataJson.Nombre1 != undefined && response.toUpperCase().indexOf(cifinDataJson.Nombre1.toUpperCase()) > 0) {
                dataDocument.cifinData_containFirtsName = true;
                confianza += 10;
              }
              if (cifinDataJson.Nombre2 != undefined && response.toUpperCase().indexOf(cifinDataJson.Nombre2.toUpperCase()) > 0) {
                dataDocument.cifinData_containSecondName = true;
                confianza += 10;
              }
              if (cifinDataJson.Apellido1 != undefined && response.toUpperCase().indexOf(cifinDataJson.Apellido1.toUpperCase()) > 0) {
                dataDocument.cifinData_containFirtsLastName = true;
                confianza += 10;
              }
              if (cifinDataJson.Apellido2 != undefined && response.toUpperCase().indexOf(cifinDataJson.Apellido2.toUpperCase()) > 0) {
                dataDocument.cifinData_containSecondLastName = true;
                confianza += 10;
              }
              if (cifinDataJson.NumeroIdentificacion != undefined && response.replace(/\./g, '').indexOf(cifinDataJson.NumeroIdentificacion) > 0) {
                dataDocument.cifinData_containIdentification = true;
                confianza += 10;
              }

              dataDocument.confianzaFront = confianza / 10;

              console.log(dataDocument);
              await newClient.update({ necl_json_document: null, necl_approval_processed: true });
              await newClient.update({ necl_json_document: dataDocument, necl_approval_processed: true });
            })();

          });
          console.log("\n\n\n");

          // se envia path del archivo y se envia si false si es la parte back del documento
          console.log("Se envia a leer reverso del documento");
          await readDocument(`C:/projects/Avanzo/files/documents/${documentoJson.documentBack}`, false).then(response => {
            console.log("llega de leer el reverso del documento ");

            dataDocument.sexo = response.substring(response.indexOf("ESTATURA"), response.indexOf("ESTATURA") - 3);
            dataDocument.expedicion = response.substring(response.indexOf("SEXO") + 4, response.indexOf("SEXO") + 16).trim();
            dataDocument.nacimiento = response.substring(0, 11).trim()
            dataDocument.estatura = response.substring(response.indexOf("LUGAR DE NACIMIENTO") + 20, response.indexOf("LUGAR DE NACIMIENTO") + 25).trim();

            console.log("Se valida la fecha de expedicion del documento con cifin");
            //"FechaExpedicion": "18/11/2009" < cifin
            //"expedicion": "05-SEP-2003" < cedula
            if (cifinDataJson.FechaExpedicion != undefined) {



              //DD/MM/YYYY
              (async () => {
                let dateArray = cifinDataJson.FechaExpedicion.split("/");

                console.log("Antes de convertir fecha");
                console.log("Fecha a convertir : " + dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0]);

                let dateCifinFormatDocument = await convertFormatDDMMMYYY(dateArray[2], dateArray[1], dateArray[0]);
                dateCifinFormatDocument = "06-ENE-1999";
                dataDocument.cifinExpDate = dateCifinFormatDocument;
                let expCedula = dataDocument.expedicion.split("-")[1];



                if (dateCifinFormatDocument.indexOf(expCedula) > 0) {
                  if (dataDocument.expedicion.toUpperCase() === dateCifinFormatDocument.toUpperCase()) {
                    dataDocument.cifinData_equalExpDate = true;
                  }
                  console.log("Despues  de convertir fecha");
                  console.log("Fecha convertida: " + dateCifinFormatDocument);
                  console.log("Fecha exp CC: " + dataDocument.expedicion);
                }


              })();



            } else {

              console.log("Se manda a actualizar el usuario con la informacion final de la lectura del documento");
              console.log("Informacion final");
              console.log(dataDocument);
              (async () => {
                await newClient.update({ necl_json_document: null, necl_approval_processed: true });
                await newClient.update({ necl_json_document: dataDocument, necl_approval_processed: true });
              })();
            }



          });


        }

        /**
       * Lectura de certificados laborales
       * para empresa emtelco >1 y salesland >3
       * formatos pdf se leen localmente
       * formatos opng,jpeg,jpg se envian a aws a leer
       */
        workingSupport = true;
        if (!workingSupport) {

          /**
           * Si la empresa es emtelco
           */
          console.log("Vamos a leer certificado laboral....");
          if (newClient.Company_idCompany == 1) {

            // await readWorkingSupport(`C:/projects/Avanzo/files/OCR/SalesLand/50  Emtelco/CERTIFICADO LABORALEMTELCO.pdf`).then(response => {
            await readWorkingSupport(`C:/projects/Avanzo/files/OCR/SalesLand/50  Emtelco/certificado laboral.png`).then(response => {
              (async () => {
                console.log("Se actualizad en newClient con el json generado");
                await newClient.update({ necl_json_working_support: response, necl_approval_processed: true });
              })();

            });
          }

          /**
           * Sila empresa es salesland
           */

          if (newClient.Company_idCompany == 3) {
            await readWorkingSupportSalesLand(`C:/projects/Avanzo/files/documents/100201-2/certificado_sales.png`).then(response => {

              (async () => {
                if (response)
                  await newClient.update({ necl_json_payment_support: response, necl_approval_processed: true });
              })();

            });
          }

        }

        /**
         * Lectura de soporte de pagos
         * para empresa emtelco y salesland
         * formatos pdf se leen localmente
         * formatos opng,jpeg,jpg se envian a aws a leer
         */
        if (newClient.file3) {
          dataDocument.paymentData_contentFirtsName = false;
          dataDocument.paymentData_contentSecondName = false;
          dataDocument.paymentData_contentFirtslastName = false;
          dataDocument.paymentData_contentSecondlastName = false;
          dataDocument.paymentData_contentIdentificationId = false;
          dataDocument.paymentSupportCorrect = false;
          dataDocument.paymentData_paymentDate = '';

          if (newClient.Company_idCompany == 1) {
            
            await readPaymentgSupport(`C:/projects/Avanzo/files/documents/${newClient.file3}`).then(response => {
              console.log("Respuesta en index OK");
              if (response) {
                (async () => {
                  await newClient.update({ necl_json_payment_support: null, necl_approval_processed: false });
                  await newClient.update({ necl_json_payment_support: response, necl_approval_processed: false });
                })();

                confianza = 0
                if (response.client.name.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[0]) >= 0) {
                  dataDocument.paymentData_contentFirtsName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[1]) >= 0) {
                  dataDocument.paymentData_contentSecondName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[0]) >= 0) {
                  dataDocument.paymentData_contentFirtslastName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[1]) >= 0) {
                  dataDocument.paymentData_contentSecondlastName = true;
                  confianza += 10;
                }


                if (response.client.documentNumber.replace(/\./g, '').replace(/,/g, '').toUpperCase().indexOf(newClient.identificationId) >= 0) {
                  dataDocument.paymentData_contentIdentificationId = true;
                  confianza += 10;
                }

                if (response.client.nomina.toUpperCase() != undefined && response.client.nomina.toUpperCase() != '') {
                  dataDocument.paymentData_paymentDate = response.client.nomina.toUpperCase();
                  confianza += 10;
                  //condicion de si el comprobante de pago es el actual
                  //companySalaries.companyPaymentNumber
                  //companySalaries.companyPaymentDates
                  let paymenyDay = dataDocument.paymentData_paymentDate.split("/")[1];
                  let paymenyMonth = dataDocument.paymentData_paymentDate.split("/")[0];
                  let paymenyYear = dataDocument.paymentData_paymentDate.split("/")[2];


                  if (companySalaries.companyPaymentNumber == 1) {
                    if (parseInt(companySalaries.companyPaymentDates, 10) <= parseInt(dia, 10)) {
                      if (paymenyMonth == mes && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    } else if (parseInt(companySalaries.companyPaymentDates, 10) > parseInt(dia, 10)) {
                      if (mes == 1) {
                        anio = parseInt(anio, 10) -= 1;
                      }
                      if (paymenyMonth == (parseInt(mes, 10) - 1) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    } else {
                      dataDocument.paymentSupportCorrect = false;
                    }
                  } else if (companySalaries.companyPaymentNumber == 2) {


                    if (mes == 1 && dia < 5) {
                      anio = parseInt(anio, 10) -= 1;
                    }
                    // si el pago es quincenal comparamos el dia de hoy con el dia del pago de la empresa de
                    let paymentDayOne = companySalaries.companyPaymentDates.split(",")[0];
                    let paymentDayTwo = companySalaries.companyPaymentDates.split(",")[1];

                    if (parseInt(paymentDayOne, 10) <= parseInt(dia, 10) && parseInt(paymentDayTwo, 10) < parseInt(dia, 10)) {

                      if (paymenyMonth == (parseInt(mes, 10)) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }


                    } else if (parseInt(paymentDayOne, 10) > parseInt(dia, 10)) {
                      if (paymenyMonth == (parseInt(mes, 10) - 1) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    }

                  }

                }

                dataDocument.confianzaPaymentSupport = confianza / 6;
                response.client.name.toUpperCase();
                let subtotalDevengos = response.client.devengos.subtotal;
                let subtotalDeducciones = response.client.deducciones.subtotal;
                let descAvanzo = 0;
                response.client.deducciones.list.forEach(element => {
                  if (element.description.toUpperCase().indexOf("Desc Avanzo".toUpperCase()) >= 0) {
                    descAvanzo = element.valor;
                  }
                });

                dataDocument.clientCupo = (subtotalDevengos * 0.5) - (subtotalDeducciones - descAvanzo);



              }
              (async () => {
                console.log("Actualizacion del json global para aprobación");
                await newClient.update({ necl_json_document: null, necl_json_payment_support: null, necl_approval_processed: false });
                await newClient.update({ necl_json_document: dataDocument, necl_json_payment_support: response, necl_approval_processed: true });
              })();

            });
          }

          if (newClient.Company_idCompany == 3) {
            //datos para validar leyendo el comprobando de pago


            await readPaymentgSupportSalesLand(`C:/projects/Avanzo/files/documents/${newClient.file3}`).then(response => {
              if (response) {

                confianza = 0
                if (response.client.name.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[0]) >= 0) {
                  dataDocument.paymentData_contentFirtsName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.name.toUpperCase().split(" ")[1]) >= 0) {
                  dataDocument.paymentData_contentSecondName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[0]) >= 0) {
                  dataDocument.paymentData_contentFirtslastName = true;
                  confianza += 10;
                }
                if (response.client.name.toUpperCase().indexOf(newClient.lastName.toUpperCase().split(" ")[1]) >= 0) {
                  dataDocument.paymentData_contentSecondlastName = true;
                  confianza += 10;
                }


                if (response.client.documentNumber.replace(/\./g, '').replace(/,/g, '').toUpperCase().indexOf(newClient.identificationId) >= 0) {
                  dataDocument.paymentData_contentIdentificationId = true;
                  confianza += 10;
                }

                if (response.client.nomina.toUpperCase() != undefined && response.client.nomina.toUpperCase() != '') {
                  dataDocument.paymentData_paymentDate = response.client.nomina.toUpperCase();
                  confianza += 10;
                  //condicion de si el comprobante de pago es el actual
                  //companySalaries.companyPaymentNumber
                  //companySalaries.companyPaymentDates
                  let paymenyDay = dataDocument.paymentData_paymentDate.split("/")[1];
                  let paymenyMonth = dataDocument.paymentData_paymentDate.split("/")[0];
                  let paymenyYear = dataDocument.paymentData_paymentDate.split("/")[2];


                  if (companySalaries.companyPaymentNumber == 1) {
                    if (parseInt(companySalaries.companyPaymentDates, 10) <= parseInt(dia, 10)) {
                      if (paymenyMonth == mes && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    } else if (parseInt(companySalaries.companyPaymentDates, 10) > parseInt(dia, 10)) {
                      if (mes == 1) {
                        anio = parseInt(anio, 10) -= 1;
                      }
                      if (paymenyMonth == (parseInt(mes, 10) - 1) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    } else {
                      dataDocument.paymentSupportCorrect = false;
                    }
                  } else if (companySalaries.companyPaymentNumber == 2) {


                    if (mes == 1 && dia < 5) {
                      anio = parseInt(anio, 10) -= 1;
                    }
                    // si el pago es quincenal comparamos el dia de hoy con el dia del pago de la empresa de
                    let paymentDayOne = companySalaries.companyPaymentDates.split(",")[0];
                    let paymentDayTwo = companySalaries.companyPaymentDates.split(",")[1];

                    if (parseInt(paymentDayOne, 10) <= parseInt(dia, 10) && parseInt(paymentDayTwo, 10) < parseInt(dia, 10)) {

                      if (paymenyMonth == (parseInt(mes, 10)) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }


                    } else if (parseInt(paymentDayOne, 10) > parseInt(dia, 10)) {
                      if (paymenyMonth == (parseInt(mes, 10) - 1) && paymenyYear == anio) {
                        dataDocument.paymentSupportCorrect = true;
                      }
                    }

                  }

                }

                dataDocument.confianzaPaymentSupport = confianza / 6;
                response.client.name.toUpperCase();
                let subtotalDevengos = response.client.devengos.subtotal;
                let subtotalDeducciones = response.client.deducciones.subtotal;
                let descAvanzo = 0;
                response.client.deducciones.list.forEach(element => {
                  if (element.description.toUpperCase().indexOf("Desc Avanzo".toUpperCase()) >= 0) {
                    descAvanzo = element.valor;
                  }
                });

                dataDocument.clientCupo = (subtotalDevengos * 0.5) - (subtotalDeducciones - descAvanzo);



              }
              (async () => {
                console.log("Actualizacion del json global para aprobación");
                await newClient.update({ necl_json_document: null, necl_json_payment_support: null, necl_approval_processed: false });
                await newClient.update({ necl_json_document: dataDocument, necl_json_payment_support: response, necl_approval_processed: true });
              })();



            });
          }

        }

        /**
         * vALIDAR LOS JSON GUARDADOS PARA OBTENER EL JSON DE VALIDACION GLOBAL
         */
        let newLimit = parseInt(dataDocument.clientCupo, 10);
        if (companySalaries.companyPaymentNumber == 2)
          newLimit *= 2
        newLimit = newLimit > 500000 ? 500000 : newLimit;
        if (dataDocument.paymentSupportCorrect &&
          dataDocument.cifinData_equalExpDate &&
          dataDocument.ccData_contentIdentificationId &&
          dataDocument.cifinData_containIdentification &&
          dataDocument.paymentData_contentIdentificationId &&
          newLimit > 250000) {
          console.log("Se envia aprobar el newClient : " + newClient.idNewClient);
          console.log("newLimit : " + newLimit);
          await ApproveOrReject(newClient.idNewClient, true, newClient.CompanySalaries_idCompanySalaries, "", newLimit);
        } else {
          if (newLimit < 250000) {
            console.log("Se envia rechazar el newClient : " + newClient.idNewClient);
            console.log("newLimit : " + newLimit);
            await ApproveOrReject(newClient.idNewClient, false, newClient.CompanySalaries_idCompanySalaries, `${process.env.REJECTION_REASON}`, newLimit);
          } else {
            console.log("Se cambia estado de proceso para que se haga manual : " + newClient.idNewClient);


            // await ApproveOrReject(newClient.idNewClient, true, newClient.CompanySalaries_idCompanySalaries, "", newLimit);

            await newClient.update({ necl_approval_processed: true });
          }

        }

        console.log("#########################################################");
        console.log("Finaliza la lectura1");
        console.log("#########################################################");

      } catch (error) {
        console.log(error);
        await newClient.update({ necl_approval_processed: false });
        console.log("No se pudo leer el archivo:  " + newClient.file3);
      }

    }





  } catch (error) {
    console.log("Ocurrio un error : " + error);
    // await newClient.update({ necl_approval_processed: 0 });
    await newClient.update({ necl_approval_processed: false });

  }




}

async function getConfiguration() {
  try {
    let configuration = await dbSequelize.configuration.findOne({
      where: {
        conf_id: CONFIGURATION.AUTOMATIC_APPROVAL,
      }
    });
    if (configuration) {
      if (configuration.confValue) {
        cron.schedule("* * * * *", () => {
          /**
  * Se listan todos los newcliente que tengan la bandera de aprobacion automatica
  */
          (async () => {
            let newClient = await dbSequelize.newclient.findOne({
              attributes: ['idNewClient', 'name', 'lastName', 'Company_idCompany', 'identificationId', 'file1', 'file3', 'status', 'necl_cifindata', 'CompanySalaries_idCompanySalaries', [sequelize.fn('min', sequelize.col('idNewClient')), 'idNewClient']],
              where: { status: 0, necl_approval_processed: false }
            });

            if (newClient.idNewClient) {
              console.log("#######################################################");
              console.log("################## TAREA PROGRAMADA ###################");
              console.log("#####################Aprobación automatica######################");
              console.log(new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }));
              console.log("#######################################################");
              worker(newClient);
            }
          })();


        }, function () {
          // Código a ejecutar cuando la tarea termina. 
          // Puedes pasar null para que no haga nada
          console.log("-------------------------------");
          console.log("-------------------------------");
          console.log("-------------------------------");
          console.log("-TERMINA TAREA PROGRAMA-");
          console.log("-------------------------------");
          console.log("-------------------------------");
          console.log("-------------------------------");
        }, true);
      } else {
        console.log("Esta desactivado el envio de correo para emrpesas RRHH");
      }
    } else {
      console.log("No se encontró configuracion para envio de correos RRHH");
    }
  } catch (error) {
    console.log("Ocurrio un error*** : " + error);
  }
}


async function imprimir() {


  console.log("imprimiendo 11");
  setTimeout(() => {
    console.log("imprimiendo 22");
  }, 300);

  console.log("imprimiendo 333");

}

async function ApproveOrReject(clientId, isApproved, cycleId, rere_array, newLimit) {


  try {
    console.log("Llega aprobar o rechazar cliente 1");
    console.log("_________________________________ 1");
    console.log(process.env.BASE_URL);
    console.log(process.env.USER_ID);
    console.log(process.env.USER_ID);

    let userData = {};
    userData.idUser = process.env.USER_ID
    userData.Role_idRole = process.env.USER_ROLE
    userData.name = "Perfilamiento automatico"

    const jwtoken = jwt.sign({ userData }, process.env.SECRET_KEY, { expiresIn: '8h' });

    console.log("Llega aprobar o rechazar cliente ");
    console.log("_________________________________");



    const options = {
      url: `${process.env.BASE_URL}/Customer/ApproveorReject`,
      headers: {
        'Authorization': 'Bearer ' + jwtoken,
        'clientid': clientId,
        'cycleid': cycleId,
        'approve': isApproved,
        'rere_array': rere_array,
        'new_limit': newLimit
      }
    };

    request.put(options, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
    });

  } catch (error) {
    console.log("1 ::" + error);
  }
}


getConfiguration().catch(error => console.log(error.stack));

