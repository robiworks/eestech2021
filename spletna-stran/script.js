let body = document.getElementById("content");
let globalDeviceObject = [];
let pause = false;
let ports;

constructBody();

function createElement(tag, innerHTML, classList, style, parent) {
    let element = document.createElement(tag);
    if (innerHTML) element.innerHTML = innerHTML;
    if (classList) element.classList = classList;
    if (style) element.style = style;
    if (parent) parent.appendChild(element);
    return element;
}   


async function constructBody() {
    var data = await callServer();
    await getPorts();
    constructLocal(data);
}

async function constructLocal(data) {
    if (body.innerHTML!="") {
        body.innerHTML = "";
    }
    let interval = parseInt(document.getElementById('updateInterval').value) + 1;
    let counter = createElement('p','Naslednja posodobitev čez ','h3','',body);
    let amount = createElement('small', interval + "s",'h3','',counter);
    let types = ["bg-success", "bg-warning", "bg-danger"];
    amount.id = "time-remaining";
    let table = createElement('table','','table table-striped','',body);
    // header
    {
        let row = createElement('tr','','','font-weight:bold;',table);
        let r = row.insertCell();
        r.style.textAlign = "center";
        r.innerHTML = "#";
        let n = row.insertCell();
        n.innerHTML = "Naslov";
        let p = row.insertCell();
        p.innerHTML = "Odprti porti";
        let h = row.insertCell();
        h.innerHTML = "Tip klijenta"
        let o = row.insertCell();
        o.style.textAlign = "center";
        o.innerHTML = "Ocena";
    }
    for (let i = 0; i < data.length; i++) {
        let ocena = 0;
        let row = createElement('tr','','','',table);
        if (i%2==0) {
            row.style.backgroundColor = "#F2F2F2"
        }
        let r = row.insertCell();
        r.style.textAlign = "center";
        r.innerHTML = "<b>" + (i+1) + "</b>";
        let n = row.insertCell();
        n.innerHTML = data[i].ip + (data[i].hostname ? " <small>(" + data[i].hostname + ")</small>" : "");
        let p = row.insertCell();
        for (let j = 0; j < data[i].ports.length; j++) {
            let exploit = await getExploitLevel(data[i].ports[j].port)-1;
            let temp = "<b>" + data[i].ports[j].port + "</b><small>" + data[i].ports[j].protocol + "-" + data[i].ports[j].service + "</small>";
            p.innerHTML += '<span class="badge rounded-pill ' + types[exploit] + '">' + temp + '</span> ';
            ocena += exploit+1;
        }
        let h = row.insertCell();
        h.innerHTML = data[i].os;
        let o = row.insertCell();
        ocena = (ocena/data[i].ports.length);
        o.style="text-align:center; cursor:pointer";
        o.innerHTML = '<span class="badge rounded-pill ' + types[Math.round(ocena)-1] + '">' + ocena + '</span> ';
        o.index = i;
        o.onclick = function() {showPopup(this)};

        globalDeviceObject[i] = data[i];

    }
    awaitUpdate();
}

async function showPopup(e) {
    let types = ["bg-success", "bg-warning", "bg-danger"];
    pause = true;
    var index = e.index;
    //createElement(tag, innerHTML, classList, style, parent)
    let backdrop = createElement('div','','modal fade show','display: block; padding-right: 17px; background-color: rgba(0,0,0,0.4)',body);
    backdrop.id="backdrop";
    let dialog = createElement('div','','modal-dialog','',backdrop);
    let content = createElement('div','','modal-content','',dialog);
    let header = createElement('div','','modal-header','font-weight:bold',content);
    let title = createElement('h5',globalDeviceObject[index].ip,'modal-title','',header);
    header.innerHTML += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closePopup()"></button>';
    let mod_body = createElement('div','','modal-body','',content);
    let footer = createElement('div','','modal-footer','',content);
    footer.innerHTML = '<button type="button" class="btn btn-success" onclick="closePopup()">Zapri okno</button>';
    for (let i = 0; i < globalDeviceObject[index].ports.length; i++) {
        mod_body.innerHTML += "<b>" + globalDeviceObject[index].ports[i].port + "</b>" + " - " + await getDescription(globalDeviceObject[index].ports[i].port) + "<br>";
        let exploit = await getExploitLevel(globalDeviceObject[index].ports[i].port);
        let port_index = await getPortIndex(globalDeviceObject[index].ports[i].port);
        mod_body.innerHTML += "Stopnja ranljivosti: " + '<span class="badge rounded-pill ' + types[exploit-1] + '">' + exploit + '</span> ';
        mod_body.innerHTML += "<br>";
        mod_body.innerHTML += ports[port_index].sightings;
        
        
        mod_body.innerHTML += "<br>";
    }
    mod_body.innerHTML += "<hr>"

    console.log(backdrop);
}

async function closePopup() {
    document.getElementById('backdrop').remove();
    pause = false;
    awaitUpdate();
}

async function awaitUpdate() {
    if (pause) {
        return;
    }
    let value = parseInt(document.getElementById('time-remaining').innerHTML);
    if (value > 0 ) {
        value--;
        document.getElementById('time-remaining').innerHTML = value + "s...";
        setTimeout(awaitUpdate,1000);
    } else {
        constructBody();
    }

}

async function getDescription(port) {
    for (var i = 0; i < ports.length; i++) {
        if (port == ports[i].port) {
            return await ports[i]['extended-desc'];
        }
    }
}

async function getPortIndex(port) {
    for (var i = 0; i < ports.length; i++) {
        if (port == ports[i].port) {
            return i;
        }
    }
}




async function getExploitLevel(port) {
    for (var i = 0; i < ports.length; i++) {
        if (port == ports[i].port) {
            return await ports[i].exploitable;
        }
    }
    return 3;
}



async function callServer() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var response;

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    await fetch("example_response.json",requestOptions)
            .then(response => response.text())
            .then(result => response = JSON.parse(result))
    return response;
} 

async function getPorts() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var response;

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    await fetch("ports.json",requestOptions)
            .then(response => response.text())
            .then(result => response = JSON.parse(result))

    ports = response;
}