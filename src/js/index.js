/* eslint-disable no-unused-vars */
import style from '../css/style.css';
/* eslint-enable no-unused-vars */
import password from './config';

const connection = new WebSocket('ws://104.248.143.87:1337');
connection.onopen = () => {
  console.log('uppkoppling started ... ');
};
connection.onerror = error => {
  console.log(`Error: ${error}`);
};
connection.onmessage = message => {
  const textEl = document.getElementById('logger');
  const obj = JSON.parse(message.data);
  console.log(obj);

  if (obj.type === 'history') {
    obj.data.forEach(messagehistory => {
      console.log(messagehistory);
      const messagein = document.getElementById('msg1');
      const div = document.importNode(messagein.content, true);

      const time = new Date(messagehistory.time).toString();

      div.firstElementChild.textContent = `${time.substr(0, 23)} ${messagehistory.author}: ${
        messagehistory.text
      }`;
      div.firstElementChild.style = `color: ${messagehistory.color}`;

      const paste = document.getElementById('paste');
      paste.appendChild(div);
      console.log(obj.data.text);
    });
  }
  if (obj.type === 'color') {
    const colorin = document.getElementById('msg');
    colorin.setAttribute('placeholder', 'Skriv in ditt medelande');
  }
  if (obj.type === 'message') {
    const messagein = document.getElementById('msg1');
    const div = document.importNode(messagein.content, true);

    const time = new Date(obj.data.time).toString();

    div.firstElementChild.textContent = `${time.substr(0, 23)} ${obj.data.author}:  ${
      obj.data.text
    }`;
    div.firstElementChild.style = `color: ${obj.data.color}`;

    const paste = document.getElementById('paste');
    paste.appendChild(div);
    console.log(obj.data.text);
  }
  if (obj.type === 'heartbeat') {
    textEl.textContent += `${obj.data},`;
  }
};
connection.onclose = () => {
  console.log('upploppling nedstängd ...');
};
const eventhandler = event => {
  event.preventDefault();
  const textinput = document.getElementById('msg');
  const obj = {
    type: 'message',
    data: textinput.value,
    key: password
  };
  const jsonObj = JSON.stringify(obj);
  connection.send(jsonObj);
  textinput.value = '';
};
const btnEl = document.getElementById('btn');
window.addEventListener('keypress', event => {
  console.log(event.code);

  if (event.code === 'Enter') {
    eventhandler(event);
  }
});
btnEl.addEventListener('click', eventhandler);
