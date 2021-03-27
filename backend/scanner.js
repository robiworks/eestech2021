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
    var jsonResponse = createResponse(data[0].hostname, data[0].ip, data[0].openPorts);
    console.log(jsonResponse);
})

stealthscan.on('error', function(error) {
    //console.log(error);
})

stealthscan.startScan();


// OS and port scan ti pove se verzijo OS/porta kar lahko pomaga ker assumas da starejsi kot je version lazje je hackable ker ni uptodate version.
var osandports = new nmap.OsAndPortScan('192.168.1.4');
 
osandports.on('complete',function(data){
  console.log(data);
});
osandports.on('error', function(error){
  console.log(error);
});
 
osandports.startScan();
function createResponse(hostname, ip, ports) {
    var jsonResponse = new Object();
    jsonResponse.hostname = hostname;
    jsonResponse.ip = ip;
    jsonResponse.ports = ports;
    return jsonResponse;
}
