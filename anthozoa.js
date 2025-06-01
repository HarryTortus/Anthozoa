// anthozoa.js - v0.02: Corrected UI Controls Linked

console.log("Anthozoa.js: Script loaded - v0.02");

const versionNumber = "0.02";
const appSettings = {
    backgroundColor: '#1a1a1a', 
    lineThickness: 1.5,
    baseHue: 180, 
    freezeGrowth: false, 
    bouncyBorder: false, 
    growthSpeed: 1.0,
    repulsionIntensity: 1.0,
    minDistance: 20,
    turnAngle: 30, 
    maxCurveLength: 300,
    noiseInfluence: 0.1,
};

// HTML Element References
let lineThicknessSliderEl, baseHueSliderEl, backgroundColorPickerEl,
    freezeGrowthToggleEl, bouncyBorderToggleEl, 
    growthSpeedSliderEl, repulsionIntensitySliderEl, minDistanceSliderEl,
    turnAngleSliderEl, maxCurveLengthSliderEl, noiseInfluenceSliderEl,
    resetButtonEl, fullscreenButtonEl; 

let p5Canvas; 
// let shapes = []; // Will be used in later versions
// let selectedShape = 'anthozoa_default'; // Not used in this version
// let motionActive = true; // Replaced by appSettings.freezeGrowth

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
    
    // Draw loop will check !appSettings.freezeGrowth for animation
    if (frameCount < 200 || appSettings.freezeGrowth) { 
        fill(180, 180, 180, 150); 
        textAlign(CENTER, CENTER);
        textSize(16);
        if (typeof width !== 'undefined' && typeof height !== 'undefined') { 
            text("Anthozoa v" + versionNumber + (appSettings.freezeGrowth ? " (Frozen)" : " - Controls Linked"), width / 2, height / 2);
        }
    }
    // Actual Anthozoa drawing logic will go here in later versions
}

