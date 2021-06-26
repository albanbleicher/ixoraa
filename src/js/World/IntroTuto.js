// import gsap from 'gsap';
// import lottie from 'lottie-web'

// export default class IntroTuto {
//     constructor(params) {
//         this.assets = params.assets
//         this.socket = params.socket
//         this.name = params.name
//         this.description = params.description
//         this.container = null
//         this.create()
//     }

//     // Create Lottie animation and DOM nodes
//     create() {
//         this.app = document.querySelector('.app')
//         this.container = document.createElement('div')
//         this.textContainer = document.createElement('div')
//         this.container.classList.add('introTuto')
//         this.textContainer.classList.add('textContainer')
//         this.container.setAttribute('id', 'introTuto')

//         this.title1 = document.createElement('h2')
//         this.title1.innerText = "Suivez l'appel des totems";
//         this.title2 = document.createElement('h2')
//         this.title2.innerText = "Puis apprenez leur savoir \nen reproduisant leur chants";
//         this.animationElement = document.createElement('div')
//         this.animationElement.setAttribute('id', 'introTutoAnimation')

//         this.container.append(this.animationElement)

//         this.app.append(this.container)

//     }
//     // Set the timeline to chain title and animation
//     showIntroTuto() {

//         this.textContainer.append(this.title1);
//         this.textContainer.append(this.title2);
//         this.container.append(this.textContainer);
//         gsap.to(this.title1, { opacity: 1, duration: 3 }).then(() => {
//             gsap.to(this.title2, { opacity: 1, duration: 3 }).then(() => {
//                 gsap.to(this.title1, { opacity: 0, duration: 3 })
//                 gsap.to(this.title2, { opacity: 0, duration: 3 })
//             })
//         })

//     }

//     showTotemTuto() {
//         lottie.loadAnimation({
//             container: document.getElementById("introTutoAnimation"),
//             renderer: "svg",
//             autoplay: true,
//             loop: true,
//             path: './animations/sagesse_script.json',
//         });
//         gsap.to(this.animationElement, { opacity: 1, duration: 3 }).then(() => {
//             gsap.to(this.animationElement, { opacity: 0, duration: 3, delay: 5 }).then(() => {
//                 if (this.socket) { this.socket.emit('totem approach', this.name); console.log('yes') }
//             })
//         })
//     }

//     showOutro() {
//         var outro = lottie.loadAnimation({
//             container: document.getElementById("introTutoAnimation"),
//             renderer: "svg",
//             autoplay: true,
//             loop: false,
//             path: './animations/ecran_fin.json',
//         });
//         gsap.to(this.animationElement, { opacity: 1, duration: 3 }).then(() => {
//             gsap.to(this.animationElement, { opacity: 0, duration: 3, delay: 5 }).then(() => {
//                 gsap.to(this.app, { opacity: 0, duration: 3 });
//             })
//         })

//         outro.setSpeed(0.5);
//     }

//     hide() {
//         gsap.to(this.container, { opacity: 0, duration: 1 })
//     }

// }