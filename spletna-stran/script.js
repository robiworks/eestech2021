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



async function constructBody(type) {
    constructLocal('');
}

async function constructLocal(data) {
    console.log(body);
    let table = createElement('table','','table table-striped',body);
    // header
    {
        let row = createElement('tr','','font-weight:bold',table);
        console.log(row);
        let r = row.insertCell();
        r.innerHTML = "#";
        let n = row.insertCell();
        n.innerHTML = "Naslov";
        let p = row.insertCell();
        p.innerHTML = "Odprti porti";
        let o = row.insertCell();
        o.innerHTML = "Ocena";
    }

    for (let i = 0; i < data.length; i++) {
        let row = createElement('tr','','',table);

    }
    console.log(body);


}


async function callServer(type,ip,port) {
    return;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var response;

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("",requestOptions)
            .then(response => response.text())
            .then(result => response = result)
            .then(error => console.log(error))

    console.log(response);
} 