import '@style/App.scss'
import App from '@js/App'
import gsap from 'gsap';
import io from "socket.io-client"
import lottie from "lottie-web"

// Animation for the logo
const anim = lottie.loadAnimation({
  container: document.querySelector('.title'),
  renderer: 'svg',
  autoplay: true,
  loop: false,
  path: './animations/logo_animation.json'
})
const play = document.querySelector('button')
const home = document.querySelector('.home')
const loading = document.querySelector('.loading')
// const audio = new Audio('./loading.mp3')
const landing = document.querySelector('.landing')
const access = document.querySelector('.access')
const code = document.querySelector('.code')
const headphones = document.querySelector('.headphones')




anim.setSpeed(10);
anim.addEventListener('complete', () => gsap.to([play, headphones], { opacity: 1 }))

let socket = false;
console.log(window.location)
if (!window.location.hash.includes('#nosocket')) {

 if (window.location.origin.includes('albchr.dev')) socket = io("https://ixoraa-api.herokuapp.com");
 else socket = io("ws://localhost:3000");

  console.log('[Socket] Enabled.');
  socket.emit("room create");
  document.addEventListener('DOMContentLoaded', () => {

    play.addEventListener('click', () => {
      // audio.play()
      // audio.pause()
      // audio.volume = 0
      socket.emit("room create");
      socket.once("room code", (id) => {
        code.innerText = id;
      });
      gsap.to([home, headphones], { opacity: 0, duration:1 }).then(() => {

        home.remove()
        gsap.to(access, { opacity: 1 });
        gsap.from('.notice', {opacity:0, y:50, duration:1})
      });
      socket.once('room is_synced', () => {
        const canvas = document.querySelector('#_canvas');
        new App({
          canvas,
          socket
        })
        gsap.to(access, { opacity: 0, duration:1 }).then(() => {
          access.remove()
          gsap.to(loading, { opacity: 1 });
          // gsap.to(audio, { volume: 1, duration:4 });
          // audio.play()
          // setTimeout(() => {
          //   gsap.to('.first', {opacity:1, duration:1.5})
          // },15000)
          // setTimeout(() => {
          //   gsap.to('.first', {opacity:0, duration:1})
          // },17000)
          // setTimeout(() => {
          //   gsap.to('.second', {opacity:1, duration:1.5})
          // },17500)
          // setTimeout(() => {
          //   gsap.to('.second', {opacity:0, duration:1})
          // },20500)
          // setTimeout(() => {
          //   gsap.to('.third', {opacity:1, duration:1.5})
          // },20500)
          // setTimeout(() => {
          //   gsap.to('.third', {opacity:0, duration:1})
          // },23000)
          // setTimeout(() => {
          //   gsap.to('.fourth', {opacity:1, duration:1.5})
          // },24000)
          // setTimeout(() => {
          //   gsap.to('.fourth', {opacity:0, duration:1.5})
          // },25000)
          // setTimeout(() => {
          //   gsap.to('.fifth', {opacity:1, duration:1.5})
          // },26000)
          // setTimeout(() => {
          //   gsap.to('.fifth', {opacity:0, duration:1.5})
          // },27000)
          // setTimeout(() => {
          //   gsap.to('.sixth', {opacity:1, duration:1.5})
          // },28000)
          // setTimeout(() => {
          //   gsap.to('.sixth', {opacity:0, duration:1})
          //   // gsap.to(audio, {volume:0, duration:2})
          // },35000)
          setTimeout(() => {
            gsap.to(loading, {opacity:0, duration:2}).then(()=> {
              loading.remove()
              socket.emit('user loaded')
              gsap.to(canvas, {opacity:1, duration:1})
            })
          },37000)
          
          

        });
    

      })

      gsap.to(landing, { opacity: 0 }).then(() => {
        gsap.to(landing, { display: 'none' })
      })
    })


  })
}
else {
  console.log('[Socket] Disabled.');
  const removables = document.querySelectorAll('.home, .access, .loading')
  removables.forEach(element => {
    element.remove()

  })
  new App({
    canvas: document.querySelector('#_canvas'),
    socket
  })
}


function musicFadeOut() {
  // Initial volume of 0.20
  // Make sure it's a multiple of 0.05
  var vol = 0.20;
  var interval = 200; // 200ms interval

  var fadeout = setInterval(() => {
    var audio = document.getElementById("audio_intro");
    // Reduce volume by 0.05 as long as it is above 0
    // This works as long as you start with a multiple of 0.05!
    if (vol > 0) {
      vol -= 0.02;
      audio.volume = vol;
    }
    else {
      // Stop the setInterval when 0 is reached
      clearInterval(fadeout);
    }
  }, interval);
}