(this.webpackJsonpamoeba=this.webpackJsonpamoeba||[]).push([[0],{16:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var a=n(2),i=n.n(a),r=n(11),o=n.n(r),c=(n(16),n(8)),u=n(9),l=n(7),s=n(3),h=n(4),f=n(1),d=n(6),y=n(5),g=n(0),v=function(e){var t=e.x,n=e.y,a=e.id,r=e.value,o=e.win,c=e.canPlayerMove,u=e.onClick,l=e.view,s=e.config,h=l.spaceSize;return Object(g.jsx)("button",{id:a,onClick:0===r&&!o&&c?u:function(){},className:"space",style:{position:"absolute",width:"".concat(h,"px"),height:"".concat(h,"px"),left:"".concat(t*h,"px"),top:"".concat(n*h,"px")},children:r>0&&i.a.createElement(s.playerIcons[r-1],{color:s.playerColors[r-1]})})},p=function(e){var t=e.chunkData,n=e.posX,a=e.posY,i=e.chunkX,r=e.chunkY,o=e.win,c=e.canPlayerMove,u=e.view,l=e.selectSquare,s=e.config,h=u.spaceSize;return Object(g.jsx)("div",{className:"chunk",style:{position:"absolute",width:"".concat(3*h,"px"),height:"".concat(3*h,"px"),left:"".concat(3*n*h,"px"),top:"".concat(3*a*h,"px")},children:t.map((function(e,t){return e.map((function(e,n){return Object(g.jsx)(v,{id:"".concat(t+3*i,"_").concat(n+3*r),value:e,x:t,y:n,onClick:function(){return l({detail:{x:3*i+t,y:3*r+n}})},win:o,canPlayerMove:c,view:u,config:s},"".concat(t+3*i,"_").concat(n+3*r))}))}))})},x=function(){function e(t,n,a,i){Object(s.a)(this,e),this.getValue=void 0,this.winLength=void 0,this.icon=void 0,this.pCount=void 0,this.getValue=t,this.winLength=n,this.icon=a,this.pCount=i}return Object(h.a)(e,[{key:"doTurn",value:function(e){throw new Error("Method not implemented.")}}]),e}();function w(e,t,n,a,i,r,o){for(var c=0,u=-1;r(e+u*a,t+u*i)===n;){for(var l=0,s=e+u*a,h=t+u*i;r(s,h)===n||s===e&&h===t;)l++,s+=a,h+=i;if(l<o)for(var f=l;f<=o;f++){var d=e+(u+f)*a,y=t+(u+f)*i;if(r(d,y)!==n&&0!==r(d,y)){l=0;break}}l>c&&(c=l),u--}return c}var m=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(h.a)(n,[{key:"doTurn",value:function(e){var t=this,n=0,a=0,i=[];if(e.forEach((function(e){for(var r=function(r){for(var o=function(o){if(0===r&&0===o)return"continue";if(0!==t.getValue(e.x+r,e.y+o))return"continue";var u=!1;if(i.forEach((function(t){t.x===e.x+r&&t.y===e.y+o&&(u=!0)})),u)return"continue";var l={x:e.x+r,y:e.y+o,att:Math.max(w(e.x+r,e.y+o,t.icon,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,-1,t.getValue,t.winLength)),def:Math.max.apply(Math,Object(c.a)(Array(t.pCount).fill(0).map((function(n,a){return Math.max(w(e.x+r,e.y+o,a+1,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,-1,t.getValue,t.winLength))})).filter((function(e,n){return n!==t.icon-1}))))};l.att>n&&(n=l.att),l.def>a&&(a=l.def),i.push(l)},u=-1;u<=1;u++)o(u)},o=-1;o<=1;o++)r(o)})),0===i.length)return{x:0,y:0};var r=0,o=0,u=i.filter((function(e){return e.att===n}));u.forEach((function(e){e.def>r&&(r=e.def)})),u=u.filter((function(e){return e.def===r}));var l=i.filter((function(e){return e.def===a}));return l.forEach((function(e){e.att>o&&(o=e.att)})),l=l.filter((function(e){return e.att===o})),n>=this.winLength?u[Math.floor(Math.random()*u.length)]:a>=this.winLength?l[Math.floor(Math.random()*l.length)]:n>=a?u[Math.floor(Math.random()*u.length)]:l[Math.floor(Math.random()*l.length)]}}]),n}(x),b=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(h.a)(n,[{key:"doTurn",value:function(e){var t=this,n=0,a=0,i=[];if(e.forEach((function(e){for(var r=function(r){for(var o=function(o){if(0===r&&0===o)return"continue";if(0!==t.getValue(e.x+r,e.y+o))return"continue";var u=!1;if(i.forEach((function(t){t.x===e.x+r&&t.y===e.y+o&&(u=!0)})),u)return"continue";var l={x:e.x+r,y:e.y+o,att:Math.max(w(e.x+r,e.y+o,t.icon,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,-1,t.getValue,t.winLength)),def:Math.max.apply(Math,Object(c.a)(Array(t.pCount).fill(0).map((function(n,a){return Math.max(w(e.x+r,e.y+o,a+1,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,-1,t.getValue,t.winLength))})).filter((function(e,n){return n!==t.icon-1}))))};l.att>n&&(n=l.att),l.def>a&&(a=l.def),i.push(l)},u=-1;u<=1;u++)o(u)},o=-1;o<=1;o++)r(o)})),0===i.length)return{x:0,y:0};var r=0,o=0,u=i.filter((function(e){return e.att===n}));u.forEach((function(e){e.def>r&&(r=e.def)})),u=u.filter((function(e){return e.def===r}));var l=i.filter((function(e){return e.def===a}));return l.forEach((function(e){e.att>o&&(o=e.att)})),l=l.filter((function(e){return e.att===o})),n-a>0?u[Math.floor(Math.random()*u.length)]:l[Math.floor(Math.random()*l.length)]}}]),n}(x),j=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(h.a)(n,[{key:"doTurn",value:function(e){var t=this,n=0,a=0,i=[];if(e.forEach((function(e){for(var r=function(r){for(var o=function(o){if(0===r&&0===o)return"continue";if(0!==t.getValue(e.x+r,e.y+o))return"continue";var u=!1;if(i.forEach((function(t){t.x===e.x+r&&t.y===e.y+o&&(u=!0)})),u)return"continue";var l={x:e.x+r,y:e.y+o,att:Math.max(w(e.x+r,e.y+o,t.icon,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,-1,t.getValue,t.winLength)),def:Math.max.apply(Math,Object(c.a)(Array(t.pCount).fill(0).map((function(n,a){return Math.max(w(e.x+r,e.y+o,a+1,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,-1,t.getValue,t.winLength))})).filter((function(e,n){return n!==t.icon-1}))))};l.att>n&&(n=l.att),l.def>a&&(a=l.def),i.push(l)},u=-1;u<=1;u++)o(u)},o=-1;o<=1;o++)r(o)})),0===i.length)return{x:0,y:0};var r=0,o=0,u=i.filter((function(e){return e.att===n}));u.forEach((function(e){e.def>r&&(r=e.def)})),u=u.filter((function(e){return e.def===r}));var l=i.filter((function(e){return e.def===a}));return l.forEach((function(e){e.att>o&&(o=e.att)})),l=l.filter((function(e){return e.att===o})),n-a>-1?u[Math.floor(Math.random()*u.length)]:l[Math.floor(Math.random()*l.length)]}}]),n}(x),L=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(h.a)(n,[{key:"doTurn",value:function(e){var t=this,n=0,a=0,i=[];if(e.forEach((function(e){for(var r=function(r){for(var o=function(o){if(0===r&&0===o)return"continue";if(0!==t.getValue(e.x+r,e.y+o))return"continue";var u=!1;if(i.forEach((function(t){t.x===e.x+r&&t.y===e.y+o&&(u=!0)})),u)return"continue";var l={x:e.x+r,y:e.y+o,att:Math.max(w(e.x+r,e.y+o,t.icon,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,t.icon,1,-1,t.getValue,t.winLength)),def:Math.max.apply(Math,Object(c.a)(Array(t.pCount).fill(0).map((function(n,a){return Math.max(w(e.x+r,e.y+o,a+1,1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,0,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,-1,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,0,-1,t.getValue,t.winLength),w(e.x+r,e.y+o,a+1,1,-1,t.getValue,t.winLength))})).filter((function(e,n){return n!==t.icon-1}))))};l.att>n&&(n=l.att),l.def>a&&(a=l.def),i.push(l)},u=-1;u<=1;u++)o(u)},o=-1;o<=1;o++)r(o)})),0===i.length)return{x:0,y:0};var r=0,o=0,u=i.filter((function(e){return e.att===n}));u.forEach((function(e){e.def>r&&(r=e.def)})),u=u.filter((function(e){return e.def===r}));var l=i.filter((function(e){return e.def===a}));return l.forEach((function(e){e.att>o&&(o=e.att)})),l=l.filter((function(e){return e.att===o})),n-a>1?u[Math.floor(Math.random()*u.length)]:l[Math.floor(Math.random()*l.length)]}}]),n}(x);function O(e,t){for(;e<0;)e+=t;return e%t}function V(e){return 1===e||0===e?e:V(e-2)+V(e-1)}var S=function(e){return Object(g.jsxs)("div",{id:"limit-dialog",children:["Turns Left: ",e.moveLimit]})},k=function(e){return Object(g.jsx)("div",{id:"score-dialog",children:Object(g.jsx)("table",{children:Object(g.jsx)("tbody",{children:e.playerScores.map((function(t,n){return Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{style:{width:"40px"},children:i.a.createElement(e.config.playerIcons[n],{color:e.config.playerColors[n]})}),Object(g.jsx)("td",{children:t})]},n)}))})})})},C=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(e){var a;Object(s.a)(this,n),(a=t.call(this,e)).boardRef=void 0,a.getValue=a.getValue.bind(Object(f.a)(a)),a.addChunk=a.addChunk.bind(Object(f.a)(a)),a.selectSquare=a.selectSquare.bind(Object(f.a)(a)),a.postMove=a.postMove.bind(Object(f.a)(a)),a.handleScroll=a.handleScroll.bind(Object(f.a)(a)),a.handleTouchStart=a.handleTouchStart.bind(Object(f.a)(a)),a.handleTouchMove=a.handleTouchMove.bind(Object(f.a)(a)),a.handleTouchEnd=a.handleTouchEnd.bind(Object(f.a)(a)),a.sharePoint=a.sharePoint.bind(Object(f.a)(a)),a.horizontalCount=a.horizontalCount.bind(Object(f.a)(a)),a.verticalCount=a.verticalCount.bind(Object(f.a)(a)),a.diagonalUp=a.diagonalUp.bind(Object(f.a)(a)),a.diagonalDown=a.diagonalDown.bind(Object(f.a)(a)),a.calculateLimitScore=a.calculateLimitScore.bind(Object(f.a)(a)),a.handleZoom=a.handleZoom.bind(Object(f.a)(a)),a.handleKeyDown=a.handleKeyDown.bind(Object(f.a)(a)),a.handleKeyUp=a.handleKeyUp.bind(Object(f.a)(a)),a.boardRef=i.a.createRef();for(var r=[],o=0;o<e.playerCount;o++)switch(e.params.get("p".concat(o+1))){case"fuzzy":r.push(new m(a.getValue,e.winLength,o+1,e.playerCount));break;case"elk":r.push(new b(a.getValue,e.winLength,o+1,e.playerCount));break;case"elkatt":r.push(new j(a.getValue,e.winLength,o+1,e.playerCount));break;case"elkdef":r.push(new L(a.getValue,e.winLength,o+1,e.playerCount));break;default:r.push(void 0)}return a.state={map:{},placements:[],turn:0,AIs:r,win:!1,view:{offsetX:0,offsetY:0,spaceSize:50},xLow:0,xHigh:0,yLow:0,yHigh:0,playerScores:Array(e.playerCount).fill(0),moveLimit:e.limit,isTouching:!1,touchStart:{x:0,y:0},touchOffset:{x:0,y:0},shiftScroll:!1,ctrlScroll:!1},a}return Object(h.a)(n,[{key:"sharePoint",value:function(e,t){for(var n=0;n<e.length;n++)for(var a=0;a<t.length;a++)if(e[n].x===t[a].x&&e[n].y===t[a].y)return!0;return!1}},{key:"horizontalCount",value:function(e,t,n){for(var a=[];this.getValue(e,t)===n;)a.push({x:e,y:t}),e++;return{ps:a,type:0}}},{key:"verticalCount",value:function(e,t,n){for(var a=[];this.getValue(e,t)===n;)a.push({x:e,y:t}),t++;return{ps:a,type:1}}},{key:"diagonalUp",value:function(e,t,n){for(var a=[];this.getValue(e,t)===n;)a.push({x:e,y:t}),t++,e++;return{ps:a,type:2}}},{key:"diagonalDown",value:function(e,t,n){for(var a=[];this.getValue(e,t)===n;)a.push({x:e,y:t}),t--,e++;return{ps:a,type:3}}},{key:"handleZoom",value:function(e){var t=this.state.view,n=t.offsetX,a=t.offsetY,i=t.spaceSize,r=Math.max(15,Math.min(160,i*e));this.setState({view:{offsetX:n*(r/i),offsetY:a*(r/i),spaceSize:r}})}},{key:"calculateLimitScore",value:function(){for(var e=this,t=this.props,n=t.playerCount,a=t.winLength,i=this.state.placements,r=[],o=0;o<n;o++)r.push([]);i.forEach((function(t){[e.horizontalCount(t.x,t.y,t.v),e.verticalCount(t.x,t.y,t.v),e.diagonalUp(t.x,t.y,t.v),e.diagonalDown(t.x,t.y,t.v)].forEach((function(n){if(!(n.ps.length<a)){var i=!1,o=[];r[t.v-1].forEach((function(t,a){t.type===n.type&&e.sharePoint(t.ps,n.ps)&&(t.ps.length<n.ps.length?o.push(a):i=!0)})),o.forEach((function(e){return r[t.v-1][e].old=!0})),i||r[t.v-1].push(n)}}))}));var c=[];return r.map((function(e){return e.filter((function(e){return void 0===e.old}))})),r.forEach((function(e){var t=0;e.forEach((function(e){t+=V(e.ps.length-a+2)})),c.push(t)})),c}},{key:"handleScroll",value:function(e){e.preventDefault();var t=this.state,n=t.shiftScroll,a=t.ctrlScroll,i=this.state.view,r=i.offsetX,o=i.offsetY,c=i.spaceSize;if(a)this.handleZoom(Math.exp(e.deltaY/200));else{var u=.25*e.deltaX,l=.25*e.deltaY;this.setState({view:{offsetX:r-(n?l:u),offsetY:o-(n?u:l),spaceSize:c}})}}},{key:"handleTouchMove",value:function(e){e.preventDefault();var t="undefined"===typeof e.originalEvent?e:e.originalEvent,n=t.touches[0]||t.changedTouches[0];this.setState({touchOffset:{x:n.pageX,y:n.pageY}})}},{key:"handleTouchStart",value:function(e){e.preventDefault();var t="undefined"===typeof e.originalEvent?e:e.originalEvent,n=t.touches[0]||t.changedTouches[0];this.setState({isTouching:!0,touchStart:{x:n.pageX,y:n.pageY},touchOffset:{x:n.pageX,y:n.pageY}})}},{key:"handleTouchEnd",value:function(e){e.preventDefault();var t="undefined"===typeof e.originalEvent?e:e.originalEvent,n=t.touches[0]||t.changedTouches[0],a=this.state,i=a.view,r=a.touchStart,o=a.touchOffset,c=i.offsetX,u=i.offsetY,l=i.spaceSize;this.setState({isTouching:!1,view:{offsetX:c+(o.x-r.x),offsetY:u+(o.y-r.y),spaceSize:l}},(function(){Math.pow(r.x-n.pageX,2)+Math.pow(r.y-n.pageY,2)<10&&void 0!==n.target.click&&n.target.click()}))}},{key:"handleKeyDown",value:function(e){switch(e.key){case"Shift":this.setState({shiftScroll:!0});break;case"Control":this.setState({ctrlScroll:!0})}}},{key:"handleKeyUp",value:function(e){switch(e.key){case"Shift":this.setState({shiftScroll:!1});break;case"Control":this.setState({ctrlScroll:!1})}}},{key:"componentDidMount",value:function(){var e,t=this;window.addEventListener("wheel",this.handleScroll,{passive:!1}),window.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),window.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),window.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),window.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1}),window.addEventListener("keydown",this.handleKeyDown,{passive:!1}),window.addEventListener("keyup",this.handleKeyUp,{passive:!1}),null===(e=this.boardRef.current)||void 0===e||e.addEventListener("selectSquare",this.selectSquare);for(var n=Object(l.a)({},this.state),a=-1;a<=1;a++)for(var i=-1;i<=1;i++)n=Object(l.a)(Object(l.a)({},n),this.addChunk(a,i,n));this.setState(Object(l.a)({},n),(function(){if(void 0!==t.state.AIs[t.state.turn]){var e,n=null===(e=t.state.AIs[t.state.turn])||void 0===e?void 0:e.doTurn(t.state.placements);setTimeout((function(){var e;return null===(e=t.boardRef.current)||void 0===e?void 0:e.dispatchEvent(new CustomEvent("selectSquare",{detail:{x:null===n||void 0===n?void 0:n.x,y:null===n||void 0===n?void 0:n.y}}))}),t.props.turnDelay)}}))}},{key:"getValue",value:function(e,t){var n=this.state.map[Math.floor(e/3)+"_"+Math.floor(t/3)];return void 0===n?0:n.chunkData[O(e,3)][O(t,3)]}},{key:"checkWin",value:function(e){var t=e.x,n=e.y,a=this.state.moveLimit,i=this.props,r=i.winLength;if(i.isLimited){var o=this.calculateLimitScore();return 0===a?{win:!0,playerScores:o}:{win:!1,playerScores:o}}var c=this.getValue(t,n);if(0===c)return{win:!1,playerScores:[]};for(var u=0;u<r;u++){for(var l=[],s=0;s<r;s++){var h=this.getValue(t-u+s,n);if(void 0===h)break;if(h!==c)break;l.push(t-u+s+"_"+n)}if(l.length===r)return l.forEach((function(e){var t;return null===(t=document.getElementById(e))||void 0===t?void 0:t.classList.add("win-square")})),{win:!0,playerScores:[]}}for(var f=0;f<r;f++){for(var d=[],y=0;y<r;y++){var g=this.getValue(t,n-f+y);if(void 0===g)break;if(g!==c)break;d.push(t+"_"+(n-f+y))}if(d.length===r)return d.forEach((function(e){var t;return null===(t=document.getElementById(e))||void 0===t?void 0:t.classList.add("win-square")})),{win:!0,playerScores:[]}}for(var v=0;v<r;v++){for(var p=[],x=0;x<r;x++){var w=this.getValue(t-v+x,n-v+x);if(void 0===w)break;if(w!==c)break;p.push(t-v+x+"_"+(n-v+x))}if(p.length===r)return p.forEach((function(e){var t;return null===(t=document.getElementById(e))||void 0===t?void 0:t.classList.add("win-square")})),{win:!0,playerScores:[]}}for(var m=0;m<r;m++){for(var b=[],j=0;j<r;j++){var L=this.getValue(t-m+j,n+m-j);if(void 0===L)break;if(L!==c)break;b.push(t-m+j+"_"+(n+m-j))}if(b.length===r)return b.forEach((function(e){var t;return null===(t=document.getElementById(e))||void 0===t?void 0:t.classList.add("win-square")})),{win:!0,playerScores:[]}}return{win:!1,playerScores:[]}}},{key:"postMove",value:function(e){var t=this,n=this.props,a=n.config,i=n.isLimited,r=n.playerCount,o=this.state,c=o.placements,u=o.turn,s=this.checkWin(e),h=s.win,f=s.playerScores,d=Object(l.a)(Object(l.a)({},this.state),{},{playerScores:f});if(h){var y=O(i?f.map((function(e,t){return{e:e,i:t}})).sort((function(e,t){return t.e-e.e}))[0].i:u-1,r);c.forEach((function(e){var n=document.getElementById(e.x+"_"+e.y);n.classList.add("amoeba-square");var i=[];"none"!==window.getComputedStyle(n).boxShadow&&i.push(window.getComputedStyle(n).boxShadow),0===t.getValue(e.x,e.y+1)&&i.push("".concat(a.playerColors[y]," 0rem 5rem")),0===t.getValue(e.x+1,e.y)&&0===t.getValue(e.x,e.y+1)&&0===t.getValue(e.x+1,e.y+1)&&i.push("".concat(a.playerColors[y]," 5rem 5rem")),0===t.getValue(e.x+1,e.y)&&i.push("".concat(a.playerColors[y]," 5rem 0rem")),0===t.getValue(e.x+1,e.y)&&0===t.getValue(e.x,e.y-1)&&0===t.getValue(e.x+1,e.y-1)&&i.push("".concat(a.playerColors[y]," 5rem -5rem")),0===t.getValue(e.x,e.y-1)&&i.push("".concat(a.playerColors[y]," 0rem -5rem")),0===t.getValue(e.x-1,e.y)&&0===t.getValue(e.x,e.y+1)&&0===t.getValue(e.x-1,e.y+1)&&i.push("".concat(a.playerColors[y]," -5rem 5rem")),0===t.getValue(e.x-1,e.y)&&i.push("".concat(a.playerColors[y]," -5rem 0rem")),0===t.getValue(e.x-1,e.y)&&0===t.getValue(e.x,e.y-1)&&0===t.getValue(e.x-1,e.y-1)&&i.push("".concat(a.playerColors[y]," -5rem -5rem")),n.style.boxShadow=i.join(", ")})),this.setState(Object(l.a)(Object(l.a)({},d),{},{win:!0}))}else{for(var g=Math.floor(e.x/3),v=Math.floor(e.y/3),p=-1;p<=1;p++)for(var x=-1;x<=1;x++)0===p&&0===x||(d=Object(l.a)(Object(l.a)({},d),this.addChunk(g+p,v+x,d)));this.setState(d,(function(){if(void 0!==t.state.AIs[t.state.turn]){var e,n=null===(e=t.state.AIs[t.state.turn])||void 0===e?void 0:e.doTurn(t.state.placements);setTimeout((function(){var e;return null===(e=t.boardRef.current)||void 0===e?void 0:e.dispatchEvent(new CustomEvent("selectSquare",{detail:{x:null===n||void 0===n?void 0:n.x,y:null===n||void 0===n?void 0:n.y}}))}),t.props.turnDelay)}}))}}},{key:"selectSquare",value:function(e){var t,n=this,a=e.detail,i=a.x,r=a.y;null===(t=document.getElementById(i+"_"+r))||void 0===t||t.classList.add("space-pressed");var o=this.state,s=o.map,h=o.turn,f=o.moveLimit,d=h+1,y=s[Math.floor(i/3)+"_"+Math.floor(r/3)];y.chunkData[O(i,3)][O(r,3)]=d,this.setState({map:Object(l.a)(Object(l.a)({},s),{},Object(u.a)({},Math.floor(i/3)+"_"+Math.floor(r/3),y)),placements:[].concat(Object(c.a)(this.state.placements),[{x:i,y:r,v:d}]),turn:(h+1)%this.props.playerCount,moveLimit:f-(h===this.props.playerCount-1?1:0)},(function(){n.postMove({x:i,y:r,v:d})}))}},{key:"addChunk",value:function(e,t,n){var a=n||this.state,i=a.map,r=a.xLow,o=a.yLow,c=a.xHigh,u=a.yHigh,l=a.view,s=l.offsetX,h=l.offsetY,f=l.spaceSize;if(void 0===i[e+"_"+t]){for(var d=[],y=0;y<3;y++){d[y]=[];for(var g=0;g<3;g++)d[y][g]=0}return i["".concat(e,"_").concat(t)]={x:e,y:t,chunkData:d},e<r&&(r=e,s-=3*f/2),t<o&&(o=t,h-=3*f/2),e>c&&(c=e,s+=3*f/2),t>u&&(u=t,h+=3*f/2),{map:i,xLow:r,yLow:o,xHigh:c,yHigh:u,view:{offsetX:s,offsetY:h,spaceSize:f}}}}},{key:"render",value:function(){var e=this,t=this.props,n=t.config,a=t.isLimited,i=t.playerCount,r=this.state,o=r.view,c=r.isTouching,u=r.touchOffset,l=r.touchStart,s=r.xLow,h=r.yLow,f=r.xHigh,d=r.yHigh,y=r.moveLimit,v=r.playerScores,x=r.win,w=r.turn,m=r.map,b=r.AIs,j=o.offsetX,L=o.offsetY,V=o.spaceSize,C=3*V*(f-s+1),M=3*V*(d-h+1);return Object(g.jsxs)("div",{id:"screen",children:[Object(g.jsx)("div",{id:"player-bar",style:{background:x?n.playerColors[O(a?v.map((function(e,t){return{e:e,i:t}})).sort((function(e,t){return t.e-e.e}))[0].i:w-1,i)]:n.playerColors[w]}}),Object(g.jsxs)("div",{id:"zoom-bar",children:[Object(g.jsx)("button",{id:"zoom-in",onClick:function(){return e.handleZoom(1.5)},children:"+"}),Object(g.jsx)("button",{id:"zoom-out",onClick:function(){return e.handleZoom(2/3)},children:"-"})]}),a&&Object(g.jsx)(S,{moveLimit:y}),a&&Object(g.jsx)(k,{playerScores:v,config:n}),Object(g.jsx)("button",{id:"reset-button",onClick:function(){return window.location.reload()},children:"Reset Game"}),Object(g.jsx)("div",{className:"board",ref:this.boardRef,children:Object(g.jsx)("div",{className:"chunk-container",style:{position:"absolute",width:"".concat(C,"px"),height:"".concat(M,"px"),marginTop:"".concat(-M/2+L+(c?u.y-l.y:0),"px"),marginLeft:"".concat(-C/2+j+(c?u.x-l.x:0),"px")},children:Object.values(m).map((function(t){return Object(g.jsx)(p,{config:n,posX:t.x-s,posY:t.y-h,chunkX:t.x,chunkY:t.y,chunkData:t.chunkData,selectSquare:e.selectSquare,win:x,canPlayerMove:void 0===b[w],view:o},t.x+"_"+t.y)}))})})]})}}]),n}(i.a.Component),M=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).handleColorChange=a.handleColorChange.bind(Object(f.a)(a)),a}return Object(h.a)(n,[{key:"handleColorChange",value:function(e,t){console.log({e:e,id:t})}},{key:"render",value:function(){var e=this,t=this.props,n=(t.isPlayer,t.id),a=(t.color,t.config),i=a.player_icons[n];return Object(g.jsxs)("div",{className:"menu-item",children:[Object(g.jsxs)("div",{className:"menu-item-name",children:["Player ",n+1]}),Object(g.jsx)("div",{className:"menu-item-icon",children:Object(g.jsx)(i,{color:a.player_colors[n]})}),Object(g.jsx)("div",{className:"menu-item-color",children:Object(g.jsx)("input",{type:"text",value:a.player_colors[n],onChange:function(t){return e.handleColorChange(t,n)}})})]})}}]),n}(i.a.Component),E=function(e){Object(d.a)(n,e);var t=Object(y.a)(n);function n(e){var a;Object(s.a)(this,n),a=t.call(this,e);for(var i=[],r=0;r<e.playerCount;r++)i.push({color:e.config.player_colors[r],isPlayer:!0});return a.state={players:i},a}return Object(h.a)(n,[{key:"render",value:function(){return Object(g.jsx)("div",{className:"menu",children:this.state.players.map((function(e,t){return Object(g.jsx)(M,{id:t,color:e.color,isPlayer:e.isPlayer})}))})}}]),n}(i.a.Component),T=function(e){return Object(g.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(g.jsx)("path",{fill:e.color,d:"M500,0C223.86,0,0,223.86,0,500s223.86,500,500,500,500-223.86,500-500S776.14,0,500,0Zm0,800c-165.69,0-300-134.31-300-300S334.31,200,500,200,800,334.31,800,500,665.69,800,500,800Z"})})},D=function(e){return Object(g.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(g.jsx)("polygon",{fill:e.color,points:"1000 858.58 641.42 500 1000 141.42 858.58 0 500 358.58 141.42 0 0 141.42 358.58 500 0 858.58 141.42 1000 500 641.42 858.58 1000 1000 858.58"})})},z=function(e){return Object(g.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(g.jsx)("path",{fill:e.color,d:"M500,0,0,500l500,500,500-500Zm0,717.16L282.84,500,500,282.84,717.16,500Z",transform:"translate(0 0)"})})},_=function(e){return Object(g.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(g.jsx)("path",{fill:e.color,d:"M0,0V1000H1000V0ZM800,800H200V200H800Z"})})};var I=function(e){var t=e.params,n=t.get("win")?parseInt(t.get("win"),10):5,a=t.get("count")?parseInt(t.get("count"),10):2,i=t.get("limit")?parseInt(t.get("limit"),10):0,r=t.get("delay")?parseInt(t.get("delay"),10):0;switch(window.location.pathname){default:return Object(g.jsx)(C,{config:{playerColors:["#5588ff","#ff3344","#33ff44","#ffcc33"],playerIcons:[T,D,z,_]},params:t,winLength:n,playerCount:a,limit:i,isLimited:i>0,turnDelay:r});case"/menu":return Object(g.jsx)(E,{params:t,winLength:n,playerCount:a,limit:i,isLimited:i>0,turnDelay:r})}},Y=function(e){e&&e instanceof Function&&n.e(5).then(n.bind(null,21)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,r=t.getLCP,o=t.getTTFB;n(e),a(e),i(e),r(e),o(e)}))},X=i.a.lazy((function(){return n.e(3).then(n.bind(null,22))})),P=i.a.lazy((function(){return n.e(4).then(n.bind(null,23))})),q=function(e){return Object(g.jsxs)(g.Fragment,{children:[Object(g.jsxs)(i.a.Suspense,{fallback:function(){return Object(g.jsx)("div",{})},children:["default"===e.theme&&Object(g.jsx)(X,{}),"win98"===e.theme&&Object(g.jsx)(P,{})]}),e.children]})},N=new URLSearchParams(window.location.search);o.a.render(Object(g.jsx)(i.a.StrictMode,{children:Object(g.jsx)(q,{theme:N.get("theme")||"default",children:Object(g.jsx)(I,{params:N})})}),document.getElementById("root")),Y()}},[[18,1,2]]]);
//# sourceMappingURL=main.34cce574.chunk.js.map