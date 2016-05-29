require('./index.scss');

window.__DESCRIPTION__ = 'Mouse Room';


// import {Client} from 'corona-client'

// window.onload = function(){
//   var client = new Client('ws://localhost:8080/', function(controller){
//     controller.getModel('mouses').then((mouses) => {
//       mouses.on('*.change', (index, key, value) => {
//         console.log(index, key, value)
//       });
//     })

//     // window.addEventListener('mousemove', (ev) => {
//     //   console.log(ev);
//     //   controller.update(ev.clientX, ev.clientY);
//     // });
//   })
//   window.client = client;
// }
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Index } from "./index";

ReactDOM.render(
  <Index />,
  document.getElementById("main")
);
