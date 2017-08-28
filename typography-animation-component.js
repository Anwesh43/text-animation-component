var h = window.innerHeight
class TypographyAnimationComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        const shadow = this.attachShadow({mode:'open'})
        this.text = this.getAttribute('text')
        shadow.appendChild(this.div)
    }
    render() {
        const canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        const canvasH = h/12
        context.font = context.font.replace(/\d{2}/,canvasH/3)
        const w = context.measureText(this.text).width
        canvas.width = w
        canvas.height = canvasH
        context = canvas.getContext('2d')
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
    }
}
