!function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=7)}([function(e,t,n){e.exports=n(3)},function(e,t){function c(e,t,n,r,o,a,i){try{var s=e[a](i),c=s.value}catch(e){return void n(e)}s.done?t(c):Promise.resolve(c).then(r,o)}e.exports=function(s){return function(){var e=this,i=arguments;return new Promise(function(t,n){var r=s.apply(e,i);function o(e){c(r,t,n,o,a,"next",e)}function a(e){c(r,t,n,o,a,"throw",e)}o(void 0)})}}},function(e,t,n){var r=n(4),o=n(5),a=n(6);e.exports=function(e,t){return r(e)||o(e,t)||a()}},function(e,t,n){var r=function(a){"use strict";var e=Object.prototype,l=e.hasOwnProperty,t="function"==typeof Symbol?Symbol:{},o=t.iterator||"@@iterator",n=t.asyncIterator||"@@asyncIterator",r=t.toStringTag||"@@toStringTag";function i(e,t,n,r){var a,i,s,c,o=t&&t.prototype instanceof h?t:h,l=Object.create(o.prototype),u=new L(r||[]);return l._invoke=(a=e,i=n,s=u,c="suspendedStart",function(e,t){if("executing"===c)throw new Error("Generator is already running");if("completed"===c){if("throw"===e)throw t;return I()}for(s.method=e,s.arg=t;;){var n=s.delegate;if(n){var r=y(n,s);if(r){if(r===p)continue;return r}}if("next"===s.method)s.sent=s._sent=s.arg;else if("throw"===s.method){if("suspendedStart"===c)throw c="completed",s.arg;s.dispatchException(s.arg)}else"return"===s.method&&s.abrupt("return",s.arg);c="executing";var o=d(a,i,s);if("normal"===o.type){if(c=s.done?"completed":"suspendedYield",o.arg===p)continue;return{value:o.arg,done:s.done}}"throw"===o.type&&(c="completed",s.method="throw",s.arg=o.arg)}}),l}function d(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}a.wrap=i;var p={};function h(){}function s(){}function c(){}var u={};u[o]=function(){return this};var f=Object.getPrototypeOf,v=f&&f(f(E([])));v&&v!==e&&l.call(v,o)&&(u=v);var g=c.prototype=h.prototype=Object.create(u);function b(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function m(c){var t;this._invoke=function(n,r){function e(){return new Promise(function(e,t){!function t(e,n,r,o){var a=d(c[e],c,n);if("throw"!==a.type){var i=a.arg,s=i.value;return s&&"object"==typeof s&&l.call(s,"__await")?Promise.resolve(s.__await).then(function(e){t("next",e,r,o)},function(e){t("throw",e,r,o)}):Promise.resolve(s).then(function(e){i.value=e,r(i)},function(e){return t("throw",e,r,o)})}o(a.arg)}(n,r,e,t)})}return t=t?t.then(e,e):e()}}function y(e,t){var n=e.iterator[t.method];if(void 0===n){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,y(e,t),"throw"===t.method))return p;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var r=d(n,e.iterator,t.arg);if("throw"===r.type)return t.method="throw",t.arg=r.arg,t.delegate=null,p;var o=r.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,p):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,p)}function x(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function w(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(x,this),this.reset(!0)}function E(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,r=function e(){for(;++n<t.length;)if(l.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return r.next=r}}return{next:I}}function I(){return{value:void 0,done:!0}}return s.prototype=g.constructor=c,c.constructor=s,c[r]=s.displayName="GeneratorFunction",a.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===s||"GeneratorFunction"===(t.displayName||t.name))},a.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,c):(e.__proto__=c,r in e||(e[r]="GeneratorFunction")),e.prototype=Object.create(g),e},a.awrap=function(e){return{__await:e}},b(m.prototype),m.prototype[n]=function(){return this},a.AsyncIterator=m,a.async=function(e,t,n,r){var o=new m(i(e,t,n,r));return a.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},b(g),g[r]="Generator",g[o]=function(){return this},g.toString=function(){return"[object Generator]"},a.keys=function(n){var r=[];for(var e in n)r.push(e);return r.reverse(),function e(){for(;r.length;){var t=r.pop();if(t in n)return e.value=t,e.done=!1,e}return e.done=!0,e}},a.values=E,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(w),!e)for(var t in this)"t"===t.charAt(0)&&l.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(n){if(this.done)throw n;var r=this;function e(e,t){return a.type="throw",a.arg=n,r.next=e,t&&(r.method="next",r.arg=void 0),!!t}for(var t=this.tryEntries.length-1;0<=t;--t){var o=this.tryEntries[t],a=o.completion;if("root"===o.tryLoc)return e("end");if(o.tryLoc<=this.prev){var i=l.call(o,"catchLoc"),s=l.call(o,"finallyLoc");if(i&&s){if(this.prev<o.catchLoc)return e(o.catchLoc,!0);if(this.prev<o.finallyLoc)return e(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return e(o.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return e(o.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;0<=n;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&l.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=e,a.arg=t,o?(this.method="next",this.next=o.finallyLoc,p):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),p},finish:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),w(n),p}},catch:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;w(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:E(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=void 0),p}},a}(e.exports);try{regeneratorRuntime=r}catch(e){Function("r","regeneratorRuntime = r")(r)}},function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw a}}return n}}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}},function(e,t,n){"use strict";n.r(t);var r=n(0),s=n.n(r),o=n(1),a=n.n(o);function i(e){M.isLoggedIn=!0,A.loginWrapper.setAttribute("style","display: none;"),A.onboardingFlow.setAttribute("style","display: flex;")}function c(e){e.changedTouches?M.swipeX=e.changedTouches[0].clientX:M.swipeX=e.clientX}function l(e){if(M.swipeX||0===M.swipeX){var t=null;e.changedTouches?t=e.changedTouches[0].clientX-M.swipeX:(e.clientX,M.swipeX);var n=Math.sign(t);0<n&&0!==M.currentOnboardingScreen?(A.onboardingScreenArr[M.currentOnboardingScreen-1].setAttribute("style","transform: translateX(0px);"),M.currentOnboardingScreen--):n<0&&M.currentOnboardingScreen!==A.onboardingScreenArr.length-1&&(A.onboardingScreenArr[M.currentOnboardingScreen].setAttribute("style","transform: translateX(-".concat(window.innerWidth,"px);")),M.currentOnboardingScreen++)}e.preventDefault()}function u(){M.currentOnboardingScreen!==A.onboardingScreenArr.length-1&&(A.onboardingScreenArr[M.currentOnboardingScreen].setAttribute("style","transform: translateX(-".concat(window.innerWidth,"px);")),M.currentOnboardingScreen++)}function d(){A.onboardingFlow.setAttribute("style","display: none;");for(var e=0;e<A.onboardingScreenArr.length;e++)A.onboardingScreenArr[e].setAttribute("style","transform: translateX(0px);");h(),f(),M.webWorkerLoaded?M.predictLoop=setInterval(z,1e3):M.predictLoop=setInterval(q,2e3)}function p(){A.onboardingFlow.setAttribute("style","display: none;");for(var e=0;e<A.onboardingScreenArr.length;e++)A.onboardingScreenArr[e].setAttribute("style","transform: translateX(0px);");h(),f(),M.webWorkerLoaded?M.predictLoop=setInterval(z,1e3):M.predictLoop=setInterval(q,2e3)}function h(){A.app.setAttribute("style","display: flex;")}function f(){A.onboardingFlow.removeEventListener("touchstart",c,S.eventOpts),A.onboardingFlow.removeEventListener("touchend",l,S.eventOpts),A.onboardingFlow.removeEventListener("click",u,S.eventOpts),A.startButton.removeEventListener("touchend",p,S.eventOpts),A.startButton.removeEventListener("click",p,S.eventOpts)}function v(){M.nonClasses.some(function(e){return M.predictedClass.includes(e)})?(A.chatboxContent.innerHTML="This doesn't look like a plant to me...",M.chatboxIsExpanded=!1):.7<M.probability?(A.chatboxContent.innerHTML="\n      <span>I think its a ".concat(M.predictedClass,'</span><span id="wtf-button">🔍</span>\n    '),A.chatboxContainer.classList.add("found"),M.chatboxIsExpanded=!0):(M.probability<.7&&.5<M.probability?A.chatboxContent.innerHTML="Hmmm could it be a ".concat(M.predictedClass,"...?"):A.chatboxContent.innerHTML="Trying to figure this out...",M.chatboxIsExpanded=!1)}function g(e){e.stopPropagation(),M.chatboxIsExpanded=!1,M.chatboxIsTriggered=!1,A.canvasOverlay.classList.remove("active"),A.chatboxContent.innerHTML="Let's try again...",null===M.predictLoop&&M.webWorkerLoaded?M.predictLoop=setInterval(z,1e3):null===M.predictLoop&&(M.predictLoop=setInterval(q,2e3)),A.chatboxContainer.classList.remove("expand"),A.chatboxContainer.classList.add("contract"),A.chatboxCloseButton.classList.remove("showX"),A.chatboxCloseButton.classList.add("hideX"),A.chatboxContent.classList.remove("up"),A.chatboxContent.classList.add("down"),A.chatboxTitle.classList.remove("showX"),A.chatboxTitle.classList.add("hideX"),A.chatboxSocial.innerHTML=""}function b(){M.chatboxIsExpanded&&(M.chatboxIsTriggered=!0,A.canvasOverlay.classList.add("active"),clearInterval(M.predictLoop),M.predictLoop=null,window.requestAnimationFrame(m),A.chatboxContainer.classList.remove("contract"),A.chatboxContainer.classList.add("expand"),A.chatboxCloseButton.classList.remove("hideX"),A.chatboxCloseButton.classList.add("showX"),A.chatboxContent.classList.remove("down"),A.chatboxContent.classList.add("up"),A.chatboxTitle.innerHTML=M.predictedClass.replace(/-/g," "),A.chatboxTitle.classList.remove("hideX"),A.chatboxTitle.classList.add("showX"))}function m(){if(A.chatboxSocial.innerHTML="",4===M.currentLensIndex)A.chatboxContent.innerHTML="",new InstagramFeed({tag:M.data[M.currentLensIndex][M.predictedClass],container:document.getElementById("chatbox-social"),display_profile:!1,display_gallery:!0,items:72,items_per_row:3,margin:.5});else if(null!==M.data[M.currentLensIndex][M.predictedClass]||void 0!==M.data[M.currentLensIndex][M.predictedClass]){var e=M.data[M.currentLensIndex][M.predictedClass];if("no_info"===e)A.chatboxContent.innerText="I don't know anything about this! Why don't you tell me more?";else{var t=e.split("\\"),n="";if(0<t.length){for(var r=0;r<t.length;r++)if(n+=t[r]+"<br>",-1<t[r].indexOf("{")){var o=t[r].match(/\{(.*)\}/i)[1];n=n.replace(t[r].match(/\{(.*)\}/i)[0],""),0<o.length&&(n+='<img src="'+o+'">',console.log(n))}}else n="";A.chatboxContent.innerHTML=n}}}function y(e){A.navMenu.classList.contains("show"),A.navMenu.classList.toggle("show"),e.preventDefault()}var x=n(2),w=n.n(x);function L(){return E.apply(this,arguments)}function E(){return(E=a()(s.a.mark(function e(t){var n,r,o,a,i;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.lastIndexOf("/"),r=0<=n?t.slice(0,n+1):"",o="".concat(r,"dict.txt"),e.next=5,tf.util.fetch(o);case 5:return a=e.sent,e.next=8,a.text();case 8:return i=e.sent,e.abrupt("return",i.trim().split("\n"));case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)}function I(e){A.loading.innerText="Downloading model... ".concat(100*e.toFixed(2),"%")}var O,C,B;n.d(t,"APP_STATE",function(){return M}),n.d(t,"CONFIG",function(){return S}),n.d(t,"DOM_EL",function(){return A}),n.d(t,"predict",function(){return q}),n.d(t,"offloadPredict",function(){return z}),O="https://gds-esd.com/wtf/scgs/"!==window.location.href?"https://cors-anywhere.herokuapp.com/https://gds-esd.com/wtf/scgs/tfjs_model/model.json":"https://gds-esd.com/wtf/scgs/tfjs_model/model.json";var k=null,T=!1,M={data:null,isLoggedIn:!1,chatboxIsExpanded:!1,chatboxIsTriggered:!1,currentLensIndex:0,numLenses:0,currentOnboardingScreen:0,predictedClass:"",probability:0,swipeX:null,predictLoop:null,nonClasses:["fern-1","fern-2","fern-3","pebbles","path","square-tiles"],webWorkerLoaded:!1},S={constraints:{video:{facingMode:"environment"},audio:!1},eventOpts:{capture:!1,passive:!0}},A={app:null,loading:null,canvas:null,canvasOverlay:null,ctx:null,video:null,loginWrapper:null,loginButton:null,onboardingFlow:null,skipButtons:null,onboardingScreenArr:null,chatbox:null,chatboxCloseButton:null,chatboxContent:null,chatboxSocial:null,chatboxTitle:null,chatboxContainer:null,carousel:null,carouselMiddle:null,carouselLeftLabel:null,carouselMiddleLabel:null,carouselRightLabel:null,navButton:null,navMenu:null,navMenuCloseButton:null,lenses:[]};window.addEventListener("DOMContentLoaded",function(){V(),Y(),H()});var j,X,_,F,P,W,H=(W=a()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return D(),e.next=3,N();case 3:return M.data=e.sent,console.log(M.data),e.next=7,G();case 7:A.video.srcObject=e.sent,R(),A.loading.classList.add("loaded"),setTimeout(function(){A.loading.setAttribute("style","display: none;")},300),A.video.onloadeddata=function(e){A.video.play(),J()};case 12:case"end":return e.stop()}},e)})),function(){return W.apply(this,arguments)}),N=(P=a()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("https://cors-anywhere.herokuapp.com/https://gds-esd.com/sheet/1V_naAwK3rQAWowSV0ny6SdjXwclEBmSw7J-wMMCOrBE/1").then(function(e){return e.json()}));case 1:case"end":return e.stop()}},e)})),function(){return P.apply(this,arguments)}),G=(F=a()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1}).then(function(e){return e}).catch(function(e){console.error("Oops. Something is broken.",e)}));case 1:case"end":return e.stop()}},e)})),function(){return F.apply(this,arguments)}),D=(_=a()(s.a.mark(function e(){var t,n,r;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(window.Worker)return k=new Worker("web-worker.js"),M.webWorkerLoaded=!0,k.onmessage=function(e){T=!T,M.chatboxIsTriggered||(M.predictedClass=e.data[0],M.probability=e.data[1],window.requestAnimationFrame(v))},e.abrupt("return");e.next=5;break;case 5:if("indexedDB"in window)return e.prev=6,e.next=9,tf.loadGraphModel("indexeddb://web-model");e.next=38;break;case 9:return C=e.sent,e.next=12,L(O);case 12:B=e.sent,t=tf.zeros([1,224,224,3]),C.predict(t),e.next=36;break;case 17:return e.prev=17,e.t0=e.catch(6),console.log("Couldn't find local cached model. It's okay, attempting to download it now."),e.next=22,tf.loadGraphModel(O,{onProgress:I});case 22:return C=e.sent,e.next=25,L(O);case 25:return B=e.sent,n=tf.zeros([1,224,224,3]),C.predict(n),e.prev=28,e.next=31,C.save("indexeddb://web-model");case 31:e.next=36;break;case 33:e.prev=33,e.t1=e.catch(28),console.log("Model downloaded, but can't save it to cache.");case 36:e.next=47;break;case 38:return console.log("IndexedDB not available. Will not attempt to save model to cache."),e.next=41,tf.loadGraphModel(O,{onProgress:I});case 41:return C=e.sent,e.next=44,L(O);case 44:B=e.sent,r=tf.zeros([1,224,224,3]),C.predict(r);case 47:case"end":return e.stop()}},e,null,[[6,17],[28,33]])})),function(){return _.apply(this,arguments)}),R=function(){A.loading.innerText="Fetching assets...";for(var e=0;e<5;e++){var t=new Image;t.src="img/ui/faces"+(2*(e+1)).toString()+".png",t.alt=e.toString(),A.lenses[e]=t,A.carouselMiddle.appendChild(A.lenses[e]),A.lenses[e].classList.add("teacher-face"),1===M.currentLensIndex?A.lenses[e].style.display="block":A.lenses[e].style.display="none"}M.numLenses=A.lenses.length,A.carouselLeftLabel.innerText=M.data[1].subject,A.carouselMiddleLabel.innerText=M.data[0].subject,A.carouselRightLabel.innerText=M.data[2].subject,A.lenses[M.currentLensIndex].style.display="block",A.canvas.width=window.innerWidth,A.canvas.height=window.innerWidth,A.ctx=A.canvas.getContext("2d",{alpha:!1})},q=(X=a()(s.a.mark(function e(){var t,n,r,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(M.chatboxIsTriggered)return window.clearInterval(M.predictLoop),M.predictLoop=null,e.abrupt("return");e.next=4;break;case 4:return t=tf.tidy(function(){var c,e=tf.browser.fromPixels(A.canvas),t=(c=e,tf.tidy(function(){var e=c.shape.slice(0,2),t=w()(e,2),n=t[0],r=t[1],o=0,a=0;r<n?o=(n-r)/2:a=(r-n)/2;var i=Math.min(r,n),s=[[o/n,a/r,(o+i)/n,(a+i)/r]];return tf.image.cropAndResize(c.toFloat().expandDims(),s,[0],[224,224])}).div(127.5).sub(1));return C.predict(t)}),e.next=7,t.data();case 7:n=e.sent,t.dispose(),r=Array.from(n).map(function(e,t){return{label:B[t],prob:e}}),o=r.reduce(function(e,t){return e.prob>t.prob?e:t}),M.predictedClass=o.label,M.probability=parseFloat(o.prob.toFixed(2)),window.requestAnimationFrame(v);case 14:case"end":return e.stop()}},e)})),function(){return X.apply(this,arguments)}),z=(j=a()(s.a.mark(function e(){var t;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:T||(t=A.ctx.getImageData(0,0,A.canvas.width,A.canvas.height),k.postMessage(t),T=!T),M.chatboxIsExpanded||(A.chatboxContent.innerText="Hold the camera steady while I figure this out...");case 2:case"end":return e.stop()}},e)})),function(){return j.apply(this,arguments)}),V=function(){A.app=document.getElementById("app"),A.loading=document.getElementById("loading"),A.loginWrapper=document.getElementsByClassName("login")[0],A.loginButton=document.getElementById("login-button"),A.onboardingFlow=document.getElementsByClassName("onboarding")[0],A.skipButtons=document.getElementsByClassName("skip-button"),A.startButton=document.getElementById("start-button"),A.onboardingScreenArr=document.getElementsByClassName("onboarding-screen"),A.navButton=document.getElementById("nav-button"),A.navMenu=document.getElementById("menu-list"),A.navMenuCloseButton=document.getElementById("menu-close-button"),A.carousel=document.getElementById("carousel"),A.carouselMiddle=document.getElementById("carousel-middle"),A.carouselLeftLabel=document.getElementById("carousel-left-label"),A.carouselMiddleLabel=document.getElementById("carousel-middle-label"),A.carouselRightLabel=document.getElementById("carousel-right-label"),A.chatboxContainer=document.getElementById("chatbox-container"),A.chatboxCloseButton=document.getElementById("chatbox-close-button"),A.chatboxTitle=document.getElementById("chatbox-title"),A.chatboxContent=document.getElementById("chatbox-content"),A.chatboxSocial=document.getElementById("chatbox-social"),A.video=document.getElementById("camera-view"),A.canvas=document.getElementById("canvas"),A.canvasOverlay=document.getElementById("canvas-overlay"),A.ctx=A.canvas.getContext("2d",{alpha:!1,desynchronized:!1})},Y=function(){A.loginButton.addEventListener("click",i,S.eventOpts),A.chatboxContainer.addEventListener("click",b,S.eventOpts),A.chatboxCloseButton.addEventListener("click",g,S.eventOpts),A.onboardingFlow.addEventListener("touchstart",c,S.eventOpts),A.onboardingFlow.addEventListener("touchend",l,S.eventOpts),A.onboardingFlow.addEventListener("click",u,S.eventOpts),A.startButton.addEventListener("touchend",p,S.eventOpts),A.startButton.addEventListener("click",p,S.eventOpts),A.navButton.addEventListener("touchend",y,S.eventOpts),A.navButton.addEventListener("click",y,S.eventOpts),A.navMenuCloseButton.addEventListener("touchend",y,S.eventOpts),A.navMenuCloseButton.addEventListener("click",y,S.eventOpts),A.carousel.addEventListener("touchstart",c,S.eventOpts),A.carousel.addEventListener("touchend",K,S.eventOpts);for(var e=0;e<A.skipButtons.length;e++)A.skipButtons[e].addEventListener("click",d,S.eventOpts),A.skipButtons[e].addEventListener("touchend",d,S.eventOpts)},J=function e(){A.ctx.drawImage(A.video,0,0,window.innerWidth,window.innerWidth),window.requestAnimationFrame(e)},K=function(e){if(A.lenses[M.currentLensIndex].style.display="none",M.swipeX||0===M.swipeX){var t=null;e.changedTouches?t=e.changedTouches[0].clientX-M.swipeX:(e.clientX,M.swipeX);var n=Math.sign(t);0<n?M.currentLensIndex--:n<0&&M.currentLensIndex++}M.currentLensIndex>M.numLenses-1&&(M.currentLensIndex=0),M.currentLensIndex<0&&(M.currentLensIndex=M.numLenses-1),A.lenses[M.currentLensIndex].style.display="block";var r=M.currentLensIndex+1;r>M.numLenses-1&&(r=0),r<0&&(r=M.numLenses-1);var o=M.currentLensIndex-1;o>M.numLenses-1&&(o=0),o<0&&(o=M.numLenses-1),A.carouselLeftLabel.innerHTML=M.data[r].subject,A.carouselMiddleLabel.innerHTML=M.data[M.currentLensIndex].subject,A.carouselRightLabel.innerHTML=M.data[o].subject,M.chatboxIsExpanded&&window.requestAnimationFrame(m),e.preventDefault()}}]);