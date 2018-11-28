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
  if (obj.type === 'message') {
    const messagein = document.getElementById('msg1');
    const div = document.importNode(messagein.content, true);
    div.firstElementChild.textContent = `${obj.data.author} ${obj.data.text}`;
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
const btnEl = document.getElementById('btn');
btnEl.addEventListener('click', event => {
  event.preventDefault();
  const textinput = document.getElementById('msg');
  const obj = {
    type: 'message',
    data: textinput.value,
    key: password
  };
  const jsonObj = JSON.stringify(obj);
  connection.send(jsonObj);
});
