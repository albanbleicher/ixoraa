import '@style/App.scss'
import App from '@js/App'
import gsap from 'gsap';
import io from "socket.io-client"

const io_client = io("http://localhost:3000");


document.addEventListener('DOMContentLoaded', () => {
  const landing = document.querySelector('.landing')
  const loading = document.querySelector('.loading')
  const access = document.querySelector('.access')
  const play = document.querySelector('.play')
  const begin = document.querySelector('.begin')
  const code = document.querySelector('.code')


  play.addEventListener('click', () => {
    io_client.emit("room create");
    io_client.once("room code", (id) => {
      console.log('test');
      code.innerText = id;
    });
    io_client.once('room is_synced', () => {
      console.log('test')
      gsap.to(access, { opacity: 0 }).then(() => {
        gsap.to(access, { display: 'none' })
      })
      new App({
        canvas: document.querySelector('#_canvas'),
      })
    })

    gsap.to(landing, { opacity: 0 }).then(() => {
      gsap.to(landing, { display: 'none' })
    })
  })

  /*new App({
    canvas: document.querySelector('#_canvas'),
  })*/
})