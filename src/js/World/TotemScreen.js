import gsap from 'gsap';
export default class TotemScreen {
    constructor(params) {
        this.name = params.name
        this.description = params.description
        this.container = null
        this.create()
    }

    // Simple way to create screen text
    create() {
        const app = document.querySelector('.app')
        this.container = document.createElement('div')
        this.container.classList.add('totemScreen')
        this.container.setAttribute('id', 'totem-'+this.name)
        const title = document.createElement('h2')
        title.innerText = this.name;
        const description = document.createElement('p')
        description.innerText = this.description;
        this.container.append(title, description)
        app.append(this.container)
        gsap.to(this.container, {opacity:0, duration:0})
    }
    show() {
        gsap.to(this.container, {opacity:1, duration:1})
    }
    hide() {
        gsap.to(this.container, {opacity:0, duration:1})
    }

}