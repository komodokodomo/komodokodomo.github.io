function handleMotionEvent(event) {

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    var xx = event.acceleration.x;
    var yy = event.acceleration.y;
    var zz = event.acceleration.z;

    var rotateDegrees = event.alpha;
    var leftToRight = event.gamma;
    var frontToBack = event.beta;

    console.log(x +", " + y + ", " + z);
    console.log(xx +", " + yy + ", " + zz);
    console.log(rotateDegrees +", " + leftToRight + ", " + frontToBack);
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