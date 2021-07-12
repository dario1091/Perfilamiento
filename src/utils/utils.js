const fs = require('fs');
const AWS = require('aws-sdk');
var path = require('path');
// const pdf = require('pdf-poppler');
const dotenv = require("dotenv");
dotenv.config();
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const arrayMonthsCC = [{ monthShort: "ENE" },
{ monthShort: "FEB" },
{ monthShort: "MAR" },
{ monthShort: "ABR" },
{ monthShort: "MAY" },
{ monthShort: "JUN" },
{ monthShort: "JUL" },
{ monthShort: "AGO" },
{ monthShort: "SEP" },
{ monthShort: "OCT" },
{ monthShort: "NOV" },
{ monthShort: "DIC" }]

const arrayMonthsEmtelco = [{ monthShort: "ENERO", monthNumeric: 1 },
{ monthShort: "FEBRERO", monthNumeric: 2 },
{ monthShort: "MARZO", monthNumeric: 3 },
{ monthShort: "ABRIL", monthNumeric: 4 },
{ monthShort: "MAYO", monthNumeric: 5 },
{ monthShort: "JUNIO", monthNumeric: 6 },
{ monthShort: "JULIO", monthNumeric: 7 },
{ monthShort: "AGOSTO", monthNumeric: 8 },
{ monthShort: "SEPTIEMBRE", monthNumeric: 9 },
{ monthShort: "OCTUBRE", monthNumeric: 10 },
{ monthShort: "NOVIEMBRE", monthNumeric: 11 },
{ monthShort: "DICIEMBRE", monthNumeric: 12 }]


async function writeFile(jsonpath, fileName, inf = {}) {
  console.log("entramos a generar archivo")

  fs.writeFileSync(`C:/projects/Avanzo/files/OCR/SalesLand/50  Emtelco/PDFs/${fileName}`, JSON.stringify(inf), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The full file was saved!");
  });


  let writeRes = fs.readFileSync(`C:/projects/Avanzo/files/OCR/SalesLand/50  Emtelco/PDFs/${fileName}`, { encoding: "utf8" });

  if (writeRes)
    return true

  return false

  // return generated
}


async function documentExtract(imagePath) {

  //convertimos la imagen en blob para enviar a amazon
  // var bitmap = fs.readFileSync(imagePath);
  // var bufferImage = new Buffer.from(bitmap);

  array = imagePath.split(path.sep)
  console.log(array[array.length - 3] + "/" + array[array.length - 2] + "/" + array[array.length - 1])
  let fileName = array[array.length - 3] + "/" + array[array.length - 2] + "/" + array[array.length - 1]
  console.log("llega a metodo para leer imagen de amazon");
  console.log("Archivo a leer: " + imagePath);

  return new Promise(resolve => {
    var textract = new AWS.Textract({
      region: "us-east-2",
      endpoint: `https://textract.us-east-2.amazonaws.com/`,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    })
    // var params = {
    //   Document: {
    //     Bytes: bufferImage,
    //   },
    // }

    var params = {
      Document: {
        // Bytes: bufferImage,
        S3Object: {
          Bucket: "archivosavanzo",
          Name: fileName
        }
      },
    }

    textract.detectDocumentText(params, (err, data) => {
      if (err) {
        console.log("Error amazon : " + err);
        return resolve(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function convertImage(pdfPath, documentNumber) {

  try {


    let filePath = path.dirname(pdfPath) + "/" + path.basename(pdfPath).replace(path.extname(pdfPath) + `-${documentNumber}`);

    const { stdout, stderr } = await exec(`pdftoppm -png ${pdfPath} ${filePath} `);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);






  } catch (error) {
    console.log(":::::::::::::::::::::::::::::::::::::::::11");

    console.log(error);
    console.log(":::::::::::::::::::::::::::::::::::::::::");
  }




}

const readDocument = (file, isFront = false) => new Promise((resolve, reject) => {
  try {

    console.log("Llego a leer documento");
    console.log("filePath: " + file);
    let ext = path.extname(file);
    console.log("fileExtension:" + ext);

    var config = {
      preserveLineBreaks: true,
      preserveOnlyMultipleLineBreaks: false
    }


    let data = {};



    if (isFront) {
      console.log("Es frente del documento");
      if (ext === '.pdf') {
        try {
          console.log(file);

          textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {
            (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
            return data;
          });

          textract.fromUrl(`https://archivosavanzo.s3.us-east-2.amazonaws.com/${file}`, config, function (error, text) {

          })



        } catch (error) {
          console.log("###################################");
          console.log(error);
        }

      } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
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
            // writeFile("", path.basename(file).replace(path.extname(file), '.json'), text_orden);
            (text_orden) ? resolve(text_orden) : reject(new Error('El archivo no se pudo leer'))

          })();

        } catch (error) {
          console.log("el error es:");
        }


      }
    } else {
      if (ext === '.pdf') {

        try {
          console.log(file);
          textract.fromFileWithMimeAndPath("application/pdf", file, config, function (error, text) {
            (error) ? reject(new Error('El archivo no se pudo leer')) : resolve(data)
            return data;
          });
        } catch (error) {
          console.log(error);
        }

      } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {

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

            // writeFile("", path.basename(file).replace(path.extname(file), '.json'), text);

            (text) ? resolve(text) : reject(new Error('El archivo no se pudo leer'))


          })();


        } catch (error) {
          console.log("el error es:");
        }


      }
    }

    return data;
  } catch (error) {
    return false;
  }

});


// async function convertFormatDDMMMYYY(year, month, day) {
//   console.log("llega a convertir fecha a formato cedula");
//   var opciones = { year: 'numeric', month: 'short', day: 'numeric' };
//   var fecha = new Date(year, (month - 1), day)
//     .toLocaleDateString('es-CO', opciones)
//     .replace(/ /g, '-')
//     .replace('.', '')
//     .replace(/-([a-z])/, function (x) { return '-' + x[1].toUpperCase() });

//   console.log("Fecha formateada: " + fecha);
//   return fecha.toUpperCase();
// }
async function convertFormatDDMMMYYY(year, month, day) {
  let fecha = day + "-" + arrayMonthsCC[month - 1].monthShort + "-" + year
  return fecha.toUpperCase();
}

async function convertFormatMMDDYYY(year, month, day) {
  let result = arrayMonthsEmtelco.find(item => item.monthShort == month.toUpperCase());

  let fecha = day + "/" + `${result.monthNumeric}` + "/" + year
  return fecha.toUpperCase();
}



//redondea valores al alza ejemplo 
// 318034 > 320000
async function redondeaAlAlza(x, r) {
  xx = Math.floor(x / r)
  if (xx != x / r) { xx++ }
  return (xx * r)
}


module.exports = { writeFile, documentExtract, convertImage, readDocument, convertFormatDDMMMYYY, convertFormatMMDDYYY,redondeaAlAlza };