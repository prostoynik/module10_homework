const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "lightskyblue";
ctx.strokeRect(0, 0, 500, 500);

// Обычный прямоугольник
ctx.strokeStyle = "yellow";
ctx.strokeRect(10, 20, 30, 40);

const btn = document.querySelector('.j-btn-test');

const wsUri = "wss://echo-ws-service.herokuapp.com/";

const output = document.getElementById("output");
const btnOpen = document.querySelector('.j-btn-open');
const btnClose = document.querySelector('.j-btn-close');
const btnSend = document.querySelector('.j-btn-send');
const fieldInput = document.querySelector('#input');

let websocket;

window.onload = () =>{
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        //writeToScreen("CONNECTED");
    };
    websocket.onclose = function(evt) {
        writeToScreen('<div style="color: red;">' +'DISCONNECTED: перезагрузите страницу'+'</div>');
    };
    websocket.onmessage = function(evt) {
        writeToScreen(

            '<div class="msg"  style="color: blue;">' + evt.data+'</div>', true
        );
    };
    websocket.onerror = function(evt) {
        writeToScreen(
            '<span style="color: red;">ERROR:</span> ' + evt.data
        );
    };
}

window.onclose = () =>{
    websocket.close();
    websocket = null;
}

// Функция, выводящая текст об ошибке
const error = () => {
    //status.textContent = 'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    console.log('position', position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    // status.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
    let link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    let li = '<a class="geo" href = "' + link  + '">Геолокация</a>';
    geoToScreen(li);
}

btn.addEventListener('click', () => {

    if (!navigator.geolocation) {
        //status.textContent = 'Geolocation не поддерживается вашим браузером';
    } else {
        //status.textContent = 'Определение местоположения…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

function geoToScreen(link) {
    let are = document.createElement("p");
    are.className = "r";
    are.innerHTML = link;
    output.appendChild(are);
}

function writeToScreen(message, isResponse) {
    let pre;
    if(isResponse){
        pre = document.createElement('p');
        pre.className = "r";
    }
    else
        pre = document.createElement('p');
    pre.innerHTML = message;
    output.appendChild(pre);
}

btnSend.addEventListener('click', () => {
    const message = fieldInput.value;
    if(message.trim() != '') {
    writeToScreen('<div class="msg" style="color: orange;">' + message+'</div>', false);
    websocket.send(message);}
});


