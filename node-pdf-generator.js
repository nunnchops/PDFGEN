var restify = require('restify')
  , port = process.env.PORT || 3000
  , tmpdir = require('os').tmpdir()
  , fs = require('fs');

var server = restify.createServer();
var url = 'http://ready-to-innovate.com/resultsOpen.php?name=AllyJ&region=France&rhEmail=chrisj@redhat.com&d1=2&o1=1&d2=1&o2=1&d3=2&o3=1&d4=2&o4=1&d5=2&o5=1&status=Completed'
var url_orig = 'http://ready-to-innovate.com/results.php?name=MYCOMPANY&d1=2&o1=0&d2=2&o2=1&d3=3&o3=2&d4=4&o4=1&d5=2&o5=1'

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
    rasterize    = spawn('phantomjs', ['/home/rnunn/WORK/RTI_PDF_GENERATOR/tools/phantomjs/phantomjs-2.1.1-linux-x86_64/bin/rasterize.js', url, '/tmp/' + filename]);

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
