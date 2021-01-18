var MOVEMENT = {
    x : null,
    y : null,
    z : null,
    xx : null,
    yy : null,
    zz : null,
    rotateZ : null,
    rotateY : null,
    rotateX : null,
}

var DOM_EL = {
    gesture: null
}

function handleMotionEvent(event) {

    MOVEMENT.x = event.accelerationIncludingGravity.x;
    MOVEMENT.y = event.accelerationIncludingGravity.y;
    MOVEMENT.z = event.accelerationIncludingGravity.z;

    MOVEMENT.xx = event.acceleration.x;
    MOVEMENT.yy = event.acceleration.y;
    MOVEMENT.zz = event.acceleration.z;

    MOVEMENT.rotateZ = event.rotationRate.alpha;
    MOVEMENT.rotateY = event.rotationRate.gamma;
    MOVEMENT.rotateX = event.rotationRate.beta;

    // console.log(x +", " + y + ", " + z);
    // console.log(xx +", " + yy + ", " + zz);
    console.log(MOVEMENT.rotateZ +", " + MOVEMENT.rotateY + ", " + MOVEMENT.rotateX);
}

function setup(){
    DOM_EL.gesture = select("#gesture-identifier");
}

function init() {
	mm = new MobileMovement();

	mm.on("basketball shot", function(info) {
		console.log(info.movement); // Logs the monitored movement object defined by "basketball shot"
		console.log(info.actionKey); // Logs the string "basketball shot"
        console.log(info.event.alpha); // Logs the alpha component of the DeviceOrientation event triggering the callback
        DOM_EL.gesture.html(info.actionKey);
		try {
		// if(document.getElementById("vibrate").checked) {
			window.navigator.vibrate(200);
		// }
		} catch(e) {
			console.log(" couldn't vibrate");
		}
    });
    
    mm.on("dig", function(info) {
		console.log(info.movement); // Logs the monitored movement object defined by "basketball shot"
		console.log(info.actionKey); // Logs the string "basketball shot"
        console.log(info.event.alpha); // Logs the alpha component of the DeviceOrientation event triggering the callback
        DOM_EL.gesture.html(info.actionKey);
		try {
		// if(document.getElementById("vibrate").checked) {
			window.navigator.vibrate(200);
		// }
		} catch(e) {
			console.log(" couldn't vibrate");
		}
	});
}

window.addEventListener("load", init, false);
// window.addEventListener("devicemotion", handleMotionEvent, true);

// if (window.DeviceOrientationEvent) {
//     window.addEventListener("deviceorientation", function(event) {
//         var rotateDegrees = event.alpha;
//         var leftToRight = event.gamma;
//         var frontToBack = event.beta;
//         console.log(event);

//         handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
//     }, true);
// }

// var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    // do something amazing
// };