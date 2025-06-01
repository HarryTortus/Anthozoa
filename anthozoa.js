// anthozoa.js - v0.04: Correct Canvas Padding & Vertical Fill

console.log("Anthozoa.js: Script loaded - v0.04");

const versionNumber = "0.04";
const appSettings = {
    backgroundColor: '#1a1a1a', 
    lineThickness: 1.5,
    lineColor: '#f0f2f5', // Default line color (light for dark bg)
    isAnimating: true,    // true means playing, false means paused
    // Bouncy Border was removed in a previous step, will be re-added later if desired
    growthSpeed: 1.0,
    repulsionIntensity: 1.0,
    minDistance: 20,
    turnAngle: 30, 
    maxCurveLength: 300,
    noiseInfluence: 0.1,
};

// HTML Element References
let lineThicknessSliderEl, lineColorPickerEl, backgroundColorPickerEl,
    playPauseButtonEl, 
    growthSpeedSliderEl, repulsionIntensitySliderEl, minDistanceSliderEl,
    turnAngleSliderEl, maxCurveLengthSliderEl, noiseInfluenceSliderEl,
    resetButtonEl, fullscreenButtonEl; 

let p5Canvas; 
let shapes = []; // Will hold our AnthozoaOrganism instances in future phases

// --- UTILITY FUNCTIONS ---
function updateRangeSliderFill(inputElement) {
    if (!inputElement) return;
    const min = parseFloat(inputElement.min || 0);
    const max = parseFloat(inputElement.max || 1);
    const value = parseFloat(inputElement.value);
    const percentage = ((value - min) / (max - min)) * 100;
    inputElement.style.setProperty('--range-progress', `${percentage}%`);
}

// --- P5.JS SETUP & DRAW ---
function setup() {
    console.log("Anthozoa: p5.js setup() called.");
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');
    
    if (!canvasPlaceholder) {
        console.error("Anthozoa FATAL: Canvas placeholder DIV with ID '#p5-canvas-placeholder' not found in HTML!");
        let body = document.querySelector('body');
        if (body) body.innerHTML = '<h1 style="color:red; text-align:center; margin-top: 50px;">Error: HTML structure incomplete. Canvas placeholder missing.</h1>';
        noLoop(); 
        return; 
    }

    try {
        p5Canvas = createCanvas(100, 100); 
        if (p5Canvas && p5Canvas.elt) { 
            p5Canvas.parent(canvasPlaceholder);
            console.log("Anthozoa: Canvas created and parented.");
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
        background(0); 
    }
    
    let statusText = "Anthozoa v" + versionNumber;
    if (!appSettings.isAnimating) {
        statusText += " (Paused)";
    } else if (frameCount < 200) { 
        statusText += " - Controls Ready";
    }

    if (typeof width !== 'undefined' && typeof height !== 'undefined') { 
        fill(180, 180, 180, 150); 
        textAlign(CENTER, CENTER);
        textSize(16);
        text(statusText, width / 2, height / 2);
    }
    
    // if (appSettings.isAnimating) {
    //     // Future: Update and display Anthozoa organisms
    // }
}

// --- CONTROL UI SETUP ---
function setupControls() {
    console.log("Anthozoa: setupControls() called for v0.04.");
    let allControlsFound = true;
    const getEl = (id, isCritical = true) => { 
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Anthozoa: HTML Element with ID '${id}' not found.`);
            if (isCritical) allControlsFound = false; 
        }
        return el;
    };

    // Get elements defined in the current Anthozoa HTML
    lineThicknessSliderEl = getEl('lineThickness', true);
    lineColorPickerEl = getEl('lineColor', true); 
    backgroundColorPickerEl = getEl('backgroundColor', true);
    playPauseButtonEl = getEl('playPauseButton', true); 
    // bouncyBorderToggleEl was removed
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
    playPauseButtonEl.innerHTML = appSettings.isAnimating ? "Pause" : "Play"; 
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
    const addInputListener = (el, settingName, isColor = false) => { 
        if (el) {
            const eventToUse = (el.type === 'range' || isColor) ? 'input' : 'change'; 
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
    addInputListener(lineColorPickerEl, 'lineColor', true); 
    addInputListener(backgroundColorPickerEl, 'backgroundColor', true); 
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
            appSettings.growthSpeed = 1.0; appSettings.repulsionIntensity = 1.0; 
            appSettings.minDistance = 20; appSettings.turnAngle = 30; 
            appSettings.maxCurveLength = 300; appSettings.noiseInfluence = 0.1;
            
            // Update HTML controls
            if (lineThicknessSliderEl) lineThicknessSliderEl.value = appSettings.lineThickness;
            if (lineColorPickerEl) lineColorPickerEl.value = appSettings.lineColor;
            if (backgroundColorPickerEl) backgroundColorPickerEl.value = appSettings.backgroundColor;
            if (playPauseButtonEl) playPauseButtonEl.innerHTML = appSettings.isAnimating ? "Pause" : "Play";
            if (growthSpeedSliderEl) growthSpeedSliderEl.value = appSettings.growthSpeed;
            if (repulsionIntensitySliderEl) repulsionIntensitySliderEl.value = appSettings.repulsionIntensity;
            if (minDistanceSliderEl) minDistanceSliderEl.value = appSettings.minDistance;
            if (turnAngleSliderEl) turnAngleSliderEl.value = appSettings.turnAngle;
            if (maxCurveLengthSliderEl) maxCurveLengthSliderEl.value = appSettings.maxCurveLength;
            if (noiseInfluenceSliderEl) noiseInfluenceSliderEl.value = appSettings.noiseInfluence;

            document.querySelectorAll('.controls input[type="range"]').forEach(slider => {
                if(slider) { updateSliderValueDisplay(slider); updateRangeSliderFill(slider); }
            });
            if (typeof background === 'function') background(appSettings.backgroundColor); 
            shapes = []; 
        });
    }

    if(fullscreenButtonEl) { 
        fullscreenButtonEl.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message} (${err.name})`));
            } else { if (document.exitFullscreen) document.exitFullscreen(); }
        });
    }

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event =>
        document.addEventListener(event, windowResized)
    );
    console.log("Anthozoa: setupControls() finished successfully.");
    return true; 
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
    console.log("Anthozoa: windowResized() called - applying canvas padding and vertical fill logic.");
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
    console.log("Anthozoa: windowResized() finished, canvas is: " + newCanvasWidth + "x" + newCanvasHeight);
}

// Placeholder for AnthozoaOrganism class, mousePressed for seed planting, etc.
// These will be the focus of our next development steps for Phase 1.

console.log("Anthozoa.js: Script parsed. p5.js should call setup() soon if linked correctly.");
