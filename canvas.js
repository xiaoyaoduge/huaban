function shape (copy,cobj,xp) {
    this.copy=copy;
    this.cobj=cobj;
    this.xp=xp;
    this.canvasW=copy.offsetWidth;
    this.canvasH=copy.offsetHeight;
    this.fillStyle="#000";
    this.strokeStyle="#000";
    this.type="line";
    this.style="stroke";
    this.history=[];
    this.lineWidth=1;
    this.flag=true;
    this.bianNum=5;
    this.jiaoNum=5;
    this.xpsize=20;
}
shape.prototype={
    init:function(){
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.fillStyle=this.fillStyle;
        this.cobj.type=this.type;
        this.cobj.lineWidth=this.lineWidth;
        this.xp.style.display="none";
        this.flag=true;
    },
    draw:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                that[that.type](startx,starty,movex,movey);
            };
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH))
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    arc:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var a=360/this.bianNum*Math.PI/180;
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(x+r*Math.cos(a*i),y+r*Math.sin(a*i))
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/3;
        var a=360/(this.jiaoNum*2)*Math.PI/180;
        for(var i=0;i<this.jiaoNum*2;i++){
            if(i%2==0){
                this.cobj.lineTo(x+r*Math.cos(a*i),y+r*Math.sin(a*i));
            }else{
                this.cobj.lineTo(x+r1*Math.cos(a*i),y+r1*Math.sin(a*i));
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    clear:function(){
        var that=this;
        that.copy.onmousemove=function(e){
            var movex= e.offsetX;
            var movey= e.offsetY;
            var lefts=movex-that.xpsize/2;
            var tops=movey-that.xpsize/2;
            if(lefts<0){
                lefts=0
            }
            if(lefts>that.canvasW-that.xpsize){
                lefts=that.canvasW-that.xpsize
            }
            if(tops<0){
                tops=0
            }
            if(tops>that.canvasH-that.xpsize){
                tops=that.canvasH-that.xpsize
            }
            that.xp.style.cssText="display:block;left:"+lefts+"px;top:"+tops+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
        };
        that.copy.onmousedown=function(){
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                var lefts=movex-that.xpsize/2;
                var tops=movey-that.xpsize/2;
                if(lefts<0){
                    lefts=0
                }
                if(lefts>that.canvasW-that.xpsize){
                    lefts=that.canvasW-that.xpsize
                }
                if(tops<0){
                    tops=0
                }
                if(tops>that.canvasH-that.xpsize){
                    tops=that.canvasH-that.xpsize
                }
                that.xp.style.cssText="display:block;left:"+lefts+"px;top:"+tops+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
                that.cobj.clearRect(lefts,tops,that.xpsize,that.xpsize)
            };
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH))
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear();
            }
        }
    },
    reset:function(){
        if(this.history.length==0){
            this.cobj.clearRect(0,0,this.canvasW,this.canvasH);
            setTimeout(function(){
                alert("没了");
            },60);
            return;
        }
        if(this.flag){
            if(this.history.length==1){
                this.history.pop();
                this.cobj.clearRect(0,0,this.canvasW,this.canvasH)
            }else{
                this.history.pop();
                this.cobj.putImageData(this.history.pop(),0,0)
            }
        }else{
            this.cobj.putImageData(this.history.pop(),0,0)
        }
        this.flag=false
    },
    pen:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty)
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.lineTo(movex,movey);
                that.cobj.stroke();
            };
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }

    }
};