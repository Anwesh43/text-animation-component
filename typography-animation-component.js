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
        const w = 2*(context.measureText(this.text).width)
        canvas.width = w
        canvas.height = canvasH
        this.div.style.width = w
        this.div.style.height = h
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,canvasH/3)
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
    }
    class AnimatedTextWithCursor {
        constructor(text) {
            this.text = text
            this.index = 0
            this.dir = 0
        }
        draw(context,x,y) {
            var msg = ""
            for(var i=0;i<this.index;i++) {
                msg += this.text.charAt(i)
            }
            context.fillStyle = 'black'
            context.fillText(msg,x,y)
        }
        update() {
            if((this.index < this.text.length-1 && this.dir == 1) || (this.index>0 && this.dir == -1)) {
                if(this.index == this.text.length || this.index == 0) {
                    this.dir = 0
                }
            }
        }
        startUpdating() {
            if(this.dir == 0) {
                if(this.index == this.text.length) {
                    this.dir = -1
                }
                if(this.index == 0) {
                    this.dir = 1
                }
            }
        }
    }
}
