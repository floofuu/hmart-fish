var rotationAngle = 0; // Initial rotation angle
var isSliderUsed = false; // Flag to track whether the slider is being used

window.onload = function() {
    var slider = document.getElementById("range");
    var root = document.querySelector(':root');

    slider.oninput = function(e) {
        console.log(e.target.value);
        rotationAngle = e.target.value; // Update rotation angle
        isSliderUsed = true; // Set the flag to true when slider is being used
        updateRotation(); // Update rotation based on slider input
    }

    slider.onmouseup = function() {
        isSliderUsed = false; // Reset the flag when slider is released
    }
}

function updateRotation() {
    var root = document.querySelector(':root');
    root.style.setProperty('--rotation', rotationAngle + 'deg');
}

function shuffleStack() {
    console.log("Shuffling stack...");
    const container = document.querySelector('.container');
    const slides = container.querySelectorAll('.section');
    
    const topImage = slides[0];
    
    container.removeChild(topImage);
    
    container.appendChild(topImage);

    // Reset rotation property after shuffling
    rotationAngle = 0;
    console.log("Rotation angle after shuffling: " + rotationAngle);
    updateRotation();
}

document.querySelectorAll('.section').forEach(function(image) {
    image.addEventListener('click', function() {
        console.log("Section clicked...");
        shuffleStack();
    });
});

