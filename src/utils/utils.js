const fs = require('fs');
const AWS = require('aws-sdk');
var path = require('path');
// const pdf = require('pdf-poppler');
var PDFImage = require("pdf-image").PDFImage;
var pdf2img = require('pdf2img');
const dotenv = require("dotenv");
dotenv.config();

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
  var bitmap = fs.readFileSync(imagePath);
  var bufferImage = new Buffer.from(bitmap);
  console.log("llega a metodo para leer imagen de amazon");
  console.log("Archivo a leer: " + imagePath);
  return new Promise(resolve => {
    var textract = new AWS.Textract({
      region: "us-east-2",
      endpoint: `https://textract.us-east-2.amazonaws.com/`,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    })
    var params = {
      Document: {
        Bytes: bufferImage,
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

async function convertImage(pdfPath, pass = '') {

  try {
    // pdf2img.setOptions({
    //   type: 'png',                                // png or jpg, default jpg
    //   size: 1024,                                 // default 1024
    //   density: 600,                               // default 600
    //   outputdir: path.dirname(pdfPath) + path.sep,  // output folder, default null (if null given, then it will create folder name same as file name)
    //   outputname: 'test',                         // output file name, dafault null (if null given, then it will create image name same as input name)
    //   page: null,                                 // convert selected page, default null (if null given, then it will convert all pages)
    //   quality: 100                                // jpg compression quality, default: 100
    // });
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // pdf2img.convert(pdfPath, function (err, info) {
    //   console.log("22--------------------------------------------");

    //   if (err) console.log(err)
    //   else console.log(info);
    // });
    console.log(pdfPath);

    var pdfImage = new PDFImage("../../workingSupport.pdf");
    console.log("--------------------------------------------");
    console.log("--------------------------------------------");
    pdfImage.convertFile().then(function (imagePaths) {
      // [ /tmp/slide-0.png, /tmp/slide-1.png ]
      console.log("---::::::::::::::::::::::::::::");
      console.log(imagePaths);
    });


    var pdfImage2 = new PDFImage("../../workingSupport.pdf");

    pdfImage2.convertFile().then(function (imagePaths) {
      // [ /tmp/slide-0.png, /tmp/slide-1.png ]
      console.log(">>3");
    });



    var pdfImage3 = new PDFImage("../../workingSupport.pdf", {
      combinedImage: true
    });

    pdfImage3.convertFile().then(function (imagePaths) {
      // /tmp/slide.png 
      console.log(">>2");
    });











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


async function convertFormatDDMMMYYY(year, month, day) {
  console.log("llega a convertir fecha a formato cedula");
  var opciones = { year: 'numeric', month: 'short', day: 'numeric' };
  var fecha = new Date(year, (month - 1), day)
    .toLocaleDateString('es-CO', opciones)
    .replace(/ /g, '-')
    .replace('.', '')
    .replace(/-([a-z])/, function (x) { return '-' + x[1].toUpperCase() });

  console.log("Fecha formateada: " + fecha);
  return fecha.toUpperCase();
}


module.exports = { writeFile, documentExtract, convertImage, readDocument, convertFormatDDMMMYYY };