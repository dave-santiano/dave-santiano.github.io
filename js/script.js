// Optimized rainbow text implementation
const CIRCLE_DEGREES = 360;
let rainbowElements;
let colorIncrement;
let baseColor;

function setRainbowElementColors() {
    // Cache the elements and recalculate in case new elements were added
    rainbowElements = document.getElementsByClassName("rainbow_element");
    
    // Avoid division by zero and ensure we have elements
    if (rainbowElements.length === 0) return;
    
    // Recalculate increment in case elements were added/removed
    colorIncrement = CIRCLE_DEGREES / rainbowElements.length;
    baseColor = Math.random() * CIRCLE_DEGREES;
    
    // Use modern for...of loop for better performance
    let currentColor = baseColor;
    for (const element of rainbowElements) {
        // Use more subtle saturation for better readability
        const hslColor = `hsl(${currentColor.toFixed(0)}, 80%, 85%)`;
        element.style.backgroundColor = hslColor;
        currentColor += colorIncrement;
    }
}

// Performance improvement: Use requestAnimationFrame for smooth updates
function initRainbowColors() {
    requestAnimationFrame(setRainbowElementColors);
}

// Optional: Add dynamic color cycling animation (commented out by default)

function animateRainbowColors() {
    let animationFrame;
    let startColor = Math.random() * CIRCLE_DEGREES;
    
    function animate() {
        if (!rainbowElements || rainbowElements.length === 0) return;
        
        let currentColor = startColor;
        const increment = CIRCLE_DEGREES / rainbowElements.length;
        
        for (const element of rainbowElements) {
            const hslColor = `hsl(${currentColor.toFixed(0)}, 80%, 85%)`;
            element.style.backgroundColor = hslColor;
            currentColor += increment;
        }
        
        startColor += 0.2; // Slow color rotation
        if (startColor >= CIRCLE_DEGREES) startColor = 0;
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Return function to stop animation
    return () => cancelAnimationFrame(animationFrame);
}


// Backwards compatibility alias for existing HTML onload calls
window.setRainbowElementColors = setRainbowElementColors;

// Animation control functions
window.startRainbowAnimation = animateRainbowColors;
window.stopRainbowAnimation = null; // Will be set when animation starts

// Auto-start animation on every page load
window.addEventListener('load', () => {
    window.stopRainbowAnimation = animateRainbowColors();
});