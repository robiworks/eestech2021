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
    console.log(detected);
    for (let i = 0; i < detected.length; i++) {
        detailedScan(detected[i].ip);
    }
    
}


async function detailedScan(host) {
    var osandports = new nmap.NmapScan(host, '-sS -F --max-retries 1');

    osandports.on('complete', function (data) {
        this.data = data;
        console.log(data);
    });
    
    osandports.on('error', function (error) {
        console.log(error);
    });

    await osandports.startScan();

}