var nmap = require('node-nmap');

nmap.nmapLocation = "nmap";

// quick scan
var quickscan = new nmap.QuickScan('localhost');

quickscan.on('complete', function(data) {
    console.log(data);
})

quickscan.on('error', function(error) {
    console.log(error);
})

quickscan.startScan();

// stealth scan
var stealthscan = new nmap.NmapScan('localhost', '-sS');

stealthscan.on('complete', function(data) {
    console.log(data);
})

stealthscan.on('error', function(error) {
    console.log(error);
})

stealthscan.startScan();