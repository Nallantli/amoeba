(this.webpackJsonpamoeba=this.webpackJsonpamoeba||[]).push([[0],{16:function(t,e,n){},18:function(t,e,n){"use strict";n.r(e);var a=n(2),i=n.n(a),r=n(11),o=n.n(r),c=(n(16),function(t){t&&t instanceof Function&&n.e(5).then(n.bind(null,21)).then((function(e){var n=e.getCLS,a=e.getFID,i=e.getFCP,r=e.getLCP,o=e.getTTFB;n(t),a(t),i(t),r(t),o(t)}))}),u=n(0),s=i.a.lazy((function(){return n.e(3).then(n.bind(null,22))})),l=i.a.lazy((function(){return n.e(4).then(n.bind(null,23))})),h=function(t){return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsxs)(i.a.Suspense,{fallback:function(){return Object(u.jsx)("div",{})},children:["default"===t.theme&&Object(u.jsx)(s,{}),"win98"===t.theme&&Object(u.jsx)(l,{})]}),t.children]})},f=n(7),d=n(1),y=n(3),p=n(4),v=n(6),x=n(5);var g=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(t){var a;return Object(y.a)(this,n),(a=e.call(this,t)).state=Object(d.a)(Object(d.a)({},t),{},{tab:"regular"}),a}return Object(p.a)(n,[{key:"render",value:function(){var t=this,e=this.state,n=e.winLength,a=e.limit,r=e.delay,o=e.AINames,c=e.iconConfig,s=e.tab,l=function(e){var n=Object(f.a)(t.state.AINames);n.splice(e,1),t.setState(Object(d.a)(Object(d.a)({},t.state),{},{AINames:n}))},h=function(e,n){var a=Object(f.a)(t.state.AINames);a[e]=n,t.setState(Object(d.a)(Object(d.a)({},t.state),{},{AINames:a}))},y=o.length>1;return Object(u.jsxs)("div",{id:"menu",children:[Object(u.jsxs)("div",{id:"tabs",children:[Object(u.jsx)("button",{className:"tablinks-".concat("regular"===s?"active":"inactive"),onClick:function(){return t.setState(Object(d.a)(Object(d.a)({},t.state),{},{tab:"regular"}))},children:"Regular Mode"}),Object(u.jsx)("button",{className:"tablinks-".concat("limit"===s?"active":"inactive"),onClick:function(){return t.setState(Object(d.a)(Object(d.a)({},t.state),{},{tab:"limit"}))},children:"Limit Mode"})]}),Object(u.jsx)("div",{id:"menu-options-".concat("regular"===s?"active":"inactive")}),Object(u.jsx)("div",{id:"menu-options-".concat("limit"===s?"active":"inactive"),children:Object(u.jsxs)("div",{id:"menu-limit",children:[Object(u.jsx)("span",{children:"Maximum Amount of Rounds:"}),Object(u.jsx)("input",{id:"input-limit",type:"text",defaultValue:a,onChange:function(e){t.setState(Object(d.a)(Object(d.a)({},t.state),{},{limit:parseInt(e.target.value,10)}))}})]})}),Object(u.jsxs)("div",{id:"menu-options",children:[Object(u.jsxs)("div",{id:"menu-winLength",children:[Object(u.jsx)("span",{children:"Length to Win or (Limit Mode) Gain Score:"}),Object(u.jsx)("input",{id:"input-winLength",type:"text",defaultValue:n,onChange:function(e){t.setState(Object(d.a)(Object(d.a)({},t.state),{},{winLength:parseInt(e.target.value,10)}))}})]}),Object(u.jsxs)("div",{id:"menu-delay",children:[Object(u.jsx)("span",{children:"Millisecond Delay Between Moves:"}),Object(u.jsx)("input",{id:"input-delay",type:"text",defaultValue:r,onChange:function(e){t.setState(Object(d.a)(Object(d.a)({},t.state),{},{delay:parseInt(e.target.value,10)}))}})]})]}),Object(u.jsx)("div",{id:"menu-players",children:o.map((function(t,e){return function(t){var e=t.AIName,n=t.index,a=t.iconConfig,r=t.removeItem,o=t.changeAI,c=t.canDelete;return Object(u.jsxs)("div",{className:"menu-playerItem",children:[Object(u.jsx)("div",{className:"menu-playerItem-icon",children:i.a.createElement(a.playerIcons[n],{color:a.playerColors[n]})}),Object(u.jsx)("div",{className:"menu-playerItem-body",children:Object(u.jsxs)("div",{className:"menu-playerItem-AISelect",children:[Object(u.jsx)("span",{children:"Type:"}),Object(u.jsxs)("select",{id:"p".concat(n+1),onChange:function(t){return o(n,t.target.value)},children:[Object(u.jsx)("option",{selected:"player"===e,value:"player",children:"No AI"}),Object(u.jsx)("option",{selected:"fuzzy"===e,value:"fuzzy",children:"fuzzy"}),Object(u.jsx)("option",{selected:"elk"===e,value:"elk",children:"elk"}),Object(u.jsx)("option",{selected:"elkatt"===e,value:"elkatt",children:"elkatt"}),Object(u.jsx)("option",{selected:"elkdef"===e,value:"elkdef",children:"elkdef"})]})]})}),c&&Object(u.jsx)("button",{className:"menu-playerItem-remove",onClick:function(){return r(n)},children:"X"})]})}({AIName:t,index:e,iconConfig:c,removeItem:l,changeAI:h,canDelete:y})}))}),o.length<4&&Object(u.jsx)("button",{id:"menu-addPlayer",onClick:function(){t.setState(Object(d.a)(Object(d.a)({},t.state),{},{AINames:[].concat(Object(f.a)(o),["player"])}))},children:"Add Player"}),Object(u.jsx)("button",{id:"play-game",onClick:function(){var t="win=".concat(n,"&count=").concat(o.length,"&delay=").concat(r);"limit"===s&&(t+="&limit=".concat(a));for(var e=0;e<o.length;e++)"player"!==o[e]&&(t+="&p".concat(e+1,"=").concat(o[e]));window.location.assign("https://nallantli.github.io/amoeba/?game=1&".concat(t))},children:"Play!"})]})}}]),n}(i.a.Component),m=n(8),b=function(t){var e=t.x,n=t.y,a=t.id,r=t.value,o=t.win,c=t.canPlayerMove,s=t.onClick,l=t.view,h=t.iconConfig,f=l.spaceSize;return Object(u.jsx)("button",{id:a,onClick:0===r&&!o&&c?s:function(){},className:"space",style:{position:"absolute",width:"".concat(f,"px"),height:"".concat(f,"px"),left:"".concat(e*f,"px"),top:"".concat(n*f,"px")},children:r>0&&i.a.createElement(h.playerIcons[r-1],{color:h.playerColors[r-1]})})},j=function(t){var e=t.chunkData,n=t.posX,a=t.posY,i=t.chunkX,r=t.chunkY,o=t.win,c=t.canPlayerMove,s=t.view,l=t.selectSquare,h=t.iconConfig,f=s.spaceSize;return Object(u.jsx)("div",{className:"chunk",style:{position:"absolute",width:"".concat(3*f,"px"),height:"".concat(3*f,"px"),left:"".concat(3*n*f,"px"),top:"".concat(3*a*f,"px")},children:e.map((function(t,e){return t.map((function(t,n){return Object(u.jsx)(b,{id:"".concat(e+3*i,"_").concat(n+3*r),value:t,x:e,y:n,onClick:function(){return l({detail:{x:3*i+e,y:3*r+n}})},win:o,canPlayerMove:c,view:s,iconConfig:h},"".concat(e+3*i,"_").concat(n+3*r))}))}))})},w=n(9);function O(t,e){for(;t<0;)t+=e;return t%e}function L(t){return 1===t||0===t?t:L(t-2)+L(t-1)}function k(t,e,n,a){for(var i=[];E(t,e,n)===a;)i.push({x:e,y:n}),e++;return{ps:i,type:0}}function S(t,e,n,a){for(var i=[];E(t,e,n)===a;)i.push({x:e,y:n}),n++;return{ps:i,type:1}}function M(t,e,n,a){for(var i=[];E(t,e,n)===a;)i.push({x:e,y:n}),n++,e++;return{ps:i,type:2}}function C(t,e,n,a){for(var i=[];E(t,e,n)===a;)i.push({x:e,y:n}),n--,e++;return{ps:i,type:3}}function E(t,e,n){var a=t.map[Math.floor(e/3)+"_"+Math.floor(n/3)];return void 0===a?0:a.chunkData[O(e,3)][O(n,3)]}function I(t){for(var e=t.playerCount,n=t.winLength,a=t.placements,i=[],r=0;r<e;r++)i.push([]);a.forEach((function(e){[k(t,e.x,e.y,e.v),S(t,e.x,e.y,e.v),M(t,e.x,e.y,e.v),C(t,e.x,e.y,e.v)].forEach((function(t){if(!(t.ps.length<n)){var a=!1,r=[];i[e.v-1].forEach((function(e,n){e.type===t.type&&function(t,e){for(var n=0;n<t.length;n++)for(var a=0;a<e.length;a++)if(t[n].x===e[a].x&&t[n].y===e[a].y)return!0;return!1}(e.ps,t.ps)&&(e.ps.length<t.ps.length?r.push(n):a=!0)})),r.forEach((function(t){return i[e.v-1][t].old=!0})),a||i[e.v-1].push(t)}}))}));var o=[];return i.map((function(t){return t.filter((function(t){return void 0===t.old}))})),i.forEach((function(t){var e=0;t.forEach((function(t){e+=L(t.ps.length-n+2)})),o.push(e)})),o}function T(t){if(0===t.placements.length)return!1;var e=t.placements[t.placements.length-1],n=e.x,a=e.y,i=t.winLength,r=t.isLimited,o=t.moveLimit;if(r)return 0===o;var c=E(t,n,a);if(0===c)return!1;for(var u=0;u<i;u++){for(var s=[],l=0;l<i;l++){var h=E(t,n-u+l,a);if(void 0===h)break;if(h!==c)break;s.push(n-u+l+"_"+a)}if(s.length===i)return s.forEach((function(t){var e;return null===(e=document.getElementById(t))||void 0===e?void 0:e.classList.add("win-square")})),!0}for(var f=0;f<i;f++){for(var d=[],y=0;y<i;y++){var p=E(t,n,a-f+y);if(void 0===p)break;if(p!==c)break;d.push(n+"_"+(a-f+y))}if(d.length===i)return d.forEach((function(t){var e;return null===(e=document.getElementById(t))||void 0===e?void 0:e.classList.add("win-square")})),!0}for(var v=0;v<i;v++){for(var x=[],g=0;g<i;g++){var m=E(t,n-v+g,a-v+g);if(void 0===m)break;if(m!==c)break;x.push(n-v+g+"_"+(a-v+g))}if(x.length===i)return x.forEach((function(t){var e;return null===(e=document.getElementById(t))||void 0===e?void 0:e.classList.add("win-square")})),!0}for(var b=0;b<i;b++){for(var j=[],w=0;w<i;w++){var O=E(t,n-b+w,a+b-w);if(void 0===O)break;if(O!==c)break;j.push(n-b+w+"_"+(a+b-w))}if(j.length===i)return j.forEach((function(t){var e;return null===(e=document.getElementById(t))||void 0===e?void 0:e.classList.add("win-square")})),!0}return!1}function N(t,e,n){var a=t.map;if(void 0!==a[e+"_"+n])return t;for(var i=[],r=0;r<3;r++){i[r]=[];for(var o=0;o<3;o++)i[r][o]=0}return Object(d.a)(Object(d.a)({},t),{},{map:Object(d.a)(Object(d.a)({},a),{},Object(w.a)({},"".concat(e,"_").concat(n),{x:e,y:n,chunkData:i}))})}function A(t,e,n){var a=t,i=a.turn,r=a.moveLimit,o=a.placements,c=a.playerCount,u=Math.floor(e/3),s=Math.floor(n/3),l=i+1,h=t.map[u+"_"+s];return void 0===h?A(N(t,u,s),e,n):(h.chunkData[O(e,3)][O(n,3)]=l,t=function(t,e,n){for(var a=e-1;a<=e+1;a++)for(var i=n-1;i<=n+1;i++)t=Object(d.a)(Object(d.a)({},t),N(t,a,i));return t}(t,u,s),Object(d.a)(Object(d.a)({},t),{},{map:Object(d.a)(Object(d.a)({},t.map),{},Object(w.a)({},u+"_"+s,h)),placements:[].concat(Object(f.a)(o),[{x:e,y:n,v:l}]),turn:(i+1)%c,moveLimit:r-(i===c-1?1:0)}))}var z=function(t){return Object(u.jsxs)("div",{id:"limit-dialog",children:["Turns Left: ",t.moveLimit]})},D=function(t){var e=t.playerScores,n=t.iconConfig;return Object(u.jsx)("div",{id:"score-dialog",children:Object(u.jsx)("table",{children:Object(u.jsx)("tbody",{children:e.map((function(t,e){return Object(u.jsxs)("tr",{children:[Object(u.jsx)("td",{style:{width:"40px"},children:i.a.createElement(n.playerIcons[e],{color:n.playerColors[e]})}),Object(u.jsx)("td",{children:t})]},e)}))})})})},X=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(t){var a;return Object(y.a)(this,n),(a=e.call(this,t)).boardRef=void 0,a.selectSquare=a.selectSquare.bind(Object(m.a)(a)),a.postMove=a.postMove.bind(Object(m.a)(a)),a.handleScroll=a.handleScroll.bind(Object(m.a)(a)),a.handleTouchStart=a.handleTouchStart.bind(Object(m.a)(a)),a.handleTouchMove=a.handleTouchMove.bind(Object(m.a)(a)),a.handleTouchEnd=a.handleTouchEnd.bind(Object(m.a)(a)),a.handleZoom=a.handleZoom.bind(Object(m.a)(a)),a.handleKeyDown=a.handleKeyDown.bind(Object(m.a)(a)),a.handleKeyUp=a.handleKeyUp.bind(Object(m.a)(a)),a.boardRef=i.a.createRef(),a.state={view:{offsetX:0,offsetY:0,spaceSize:50},xLow:0,xHigh:0,yLow:0,yHigh:0,isTouching:!1,touchStart:{x:0,y:0},touchOffset:{x:0,y:0},shiftScroll:!1,ctrlScroll:!1},a}return Object(p.a)(n,[{key:"handleZoom",value:function(t){var e=this.state.view,n=e.offsetX,a=e.offsetY,i=e.spaceSize,r=Math.max(15,Math.min(160,i*t));this.setState({view:{offsetX:n*(r/i),offsetY:a*(r/i),spaceSize:r}})}},{key:"handleScroll",value:function(t){t.preventDefault();var e=this.state,n=e.shiftScroll,a=e.ctrlScroll,i=this.state.view,r=i.offsetX,o=i.offsetY,c=i.spaceSize;if(a)this.handleZoom(Math.exp(t.deltaY/200));else{var u=.25*t.deltaX,s=.25*t.deltaY;this.setState({view:{offsetX:r-(n?s:u),offsetY:o-(n?u:s),spaceSize:c}})}}},{key:"handleTouchMove",value:function(t){t.preventDefault();var e="undefined"===typeof t.originalEvent?t:t.originalEvent,n=e.touches[0]||e.changedTouches[0];this.setState({touchOffset:{x:n.pageX,y:n.pageY}})}},{key:"handleTouchStart",value:function(t){t.preventDefault();var e="undefined"===typeof t.originalEvent?t:t.originalEvent,n=e.touches[0]||e.changedTouches[0];this.setState({isTouching:!0,touchStart:{x:n.pageX,y:n.pageY},touchOffset:{x:n.pageX,y:n.pageY}})}},{key:"handleTouchEnd",value:function(t){t.preventDefault();var e="undefined"===typeof t.originalEvent?t:t.originalEvent,n=e.touches[0]||e.changedTouches[0],a=this.state,i=a.view,r=a.touchStart,o=a.touchOffset,c=i.offsetX,u=i.offsetY,s=i.spaceSize;this.setState({isTouching:!1,view:{offsetX:c+(o.x-r.x),offsetY:u+(o.y-r.y),spaceSize:s}},(function(){Math.pow(r.x-n.pageX,2)+Math.pow(r.y-n.pageY,2)<10&&void 0!==n.target.click&&n.target.click()}))}},{key:"handleKeyDown",value:function(t){switch(t.key){case"Shift":this.setState({shiftScroll:!0});break;case"Control":this.setState({ctrlScroll:!0})}}},{key:"handleKeyUp",value:function(t){switch(t.key){case"Shift":this.setState({shiftScroll:!1});break;case"Control":this.setState({ctrlScroll:!1})}}},{key:"componentDidMount",value:function(){var t;window.addEventListener("wheel",this.handleScroll,{passive:!1}),window.addEventListener("touchstart",this.handleTouchStart,{passive:!1}),window.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),window.addEventListener("touchend",this.handleTouchEnd,{passive:!1}),window.addEventListener("touchcancel",this.handleTouchEnd,{passive:!1}),window.addEventListener("keydown",this.handleKeyDown,{passive:!1}),window.addEventListener("keyup",this.handleKeyUp,{passive:!1}),null===(t=this.boardRef.current)||void 0===t||t.addEventListener("selectSquare",this.selectSquare),this.props.doLocalTurn(this.props.gameState,this.boardRef,this.props.gameState.delay)}},{key:"postMove",value:function(t){var e=this.props.iconConfig,n=t.isLimited,a=t.playerCount,i=t.placements,r=t.turn;if(T(t)){var o=O(n?I(t).map((function(t,e){return{e:t,i:e}})).sort((function(t,e){return e.e-t.e}))[0].i:r-1,a);i.forEach((function(n){var a=document.getElementById(n.x+"_"+n.y);a.classList.add("amoeba-square");var i=[];"none"!==window.getComputedStyle(a).boxShadow&&i.push(window.getComputedStyle(a).boxShadow),0===E(t,n.x,n.y+1)&&i.push("".concat(e.playerColors[o]," 0rem 5rem")),0===E(t,n.x+1,n.y)&&0===E(t,n.x,n.y+1)&&0===E(t,n.x+1,n.y+1)&&i.push("".concat(e.playerColors[o]," 5rem 5rem")),0===E(t,n.x+1,n.y)&&i.push("".concat(e.playerColors[o]," 5rem 0rem")),0===E(t,n.x+1,n.y)&&0===E(t,n.x,n.y-1)&&0===E(t,n.x+1,n.y-1)&&i.push("".concat(e.playerColors[o]," 5rem -5rem")),0===E(t,n.x,n.y-1)&&i.push("".concat(e.playerColors[o]," 0rem -5rem")),0===E(t,n.x-1,n.y)&&0===E(t,n.x,n.y+1)&&0===E(t,n.x-1,n.y+1)&&i.push("".concat(e.playerColors[o]," -5rem 5rem")),0===E(t,n.x-1,n.y)&&i.push("".concat(e.playerColors[o]," -5rem 0rem")),0===E(t,n.x-1,n.y)&&0===E(t,n.x,n.y-1)&&0===E(t,n.x-1,n.y-1)&&i.push("".concat(e.playerColors[o]," -5rem -5rem")),a.style.boxShadow=i.join(", ")}))}else this.props.doLocalTurn(t,this.boardRef,t.delay)}},{key:"selectSquare",value:function(t){var e,n=this.props,a=n.broadcast,i=n.gameState,r=t.detail,o=r.x,c=r.y;null===(e=document.getElementById(o+"_"+c))||void 0===e||e.classList.add("space-pressed"),a(A(i,o,c),this.postMove)}},{key:"render",value:function(){var t=this,e=this.props,n=e.iconConfig,a=e.canMove,i=e.gameState,r=e.gameState,o=r.moveLimit,c=r.turn,s=r.map,l=r.isLimited,h=r.playerCount,f=this.state,d=f.view,y=f.view,p=y.offsetX,v=y.offsetY,x=y.spaceSize,g=f.isTouching,m=f.touchOffset,b=f.touchStart,w=f.xLow,L=f.yLow,k=f.xHigh,S=f.yHigh,M=3*x*(k-w+1),C=3*x*(S-L+1),E=l?I(i):[],N=T(i);return Object(u.jsxs)("div",{id:"screen",children:[Object(u.jsx)("div",{id:"player-bar",style:{background:N?n.playerColors[O(l?E.map((function(t,e){return{e:t,i:e}})).sort((function(t,e){return e.e-t.e}))[0].i:c-1,h)]:n.playerColors[c]}}),Object(u.jsxs)("div",{id:"zoom-bar",children:[Object(u.jsx)("button",{id:"zoom-in",onClick:function(){return t.handleZoom(1.5)},children:"+"}),Object(u.jsx)("button",{id:"zoom-out",onClick:function(){return t.handleZoom(2/3)},children:"-"})]}),l&&Object(u.jsx)(z,{moveLimit:o}),l&&Object(u.jsx)(D,{playerScores:E,iconConfig:n}),Object(u.jsx)("button",{id:"reset-button",onClick:function(){return window.location.reload()},children:"Reset Game"}),Object(u.jsx)("div",{className:"board",ref:this.boardRef,children:Object(u.jsx)("div",{className:"chunk-container",style:{position:"absolute",width:"".concat(M,"px"),height:"".concat(C,"px"),marginTop:"".concat(-C/2+v+(g?m.y-b.y:0),"px"),marginLeft:"".concat(-M/2+p+(g?m.x-b.x:0),"px")},children:Object.values(s).map((function(e){return Object(u.jsx)(j,{iconConfig:n,posX:e.x-w,posY:e.y-L,chunkX:e.x,chunkY:e.y,chunkData:e.chunkData,selectSquare:t.selectSquare,win:N,canPlayerMove:a,view:d},e.x+"_"+e.y)}))})})]})}}]),n}(i.a.Component),Y=function(){function t(e,n,a){Object(y.a)(this,t),this.winLength=void 0,this.icon=void 0,this.pCount=void 0,this.winLength=e,this.icon=n,this.pCount=a}return Object(p.a)(t,[{key:"doTurn",value:function(t){throw new Error("Method not implemented.")}}]),t}();function _(t,e,n,a,i,r,o,c){for(var u=0,s=-1;o(t,e+s*i,n+s*r)===a;){for(var l=0,h=e+s*i,f=n+s*r;o(t,h,f)===a||h===e&&f===n;)l++,h+=i,f+=r;if(l<c)for(var d=l;d<=c;d++){var y=e+(s+d)*i,p=n+(s+d)*r;if(o(t,y,p)!==a&&0!==o(t,y,p)){l=0;break}}l>u&&(u=l),s--}return u}var q=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(){return Object(y.a)(this,n),e.apply(this,arguments)}return Object(p.a)(n,[{key:"doTurn",value:function(t){var e=this,n=t.placements,a=0,i=0,r=[];if(n.forEach((function(n){for(var o=function(o){for(var c=function(c){if(0===o&&0===c)return"continue";if(0!==E(t,n.x+o,n.y+c))return"continue";var u=!1;if(r.forEach((function(t){t.x===n.x+o&&t.y===n.y+c&&(u=!0)})),u)return"continue";var s={x:n.x+o,y:n.y+c,att:Math.max(_(t,n.x+o,n.y+c,e.icon,1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,-1,E,e.winLength)),def:Math.max.apply(Math,Object(f.a)(Array(e.pCount).fill(0).map((function(a,i){return Math.max(_(t,n.x+o,n.y+c,i+1,1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,-1,E,e.winLength))})).filter((function(t,n){return n!==e.icon-1}))))};s.att>a&&(a=s.att),s.def>i&&(i=s.def),r.push(s)},u=-1;u<=1;u++)c(u)},c=-1;c<=1;c++)o(c)})),0===r.length)return{x:0,y:0};var o=0,c=0,u=r.filter((function(t){return t.att===a}));u.forEach((function(t){t.def>o&&(o=t.def)})),u=u.filter((function(t){return t.def===o}));var s=r.filter((function(t){return t.def===i}));return s.forEach((function(t){t.att>c&&(c=t.att)})),s=s.filter((function(t){return t.att===c})),a-i>0?u[Math.floor(Math.random()*u.length)]:s[Math.floor(Math.random()*s.length)]}}]),n}(Y),B=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(){return Object(y.a)(this,n),e.apply(this,arguments)}return Object(p.a)(n,[{key:"doTurn",value:function(t){var e=this,n=t.placements,a=0,i=0,r=[];if(n.forEach((function(n){for(var o=function(o){for(var c=function(c){if(0===o&&0===c)return"continue";if(0!==E(t,n.x+o,n.y+c))return"continue";var u=!1;if(r.forEach((function(t){t.x===n.x+o&&t.y===n.y+c&&(u=!0)})),u)return"continue";var s={x:n.x+o,y:n.y+c,att:Math.max(_(t,n.x+o,n.y+c,e.icon,1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,-1,E,e.winLength)),def:Math.max.apply(Math,Object(f.a)(Array(e.pCount).fill(0).map((function(a,i){return Math.max(_(t,n.x+o,n.y+c,i+1,1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,-1,E,e.winLength))})).filter((function(t,n){return n!==e.icon-1}))))};s.att>a&&(a=s.att),s.def>i&&(i=s.def),r.push(s)},u=-1;u<=1;u++)c(u)},c=-1;c<=1;c++)o(c)})),0===r.length)return{x:0,y:0};var o=0,c=0,u=r.filter((function(t){return t.att===a}));u.forEach((function(t){t.def>o&&(o=t.def)})),u=u.filter((function(t){return t.def===o}));var s=r.filter((function(t){return t.def===i}));return s.forEach((function(t){t.att>c&&(c=t.att)})),s=s.filter((function(t){return t.att===c})),a-i>-1?u[Math.floor(Math.random()*u.length)]:s[Math.floor(Math.random()*s.length)]}}]),n}(Y),Z=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(){return Object(y.a)(this,n),e.apply(this,arguments)}return Object(p.a)(n,[{key:"doTurn",value:function(t){var e=this,n=t.placements,a=0,i=0,r=[];if(n.forEach((function(n){for(var o=function(o){for(var c=function(c){if(0===o&&0===c)return"continue";if(0!==E(t,n.x+o,n.y+c))return"continue";var u=!1;if(r.forEach((function(t){t.x===n.x+o&&t.y===n.y+c&&(u=!0)})),u)return"continue";var s={x:n.x+o,y:n.y+c,att:Math.max(_(t,n.x+o,n.y+c,e.icon,1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,-1,E,e.winLength)),def:Math.max.apply(Math,Object(f.a)(Array(e.pCount).fill(0).map((function(a,i){return Math.max(_(t,n.x+o,n.y+c,i+1,1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,-1,E,e.winLength))})).filter((function(t,n){return n!==e.icon-1}))))};s.att>a&&(a=s.att),s.def>i&&(i=s.def),r.push(s)},u=-1;u<=1;u++)c(u)},c=-1;c<=1;c++)o(c)})),0===r.length)return{x:0,y:0};var o=0,c=0,u=r.filter((function(t){return t.att===a}));u.forEach((function(t){t.def>o&&(o=t.def)})),u=u.filter((function(t){return t.def===o}));var s=r.filter((function(t){return t.def===i}));return s.forEach((function(t){t.att>c&&(c=t.att)})),s=s.filter((function(t){return t.att===c})),a-i>1?u[Math.floor(Math.random()*u.length)]:s[Math.floor(Math.random()*s.length)]}}]),n}(Y),R=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(){return Object(y.a)(this,n),e.apply(this,arguments)}return Object(p.a)(n,[{key:"doTurn",value:function(t){var e=this,n=t.placements,a=0,i=0,r=[];if(n.forEach((function(n){for(var o=function(o){for(var c=function(c){if(0===o&&0===c)return"continue";if(0!==E(t,n.x+o,n.y+c))return"continue";var u=!1;if(r.forEach((function(t){t.x===n.x+o&&t.y===n.y+c&&(u=!0)})),u)return"continue";var s={x:n.x+o,y:n.y+c,att:Math.max(_(t,n.x+o,n.y+c,e.icon,1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,e.icon,1,-1,E,e.winLength)),def:Math.max.apply(Math,Object(f.a)(Array(e.pCount).fill(0).map((function(a,i){return Math.max(_(t,n.x+o,n.y+c,i+1,1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,0,E,e.winLength),_(t,n.x+o,n.y+c,i+1,-1,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,0,-1,E,e.winLength),_(t,n.x+o,n.y+c,i+1,1,-1,E,e.winLength))})).filter((function(t,n){return n!==e.icon-1}))))};s.att>a&&(a=s.att),s.def>i&&(i=s.def),r.push(s)},u=-1;u<=1;u++)c(u)},c=-1;c<=1;c++)o(c)})),0===r.length)return{x:0,y:0};var o=0,c=0,u=r.filter((function(t){return t.att===a}));u.forEach((function(t){t.def>o&&(o=t.def)})),u=u.filter((function(t){return t.def===o}));var s=r.filter((function(t){return t.def===i}));return s.forEach((function(t){t.att>c&&(c=t.att)})),s=s.filter((function(t){return t.att===c})),a>=this.winLength?u[Math.floor(Math.random()*u.length)]:i>=this.winLength?s[Math.floor(Math.random()*s.length)]:a>=i?u[Math.floor(Math.random()*u.length)]:s[Math.floor(Math.random()*s.length)]}}]),n}(Y);function P(t,e,n){if(void 0!==t.AIs[t.turn]){var a=t.AIs[t.turn].doTurn(t),i=a.x,r=a.y;setTimeout((function(){var t;return null===(t=e.current)||void 0===t?void 0:t.dispatchEvent(new CustomEvent("selectSquare",{detail:{x:i,y:r}}))}),n)}}for(var K=function(t){Object(v.a)(n,t);var e=Object(x.a)(n);function n(t){var a;Object(y.a)(this,n),a=e.call(this,t);for(var i=t.winLength,r=t.limit,o=t.AINames,c=t.delay,u=[],s=0;s<o.length;s++)switch(o[s]){case"fuzzy":u.push(new R(i,s+1,o.length));break;case"elk":u.push(new q(i,s+1,o.length));break;case"elkatt":u.push(new B(i,s+1,o.length));break;case"elkdef":u.push(new Z(i,s+1,o.length));break;default:u.push(void 0)}a.state={turn:0,placements:[],map:{},playerCount:o.length,moveLimit:r>0?r:0,winLength:i,isLimited:r>0,delay:c,AIs:u};for(var l=-1;l<=1;l++)for(var h=-1;h<=1;h++)a.state=Object(d.a)(Object(d.a)({},a.state),N(a.state,l,h));return a}return Object(p.a)(n,[{key:"render",value:function(){var t=this,e=this.props.iconConfig,n=this.state.AIs;return Object(u.jsx)(X,{iconConfig:e,gameState:this.state,broadcast:function(e,n){t.setState(e),n(e)},doLocalTurn:P,canMove:void 0===n[this.state.turn]})}}]),n}(i.a.Component),H=new URLSearchParams(window.location.search),V=H.get("game"),F=H.get("win")?parseInt(H.get("win"),10):5,U=H.get("count")?parseInt(H.get("count"),10):2,G=H.get("limit")?parseInt(H.get("limit"),10):0,J=H.get("delay")?parseInt(H.get("delay"),10):200,W=[],Q=0;Q<U;Q++)W.push(H.get("p".concat(Q+1))||"player");var $={playerColors:["#5588ff","#ff3344","#33ff44","#ffcc33"],playerIcons:[function(t){return Object(u.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(u.jsx)("path",{fill:t.color,d:"M500,0C223.86,0,0,223.86,0,500s223.86,500,500,500,500-223.86,500-500S776.14,0,500,0Zm0,800c-165.69,0-300-134.31-300-300S334.31,200,500,200,800,334.31,800,500,665.69,800,500,800Z"})})},function(t){return Object(u.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(u.jsx)("polygon",{fill:t.color,points:"1000 858.58 641.42 500 1000 141.42 858.58 0 500 358.58 141.42 0 0 141.42 358.58 500 0 858.58 141.42 1000 500 641.42 858.58 1000 1000 858.58"})})},function(t){return Object(u.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(u.jsx)("path",{fill:t.color,d:"M500,0,0,500l500,500,500-500Zm0,717.16L282.84,500,500,282.84,717.16,500Z",transform:"translate(0 0)"})})},function(t){return Object(u.jsx)("svg",{className:"player-icon",id:"Layer_1","data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1000 1000",children:Object(u.jsx)("path",{fill:t.color,d:"M0,0V1000H1000V0ZM800,800H200V200H800Z"})})}]};o.a.render(Object(u.jsx)(i.a.StrictMode,{children:Object(u.jsx)(h,{theme:H.get("theme")||"default",children:V?Object(u.jsx)(K,{winLength:F,limit:G,delay:J,AINames:W,iconConfig:$}):Object(u.jsx)(g,{winLength:F,limit:G,delay:J,AINames:W,iconConfig:$})})}),document.getElementById("root")),c()}},[[18,1,2]]]);
//# sourceMappingURL=main.37fab14f.chunk.js.map