var restify = require('restify')
  , port = process.env.PORT || 3000
  , tmpdir = require('os').tmpdir()
  , fs = require('fs');

var server = restify.createServer();
var url = 'some_url'
var url_orig = 'some_alternative_url'

function setResponseHeaders(res, filename) {
  res.header('Content-disposition', 'inline; filename=' + filename);
  res.header('Content-type', 'application/pdf');
}

server.get('/downloads/:filename', function(req, res, next) {
  var filename = req.params.filename;
  file = tmpdir + '/' + filename;
  console.log(file);
  dispatchPDF();
  setResponseHeaders(res, filename);

    function dispatchPDF(data) {
var spawn = require('child_process').spawn,
    rasterize    = spawn('phantomjs', ['rasterize.js', url, '/tmp/' + filename]);

rasterize.stdout.on('data', function (data) {
  fs.createReadStream('/tmp/' + filename).pipe(res);
  console.log('stdout: ' + data);
});

rasterize.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

rasterize.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

  };
});

server.listen(port, function() {
  console.log("Listening on port %s...", port);
});
