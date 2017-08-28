var h = window.innerHeight
class TypographyAnimationComponent extends HTMLElement {
    constructor() {
        super()
        this.div = document.createElement('div')
        const shadow = this.attachShadow({mode:'open'})
        this.text = this.getAttribute('text')
        shadow.appendChild(this.div)
    }
    update() {
        if(this.animatedTextWithCursor) {
            this.animatedTextWithCursor.update()
        }
    }
    startUpdating() {
        if(this.animatedTextWithCursor) {
            this.animatedTextWithCursor.startUpdating()
        }
    }
    blinkCursor() {
        if(this.animatedTextWithCursor) {
            this.animatedTextWithCursor.blinkCursor()
        }
    }
    stopped() {
        return this.animatedTextWithCursor && this.animatedTextWithCursor.stopped()
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
        if(!this.animatedTextWithCursor) {
            this.animatedTextWithCursor = new AnimatedTextWithCursor(this.text)
        }
        this.animatedTextWithCursor.draw(context,w/4,canvasH/2)
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,canvasH/3)
        this.div.style.background = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
        CursorBlinker.startBlinking(this)
    }
}
class AnimatedTextWithCursor {
    constructor(text) {
        this.text = text
        this.index = 0
        this.dir = 0
    }
    draw(context,x,y,fontSize) {
        var msg = ""
        for(var i=0;i<this.index;i++) {
            msg += this.text.charAt(i)
        }
        if(!this.cursor) {
            this.cursor = new Cursor(x,y-fontSize/2,fontSize)
        }
        this.cursor.x = context.measureText(msg).width
        context.fillStyle = 'black'
        context.fillText(msg,x,y)
        this.cursor.draw(context)
    }
    update() {
        if((this.index < this.text.length-1 && this.dir == 1) || (this.index>0 && this.dir == -1)) {
            if(this.index == this.text.length || this.index == 0) {
                this.dir = 0
            }
        }
    }
    blinkCursor() {
        if(this.cursor) {
            this.cursor.blink()
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
    stopped() {
        return this.dir == 0
    }
}
class Cursor {
    constructor(x,y,h) {
        this.x = x
        this.y = y
        this.h = h
        this.i = 0
    }
    draw(context) {
        context.strokeStyle = 'black'
        context.strokeWidth = 10
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.moveTo(0,-this.h/2)
        context.lineTo(0,this.h/2)
        if(this.i % 2 == 0) {
            context.stroke()
        }
        context.restore()
    }
    blink() {
        this.i++
        console.log(this.i)
    }
}
class CursorBlinker {
    static startBlinking(component) {
        var worker = new Worker("cursor-blinker-worker.js")
        worker.onmessage = () =>{
            component.render()
            component.blinkCursor()
        }
    }
}
class TextAnimator  {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimating() {
        if(!this.animated) {
            this.animated = true
            this.component.startUpdating()
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped()) {
                    clearInterval(interval)
                    this.animated = false
                }
            },50)
        }
    }
}
customElements.define('type-text-comp',TypographyAnimationComponent)
