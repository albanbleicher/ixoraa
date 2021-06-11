import '@style/App.scss'
import App from '@js/App'
import gsap from 'gsap';
import io from "socket.io-client"

const socket = io("http://localhost:3000");

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });
// socket.emit("room create");
// socket.once("room code", (room) => {
//   console.log('code', room);
// });
// socket.on('room is_synced', () => {
new App({
  canvas: document.querySelector('#_canvas'),
})
// })
// document.addEventListener('DOMContentLoaded', () => {
//   const landing = document.querySelector('.landing')
//   const loading = document.querySelector('.loading')
//   const access = document.querySelector('.access')
//   const play = document.querySelector('.play')
//   const begin = document.querySelector('.begin')
//   const code = document.querySelector('.code')


//   play.addEventListener('click', () => {
//     socket.emit("room create");
//     socket.once("room code", (id) => {
//       console.log('test');
//       code.innerText = id;
//     });
//     socket.once('room is_synced', () => {
//       console.log('test')

//       gsap.to(access, { opacity: 0 }).then(() => {
//         gsap.to(access, { display: 'none' })
//       })
//       //musicFadeOut()
//       new App({
//         canvas: document.querySelector('#_canvas'),
//       })
//     })

//     gsap.to(landing, { opacity: 0 }).then(() => {
//       gsap.to(landing, { display: 'none' })
//     })
//   })
// })

//   /*new App({
//     canvas: document.querySelector('#_canvas'),
//   })*/
// })


// function musicFadeOut() {
//   // Initial volume of 0.20
//   // Make sure it's a multiple of 0.05
//   var vol = 0.20;
//   var interval = 200; // 200ms interval

//   var fadeout = setInterval(() => {
//     var audio = document.getElementById("audio_intro");
//     // Reduce volume by 0.05 as long as it is above 0
//     // This works as long as you start with a multiple of 0.05!
//     if (vol > 0) {
//       console.log(vol);
//       console.log(audio)
//         vol -= 0.02;
//         audio.volume = vol;
//       }
//       else {
//         // Stop the setInterval when 0 is reached
//         clearInterval(fadeout);
//       }
//     }, interval);
// }