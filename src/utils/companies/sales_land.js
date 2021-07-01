var path = require('path');
var textract = require('textract');

const { convertImage, documentExtract, writeFile } = require('../utils.js');



const readWorkingSupportSalesLand = (file) => new Promise((resolve, reject) => {
  try {

    let ext = path.extname(file);

    var config = {
      preserveLineBreaks: true,
      preserveOnlyMultipleLineBreaks: false
    }


    let data = {};





    if (ext === '.pdf') {

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("Leemos archivo certificado laboral SALES LAND formato pdf");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("\n\n");

      console.log("...");
      console.log("...");
      console.log("...");


      try {
        console.log(file);
        textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {


          data.name = text.substring(text.indexOf("(a)") + 4, text.indexOf(","));
          let txtCed = text.substring(text.indexOf("No.") + 4, text.indexOf(",", (text.indexOf("No."))));
          data.cedula = txtCed.split(" ")[0]


          let txtContrato = text.substring(text.indexOf("término"));
          data.tipoContrato = txtContrato.substring(7, txtContrato.indexOf(",")).trim();

          let txtFecha = text.substring(text.indexOf("desde el"));
          data.fechaIngreso = txtFecha.substring(8, txtFecha.indexOf("hasta")).trim();

          let txtCargo = text.substring(text.indexOf("cargo de"));
          data.cargo = txtCargo.substring("cargo de".length, txtCargo.indexOf("\n")).trim();

          let txtSalario = text.substring(text.indexOf("Salario Básico mensual"));
          data.salarioMoney = txtSalario.substring("Salario Básico mensual".length, txtSalario.indexOf("\n")).trim();

          let txtComision = text.substring(text.indexOf("Promedio Mens. Comisiones"));
          data.comisiones = txtComision.substring("Promedio Mens. Comisiones".length, txtComision.indexOf("\n")).trim();

          let txtExpedida = text.substring(text.indexOf("expide a solicitud del interesado"));
          data.expedida = txtExpedida.substring(txtExpedida.indexOf(",") + 10, txtExpedida.indexOf("\n")).trim();

          console.log("\n\n");
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log("TERMINA LECTURA  certificado laboral EMTALCO formato pdf");
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
          return data;
        });
      } catch (error) {
        console.log("###################################");
        console.log(error);
      }

    } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log("Leemos archivo certificado laboral SALES LAND formato imagen");
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


          data.name = text.substring(text.indexOf("(a)") + 4, text.indexOf(","));
          let txtCed = text.substring(text.indexOf("No.") + 4, text.indexOf(",", (text.indexOf("No."))));
          data.cedula = txtCed.split(" ")[0]


          let txtContrato = text.substring(text.indexOf("término"));
          data.tipoContrato = txtContrato.substring(7, txtContrato.indexOf(",")).trim();

          let txtFecha = text.substring(text.indexOf("desde el"));
          data.fechaIngreso = txtFecha.substring(8, txtFecha.indexOf("hasta")).trim();

          let txtCargo = text.substring(text.indexOf("cargo de"));
          data.cargo = txtCargo.substring("cargo de".length, txtCargo.indexOf("Salario Básico mensual")).trim();

          let txtSalario = text.substring(text.indexOf("Salario Básico mensual"));
          data.salarioMoney = txtSalario.substring("Salario Básico mensual".length, txtSalario.indexOf("Promedio Mens")).trim();

          let txtComision = text.substring(text.indexOf("Promedio Mens. Comisiones"));
          data.comisiones = txtComision.substring("Promedio Mens. Comisiones".length, txtComision.indexOf("Total Promedio Mensual")).trim();



          let txtTotal = text.substring(text.indexOf("Total Promedio Mensual"));
          data.total = txtTotal.substring("Total Promedio Mensual".length, txtTotal.indexOf("Para mayor información")).trim();


          let txtExpedida = text.substring(text.indexOf("expide a solicitud del interesado"));
          data.expedida = txtExpedida.substring(txtExpedida.indexOf("dado el") + 7, txtExpedida.indexOf("en la ciudad")).trim();

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

const readPaymentgSupportSalesLand = (filePath) => new Promise((resolve, reject) => {

  try {

    let extArray = filePath.split('.');
    let ext = extArray[extArray.length - 1];

    if (ext === 'pdf') {
      console.log("Entremos a convertir pdf en imagen");
      console.log(filePath);
      convertImage(filePath);
      filePath = path.dirname(filePath) + "/" + path.basename(filePath).replace(path.extname(filePath), '.jpeg');
    }

    let arrayTextLine = [];
    let json = {}
    let confidence = 0.0;

    let jsonToRead = {};
    jsonCliente = {};
    jsonCliente.company = {};
    jsonCliente.client = {};
    jsonCliente.client.banco = {};
    (async () => {

      jsonToRead = await documentExtract(filePath)


      /**
     * Se recorren los bloques que aparecen comoo lineas
     * se agrega al objeto la posicion top y left que tiene la linea
     */
      for (const block of jsonToRead.Blocks) {
        if (block.BlockType == 'LINE') {
          let strTop = block.Geometry.BoundingBox.Top.toString().substring(0, 6);
          let pos = -1;// arrayTextLine.map(function (e) { return (e.top - parseFloat(strTop) < 0.001 ? e.top : -1); })//.indexOf(parseFloat(strTop))


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
          if (block.Text.toUpperCase().startsWith("SALESLAND")) {
            jsonCliente.company.name = block.Text
            confidence += block.Confidence
          }
          if (block.Text.toUpperCase().startsWith("900.491.296")) {
            jsonCliente.company.nit = block.Text
            confidence += block.Confidence
          }
        }
      }



      /**
       * Obtenemos la posicion donde inicia la matriz de devengos y deducciones
       */
      let pos = arrayTextLine.map(function (e) { return e.arrayText[0].text; }).indexOf("DEVENGOS");
      /**
     * Obtenemos la posicion donde termina la matriz de devengos y deducciones
     */
      let pos2 = arrayTextLine.map(function (e) { return e.arrayText[0].text; }).indexOf("SUBTOTAL");

      let leftDevengos = 0.0
      let leftDeducciones = 0.0
      let salir = false;

      /**
       * se recorren las lineas y cuando encontremos una completa se procede a obtener la posicion left 
       * con el fin de saber que linea esta bajo la columna devengos y que linea bajo deducciones
      */
      for (let i = pos; i < pos2; i++) {
        for (let j = 0; j < 8; j++) {
          if (i > pos && arrayTextLine[i].arrayText.length >= 6) {
            leftDevengos = arrayTextLine[i].arrayText[0].left
            leftDeducciones = arrayTextLine[i].arrayText[4].left
            salir = true;
            break;
          }
        }
        if (salir) break;
      }

      /**
       * Se recorre el array para llenar campos de devengos o deducciones vacios, 
       * en una linea completa de devengos o deducciones
       * 
       * ejemplo de como podria llegar
       * -------------------------------------------------------------
       * Devengos   cantidad    valor  deducciones  cantidad   valor
       *    xxx        123       123 
       * -------------------------------------------------------------
       * ejemplo de como sale del array
       *   Devengos   cantidad    valor  deducciones  cantidad   valor
       *    xxx         123        123       ---        ---       ---
       * -------------------------------------------------------------
       * */
      for (let i = pos; i < pos2; i++) {
        for (let j = 0; j < 8; j++) {

          if (i > pos && arrayTextLine[i].arrayText.length <= 4) {

            if (arrayTextLine[i].arrayText[0].left == leftDevengos
              || parseFloat(arrayTextLine[i].arrayText[0].left) + 0.01 == leftDevengos
              || parseFloat(arrayTextLine[i].arrayText[0].left) - 0.01 == leftDevengos) {

              arrayTextLine[i].arrayText.splice(4, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(5, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(6, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(7, 0, { text: "---" })

            }

            if (arrayTextLine[i].arrayText[0].left == leftDeducciones
              || parseFloat(arrayTextLine[i].arrayText[0].left) + 0.01 == leftDeducciones
              || parseFloat(arrayTextLine[i].arrayText[0].left) - 0.01 == leftDeducciones) {

              arrayTextLine[i].arrayText.splice(0, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(1, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(2, 0, { text: "---" })
              arrayTextLine[i].arrayText.splice(3, 0, { text: "---" })

            }
            break;
          }
        }
      }

      /**
           * Se recorre el array para llenar campos de devengos o deducciones vacios,
           *  en una linea dentro de la matriz de devengos o deducciones 
           * 
           * ejemplo de como podria llegar, la cantidad no deberia ser mayor a 1000
           * -------------------------------------------------------------
           * Devengos   cantidad    valor  deducciones  cantidad   valor
           *   xxx        10000                xxxx       20000
           * -------------------------------------------------------------
           * ejemplo de como sale del array
           *   Devengos   cantidad    valor    deducciones  cantidad   valor
           *    xxx         ---       10000       xxxx        ---     20000
           * -------------------------------------------------------------
           * */
      for (let i = pos; i < pos2; i++) {
        for (let j = 0; j < 8; j++) {
          if (i > pos && arrayTextLine[i].arrayText.length >= 5) {
            if (parseInt(arrayTextLine[i].arrayText[2].text.replace(",", ""), 10) > 1000) {
              arrayTextLine[i].arrayText.splice(2, 0, { text: "---" })
            }
            if (parseInt(arrayTextLine[i].arrayText[6] == undefined ? 1001 : arrayTextLine[i].arrayText[6].text.replace(",", ""), 10) > 1000) {
              arrayTextLine[i].arrayText.splice(6, 0, { text: "---" })
            }
            break;
          }
          if (i > pos && arrayTextLine[i].arrayText.length <= 3 && arrayTextLine[i].arrayText.length > 1) {
            if (parseInt(arrayTextLine[i].arrayText[2] == undefined ? 1001 : arrayTextLine[i].arrayText[2].text.replace(",", ""), 10) > 1000) {
              arrayTextLine[i].arrayText.splice(2, 0, { text: "---" })
            }
            break;
          }
        }
      }

      /**
       * se recorre el array buscando lineas que hayan hecho salto de linea y son basura para el proceso 
       * se borra ese array de texto porqeu solo es un array de texto de maximo 2 elementos
       */
      for (let i = pos; i < pos2; i++) {
        if (i > pos && arrayTextLine[i] != undefined && arrayTextLine[i].arrayText.length <= 2) {
          arrayTextLine.splice(i, 1)
        }
      }


      /** 
       * Se recorre el array para unificar el texto de codigo de devengo o deduccion con la descripcion
       * */
      for (let i = pos; i < pos2; i++) {
        for (let j = 0; j < 8; j++) {
          if (i > pos && arrayTextLine[i] != undefined && arrayTextLine[i].arrayText.length >= 6) {
            arrayTextLine[i].arrayText[0].text = arrayTextLine[i].arrayText[0].text + " " + arrayTextLine[i].arrayText[1].text
            arrayTextLine[i].arrayText[4].text = arrayTextLine[i].arrayText[4].text + " " + arrayTextLine[i].arrayText[5].text
            //se elimina primero la ultima posicion para que no se vea afectado el splice de la primera posicion
            arrayTextLine[i].arrayText.splice(5, 1)
            arrayTextLine[i].arrayText.splice(1, 1)
            break;
          }
          //este array no se usa porqeu arriba se estan rellenando los espacios que faltan entonces no deberia venir menos de 3 elementos
          // if (i > pos && arrayTextLine[i].arrayText.length <= 3) {
          //   arrayTextLine[i].arrayText[0].text = arrayTextLine[i].arrayText[0].text + " " + arrayTextLine[i].arrayText[1].text
          //   arrayTextLine[i].arrayText.splice(1, 1)
          //   break;
          // }
        }
      }

      /**
       * Se genera archivo con las primeras modificaciones de la lectura
       */
      // json.texts = arrayTextLine
      // writeFile(path, "_getInfo.json", JSON.stringify(json));


      let posName = arrayTextLine.map(function (e) { return e.arrayText[0].text; }).indexOf("COMPROBANTE DE PAGO");


      confidence += arrayTextLine[posName + 1].arrayText[0] != undefined ? arrayTextLine[posName + 1].arrayText[0].confidence : 0
      jsonCliente.client.name = arrayTextLine[posName + 1].arrayText[0].text

      confidence += arrayTextLine[posName + 1].arrayText[arrayTextLine[posName + 1].arrayText.length - 1] != undefined ? arrayTextLine[posName + 1].arrayText[arrayTextLine[posName + 1].arrayText.length - 1].confidence : 0

      jsonCliente.client.documentNumber = arrayTextLine[posName + 1].arrayText[arrayTextLine[posName + 1].arrayText.length - 1].text




      /**
       * REVISAMOS SI EL TEXTO RECONOCIO LOS DOS PUNTOS (:)
       * SI NO PUEDE HACER SPLIT DE : ES PORQUE NO LO RECONOCIO SE HACE SPLIT DE LA PALABRA QUE BUSCAMOS
       */
      if (arrayTextLine[posName + 2].arrayText[0].text.split(":").length > 1)
        jsonCliente.client.convenio = arrayTextLine[posName + 2].arrayText[0].text.split(":")[1].trim()
      else
        jsonCliente.client.convenio = arrayTextLine[posName + 2].arrayText[0].text.split("Convenio")[1].trim()

      confidence += arrayTextLine[posName + 2].arrayText[0].confidence


      if (arrayTextLine[posName + 3].arrayText[0].text.split(":").length > 1)
        jsonCliente.client.nomina = arrayTextLine[posName + 3].arrayText[0].text.split(":")[1].trim()
      else
        jsonCliente.client.nomina = arrayTextLine[posName + 3].arrayText[0].text.split("NOMINA A")[1].trim()

      confidence += arrayTextLine[posName + 3].arrayText[0].confidence



      if (arrayTextLine[posName + 3].arrayText[1].text.split(":").length > 1)
        jsonCliente.client.pension = arrayTextLine[posName + 3].arrayText[1].text.split(":")[1].trim()
      else
        jsonCliente.client.pension = arrayTextLine[posName + 3].arrayText[1].text.split("PENSION")[1].trim()

      confidence += arrayTextLine[posName + 3].arrayText[1].confidence

      if (arrayTextLine[posName + 3].arrayText[2].text.split(":").length > 1)
        jsonCliente.client.salud = arrayTextLine[posName + 3].arrayText[2].text.split(":")[1].trim();
      else
        jsonCliente.client.salud = arrayTextLine[posName + 3].arrayText[2].text.split(/SALUD(.+)/)[1].trim()

      confidence += arrayTextLine[posName + 3].arrayText[2].confidence

      let plusPosition = 4


      while (arrayTextLine[posName + plusPosition].arrayText.length < 4) {
        plusPosition += 1;
      }


      if (arrayTextLine[posName + plusPosition].arrayText[2].text.split(":").length > 1)
        jsonCliente.client.basico = arrayTextLine[posName + plusPosition].arrayText[2].text.split(":")[1].trim()
      else
        jsonCliente.client.basico = arrayTextLine[posName + plusPosition].arrayText[2].text.split("BASICO")[1].trim()

      confidence += arrayTextLine[posName + plusPosition].arrayText[2].confidence


      if (arrayTextLine[posName + plusPosition].arrayText[3].text.split(":").length > 1)
        jsonCliente.client.cargo = arrayTextLine[posName + plusPosition].arrayText[3].text.split(":")[1].trim()
      else
        jsonCliente.client.cargo = arrayTextLine[posName + plusPosition].arrayText[3].text.split("CARGO")[1].trim()

      confidence += arrayTextLine[posName + plusPosition].arrayText[3].confidence


      if (arrayTextLine[posName + plusPosition].arrayText[0].text.split(":").length > 1)
        jsonCliente.client.banco.name = arrayTextLine[posName + plusPosition].arrayText[0].text.split(":")[1].trim()
      else
        jsonCliente.client.banco.name = arrayTextLine[posName + plusPosition].arrayText[0].text.split("BANCO")[1].trim()

      confidence += arrayTextLine[posName + plusPosition].arrayText[0].confidence


      if (arrayTextLine[posName + plusPosition].arrayText[1].text.split(":").length > 1)
        jsonCliente.client.banco.account = arrayTextLine[posName + plusPosition].arrayText[1].text.split(":")[1].trim()
      else
        jsonCliente.client.banco.account = arrayTextLine[posName + plusPosition].arrayText[1].text.split("CUENTA")[1].trim()

      confidence += arrayTextLine[posName + plusPosition].arrayText[1].confidence

      jsonCliente.client.confidence = confidence / 12;



      try {



        let confidenceDevengos = 0.0;
        let confidenceDeducciones = 0.0;

        let conDevengos = 0;
        let conDeducciones = 0;

        let deduccion = {};
        let devengo = {}
        let deducciones = [];
        let devengos = []

        let subtotalDevengos = 0;
        let subtotalDeducciones = 0

        for (let i = pos + 1; i < pos2; i++) {
          devengo = {}
          deduccion = {}

          if (arrayTextLine[i].arrayText[0] !== undefined
            && arrayTextLine[i].arrayText[1] !== undefined
            && arrayTextLine[i].arrayText[2] !== undefined) {

            devengo.description = arrayTextLine[i].arrayText[0].text;
            devengo.cantidad = arrayTextLine[i].arrayText[1].text;
            devengo.valor = arrayTextLine[i].arrayText[2].text;

            confidenceDevengos += arrayTextLine[i].arrayText[0].confidence;
            confidenceDevengos += arrayTextLine[i].arrayText[1].confidence;
            confidenceDevengos += arrayTextLine[i].arrayText[2].confidence;
            conDevengos += 3;
          }

          if (arrayTextLine[i].arrayText[3] != undefined
            && arrayTextLine[i].arrayText[4] != undefined
            && arrayTextLine[i].arrayText[5] != undefined) {

            deduccion.description = arrayTextLine[i].arrayText[3].text;
            deduccion.cantidad = arrayTextLine[i].arrayText[4].text;
            deduccion.valor = arrayTextLine[i].arrayText[5].text;

            confidenceDeducciones += arrayTextLine[i].arrayText[3].confidence;
            confidenceDeducciones += arrayTextLine[i].arrayText[4].confidence;
            confidenceDeducciones += arrayTextLine[i].arrayText[5].confidence;
            conDeducciones += 3;

          }

          if (devengo.description !== undefined && !devengo.description.startsWith("---")) {
            devengos.push(devengo);
            subtotalDevengos += parseInt(devengo.valor.replace(",", ""), 10);
          }
          if (deduccion.description !== undefined && !deduccion.description.startsWith("---")) {
            deducciones.push(deduccion);
            subtotalDeducciones += parseInt(deduccion.valor.replace(",", ""), 10);
          }

        }


        jsonCliente.client.devengos = {}
        jsonCliente.client.devengos.list = devengos
        jsonCliente.client.devengos.subtotal = subtotalDevengos

        jsonCliente.client.devengos.confidence = (confidenceDevengos / conDevengos);

        jsonCliente.client.deducciones = {}
        jsonCliente.client.deducciones.list = deducciones
        jsonCliente.client.deducciones.subtotal = subtotalDeducciones
        jsonCliente.client.deducciones.confidence = (confidenceDeducciones / conDeducciones);

        let sueldoNetoStr = '';
        if (arrayTextLine[pos2].arrayText[0].text.startsWith("SUBTOTAL"))
          sueldoNetoStr = arrayTextLine[pos2 + 1].arrayText[0].text.split(',')[0].replace(".", "").replace("$", "");
        else
          sueldoNetoStr = arrayTextLine[pos2].arrayText[0].text.split(',')[0].replace(".", "").replace("$", "");

        let sueldoNeto = parseInt(sueldoNetoStr, 10);

        jsonCliente.client.sueldoNeto = sueldoNeto

      } catch (error) {

        console.log("Se genero error en la lectura del archivo");
        console.log(error);

      }



      (jsonCliente) ? resolve(jsonCliente) : reject(new Error('El archivo no se pudo leer'))


    })();




  } catch (error) {
    console.log("ERROR");
    console.log(error);
    return false;
  }

});




const readDocumentSalesLand = (file, isFront = false) => new Promise((resolve, reject) => {
  try {

    let ext = path.extname(file);

    var config = {
      preserveLineBreaks: true,
      preserveOnlyMultipleLineBreaks: false
    }


    let data = {};



    if (isFront) {

      if (ext === '.pdf') {

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("Leemos archivo certificado laboral SALES LAND formato pdf");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("\n\n");

        console.log("...");
        console.log("...");
        console.log("...");


        try {
          console.log(file);
          textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {

            console.log(text);


            console.log("\n\n");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("TERMINA LECTURA  certificado laboral EMTALCO formato pdf");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
            return data;
          });
        } catch (error) {
          console.log("###################################");
          console.log(error);
        }

      } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("Leemos Documento FRONT SALES LAND formato imagen");
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
            let text_orden = "";
            let arrayText = [];
            for (const block of jsonToRead.Blocks) {
              if (block.BlockType == 'LINE') {
                arrayText.unshift(block.Text);
              }
            }

            for (const text of arrayText) {
              text_orden += text + " ";
            }

            // console.log(text);
            //  writeFile("", "img_cedula_front.json", text_orden);

            // writeFile("", path.basename(file).replace(path.extname(file), '.json'), data);
            console.log("\n\n");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("TERMINA LECTURA  Documento  SALES LAND formato imagen");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            (text_orden) ? resolve(text_orden) : reject(new Error('El archivo no se pudo leer'))


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
    } else {
      if (ext === '.pdf') {

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("Leemos archivo certificado laboral SALES LAND formato pdf");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("\n\n");

        console.log("...");
        console.log("...");
        console.log("...");


        try {
          console.log(file);
          textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {

            console.log(text);


            console.log("\n\n");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("TERMINA LECTURA  certificado laboral EMTALCO formato pdf");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
            return data;
          });
        } catch (error) {
          console.log("###################################");
          console.log(error);
        }

      } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("Leemos Documento BACK SALES LAND formato imagen");
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("\n\n");

        console.log("...");
        console.log("...");
        console.log("...");

        try {

          (async () => {
            let jsonToRead = await documentExtract(file);


            let arrayTextLine = [];



            /**
             * sacamos todas las lineas leidas
             */
            let text = "";
            for (const block of jsonToRead.Blocks) {
              if (block.BlockType == 'LINE') {
                arrayTextLine.push(block.Text)
              }
            }
            for (const lines of arrayTextLine) {
              text += lines + " ";
            }

            // console.log(text);
            // writeFile("", "img_cedula_back.json", text);

            // writeFile("", path.basename(file).replace(path.extname(file), '.json'), data);
            console.log("\n\n");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("TERMINA LECTURA  Documento  SALES LAND formato imagen");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            (text) ? resolve(text) : reject(new Error('El archivo no se pudo leer'))


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




module.exports = { readPaymentgSupportSalesLand, readWorkingSupportSalesLand, readDocumentSalesLand };