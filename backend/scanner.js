var nmap = require('node-nmap');

nmap.nmapLocation = "nmap";

// quick scan
var quickscan = new nmap.QuickScan('localhost');

quickscan.on('complete', function(data) {
    //console.log(data);
    //var jsonResponse = createResponse(data[0].ip, data[0].openPorts);
    //console.log(jsonResponse);
})

quickscan.on('error', function(error) {
    //console.log(error);
})

quickscan.startScan();

// stealth scan
var stealthscan = new nmap.NmapScan('fri.uni-lj.si', '-sS');

stealthscan.on('complete', function(data) {
    //console.log(data);
    //var jsonResponse = createResponse(data);
    //console.log(jsonResponse);
})

stealthscan.on('error', function(error) {
    //console.log(error);
})

stealthscan.startScan();


// OS and port scan ti pove se verzijo OS/porta kar lahko pomaga ker assumas da starejsi kot je version lazje je hackable ker ni uptodate version.
var osandports = new nmap.OsAndPortScan('fri.uni-lj.si');
 
osandports.on('complete',function(data){
    var jsonResponse = createResponse(data);
    console.log(jsonResponse);
});

osandports.on('error', function(error){
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
}
