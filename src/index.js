import '@style/App.scss'
import App from '@js/App'
import gsap from 'gsap';
document.addEventListener('DOMContentLoaded', () => {
  const landing = document.querySelector('.landing')
  const loading = document.querySelector('.loading')
  const access = document.querySelector('.access')
  const play = document.querySelector('.play')
  const begin = document.querySelector('.begin')



  play.addEventListener('click', () => {
    gsap.to(landing, {opacity:0}).then(() => {
      gsap.to(landing, {display:'none'})
    })
  })
  begin.addEventListener('click', () => {
    gsap.to(access, {opacity:0}).then(() => {
      gsap.to(access, {display:'none'})
    })
    new App({
      canvas: document.querySelector('#_canvas'),
    })
  })
})