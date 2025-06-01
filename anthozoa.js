// anthozoa.js

// ... (keep all existing global variables: versionNumber, appSettings, p5Canvas) ...
// ... (keep existing setup(), draw(), setupControls(), and other helper functions like updateRangeSliderFill etc.) ...

function windowResized() {
    console.log("Anthozoa: windowResized() called.");
    const mainTitle = document.getElementById('mainTitle');
    const controlsPanel = document.getElementById('controlsPanel'); // Needed for its padding
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
        // In fullscreen, canvas has no extra padding, takes full viewport
    } else {
        document.body.classList.remove('fullscreen-active');
        
        // Get the computed padding of the .controls panel
        const controlsPanelStyle = getComputedStyle(controlsPanel);
        const controlsPaddingLeft = parseFloat(controlsPanelStyle.paddingLeft) || 0;
        const controlsPaddingRight = parseFloat(controlsPanelStyle.paddingRight) || 0;
        const controlsTotalHorizontalPadding = controlsPaddingLeft + controlsPaddingRight;

        // Base canvas width on sketchContainer's content width
        let baseWidth = sketchContainer.clientWidth;
        
        // Adjust canvas width to account for the controls panel's internal padding
        // This makes the canvas drawing area align with the content area of the controls
        newCanvasWidth = baseWidth - controlsTotalHorizontalPadding;

        const bodyStyle = window.getComputedStyle(document.body);
        const bodyVerticalPadding = parseFloat(bodyStyle.paddingTop || 0) + parseFloat(bodyStyle.paddingBottom || 0);

        const titleStyle = window.getComputedStyle(mainTitle);
        const titleHeight = mainTitle.offsetHeight + parseFloat(titleStyle.marginTop || 0) + parseFloat(titleStyle.marginBottom || 0);
        
        // Use actual rendered height of controls panel for calculations
        const actualControlsHeight = controlsPanel.offsetHeight + 
                                   parseFloat(controlsPanelStyle.marginTop || 0) + 
                                   parseFloat(controlsPanelStyle.marginBottom || 0);
        
        const footerStyle = window.getComputedStyle(siteFooter);
        const footerTotalHeight = siteFooter.offsetHeight + parseFloat(footerStyle.marginTop || 0) + parseFloat(footerStyle.marginBottom || 0);

        const availableVerticalSpaceForCanvas = window.innerHeight - 
                                              bodyVerticalPadding - 
                                              titleHeight - 
                                              actualControlsHeight - // Use actual rendered height
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

// Make sure the rest of your anthozoa.js (setup, draw, setupControls, Shape class, etc.) remains the same
// as the last version that was working correctly for functionality.
