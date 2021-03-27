let body = document.getElementById("content");
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
    constructLocal(data);
}

async function constructLocal(data) {
    if (body.innerHTML!="") {
        body.innerHTML = "";
    }
    let interval = document.getElementById('updateInterval').value;
    let counter = createElement('p','Naslednja posodobitev čez ','h3','',body);
    let amount = createElement('small', interval + "s",'h3','',counter);
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
        let o = row.insertCell();
        o.innerHTML = "Ocena";
    }
    for (let i = 0; i < data.length; i++) {
        let row = createElement('tr','','','',table);
        if (i%2==0) {
            row.style.backgroundColor = "#F2F2F2"
        }
        let r = row.insertCell();
        r.style.textAlign = "center";
        r.innerHTML = "<b>" + (i+1) + "</b>";
        let n = row.insertCell();
        n.innerHTML = data[i].ip + (data[i].hostname ? " (" + data[i].hostname + ")" : "");
        let p = row.insertCell();
        for (let j = 0; j < data[i].ports.length; j++) {
            p.innerHTML += "<b>" + data[i].ports[j].port + "</b> " + data[i].ports[j].protocol + "-" + data[i].ports[j].service + "\n";
        }
        let o = row.insertCell();
        o.innerHTML = "Ocena";

    }
    awaitUpdate();
}

async function awaitUpdate() {
    let value = parseInt(document.getElementById('time-remaining').innerHTML);
    console.log(value);
    if (value > 0 ) {
        value--;
        document.getElementById('time-remaining').innerHTML = value + "s...";
        setTimeout(awaitUpdate,1000);
    } else {
        constructBody();
    }

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
            .then(error => console.log(error))
    return response;
} 