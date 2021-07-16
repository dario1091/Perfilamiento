var textract = require('textract');
var tesseract = require('tesseract.js')
var path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const { writeFile, documentExtract } = require('../utils.js');
const { convertFormatMMDDYYY } = require('../utils.js');


const readWorkingSupport = (file) => new Promise((resolve, reject) => {
  try {

    let ext = path.extname(file);

    var config = {
      preserveLineBreaks: true,
      preserveOnlyMultipleLineBreaks: false
    }


    let data = {};





    if (ext === '.pdf') {

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("Leemos archivo certificado laboral EMTALCO formato pdf");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("\n\n");

      console.log("...");
      console.log("...");
      console.log("...");

      textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {

        data.name = text.substring(15, text.indexOf(","));
        data.cedula = text.substring(text.indexOf("No.") + 4, text.indexOf(",", (text.indexOf("No."))));
        let txtCed = text.substring(text.indexOf("S.A.S. desde el"));
        let txtContrato = text.substring(text.indexOf("contrato de trabajo"));
        data.tipoContrato = txtContrato.substring("contrato de trabajo".length, txtContrato.indexOf("regido")).trim();

        data.fechaIngreso = txtCed.substring("S.A.S. desde el".length, txtCed.indexOf(",")).trim();
        let txtCargo = text.substring(text.indexOf("cargo de"));
        data.cargo = txtCargo.substring("cargo de".length, txtCargo.indexOf("con")).trim();
        let txtSalario = text.substring(text.indexOf("asignación salarial de"));
        data.salarioText = txtSalario.substring("asignación salarial de".length, txtSalario.indexOf("(")).trim();
        data.salarioMoney = txtSalario.substring(txtSalario.indexOf("(") + 1, txtSalario.indexOf(")")).trim();
        let txtExpedida = text.substring(text.indexOf("a solicitud del interesado"));
        data.expedida = txtExpedida.substring(txtExpedida.indexOf("a los"), txtExpedida.indexOf(".")).trim();

        console.log("\n\n");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("TERMINA LECTURA  certificado laboral EMTALCO formato pdf");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
        return data;
      });
    } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("Leemos archivo certificado laboral EMTALCO formato imagen");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("\n\n");

      console.log("...");
      console.log("...");
      console.log("...");

      try {

        (async () => {
          let jsonToRead = await documentExtract(file);

          /**
           * sacamos todas las lineas leidas
           */
          let text = "";
          for (const block of jsonToRead.Blocks) {
            if (block.BlockType == 'LINE') {
              text += block.Text + " ";
            }
          }

          data.name = text.substring(text.indexOf("CERTIFICA Qu") + 13, text.indexOf("con docu"));
          data.cedula = text.substring(text.indexOf("No.") + 4, text.indexOf(",", (text.indexOf("No."))));
          let txtCed = text.substring(text.indexOf("desde el") + 9, text.indexOf("desde el") + 30);
          data.fechaIngreso = txtCed.trim();
          let txtContrato = text.substring(text.indexOf("contrato de trabajo"));
          data.tipoContrato = txtContrato.substring("contrato de trabajo".length, txtContrato.indexOf("regido")).trim();
          let txtCargo = text.substring(text.indexOf("cargo de"));
          data.cargo = txtCargo.substring("cargo de".length, txtCargo.indexOf("con")).trim();
          let txtSalario = text.substring(text.indexOf("salarial de"));
          data.salarioText = txtSalario.substring("salarial de".length, txtSalario.indexOf("(")).trim();
          data.salarioMoney = txtSalario.substring(txtSalario.indexOf("(") + 1, txtSalario.indexOf(")")).trim();
          let txtExpedida = text.substring(text.indexOf("a solicitud del interesado"));
          data.expedida = txtExpedida.substring(txtExpedida.indexOf("a los"), txtExpedida.indexOf(".")).trim();

          // writeFile("", path.basename(file).replace(path.extname(file), '.json'), data);
          console.log("\n\n");
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log("TERMINA LECTURA  certificado laboral EMTALCO formato imagen");
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          (data) ? resolve(data) : reject(new Error('El archivo no se pudo leer'))


        })();


        // tesseract.recognize(file, 'eng', /*{ logger: m => console.log(m) }*/).then(({ data: { text } }) => {

        //   var find = "\n";
        //   var regex = new RegExp(find, "g");
        //   text = text.replace(regex, " ")
        //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //   console.log(text);


        //   data.name = text.substring(text.indexOf("CERTIFICA Qu") + 13, text.indexOf("con docu"));
        //   data.cedula = text.substring(text.indexOf("No.") + 4, text.indexOf(",", (text.indexOf("No."))));
        //   let txtCed = text.substring(text.indexOf("desde el") + 9, text.indexOf("desde el") + 30);
        //   data.fechaIngreso = txtCed.trim();
        //   let txtContrato = text.substring(text.indexOf("contrato de trabajo"));
        //   data.tipoContrato = txtContrato.substring("contrato de trabajo".length, txtContrato.indexOf("regido")).trim();
        //   let txtCargo = text.substring(text.indexOf("cargo de"));
        //   data.cargo = txtCargo.substring("cargo de".length, txtCargo.indexOf("con")).trim();
        //   let txtSalario = text.substring(text.indexOf("salarial de"));
        //   data.salarioText = txtSalario.substring("salarial de".length, txtSalario.indexOf("(")).trim();
        //   data.salarioMoney = txtSalario.substring(txtSalario.indexOf("(") + 1, txtSalario.indexOf(")")).trim();
        //   let txtExpedida = text.substring(text.indexOf("a solicitud del interesado"));
        //   data.expedida = txtExpedida.substring(txtExpedida.indexOf("a los"), txtExpedida.indexOf(".")).trim();


        //   (text) ? resolve(data) : reject(new Error('El archivo no se pudo leer'))

        //   return data;
        // });
      } catch (error) {
        console.log("el error es:");
      }


    }



    // }

    // // Set up the timeout
    // setTimeout(function () {
    //   reject('Promise timed out after ' + 10000 + ' ms');
    // }, 10000);
    return data;
  } catch (error) {
    return false;
  }

});


