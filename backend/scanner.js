const nmap = require('node-nmap');
const mime = require("mime-types");
const formidable = require("formidable");
const http = require("http");
const fs = require("fs-extra");
const util = require("util");
const path = require("path");
const find = require('local-devices');

nmap.nmapLocation = "nmap";

var dataDir = "./data/";
let predpomnilnik = {};

const port = process.env.PORT || 8080;

const streznik = http.createServer((zahteva, odgovor) => {
    let potDoDatoteke = false;
    if (zahteva.url == "/") {
        potDoDatoteke = ".././spletna-stran/index.html";
    } else if (zahteva.url == "/api") {
        doAPIThing(odgovor);
    } else {
        potDoDatoteke = "../spletna-stran" + zahteva.url;
    }
    // Statično vsebino postrežemo le takrat, ko gre za zahtevo takšne vrste
    if (potDoDatoteke) posredujStaticnoVsebino(odgovor, potDoDatoteke);
});

// Na tej točki strežnik poženemo
streznik.listen(port, () => {
    console.log("Strežnik pognana!");
});

// Obvladovanje napak
function posredujNapako(odgovor, tip) {
    odgovor.writeHead(tip, {
        "Content-Type": "text/plain"
    });
    if (tip == 404) {
        odgovor.end("Napaka 404: Vira ni mogoče najti.");
    } else if (tip == 500) {
        odgovor.end("Napaka 500: Prišlo je do napake strežnika.");
    } else {
        odgovor.end("Napaka " + tip + ": Neka druga napaka");
    }
}

// Metoda, ki vrne datoteko in nastavi tip datoteke,
// da jo brskalnik zna ustrezno prikazati
function posredujDatoteko(odgovor, datotekaPot, datotekaVsebina) {
    odgovor.writeHead(200, {
        "Content-Type": mime.lookup(path.basename(datotekaPot)),
    });
    odgovor.end(datotekaVsebina);
}


function posredujStaticnoVsebino(odgovor, potDoDatoteke) {
    // Preverjanje, ali je datoteka v predpomnilniku
    if (predpomnilnik[potDoDatoteke]) {
        posredujDatoteko(odgovor, potDoDatoteke, predpomnilnik[potDoDatoteke]);
    } else {
        fs.access(potDoDatoteke, (napaka) => {
            if (!napaka) {
                fs.readFile(potDoDatoteke, (napaka, datotekaVsebina) => {
                    if (napaka) {
                        posredujNapako(odgovor, 500);
                    } else {
                        // Shranjevanje vsebine nove datoteke v predpomnilnik
                        predpomnilnik[potDoDatoteke] = datotekaVsebina;
                        posredujDatoteko(odgovor, potDoDatoteke, datotekaVsebina);
                    }
                });
            } else {
                posredujNapako(odgovor, 404);
            }
        });
    }
}

async function doAPIThing(odgovor) {
    let detected;
    odgovor.writeHead(200, {
        "Content-Type": "application/json"
    });
    detected = await find();
    for (let i = 0; i < detected.length; i++) {
        console.log(detected[i]);
        console.log(await detailedScan(detected[i].ip));
    }
    
}


async function detailedScan(host) {
    var scan = new nmap.NmapScan(host,'-sS');
    var ret;
    await scan.on('complete',function(data){console.log(data)});
    await scan.startScan();
    ret = scan.ret;

    console.log(ret, scan);
    return ret;
}

/*
// quick scan
var quickscan = new nmap.QuickScan('localhost');

quickscan.on('complete', function (data) {
    //console.log(data);
    //var jsonResponse = createResponse(data[0].ip, data[0].openPorts);
    //console.log(jsonResponse);
})

quickscan.on('error', function (error) {
    //console.log(error);
})

quickscan.startScan();

// stealth scan
var stealthscan = new nmap.NmapScan('fri.uni-lj.si', '-sS');

stealthscan.on('complete', function (data) {
    //console.log(data);
    //var jsonResponse = createResponse(data);
    //console.log(jsonResponse);
})

stealthscan.on('error', function (error) {
    //console.log(error);
})

stealthscan.startScan();


// OS and port scan ti pove se verzijo OS/porta kar lahko pomaga ker assumas da starejsi kot je version lazje je hackable ker ni uptodate version.
var osandports = new nmap.OsAndPortScan('fri.uni-lj.si');

osandports.on('complete', function (data) {
    var jsonResponse = createResponse(data);
    console.log(jsonResponse);
});

osandports.on('error', function (error) {
    console.log(error);
});

osandports.startScan();

function createResponse(data) {
    var jsonResponse = new Object();
    jsonResponse.hostname = data[0].hostname;
    jsonResponse.ip = data[0].ip;
    jsonResponse.ports = data[0].openPorts;
    jsonResponse.os = data[0].osNmap;
    return jsonResponse;
}*/