// --- CONTROL UI SETUP ---
function setupControls() {
    console.log("Anthozoa: setupControls() called for v0.02.");
    let allControlsFound = true;
    const getEl = (id) => { 
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Anthozoa: HTML Element with ID '${id}' not found.`);
            allControlsFound = false; 
        }
        return el;
    };

    // Get elements for Anthozoa v0.02
    lineThicknessSliderEl = getEl('lineThickness');
    baseHueSliderEl = getEl('baseHue');
    backgroundColorPickerEl = getEl('backgroundColor');
    freezeGrowthToggleEl = getEl('freezeGrowthToggle');
    bouncyBorderToggleEl = getEl('bouncyBorderToggle'); 
    growthSpeedSliderEl = getEl('growthSpeed');
    repulsionIntensitySliderEl = getEl('repulsionIntensity');
    minDistanceSliderEl = getEl('minDistance');
    turnAngleSliderEl = getEl('turnAngle');
    maxCurveLengthSliderEl = getEl('maxCurveLength');
    noiseInfluenceSliderEl = getEl('noiseInfluence');
    resetButtonEl = getEl('resetButton'); 
    fullscreenButtonEl = getEl('fullscreenButton'); 
    
    const versionDisplayEl = getEl('versionDisplay');
    if (versionDisplayEl) versionDisplayEl.textContent = `v${versionNumber}`;

    if (!allControlsFound) {
        console.error("Anthozoa: Not all expected control elements were found. Check HTML IDs. Some controls may not work.");
    }

    // Initialize control values from appSettings
    if (lineThicknessSliderEl) lineThicknessSliderEl.value = appSettings.lineThickness;
    if (baseHueSliderEl) baseHueSliderEl.value = appSettings.baseHue;
    if (backgroundColorPickerEl) backgroundColorPickerEl.value = appSettings.backgroundColor;
    if (freezeGrowthToggleEl) freezeGrowthToggleEl.checked = appSettings.freezeGrowth;
    if (bouncyBorderToggleEl) bouncyBorderToggleEl.checked = appSettings.bouncyBorder;
    if (growthSpeedSliderEl) growthSpeedSliderEl.value = appSettings.growthSpeed;
    if (repulsionIntensitySliderEl) repulsionIntensitySliderEl.value = appSettings.repulsionIntensity;
    if (minDistanceSliderEl) minDistanceSliderEl.value = appSettings.minDistance;
    if (turnAngleSliderEl) turnAngleSliderEl.value = appSettings.turnAngle;
    if (maxCurveLengthSliderEl) maxCurveLengthSliderEl.value = appSettings.maxCurveLength;
    if (noiseInfluenceSliderEl) noiseInfluenceSliderEl.value = appSettings.noiseInfluence;
    
    document.querySelectorAll('.controls input[type="range"]').forEach(slider => {
        if(slider) { 
            updateSliderValueDisplay(slider);
            updateRangeSliderFill(slider); 
        }
    });
    
    // --- Event Listeners ---
    const addInputListener = (el, settingName, isCheckbox = false, isColor = false) => {
        if (el) {
            const eventToUse = (el.type === 'range' || isColor) ? 'input' : 'change';
            el.addEventListener(eventToUse, (e) => {
                appSettings[settingName] = isCheckbox ? e.target.checked : (isColor ? e.target.value : parseFloat(e.target.value));
                if (el.type === 'range') updateSliderValueDisplay(el);
                if (settingName === 'backgroundColor') { 
                    if (typeof background === 'function') background(appSettings.backgroundColor);
                }
                // For freezeGrowth, update the text on canvas for immediate feedback
                if (settingName === 'freezeGrowth' && (frameCount > 200 || !appSettings.freezeGrowth)) {
                     if (typeof background === 'function') background(appSettings.backgroundColor); // Redraw to clear old text
                     // The draw loop will handle drawing the new text based on appSettings.freezeGrowth
                }
                console.log("Anthozoa AppSetting Changed:", settingName, "=", appSettings[settingName]); 
            });
        }
    };

    addInputListener(lineThicknessSliderEl, 'lineThickness');
    addInputListener(baseHueSliderEl, 'baseHue');
    addInputListener(backgroundColorPickerEl, 'backgroundColor', false, true);
    addInputListener(freezeGrowthToggleEl, 'freezeGrowth', true);
    addInputListener(bouncyBorderToggleEl, 'bouncyBorder', true);
    addInputListener(growthSpeedSliderEl, 'growthSpeed');
    addInputListener(repulsionIntensitySliderEl, 'repulsionIntensity');
    addInputListener(minDistanceSliderEl, 'minDistance');
    addInputListener(turnAngleSliderEl, 'turnAngle');
    addInputListener(maxCurveLengthSliderEl, 'maxCurveLength');
    addInputListener(noiseInfluenceSliderEl, 'noiseInfluence');

    if(resetButtonEl) {
        resetButtonEl.addEventListener('click', () => {
            console.log("Anthozoa: Reset button clicked.");
            // Reset appSettings to initial defaults
            appSettings.backgroundColor = '#1a1a1a'; 
            appSettings.lineThickness = 1.5; appSettings.baseHue = 180; 
            appSettings.freezeGrowth = false; appSettings.bouncyBorder = false; 
            appSettings.growthSpeed = 1.0; appSettings.repulsionIntensity = 1.0; 
            appSettings.minDistance = 20; appSettings.turnAngle = 30; 
            appSettings.maxCurveLength = 300; appSettings.noiseInfluence = 0.1;
            
            // Update HTML controls to reflect these defaults
            if (lineThicknessSliderEl) lineThicknessSliderEl.value = appSettings.lineThickness;
            if (baseHueSliderEl) baseHueSliderEl.value = appSettings.baseHue;
            if (backgroundColorPickerEl) backgroundColorPickerEl.value = appSettings.backgroundColor;
            if (freezeGrowthToggleEl) freezeGrowthToggleEl.checked = appSettings.freezeGrowth;
            if (bouncyBorderToggleEl) bouncyBorderToggleEl.checked = appSettings.bouncyBorder;
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
        if (sliderElement.id === 'turnAngle') { // Add degree symbol for turn angle
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

// Placeholder for Shape class - to be developed next
// class AnthozoaOrganism { /* ... */ }

console.log("Anthozoa.js: Script parsed. p5.js should call setup() soon if linked correctly.");
