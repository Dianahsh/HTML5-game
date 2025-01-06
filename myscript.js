var myGamePiece=[];

function startGame() {
    myGameArea.start();
    myGamePiece[0] = new component(250, 206, "head.svg", 500, 200, 0); //type0 -> head
    for(i=1;i<10;i++){
        myGamePiece[i] = new component(100, 75, "body.svg", 500+i*80, 200, i);
    }
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);    
        this.interval = setInterval(updateGameArea, 200);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var state = { //mouse
    x: 0,
    y: 0,
}

function component(width, height, kind, x, y, type) {
    this.image = new Image();
    this.image.src = kind;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 70;
    this.angle = 0;
    this.type = type;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image,this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function(){
        var dx=0, dy=0;
        var maxDistance = 0;
        var damping = 9 * this.speed / 30;
        if(this.type == 0){
            this.angle = Math.atan2(state.y-this.y, state.x-this.x);
            dx = state.x;
            dy = state.y;
        }
        else {
            if(this.type == 1)
                maxDistance = 1.2*Math.max(myGamePiece[this.type-1].width/2, myGamePiece[this.type-1].height/2);
            else
                maxDistance = 2*Math.max(myGamePiece[this.type-1].width/2, myGamePiece[this.type-1].height/2);
            dx = myGamePiece[this.type-1].x;
            dy = myGamePiece[this.type-1].y;
            this.angle = Math.atan2(dy-this.y, dx - this.x);
        }
        var dd = Math.hypot(dx-this.x, dy-this.y);
        var direction = (dd < maxDistance ? -1 : 1);
        if (dd > maxDistance && this.type!=0) { //body a=0
            this.x += Math.cos(this.angle) * (dd - maxDistance);
            this.y += Math.sin(this.angle) * (dd - maxDistance);
            dd = maxDistance;
        }
        if (dd - maxDistance < 0.5) {
            return;
        }
        //head has a=dd/damping
        this.x += direction * Math.cos(this.angle) * dd / damping;
        this.y += direction * Math.sin(this.angle) * dd / damping;
    }
}

function updateGameArea() {
    myGameArea.clear();
    for(i=0;i<10;i++){
        myGamePiece[i].newPos();
        myGamePiece[i].update();
    }
}

window.addEventListener('mousemove', (event) => {
    state.x = event.clientX;
    state.y = event.clientY;
});
