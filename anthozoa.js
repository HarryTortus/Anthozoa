// anthozoa.js - v0.03: Revised Controls and Play/Pause Logic

console.log("Anthozoa.js: Script loaded - v0.03");

const versionNumber = "0.03";
const appSettings = {
    backgroundColor: '#1a1a1a', 
    lineThickness: 1.5,
    lineColor: '#f0f2f5', // Default line color (light for dark bg)
    isAnimating: true,  // Replaces freezeGrowth, true means playing
    // bouncyBorder: false, // Removed for now
    growthSpeed: 1.0,
    repulsionIntensity: 1.0,
    minDistance: 20,
    turnAngle: 30, 
    maxCurveLength: 300,
    noiseInfluence: 0.1,
};

// HTML Element References
let lineThicknessSliderEl, lineColorPickerEl, backgroundColorPickerEl, // Changed baseHue to lineColor
    playPauseButtonEl, // Changed from freezeGrowthToggleEl
    growthSpeedSliderEl, repulsionIntensitySliderEl, minDistanceSliderEl,
    turnAngleSliderEl, maxCurveLengthSliderEl, noiseInfluenceSliderEl,
    resetButtonEl, fullscreenButtonEl; 

let p5Canvas; 
// let shapes = []; // Will be used when AnthozoaOrganism class is implemented

// --- UTILITY FUNCTIONS ---
function updateRangeSliderFill(inputElement) { /* ... (Same as before) ... */ }

// --- P5.JS SETUP & DRAW ---
function setup() { /* ... (Same as before - calls setupControls & windowResized) ... */ }

function draw() {
    if (appSettings.backgroundColor) {
        background(appSettings.backgroundColor);
    } else {
        background(0); 
    }
    
    // Display status text
    let statusText = "Anthozoa v" + versionNumber;
    if (!appSettings.isAnimating) {
        statusText += " (Paused)";
    } else if (frameCount < 200) { // Only show "Controls Linked" for a bit if playing
        statusText += " - Controls Linked";
    }

    if (typeof width !== 'undefined' && typeof height !== 'undefined') { 
        fill(180, 180, 180, 150); 
        textAlign(CENTER, CENTER);
        textSize(16);
        text(statusText, width / 2, height / 2);
    }
    
    // if (appSettings.isAnimating) {
    //     // Future: Update and display Anthozoa organisms
    // } else {
    //     // Future: Just display static Anthozoa organisms if needed
    // }
}

