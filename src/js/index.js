/* eslint-disable no-unused-vars */
import style from '../css/style.css';
/* eslint-enable no-unused-vars */
import password from './config';

const printmessage = (time, text, author, color) => {
  const messagein = document.getElementById('msg1');
  const div = document.importNode(messagein.content, true);

  const realtime = new Date(time).toString();
  div.firstElementChild.textContent = `${realtime.substr(0, 23)} ${author}:  ${text}`;
  div.firstElementChild.style = `color: ${color}`;

  const paste = document.getElementById('paste');
  paste.appendChild(div);
  const objDiv = document.getElementById('paste');
  objDiv.scrollTop = objDiv.scrollHeight;
};
const connection = new WebSocket('ws://104.248.143.87:1337');
connection.onopen = () => {
  console.log('uppkoppling started ... ');
};
connection.onerror = error => {
  const error1 = document.getElementById('logo');
  console.log(`Error: ${error}`);
  error1.textContent = error;
};
connection.onmessage = message => {
  const textEl = document.getElementById('logger');
  const obj = JSON.parse(message.data);
  console.log(obj);

  if (obj.type === 'history') {
    obj.data.forEach(messagehistory => {
      console.log(messagehistory);
      printmessage(
        messagehistory.time,
        messagehistory.text,
        messagehistory.author,
        messagehistory.color
      );
    });
  }
  if (obj.type === 'color') {
    const colorin = document.getElementById('msg');
    colorin.setAttribute('placeholder', 'Skriv in ditt medelande');
  }
  if (obj.type === 'message') {
    printmessage(obj.data.time, obj.data.text, obj.data.author, obj.data.color);
  }
  if (obj.type === 'heartbeat') {
    textEl.textContent += `${obj.data},`;
  }
  if (obj.type === 'error') {
    const error1 = document.getElementById('logo');
    error1.textContent = 'Oops Something Went Wrong';
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
