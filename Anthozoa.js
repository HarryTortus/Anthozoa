// anthozoa.js - v0.01: Basic Setup

console.log("Anthozoa.js: Script loaded.");

const versionNumber = "0.01";
const appSettings = {
    backgroundColor: '#1a1a1a', // Dark background for Anthozoa
    // Add other initial settings as we define them
};

let p5Canvas; // Will hold the p5.js canvas

function setup() {
    console.log("Anthozoa: p5.js setup() called.");
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');
    
    if (!canvasPlaceholder) {
        console.error("Anthozoa FATAL: Canvas placeholder #p5-canvas-placeholder not found!");
        // Optional: Display an error message to the user on the page itself
        let body = document.querySelector('body');
        if (body) body.innerHTML = '<h1 style="color:red; text-align:center; margin-top: 50px;">Error: Canvas placeholder missing. Cannot start application.</h1>';
        return; // Stop execution
    }

    // Create a small temporary canvas, windowResized will adjust it
    p5Canvas = createCanvas(100, 100); 
    if (p5Canvas) {
        p5Canvas.parent(canvasPlaceholder);
        console.log("Anthozoa: Canvas created and parented.");
    } else {
        console.error("Anthozoa FATAL: createCanvas() failed.");
        return; // Stop execution
    }
    
    if (!setupControls()) {
        console.warn("Anthozoa: setupControls() reported issues. Some UI elements might not be fully initialized.");
    }
    
    windowResized(); // Initial sizing of the canvas
    console.log("Anthozoa: p5.js setup() finished.");
}

function draw() {
    // For v0.01, just clear the background
    if (appSettings.backgroundColor) {
        background(appSettings.backgroundColor);
    } else {
        background(0); // Fallback
    }

    // In future phases, we'll call update and display methods for Anthozoa organisms here
    // For v0.01, maybe draw a simple text to confirm canvas is working:
    // fill(200);
    // textAlign(CENTER, CENTER);
    // textSize(24);
    // text("Anthozoa v" + versionNumber, width / 2, height / 2);
}

function setupControls() {
    console.log("Anthozoa: setupControls() called.");
    const versionDisplayEl = document.getElementById('versionDisplay');
    
    if (versionDisplayEl) {
        versionDisplayEl.textContent = `v${versionNumber}`;
        console.log("Anthozoa: Version number set to " + versionNumber);
    } else {
        console.warn("Anthozoa: Version display element #versionDisplay not found.");
    }

    // Add listeners for fullscreen events
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
        document.addEventListener(event, windowResized)
    );

    console.log("Anthozoa: setupControls() finished.");
    return true; // Indicate successful basic setup
}

function windowResized() {
    console.log("Anthozoa: windowResized() called.");
    const mainTitle = document.getElementById('mainTitle');
    const controlsPanel = document.getElementById('controlsPanel');
    const sketchContainer = document.getElementById('sketch-container'); 
    const siteFooter = document.getElementById('site-footer');
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');


    if (!mainTitle || !controlsPanel || !sketchContainer || !siteFooter || !canvasPlaceholder) {
        console.error("Anthozoa: windowResized - One or more critical layout elements not found. Aborting resize.");
        if (typeof resizeCanvas === 'function') resizeCanvas(Math.max(50,100), Math.max(50,100)); 
        if (typeof background === 'function') background(200); 
        return;
    }

    let newCanvasWidth, newCanvasHeight;
    // Get margin from the placeholder as canvas itself might not have it set yet by p5 if just created
    const placeholderStyle = getComputedStyle(canvasPlaceholder);
    const CANVAS_MARGIN_BOTTOM = parseFloat(placeholderStyle.marginBottom) || 15;


    if (document.fullscreenElement) {
        document.body.classList.add('fullscreen-active');
        newCanvasWidth = window.innerWidth;
        newCanvasHeight = window.innerHeight;
    } else {
        document.body.classList.remove('fullscreen-active');
        
        newCanvasWidth = sketchContainer.clientWidth; 

        const bodyStyle = window.getComputedStyle(document.body);
        const bodyVerticalPadding = parseFloat(bodyStyle.paddingTop || 0) + parseFloat(bodyStyle.paddingBottom || 0);

        const titleStyle = window.getComputedStyle(mainTitle);
        const titleHeight = mainTitle.offsetHeight + parseFloat(titleStyle.marginTop || 0) + parseFloat(titleStyle.marginBottom || 0);
        
        const controlsPanelStyle = window.getComputedStyle(controlsPanel);
        const controlsHeight = controlsPanel.offsetHeight + parseFloat(controlsPanelStyle.marginTop || 0) + parseFloat(controlsPanelStyle.marginBottom || 0);
        
        const footerStyle = window.getComputedStyle(siteFooter);
        const footerTotalHeight = siteFooter.offsetHeight + parseFloat(footerStyle.marginTop || 0) + parseFloat(footerStyle.marginBottom || 0);

        const availableVerticalSpaceForCanvas = window.innerHeight - 
                                              bodyVerticalPadding - 
                                              titleHeight - 
                                              controlsHeight - 
                                              footerTotalHeight - 
                                              CANVAS_MARGIN_BOTTOM;
        
        newCanvasHeight = availableVerticalSpaceForCanvas;
        
        newCanvasWidth = Math.max(50, newCanvasWidth); 
        newCanvasHeight = Math.max(50, newCanvasHeight); 
    }

    if (typeof resizeCanvas === 'function') {
        resizeCanvas(newCanvasWidth, newCanvasHeight);
    } 
    if (typeof background === 'function' && appSettings && appSettings.backgroundColor) {
         background(appSettings.backgroundColor); 
    }
    console.log("Anthozoa: windowResized() finished, canvas: " + newCanvasWidth + "x" + newCanvasHeight);
}

// Placeholder for future utility functions if needed
// function someUtilityFunction() { /* ... */ }

// Initial call to ensure setup happens after DOM is fully loaded.
// p5.js in global mode usually handles this, but explicit defer on script tag helps.
// If not using instance mode, p5 will call setup() automatically.
console.log("Anthozoa.js: Script parsed. p5.js should call setup() soon.");
