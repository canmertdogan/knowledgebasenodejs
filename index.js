
var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var path = require('path');

http.createServer(function (req, res) {


    if (req.url === "/") {

        fs.readFile("index.html", 'utf-8', function (err, html) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
        });

    } else if (req.url.match("\.css$")) {
        var cssPath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");

        res.writeHead(200, { "Content-Type": "text/css" });
        fileStream.pipe(res);

    }
    else if (req.url.match("\.png$")) {
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(imagePath);

        res.writeHead(200, { "Content-Type": "image/png" });
        fileStream.pipe(res);
    }
    else if (req.url.match("\.js$")) {
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(imagePath);

        res.writeHead(200, { "Content-Type": "text/javascript" });
        fileStream.pipe(res);
    }
    else if (req.url.match("\.json$")) {
        var imagePath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imagePath);

        res.writeHead(200, { "Content-Type": "text/json" });
        fileStream.pipe(res);
    }
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("Sayfa Bulunamadı");
    }

}).listen(1337);

console.log("WebApp şu adreste aktif : http://127.0.0.1:1337")

//kanka json verisini çektik
var filePath = ".\\public\\json\\citydata-turkey.json";
fs.readFile(filePath, function (error, content) {

    var data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

});


//Ülkeler cart curt vs hepsi main.js'de. public > js > main.js



