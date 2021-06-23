import gsap from 'gsap';
import lottie from 'lottie-web'

export default class TotemTuto {
    constructor(params) {
        this.assets = params.assets
        this.name = params.name
        this.description = params.description
        this.container = null
        this.create()
    }

    // Create Lottie animation and DOM nodes
    create() {
        const app = document.querySelector('.app')
        this.container = document.createElement('div')
        let textContainer = document.createElement('div')
        this.container.classList.add('totemTuto')
        textContainer.classList.add('textContainer')
        this.container.setAttribute('id', 'totemTuto')

        this.title1 = document.createElement('h2')
        this.title1.innerText = "Suivez l'appel des totems";
        this.title2 = document.createElement('h2')
        this.title2.innerText = "Puis apprenez leur savoir \nen reproduisant leur chants";
        this.animationElement = document.createElement('div')
        this.animationElement.setAttribute('id', 'totemTutoAnimation')


        textContainer.append(this.title1);
        textContainer.append(this.title2);
        this.container.append(textContainer);
        this.container.append(this.animationElement)

        app.append(this.container)

        lottie.loadAnimation({
            container: document.getElementById("totemTutoAnimation"),
            renderer: "svg",
            autoplay: true,
            loop: true,
            path: './animations/espoir_script.json',
        });

    }
    // Set the timeline to chain title and animation
    show() {
        gsap.to(this.title1, { opacity: 1, duration: 3 }).then(() => {
            gsap.to(this.title2, { opacity: 1, duration: 3 }).then(() => {

                gsap.to(this.title1, { opacity: 0, duration: 3 })
                gsap.to(this.title2, { opacity: 0, duration: 3 })
                gsap.to(this.animationElement, { opacity: 1, duration: 3 }).then(() => {
                    gsap.to(this.animationElement, { opacity: 0, duration: 3, delay: 5 })

                })
            })
        })

    }
    hide() {
        gsap.to(this.container, { opacity: 0, duration: 1 })
    }

}