const readPaymentgSupport = (filePath, isRequest = false) => new Promise((resolve, reject) => {
  try {
    console.log("llega  aleer readPaymenSupport");
    let ext = path.extname(filePath);
    let fileJsonName = path.basename(filePath).replace(ext, 'json');

    var config = {
      preserveLineBreaks: true,
      preserveOnlyMultipleLineBreaks: false
    }

    if (ext === '.pdf') {
      let res = textract.fromFileWithMimeAndPath("application/pdf", filePath, config, async function (error, text) {

        let data = {};
        jsonCliente = {}
        jsonCliente.company = {}
        jsonCliente.client = {}
        jsonCliente.client.banco = {}

        // if (block.Text.toUpperCase().startsWith("PRIMER QUINCENA") || block.Text.toUpperCase().startsWith("SEGUNDA QUINCENA")) {
        //   jsonCliente.quincena = block.Text
        // }


        let textPrimerQuincena = text.substring(text.indexOf("PRIMER QUINCENA"));
        let textSegundaQuincena = text.substring(text.indexOf("SEGUNDA QUINCENA"));



        textPrimerQuincena = textPrimerQuincena.substring(0, textPrimerQuincena.indexOf("\r\n"));
        textSegundaQuincena = textSegundaQuincena.substring(0, textSegundaQuincena.indexOf("\r\n"));

        if (textPrimerQuincena.indexOf("QUINCENA") > -1) {
          jsonCliente.primerQuincena = textPrimerQuincena
        }
        if (textSegundaQuincena.indexOf("QUINCENA") > -1) {
          jsonCliente.segundaQuincena = textSegundaQuincena
        }








        let textFileType = text.substring(0, text.indexOf("Información actual del empleado"));
        jsonCliente.type = textFileType.substring(0, text.indexOf("beneficios") + 10).replace('\r\n', ' ');

        let textDateTime = text.substring(text.indexOf("Fecha y hora") + 15, text.indexOf(".m.") + 2);
        jsonCliente.fecha = textDateTime

        let textCedula = text.substring(text.indexOf("Cedula") + 8);
        jsonCliente.client.documentNumber = textCedula.substring(0, textCedula.indexOf("\r")).trim();

        let textName = text.substring(text.indexOf("Empleado") + 10, text.indexOf("Salario"));
        jsonCliente.client.name = textName.trim()


        let textSalary = text.substring(text.indexOf("Salario") + 9);
        jsonCliente.client.basico = textSalary.substring(0, textSalary.indexOf("\r")).trim();

        let textPosition = text.substring(text.indexOf("Cargo") + 6, text.indexOf("Número cuenta")).trim();
        jsonCliente.client.cargo = textPosition

        let textAccountNumber = text.substring(text.indexOf("Número cuenta") + 15);
        jsonCliente.client.banco.account = textAccountNumber.substring(0, textAccountNumber.indexOf("\r")).trim();

        let textCostCenter = text.substring(text.indexOf("C.Costos") + 10, text.indexOf("Sucursal")).trim();
        jsonCliente.company.ccostos = textCostCenter

        let textBranchOffice = text.substring(text.indexOf("Sucursal") + 9);
        jsonCliente.company.sucursal = textBranchOffice.substring(0, textBranchOffice.indexOf("\r")).trim()

        let textBank = text.substring(text.indexOf("Ent.Financiera") + 15);
        jsonCliente.client.banco.name = textBank.substring(0, textBank.indexOf("\r")).trim();

        let textAccountType = text.substring(text.indexOf("Tipo cuenta:") + 12);
        jsonCliente.client.banco.tipoCuenta = textAccountType.substring(0, textAccountType.indexOf("\r")).trim();

        let textPay = text.substring(text.indexOf("Tipo cuenta:"));
        data.pay = textPay.split("\r\n")[2];

        concepto = {};
        let arrayconceptos = []
        let indexConcepts = text.substring(text.indexOf("Concepto"), text.indexOf("autorizados)\r\n"));
        let textConcepts = text.substring(text.indexOf(indexConcepts) + 64);

        let arrayConcepts = textConcepts.substring(0, textConcepts.indexOf("_____")).split("\r\n")
        // let arrayConcepts = textConcepts.split("\r\n")

        let result = arrayConcepts.filter(concept => concept.startsWith("3223 AVANZO TINELLO"))[0];

        if (result) {
          concepto = {}
          concepto.descripcion = "3223 AVANZO TINELLO"


          let textUnidades = result.split("3223 AVANZO TINELLO")[1].trim()


          concepto.unidades = textUnidades.split(" ")[0]
          concepto.base = textUnidades.split(" ")[1]
          concepto.devengo = textUnidades.split(" ")[2]
          concepto.descuento = textUnidades.split(" ")[3]

          conceptos = []
          conceptos.push(concepto)
          jsonCliente.conceptos = conceptos
        }




        total = {};

        let textTotals = textConcepts
        let textDevengo = textTotals.substring(textTotals.indexOf("TOTALES") + 8).trim();


        total.devengo = textDevengo.split(" ")[0];
        total.descuento = textDevengo != undefined && textDevengo != '' ? textDevengo.split(" ")[1].split("\r\n")[0] : 'indefinido';
        total.netoPago = textTotals.substring(textTotals.indexOf("PAGAR")).split("\r\n")[1];

        jsonCliente.totals = total;

        /**
         * Escribimos el archivo .json con la inf
         */
        // writeFile("", "pdf_" + fileJsonName, jsonCliente);

        /**
         * Respondemos la data leida en formato json
         */
        (text) ? resolve(jsonCliente) : reject(new Error('El archivo no se pudo leer'))

      });
      return res;
    } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
      let data = {};





      (async () => {
        console.log("entra a la funcion anonima");
        let jsonToRead = await documentExtract(filePath, isRequest);

        let json = {};

        let arrayTextLine = [];

        jsonCliente = {}
        jsonCliente.company = {}
        jsonCliente.client = {}
        jsonCliente.client.banco = {}

        /**
         * sacamos todas las lineas leidas
         */
        for (const block of jsonToRead.Blocks) {
          if (block.BlockType == 'LINE') {
            let strTop = block.Geometry.BoundingBox.Top.toString().substring(0, 6);
            let pos = -1;

            for (let index = 0; index < arrayTextLine.length; index++) {
              const element = arrayTextLine[index];
              if (Math.abs(element.top - parseFloat(strTop)) < 0.005) {
                pos = index;
                break;
              }
            }

            if (pos !== -1) {
              arrayTextLine[pos].arrayText.push({ top: strTop, text: block.Text, left: block.Geometry.BoundingBox.Left.toFixed(2), confidence: block.Confidence });
            } else {
              let newElem = {}
              newElem.top = parseFloat(strTop)
              newElem.arrayText = [{ top: ":::" + strTop, text: block.Text, left: block.Geometry.BoundingBox.Left.toFixed(2), confidence: block.Confidence }]
              arrayTextLine.push(newElem);
            }
            if (block.Text.toUpperCase().startsWith("PRIMER QUINCENA") || block.Text.toUpperCase().startsWith("SEGUNDA QUINCENA")) {
              jsonCliente.quincena = block.Text
            }
          }
        }

        json.texts = arrayTextLine
        //  writeFile("", "img_info_" + fileJsonName, json);



        let posInfActual = arrayTextLine.map(function (e) { return e.arrayText[0].text; }).indexOf("Información actual del empleado");

        let posDescuentoAvanzo = arrayTextLine.map(function (e) { return e.arrayText[0].text; }).indexOf("3223 AVANZO TINELLO");

        //leemos la linea de fecha de cracion y cedula
        //se agrega esta condicion porque segun el estado del documento en algunas ocaciones no toma los dos puntos(:)
        if (arrayTextLine[posInfActual + 1].arrayText[0].text.split(":").length > 1) {
          jsonCliente.client.nomina = arrayTextLine[posInfActual + 1].arrayText[0].text.split(":")[1].trim()
        } else {
          jsonCliente.client.nomina = arrayTextLine[posInfActual + 1].arrayText[0].text.split("Fecha y hora")[1].trim()
        }
        try {
          jsonCliente.client.nomina = jsonCliente.client.nomina.split(",")[0] + " " + jsonCliente.client.nomina.split(",")[1].trim()
          let paymenyDay = jsonCliente.client.nomina.split(" ")[1];
          let paymenyMonth = jsonCliente.client.nomina.split(" ")[0];
          let paymenyYear = jsonCliente.client.nomina.split(" ")[2];
          jsonCliente.client.nomina = await convertFormatMMDDYYY(paymenyYear, paymenyMonth, paymenyDay);
        } catch (error) {
          console.log("Error convirtiendo la fecha de pago de emtelco");
        }

        if (arrayTextLine[posInfActual + 1].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.documentNumber = arrayTextLine[posInfActual + 1].arrayText[1].text.split(":")[1].trim()
        else
          jsonCliente.client.documentNumber = arrayTextLine[posInfActual + 1].arrayText[1].text.split("Cedula")[1].trim()
        //-------------------------------------

        //leemos la linea de nombre y salario
        if (arrayTextLine[posInfActual + 2].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.name = arrayTextLine[posInfActual + 2].arrayText[0].text.split(":")[1].trim()
        else
          jsonCliente.client.name = arrayTextLine[posInfActual + 2].arrayText[0].text.split("Empleado")[1].trim()

        if (arrayTextLine[posInfActual + 1].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.basico = arrayTextLine[posInfActual + 2].arrayText[1].text.split(":")[1].trim()
        else
          jsonCliente.client.basico = arrayTextLine[posInfActual + 2].arrayText[1].text.split("Salario")[1].trim()
        //-------------------------------------
        //leemos la linea de cargo y  numero de cuenta
        if (arrayTextLine[posInfActual + 3].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.cargo = arrayTextLine[posInfActual + 3].arrayText[0].text.split(":")[1].trim()
        else
          jsonCliente.client.cargo = arrayTextLine[posInfActual + 3].arrayText[0].text.split("Cargo")[1].trim()

        if (arrayTextLine[posInfActual + 1].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.banco.account = arrayTextLine[posInfActual + 3].arrayText[1].text.split(":")[1].trim()
        else
          jsonCliente.client.banco.account = arrayTextLine[posInfActual + 3].arrayText[1].text.split("Numero cuenta")[1].trim()
        //-------------------------------------

        //leemos la linea de centro de costos  y  sucursal
        if (arrayTextLine[posInfActual + 4].arrayText[0].text.split(":").length > 1)
          jsonCliente.company.ccostos = arrayTextLine[posInfActual + 4].arrayText[0].text.split(":")[1].trim()
        else
          jsonCliente.company.ccostos = arrayTextLine[posInfActual + 4].arrayText[0].text.split("C.Costos")[1].trim()

        if (arrayTextLine[posInfActual + 1].arrayText[0].text.split(":").length > 1)
          jsonCliente.company.sucursal = arrayTextLine[posInfActual + 4].arrayText[1].text.split(":")[1].trim()
        else
          jsonCliente.company.sucursal = arrayTextLine[posInfActual + 4].arrayText[1].text.split("Sucursal")[1].trim()
        //-------------------------------------

        //leemos la linea de entidad financiera
        if (arrayTextLine[posInfActual + 5].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.banco.name = arrayTextLine[posInfActual + 5].arrayText[0].text.split(":")[1].trim()
        else
          jsonCliente.client.banco.name = arrayTextLine[posInfActual + 5].arrayText[0].text.split("Ent.Financiera")[1].trim()
        //-------------------------------------

        //leemos la linea de tipo de cuenta
        if (arrayTextLine[posInfActual + 6].arrayText[0].text.split(":").length > 1)
          jsonCliente.client.banco.tipoCuenta = arrayTextLine[posInfActual + 6].arrayText[0].text.split(":")[1].trim()
        else
          jsonCliente.client.banco.tipoCuenta = v.split("Tipo cuenta")[1].trim()
        //-------------------------------------


        if (parseInt(posDescuentoAvanzo, 10) >= 0) {
          concepto = {}

          concepto.descripcion = arrayTextLine[posDescuentoAvanzo].arrayText[0].text
          concepto.unidades = arrayTextLine[posDescuentoAvanzo].arrayText[1].text
          concepto.base = arrayTextLine[posDescuentoAvanzo].arrayText[2].text
          concepto.devengo = arrayTextLine[posDescuentoAvanzo].arrayText[3].text
          concepto.descuento = arrayTextLine[posDescuentoAvanzo].arrayText[4].text

          conceptos = []
          conceptos.push(concepto)
          jsonCliente.conceptos = conceptos
        }








        total = {};



        let posTotales = arrayTextLine.map(function (e) { return e.arrayText[0].text.replace(":", ""); }).indexOf("TOTALES");
        let posNeto = arrayTextLine.map(function (e) { return e.arrayText[0].text.replace(":", ""); }).indexOf("NETO A");

        if (posTotales > -1) {
          total.devengo = arrayTextLine[posTotales].arrayText[1].text
          total.descuento = arrayTextLine[posTotales].arrayText[2].text
        }

        if (posNeto > -1) {
          total.netoPago = arrayTextLine[posNeto].arrayText[1].text
        }

        jsonCliente.totals = total;


















        // writeFile("", "img_" + fileJsonName, jsonCliente);


        (jsonToRead) ? resolve(jsonCliente) : reject(new Error('El archivo no se pudo leer---'))

      })();





      // return jsonToRead;



    }


  } catch (error) {
    console.log("ERROR");
    console.log(error);
    return false;
  }

});




module.exports = { readWorkingSupport, readPaymentgSupport };