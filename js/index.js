!function(e){var t={};function r(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(s,i,function(t){return e[t]}.bind(null,i));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";const s=new(r(1).Game);!function(){let e=document.getElementById("warning");e.parentNode.removeChild(e),s.setUpGame(document.getElementById("game-area")),document.getElementById("reset").addEventListener("click",(function(){return s.resetGame()})),document.getElementById("undo").addEventListener("click",(function(){return s.undoLastMove()}))}()},function(e,t,r){"use strict";r.r(t),r.d(t,"Game",(function(){return n}));class s{constructor(e){this.colors={2:"#eee4da",4:"#ede0c8",8:"#f2b179",16:"#f59563",32:"#f67c5f",64:"#f65e3b",128:"#edcf72",256:"#edcc61",512:"#edc850",1024:"#edc53f",2048:"#edc53f"},this.value=e,this.color=this.colors[this.value]}merge(){return this.value*=2,this.color=this.colors[this.value],2048==this.value}toString(){return this.value.toString()}}class i{constructor(e){this.chance=.1,this.area=e,this.resizeArea(),this.size=0,this.board=[],this.previousState=null,window.addEventListener("resize",()=>this.resizeArea())}setBoard(e){this.size=e.length;for(let t=0;t<this.size;++t){this.board[t]=[];for(let r=0;r<e[t].length;++r)e[t][r]?this.board[t][r]=new s(e[t][r].value):this.board[t][r]=null}this.drawBoard()}resizeArea(){let e=window.innerWidth,t=window.innerHeight;e>t?(t=Math.round(.9*t),e=t):(e=Math.round(.9*e),t=e),this.width=e,this.height=t;let r=this.area.getContext("2d");r.canvas.width=e,r.canvas.height=t,this.drawBoard()}setUp(e){this.size=e,this.board=new Array(this.size);for(let e=0;e<this.size;++e)this.board[e]=new Array(this.size),this.board[e].fill(null);this.checkBoard(!0),this.checkBoard(!0),this.drawBoard()}undoLastMove(){this.previousState&&(this.board=this.copy2DArray(this.previousState),this.previousState=null,this.drawBoard())}copy2DArray(e){let t=[];for(let r=0;r<e.length;++r){t[r]=[];for(let i=0;i<e[r].length;++i)e[r][i]?t[r][i]=new s(e[r][i].value):t[r][i]=null}return t}moveTiles(e){this.previousState=this.copy2DArray(this.board);let t=this.getMovableArray(e),r=!1;for(let e=0;e<t.length;++e){let s=this.cleanUpLine(t[e]);this.compareArrays(s,t[e])||(t[e]=s,r=!0)}this.applyMovedArray(t,e),this.checkBoard(r),this.drawBoard()}drawBoard(){let e=Math.round(this.width/(this.size+1)),t=Math.round(e/(this.size+1)),r=this.area.getContext("2d");r.clearRect(0,0,r.canvas.width,r.canvas.height);let s=t,i=t;for(let o=0;o<this.size;++o){for(let a=0;a<this.size;++a){if(this.board[o][a]){r.fillStyle=this.board[o][a].color,r.fillRect(s,i,e,e),r.font="80px Arial",r.textAlign="center",r.fillStyle="black",r.textBaseline="middle";let t=s+Math.round(e/2),n=i+Math.round(e/2)+10;r.fillText(this.board[o][a].value,t,n)}else r.fillStyle="rgba(238, 228, 218, 0.35)",r.fillRect(s,i,e,e);s+=e+t}s=t,i+=e+t}}dispatchVictory(){this.area.dispatchEvent(new Event("victory"))}spawnTile(e){let t=Math.round(Math.random()*(e.length-1)),r=e[t][0],i=e[t][1],o=2;Math.random()<this.chance&&(o=4),this.board[r][i]=new s(o)}checkBoard(e){let t=[];for(let e=0;e<this.board.length;++e)for(let r=0;r<this.board.length;++r)null==this.board[e][r]&&t.push([e,r]);if(t.length>0&&e)this.spawnTile(t);else if(0==t.length){let e=!1;for(let t=0;t<this.size-1;++t)for(let r=0;r<this.size-1;++r)this.board[t][r].value==this.board[t+1][r].value&&(e=!0),this.board[t][r].value==this.board[t][r+1].value&&(e=!0);e||this.area.dispatchEvent(new Event("gameOver"))}}compareArrays(e,t){let r=!0;for(let s=0;s<e.length;s++)e[s]!=t[s]&&(r=!1);return r}cleanUpLine(e){let t=this.shiftLine(e);for(let e=0;e<t.length-1;++e)if(null!=t[e]&&null!=t[e+1]&&t[e].value==t[e+1].value){t[e].merge()&&this.dispatchVictory(),this.area.dispatchEvent(new CustomEvent("scoreUp",{detail:{value:t[e].value}})),t[e+1]=null}return t=this.shiftLine(t),t}shiftLine(e){let t=e.filter(e=>null!=e);for(let r=t.length;r<e.length;++r)t.push(null);return t}getMovableArray(e){let t=[];switch(e){case"left":this.board.forEach(e=>t.push(e));break;case"right":this.board.forEach(e=>t.push(e.reverse()));break;case"up":for(let e=0;e<this.size;++e){t[e]=[];for(let r=0;r<this.size;++r)t[e].push(this.board[r][e])}break;case"down":for(let e=0;e<this.size;++e){t[e]=[];for(let r=this.size-1;r>=0;--r)t[e].push(this.board[r][e])}}return t}applyMovedArray(e,t){switch(t){case"left":for(let t=0;t<e.length;++t)this.board[t]=e[t];break;case"right":for(let t=0;t<e.length;++t)this.board[t]=e[t].reverse();break;case"up":for(let t=0;t<e.length;++t){let r=[];for(let s=0;s<e.length;++s)r.push(e[s][t]);this.board[t]=r}break;case"down":for(let t=0;t<e.length;++t){let r=[];for(let s=0;s<e.length;++s)r.push(e[s][t]);this.board[t]=r}this.board.reverse()}}}class o{constructor(e){this.keyCodes={ArrowLeft:"left",ArrowUp:"up",ArrowRight:"right",ArrowDown:"down",a:"left",w:"up",d:"right",s:"down"},this.touchX=0,this.touchY=0,this.tolerance=50,this.targetElement=e,this.enableController()}enableController(){document.addEventListener("keydown",e=>this.handleKeydown(e)),this.targetElement.addEventListener("touchstart",e=>this.handleTouchStart(e)),this.targetElement.addEventListener("touchend",e=>this.handleTouchEnd(e))}disableController(){document.removeEventListener("keydown",e=>this.handleKeydown(e)),this.targetElement.removeEventListener("touchstart",e=>this.handleTouchStart(e)),this.targetElement.removeEventListener("touchend",e=>this.handleTouchEnd(e))}handleKeydown(e){if(Object.keys(this.keyCodes).indexOf(e.key)>-1){let t=new CustomEvent("moveGameBoard",{detail:{direction:this.keyCodes[e.key]}});this.targetElement.dispatchEvent(t),e.key.includes("Arrow")&&e.preventDefault()}}handleTouchStart(e){e.preventDefault(),this.touchX=Math.round(e.touches[0].screenX),this.touchY=Math.round(e.touches[0].screenY)}handleTouchEnd(e){let t=Math.round(e.changedTouches[0].screenX),r=Math.round(e.changedTouches[0].screenY),s="";if(Math.abs(r-this.touchY)>this.tolerance?s=r>this.touchY?"down":"up":Math.abs(t-this.touchX)>this.tolerance&&(s=t>this.touchX?"right":"left"),""!==s){let e=new CustomEvent("moveGameBoard",{detail:{direction:s}});this.targetElement.dispatchEvent(e)}}}class a{constructor(){this.isUsable=this.checkAvailability()}checkAvailability(){let e,t="__storage_test__";try{localStorage.setItem(t,t),localStorage.removeItem(t),e=!0}catch(t){e=!1}return e}storeBoard(e,t){if(this.isUsable){let r={score:t,board:e};localStorage.setItem("board",JSON.stringify(r))}}loadBoard(){let e=null;if(this.isUsable){let t=localStorage.getItem("board");e=JSON.parse(t)}return e}}class n{constructor(){this.score=0,this.lastValue=0,this.size=4,this.saveTimeout=null,this.storage=new a}setUpGame(e){this.setUpController(e),this.playArea=new i(e);let t=this.storage.loadBoard();t?(this.score=t.score,this.size=t.board.length,this.playArea.setBoard(t.board)):this.playArea.setUp(this.size),document.getElementById("score").innerText=this.score,e.addEventListener("gameOver",()=>this.gameOver()),e.addEventListener("victory",()=>this.victory()),e.addEventListener("scoreUp",e=>this.updateScore(e.detail.value))}setUpController(e){this.controller=new o(e),e.addEventListener("moveGameBoard",e=>this.playArea.moveTiles(e.detail.direction))}updateScore(e){this.lastValue=e,this.score+=e,document.getElementById("score").innerText=this.score,this.saveTimeout&&(clearTimeout(this.saveTimeout),this.saveTimeout=null),this.saveTimeout=setTimeout(()=>this.storage.storeBoard(this.playArea.board,this.score),2e3)}resetGame(){this.score=0,this.controller.enableController(),this.playArea.setUp(this.size)}setSize(e){this.size=e,this.resetGame()}undoLastMove(){this.score-=this.lastValue,this.lastValue=0,this.playArea.undoLastMove(),document.getElementById("score").innerText=this.score}gameOver(){this.controller.disableController(),console.log("Game over")}victory(){console.log("Victory")}}}]);