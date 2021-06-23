import '@style/App.scss'
import App from '@js/App'
import gsap from 'gsap';
import io from "socket.io-client"
import lottie from "lottie-web"

// Animation for the logo
let container = document.getElementById('anim_container')

var animData = {
  container: container,
  renderer: 'svg',
  autoplay: true,
  loop: false,
  path: './animations/logo_animation.json'
}

var anim = lottie.loadAnimation(animData)

const play = document.querySelector('.play')

anim.addEventListener('complete', () => gsap.to(play, { opacity: 1 }))

anim.setSpeed(8);


let socket = false;
if (!window.location.hash.includes('#nosocket')) {
  socket = io("ws://localhost:3000");
  console.log('[Socket] Enabled.');
  socket.emit("room create");
  document.addEventListener('DOMContentLoaded', () => {
    const landing = document.querySelector('.landing')
    const access = document.querySelector('.access')
    const code = document.querySelector('.code')
    play.addEventListener('click', () => {
      socket.emit("room create");
      socket.once("room code", (id) => {
        code.innerText = id;
      });
      gsap.to(play, { opacity: 0, display: 'none' }).then(() => {
        gsap.to(access, { opacity: 1 });

      });
      socket.once('room is_synced', () => {

        gsap.to(access, { opacity: 0 }).then(() => {
          gsap.to(container, { opacity: 0, display: 'none' })
          gsap.to(access, { display: 'none' })
          new App({
            canvas: document.querySelector('#_canvas'),
            socket
          })
        })
        musicFadeOut()

      })

      gsap.to(landing, { opacity: 0 }).then(() => {
        gsap.to(landing, { display: 'none' })
      })
    })


  })
}
else {
  console.log('[Socket] Disabled.');
  const removables = document.querySelectorAll('.landing, .access')
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