// --- CONTROL UI SETUP ---
function setupControls() {
    console.log("Anthozoa: setupControls() called for v0.03.");
    let allControlsFound = true;
    const getEl = (id, isCritical = true) => { 
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Anthozoa: HTML Element with ID '${id}' not found.`);
            if (isCritical) allControlsFound = false; 
        }
        return el;
    };

    // Get elements
    lineThicknessSliderEl = getEl('lineThickness', true);
    lineColorPickerEl = getEl('lineColor', true); // New
    backgroundColorPickerEl = getEl('backgroundColor', true);
    playPauseButtonEl = getEl('playPauseButton', true); // New
    // bouncyBorderToggleEl = getEl('bouncyBorderToggle'); // Removed
    growthSpeedSliderEl = getEl('growthSpeed', true);
    repulsionIntensitySliderEl = getEl('repulsionIntensity', true);
    minDistanceSliderEl = getEl('minDistance', true);
    turnAngleSliderEl = getEl('turnAngle', true);
    maxCurveLengthSliderEl = getEl('maxCurveLength', true);
    noiseInfluenceSliderEl = getEl('noiseInfluence', true);
    resetButtonEl = getEl('resetButton', true); 
    fullscreenButtonEl = getEl('fullscreenButton', true); 
    
    const versionDisplayEl = getEl('versionDisplay');
    if (versionDisplayEl) versionDisplayEl.textContent = `v${versionNumber}`;

    if (!allControlsFound) {
        console.error("Anthozoa: One or more CRITICAL control elements missing. UI setup may fail.");
        return false; 
    }

    // Initialize control values from appSettings
    lineThicknessSliderEl.value = appSettings.lineThickness;
    lineColorPickerEl.value = appSettings.lineColor;
    backgroundColorPickerEl.value = appSettings.backgroundColor;
    playPauseButtonEl.innerHTML = appSettings.isAnimating ? "Pause" : "Play"; // Set initial text
    // if (bouncyBorderToggleEl) bouncyBorderToggleEl.checked = appSettings.bouncyBorder; // Removed
    growthSpeedSliderEl.value = appSettings.growthSpeed;
    repulsionIntensitySliderEl.value = appSettings.repulsionIntensity;
    minDistanceSliderEl.value = appSettings.minDistance;
    turnAngleSliderEl.value = appSettings.turnAngle;
    maxCurveLengthSliderEl.value = appSettings.maxCurveLength;
    noiseInfluenceSliderEl.value = appSettings.noiseInfluence;
    
    document.querySelectorAll('.controls input[type="range"]').forEach(slider => {
        if(slider) { 
            updateSliderValueDisplay(slider);
            updateRangeSliderFill(slider); 
        }
    });
    
    // --- Event Listeners ---
    const addInputListener = (el, settingName, isColor = false) => { // Simplified for non-checkboxes
        if (el) {
            const eventToUse = (el.type === 'range' || isColor) ? 'input' : 'change'; // color uses input
            el.addEventListener(eventToUse, (e) => {
                appSettings[settingName] = isColor ? e.target.value : parseFloat(e.target.value);
                if (el.type === 'range') updateSliderValueDisplay(el);
                if (settingName === 'backgroundColor') { 
                    if (typeof background === 'function') background(appSettings.backgroundColor);
                }
                console.log("Anthozoa AppSetting Changed:", settingName, "=", appSettings[settingName]); 
            });
        }
    };

    addInputListener(lineThicknessSliderEl, 'lineThickness');
    addInputListener(lineColorPickerEl, 'lineColor', true); // isColor = true
    addInputListener(backgroundColorPickerEl, 'backgroundColor', true); // isColor = true
    addInputListener(growthSpeedSliderEl, 'growthSpeed');
    addInputListener(repulsionIntensitySliderEl, 'repulsionIntensity');
    addInputListener(minDistanceSliderEl, 'minDistance');
    addInputListener(turnAngleSliderEl, 'turnAngle');
    addInputListener(maxCurveLengthSliderEl, 'maxCurveLength');
    addInputListener(noiseInfluenceSliderEl, 'noiseInfluence');

    if(playPauseButtonEl) {
        playPauseButtonEl.addEventListener('click', () => {
            appSettings.isAnimating = !appSettings.isAnimating;
            playPauseButtonEl.innerHTML = appSettings.isAnimating ? "Pause" : "Play";
            console.log("Anthozoa: isAnimating =", appSettings.isAnimating);
            if (!appSettings.isAnimating && typeof draw === 'function') {
                draw(); // Redraw one last time to update text if paused
            }
        });
    }

    if(resetButtonEl) {
        resetButtonEl.addEventListener('click', () => {
            console.log("Anthozoa: Reset button clicked.");
            // Reset appSettings to initial defaults
            appSettings.backgroundColor = '#1a1a1a'; 
            appSettings.lineThickness = 1.5; appSettings.lineColor = '#f0f2f5'; 
            appSettings.isAnimating = true; 
            // appSettings.bouncyBorder = false; // Removed
            appSettings.growthSpeed = 1.0; appSettings.repulsionIntensity = 1.0; 
            appSettings.minDistance = 20; appSettings.turnAngle = 30; 
            appSettings.maxCurveLength = 300; appSettings.noiseInfluence = 0.1;
            
            // Update HTML controls
            if (lineThicknessSliderEl) lineThicknessSliderEl.value = appSettings.lineThickness;
            if (lineColorPickerEl) lineColorPickerEl.value = appSettings.lineColor;
            if (backgroundColorPickerEl) backgroundColorPickerEl.value = appSettings.backgroundColor;
            if (playPauseButtonEl) playPauseButtonEl.innerHTML = appSettings.isAnimating ? "Pause" : "Play";
            // if (bouncyBorderToggleEl) bouncyBorderToggleEl.checked = appSettings.bouncyBorder; // Removed
            if (growthSpeedSliderEl) growthSpeedSliderEl.value = appSettings.growthSpeed;
            // ... update all other sliders ...
            if (repulsionIntensitySliderEl) repulsionIntensitySliderEl.value = appSettings.repulsionIntensity;
            if (minDistanceSliderEl) minDistanceSliderEl.value = appSettings.minDistance;
            if (turnAngleSliderEl) turnAngleSliderEl.value = appSettings.turnAngle;
            if (maxCurveLengthSliderEl) maxCurveLengthSliderEl.value = appSettings.maxCurveLength;
            if (noiseInfluenceSliderEl) noiseInfluenceSliderEl.value = appSettings.noiseInfluence;


            document.querySelectorAll('.controls input[type="range"]').forEach(slider => {
                if(slider) { updateSliderValueDisplay(slider); updateRangeSliderFill(slider); }
            });
            if (typeof background === 'function') background(appSettings.backgroundColor); 
            // shapes = []; // Will reset shapes array later
        });
    }

    if(fullscreenButtonEl) { /* ... (Same fullscreen logic) ... */ }

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
        document.addEventListener(event, windowResized)
    );
    console.log("Anthozoa: setupControls() finished successfully.");
    return true; 
}

function updateSliderValueDisplay(sliderElement) { /* ... (Same as before, ensure ° for turnAngle) ... */ }
function windowResized() { /* ... (Same as before - the one that correctly sizes canvas with padding) ... */ }
function mousePressed() { /* ... (Will be used for seed planting) ... */ }

// --- Re-pasting full helper functions for clarity ---
function updateRangeSliderFill(inputElement) {
    if (!inputElement) return;
    const min = parseFloat(inputElement.min || 0);
    const max = parseFloat(inputElement.max || 1);
    const value = parseFloat(inputElement.value);
    const percentage = ((value - min) / (max - min)) * 100;
    inputElement.style.setProperty('--range-progress', `${percentage}%`);
}

function updateSliderValueDisplay(sliderElement) {
    if(!sliderElement || !sliderElement.id) return; 
    const valueDisplayId = sliderElement.id + '-value';
    const valueDisplayElement = document.getElementById(valueDisplayId);
    if (valueDisplayElement) {
        let value = parseFloat(sliderElement.value);
        let step = parseFloat(sliderElement.step);
        let decimalPlaces = 0;
        if (step > 0 && step < 1) { 
            const stepString = step.toString();
            if (stepString.includes('.')) {
                decimalPlaces = stepString.split('.')[1].length;
            }
        }
        valueDisplayElement.textContent = value.toFixed(decimalPlaces);
        if (sliderElement.id === 'turnAngle') { 
            valueDisplayElement.textContent += '°';
        }
    }
}

function windowResized() {
    console.log("Anthozoa: windowResized() called - with control panel padding adjustment.");
    const mainTitle = document.getElementById('mainTitle');
    const controlsPanel = document.getElementById('controlsPanel'); 
    const sketchContainer = document.getElementById('sketch-container'); 
    const siteFooter = document.getElementById('site-footer');
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');

    if (!mainTitle || !controlsPanel || !sketchContainer || !siteFooter || !canvasPlaceholder) {
        console.error("Anthozoa: windowResized - CRITICAL layout DIVs missing.");
        if (p5Canvas && typeof resizeCanvas === 'function') {
             resizeCanvas(Math.max(50,100) , Math.max(50,100));
        }
        if (typeof background === 'function') background(200); 
        return;
    }

    let newCanvasWidth, newCanvasHeight;
    let canvasMarginBottom = 15; 
    const placeholderStyle = getComputedStyle(canvasPlaceholder);
    if (placeholderStyle && placeholderStyle.marginBottom) {
        const parsedMargin = parseFloat(placeholderStyle.marginBottom);
        if (!isNaN(parsedMargin)) { canvasMarginBottom = parsedMargin; }
    }

    if (document.fullscreenElement) {
        document.body.classList.add('fullscreen-active');
        newCanvasWidth = window.innerWidth;
        newCanvasHeight = window.innerHeight;
    } else {
        document.body.classList.remove('fullscreen-active');
        
        const controlsPanelStyle = getComputedStyle(controlsPanel);
        const controlsPaddingLeft = parseFloat(controlsPanelStyle.paddingLeft) || 0;
        const controlsPaddingRight = parseFloat(controlsPanelStyle.paddingRight) || 0;
        const controlsTotalHorizontalPadding = controlsPaddingLeft + controlsPaddingRight;

        let baseWidth = sketchContainer.clientWidth;
        newCanvasWidth = baseWidth - controlsTotalHorizontalPadding;

        const bodyStyle = window.getComputedStyle(document.body);
        const bodyVerticalPadding = parseFloat(bodyStyle.paddingTop || 0) + parseFloat(bodyStyle.paddingBottom || 0);
        const titleStyle = window.getComputedStyle(mainTitle);
        const titleHeight = mainTitle.offsetHeight + parseFloat(titleStyle.marginTop || 0) + parseFloat(titleStyle.marginBottom || 0);
        const actualControlsHeight = controlsPanel.offsetHeight + parseFloat(controlsPanelStyle.marginTop || 0) + parseFloat(controlsPanelStyle.marginBottom || 0);
        const footerStyle = window.getComputedStyle(siteFooter);
        const footerTotalHeight = siteFooter.offsetHeight + parseFloat(footerStyle.marginTop || 0) + parseFloat(footerStyle.marginBottom || 0);
        const availableVerticalSpaceForCanvas = window.innerHeight - bodyVerticalPadding - titleHeight - actualControlsHeight - footerTotalHeight - canvasMarginBottom;
        
        newCanvasHeight = availableVerticalSpaceForCanvas;
        
        newCanvasWidth = Math.max(50, newCanvasWidth); 
        newCanvasHeight = Math.max(50, newCanvasHeight); 
    }

    if (p5Canvas && typeof resizeCanvas === 'function') { 
        resizeCanvas(newCanvasWidth, newCanvasHeight);
    } else { console.error("Anthozoa: resizeCanvas function not available or p5Canvas not defined."); }
    
    if (typeof background === 'function' && appSettings && appSettings.backgroundColor) {
         background(appSettings.backgroundColor); 
    } else if (typeof background === 'function') { background(0); }
    console.log("Anthozoa: windowResized() finished, canvas: " + newCanvasWidth + "x" + newCanvasHeight);
}

// Placeholder for Shape class and other logic - to be developed in next steps
// class AnthozoaOrganism { /* ... */ }
// let shapes = []; // Moved to top
// function mousePressed() { /* for seed planting */ }


console.log("Anthozoa.js: Script parsed. p5.js should call setup() soon if linked correctly.");
