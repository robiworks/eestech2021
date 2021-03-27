const nmap = require('node-nmap');
const mime = require("mime-types");
const formidable = require("formidable");
const http = require("http");
const fs = require("fs-extra");
const util = require("util");
const path = require("path");
const find = require('local-devices');
const express = require("express");

nmap.nmapLocation = "nmap";

var dataDir = "./data/";
let predpomnilnik = {};
let h;

if (!process.env.PORT) process.env.PORT = 8080;

const streznik = express();

streznik.use(express.static("public"));

streznik.get("/", (req,odgovor) => {
    //let k = fs.readFileSync(path.resolve(__dirname, "../spletna-stran/index.html"));
    odgovor.sendFile(path.resolve(__dirname, "../spletna-stran/index.html"));
});

streznik.get("/api", (req, odgovor) => {
  doAPIThing(odgovor);
});

streznik.get("/*", (req,odgovor) => {
    console.log(req);
    odgovor.sendFile(path.resolve(__dirname, "../spletna-stran/"+req.originalUrl));
});

streznik.listen(process.env.PORT, () => {
  console.log("Strežnik je pognan!");
});

async function doAPIThing(odgovor) {
    let detected;
    detected = await find();
    var ob = [];
    for (var i = 0; i < detected.length; i++) {
        ob[i] = detected[i].ip;
    }
    let h = await detailedScan(ob, odgovor);
    return h;
    
}


async function detailedScan(host, odgovor) {
    var osandports = new nmap.NmapScan(host, '-sS -F --max-retries 1 -T5');
    var k = osandports.on('complete', function (data) {
        console.log(data);
        odgovor.send(data)
    });
    osandports.on('error', function (error) {
        console.log(error);
    });
    osandports.startScan();

    return k;
}


