// anthozoa.js - v0.01: Basic Setup (Focus on robust canvas creation)

console.log("Anthozoa.js: Script loaded.");

const versionNumber = "0.01";
const appSettings = {
    backgroundColor: '#1a1a1a', 
};

let p5Canvas; 

function setup() {
    console.log("Anthozoa: p5.js setup() called.");
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');
    
    if (!canvasPlaceholder) {
        console.error("Anthozoa FATAL: Canvas placeholder DIV with ID '#p5-canvas-placeholder' not found in HTML!");
        let body = document.querySelector('body');
        if (body) body.innerHTML = '<h1 style="color:red; text-align:center; margin-top: 50px;">Error: HTML structure incomplete. Canvas placeholder missing. Cannot start application.</h1>';
        noLoop(); 
        return; 
    }

    try {
        p5Canvas = createCanvas(100, 100); 
        if (p5Canvas && p5Canvas.elt) { 
            p5Canvas.parent(canvasPlaceholder);
            console.log("Anthozoa: Canvas created and parented to #p5-canvas-placeholder.");
        } else {
            console.error("Anthozoa FATAL: createCanvas() did not return a valid canvas element.");
            noLoop(); return;
        }
    } catch (e) {
        console.error("Anthozoa FATAL: Error during createCanvas() or parent():", e);
        noLoop(); return;
    }
    
    if (!setupControls()) {
        console.warn("Anthozoa: setupControls() reported issues. Some UI elements might not be fully initialized.");
    }
    
    windowResized(); 
    console.log("Anthozoa: p5.js setup() finished.");
}

function draw() {
    if (appSettings.backgroundColor) {
        background(appSettings.backgroundColor);
    } else {
        background(0); // Fallback
    }
    if (frameCount < 10) { 
        fill(200); 
        textAlign(CENTER, CENTER);
        textSize(16);
        if (typeof width !== 'undefined' && typeof height !== 'undefined') { // Ensure width/height are defined
            text("Anthozoa Canvas Active - v" + versionNumber, width / 2, height / 2);
        }
    }
}

function setupControls() {
    console.log("Anthozoa: setupControls() called.");
    const versionDisplayEl = document.getElementById('versionDisplay');
    
    if (versionDisplayEl) {
        versionDisplayEl.textContent = `v${versionNumber}`;
    } else {
        console.warn("Anthozoa: Version display element #versionDisplay not found.");
    }

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
        document.addEventListener(event, windowResized)
    );

    console.log("Anthozoa: setupControls() finished.");
    return true; 
}

function windowResized() {
    console.log("Anthozoa: windowResized() called.");
    const mainTitle = document.getElementById('mainTitle');
    const controlsPanel = document.getElementById('controlsPanel');
    const sketchContainer = document.getElementById('sketch-container'); 
    const siteFooter = document.getElementById('site-footer');
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');

    if (!mainTitle || !controlsPanel || !sketchContainer || !siteFooter || !canvasPlaceholder) {
        console.error("Anthozoa: windowResized - One or more CRITICAL layout DIVs not found. Cannot accurately size canvas.");
        if (p5Canvas && typeof resizeCanvas === 'function') {
             let fallbackW = window.innerWidth > 50 ? window.innerWidth - 20 : 50;
             let fallbackH = window.innerHeight > 50 ? window.innerHeight / 2 : 50;
             resizeCanvas(Math.max(50, fallbackW) , Math.max(50, fallbackH));
        }
        if (typeof background === 'function') background(200); 
        return;
    }

    let newCanvasWidth, newCanvasHeight;
    
    let canvasMarginBottom = 15; 
    const placeholderStyle = getComputedStyle(canvasPlaceholder);
    if (placeholderStyle && placeholderStyle.marginBottom) {
        const parsedMargin = parseFloat(placeholderStyle.marginBottom);
        if (!isNaN(parsedMargin)) {
            canvasMarginBottom = parsedMargin;
        }
    }

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
                                              canvasMarginBottom;
        
        newCanvasHeight = availableVerticalSpaceForCanvas;
        
        newCanvasWidth = Math.max(50, newCanvasWidth); 
        newCanvasHeight = Math.max(50, newCanvasHeight); 
    }

    if (p5Canvas && typeof resizeCanvas === 'function') { 
        resizeCanvas(newCanvasWidth, newCanvasHeight);
    } else {
        console.error("Anthozoa: resizeCanvas function not available or p5Canvas not defined.");
    }
    
    if (typeof background === 'function' && appSettings && appSettings.backgroundColor) {
         background(appSettings.backgroundColor); 
    }
    console.log("Anthozoa: windowResized() finished, canvas should be: " + newCanvasWidth + "x" + newCanvasHeight);
}

console.log("Anthozoa.js: Script parsed. p5.js should call setup() soon if linked correctly.");
