import gsap from 'gsap';
import lottie from 'lottie-web'

export default class Outro {
    constructor(params) {
        this.assets = params.assets
        this.socket = params.socket
        this.name = params.name
        this.description = params.description
        this.container = null
        this.outro;
        this.create()
    }

    // Create Lottie animation and DOM nodes
    create() {
        this.app = document.querySelector('.app')
        this.container = document.createElement('div')
        this.container.classList.add('outroTuto')
        this.container.setAttribute('id', 'outroTuto')

        this.animationElement = document.createElement('div')
        this.animationElement.setAttribute('id', 'outroTutoAnimation')

        this.container.append(this.animationElement)

        this.app.append(this.container)

        this.outro = lottie.loadAnimation({
            container: document.getElementById("outroTutoAnimation"),
            renderer: "svg",
            autoplay: false,
            loop: false,
            path: './animations/ecran_fin.json',
        });

    }


    showOutro() {

        this.outro.play();

        gsap.to(this.animationElement, { opacity: 1, duration: 1 }).then(() => {
          gsap.to(this.app, { background: 'white', duration: 1 });
            console.log('first')
            gsap.to(this.animationElement, { opacity: 0, duration: 3, delay: 20 }).then(() => {
                console.log('second')
                gsap.to(this.app, { opacity: 0, duration: 3 });
                console.log('third')
            })
        })

    }

    hide() {
        gsap.to(this.container, { opacity: 0, duration: 1 })
    }

} 