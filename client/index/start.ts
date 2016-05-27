require('./index.scss');

interface Window {
  __DESCRIPTION__: string
}

window.__DESCRIPTION__ = 'Mouse Room';


import {Client} from 'corona-client'

window.onload = function(){
  var client = new Client('ws://localhost:8080/', function(controller){
    var mouses = controller.getModel('mouses');
    
    mouses.on('update', (keypath, value) => {
      
    })
    
    window.addEventListener('mousemove', (ev) => {
      controller.update(ev.clientX, ev.clientY);
    })
  })
  
}