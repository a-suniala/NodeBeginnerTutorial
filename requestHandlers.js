const querystring = require("querystring"),
  fs = require("fs"),
  os = require("os"),
  path = require("path"),
  formidable = require("formidable");

function start(response) {
  console.log("Request handler 'start' was called");

  var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" content="text/html; '+
  'charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/upload" enctype="multipart/form-data" method="post">'+
  '<input type="file" name="upload" multiple="multiple">'+
  '<input type="submit" value="Upload file" />'+
  '</form>'+
  '</body>'+
  '</html>';

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called");

  var filePath = path.join(os.tmpdir(), "test.png");
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    fs.rename(files.upload.path, filePath, function(error) {
      if (error) {
        fs.unlink(filePath);
        fs.rename(files.upload.path, filePath);
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });


}

function show(response) {
  console.log("Request handler 'show' was called");
  response.writeHead(200, {"Content-Type": "image/png"});

  var filePath = path.join(os.tmpdir(), "test.png");
  fs.createReadStream(filePath).pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
