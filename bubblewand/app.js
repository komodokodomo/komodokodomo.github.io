function handleMotionEvent(event) {

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    console.log(event);
}

window.addEventListener("devicemotion", handleMotionEvent, true);

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        var rotateDegrees = event.alpha;
        var leftToRight = event.gamma;
        var frontToBack = event.beta;
        console.log(event);

        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
}

var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    // do something amazing
};