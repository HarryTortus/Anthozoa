// anthozoa.js - v0.01 (Base from Line Flow, for external file structure)

console.log("Anthozoa: Script execution started.");
let freezeNoiseTime = 0; // This is specific to Line Flow's current drawing logic
const versionNumber = "0.01"; 

const appSettings = { // Renamed from 'settings' for Anthozoa
    // Line Flow settings, will be adapted for Anthozoa
    resolution: 20,         
    lineLength: 30,         
    noiseScale: 0.001,      
    noiseSpeed: 0.0001,     
    lineThickness: 1.5,     // Default from Line Flow appearance group
    lineColor: '#f0f2f5',   // MODIFIED: Default light line color for Anthozoa's dark bg
    backgroundColor: '#1a1a1a',// MODIFIED: Darker bg for Anthozoa
    freeze: false, // Will become 'freezeGrowth' or similar if needed for Anthozoa
    dynamicColor: false,    
    hueShift: 180,          
    hueRangeWidth: 270      
};

let p5Canvas; // To hold the p5.js canvas element

function updateRangeSliderFill(inputElement) {
    if (!inputElement) return; 
    const min = parseFloat(inputElement.min || 0);
    const max = parseFloat(inputElement.max || 1);
    const value = parseFloat(inputElement.value);
    const percentage = ((value - min) / (max - min)) * 100;
    inputElement.style.setProperty('--range-progress', `${percentage}%`);
}

function setup() {
    console.log("Anthozoa: p5.js setup() called.");
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');
    if (!canvasPlaceholder) {
        console.error("Anthozoa FATAL: #p5-canvas-placeholder not found!");
        return;
    }
    p5Canvas = createCanvas(1, 1); // Create a 1x1 canvas initially
    if (!p5Canvas || !p5Canvas.elt) {
        console.error("Anthozoa FATAL: createCanvas() failed to return a valid element.");
        return;
    }
    try {
        p5Canvas.parent(canvasPlaceholder);
        console.log("Anthozoa: Canvas created and parented.");
    } catch (e) {
        console.error("Anthozoa FATAL: Error parenting canvas:", e);
        return;
    }
    
    try {
        background(appSettings.backgroundColor);
    } catch (e) {
        console.error("Anthozoa Error setting initial background in setup():", e);
    }
    strokeCap(ROUND); // From Line Flow
    
    if (!setupControls()) { 
         console.warn("Anthozoa: setupControls() reported an issue. UI might be incomplete.");
    }
    // Initialize range slider fills after controls are set up and values loaded
    document.querySelectorAll('.controls input[type="range"]').forEach(updateRangeSliderFill);
    
    windowResized(); 
    console.log("Anthozoa: p5.js setup() finished.");
}

function draw() {
    // For Anthozoa v0.01, this will still draw Line Flow visuals as a placeholder
    try {
        background(appSettings.backgroundColor); 
    } catch (e) {
        console.error("Anthozoa Error in draw() background call:", e); return; 
    }

    // Using appSettings directly for drawing parameters
    let currentFreezeState = appSettings.freeze; 
    let currentNoiseSpeed = appSettings.noiseSpeed;
    let currentLineThickness = appSettings.lineThickness;
    let currentResolution = appSettings.resolution;
    let currentLineLength = appSettings.lineLength;
    let currentNoiseScale = appSettings.noiseScale;

    let noiseZ = currentFreezeState ? freezeNoiseTime : (freezeNoiseTime = millis() * currentNoiseSpeed);
    strokeWeight(currentLineThickness);

    if (currentResolution <= 0) {
        if (frameCount < 2 && frameCount > 0) console.warn("Anthozoa: Resolution is <= 0."); 
        return; 
    }

    for (let y = -currentLineLength; y < height + currentLineLength; y += currentResolution) {
        for (let x = -currentLineLength; x < width + currentLineLength; x += currentResolution) {
            let rawNoiseValue = noise(x * currentNoiseScale, y * currentNoiseScale, noiseZ);
            let angle = rawNoiseValue * TWO_PI * 2;

            if (appSettings.dynamicColor) { 
                colorMode(HSB, 360, 100, 100);
                const halfHueRangeWidth = appSettings.hueRangeWidth / 2; 
                let hueOffset = map(rawNoiseValue, 0, 1, -halfHueRangeWidth, halfHueRangeWidth);
                let finalHue = (appSettings.hueShift + hueOffset + 360) % 360; 
                stroke(finalHue, 80, 90);
            } else {
                colorMode(RGB, 255, 255, 255);
                stroke(appSettings.lineColor); 
            }
            line(x, y, x + cos(angle) * currentLineLength, y + sin(angle) * currentLineLength);
        }
    }
}

function windowResized() {
    console.log("Anthozoa: windowResized() called.");
    const mainTitle = document.getElementById('mainTitle');
    const controlsPanel = document.getElementById('controlsPanel');
    const sketchContainer = document.getElementById('sketch-container');
    const siteFooter = document.getElementById('site-footer');
    const canvasPlaceholder = document.getElementById('p5-canvas-placeholder');


    if (!mainTitle || !controlsPanel || !sketchContainer || !siteFooter || !canvasPlaceholder) {
        console.error("Anthozoa: windowResized - Critical layout elements missing.");
        if (p5Canvas && typeof resizeCanvas === 'function') resizeCanvas(100,100); 
        if (typeof background === 'function') background(220); 
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
        
        // This is the canvas sizing logic that makes width primary and adjusts height
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
        
        let desiredSquareHeight = newCanvasWidth; 
        if (desiredSquareHeight > availableVerticalSpaceForCanvas) {
            newCanvasHeight = availableVerticalSpaceForCanvas; 
        } else {
            newCanvasHeight = desiredSquareHeight; 
        }
        
        newCanvasWidth = Math.max(50, newCanvasWidth); 
        newCanvasHeight = Math.max(50, newCanvasHeight);
    }

    if (p5Canvas && typeof resizeCanvas === 'function') {
        resizeCanvas(newCanvasWidth, newCanvasHeight);
    } 
    if (typeof background === 'function' && appSettings && appSettings.backgroundColor) {
         background(appSettings.backgroundColor); 
    } else if (typeof background === 'function') {
        background(0); // Fallback
    }
    console.log("Anthozoa: windowResized() finished, canvas: " + newCanvasWidth + "x" + newCanvasHeight);
}
       
function setupControls() {
    console.log("Anthozoa: setupControls() started.");
    let allElementsFoundCritical = true;
    const getEl = (id, isCritical = false) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Anthozoa: HTML Element with ID '${id}' not found.`);
            if (isCritical) {
                allElementsFoundCritical = false;
                console.error(`Anthozoa: CRITICAL HTML Element with ID '${id}' not found.`);
            }
        }
        return el;
    };

    // These are IDs from Line Flow's controls, which are in the initial Anthozoa HTML
    const criticalControlIds = ['fixedLineColorControl', 'dynamicColorHueShiftControl', 'hueShift', 'fullscreenButton', 'reset', 'resolution', 'lineLength', 'noiseScale', 'noiseSpeed', 'lineThickness', 'lineColor', 'backgroundColor', 'freeze', 'dynamicColor'];
    criticalControlIds.forEach(id => getEl(id, true)); 

    const hueShiftColorSwatch = getEl('hueShiftColorSwatch', false); 
    const versionDisplayEl = getEl('versionDisplay', false); 
    const resVal = getEl('resolution-value'); const lenVal = getEl('lineLength-value');
    const noiseSVal = getEl('noiseScale-value'); const noiseSpVal = getEl('noiseSpeed-value');
    const thickVal = getEl('lineThickness-value');

    if (!allElementsFoundCritical) {
        console.error("Anthozoa: One or more CRITICAL control elements missing. Setup may not complete correctly.");
        return false; 
    }
    
    if (versionDisplayEl) { versionDisplayEl.textContent = `v${versionNumber}`; }

    Object.keys(appSettings).forEach(key => {
        const input = document.getElementById(key); 
        if (input) {
            try {
                if (input.type === 'checkbox') { input.checked = appSettings[key]; }
                else { if (typeof input.value !== 'undefined') { input.value = appSettings[key]; } }
            } catch (e) { console.error(`Anthozoa: Error setting value/checked for input #${key}:`, e); }
        } 
    });
    
    const fixedLineColorControl = document.getElementById('fixedLineColorControl'); 
    const dynamicColorHueShiftControl = document.getElementById('dynamicColorHueShiftControl');
    if (fixedLineColorControl && dynamicColorHueShiftControl) { 
        if (appSettings.dynamicColor) {
            fixedLineColorControl.style.display = 'none';
            dynamicColorHueShiftControl.style.display = 'flex';
        } else {
            fixedLineColorControl.style.display = 'flex';
            dynamicColorHueShiftControl.style.display = 'none';
        }
    }

    function updateLabels() {
        const el_resVal = getEl('resolution-value'); if(el_resVal) el_resVal.textContent = appSettings.resolution;
        const el_lenVal = getEl('lineLength-value'); if(el_lenVal) el_lenVal.textContent = Number(appSettings.lineLength).toFixed(0);
        const el_noiseSVal = getEl('noiseScale-value'); if(el_noiseSVal) el_noiseSVal.textContent = (appSettings.noiseScale * 1000).toFixed(0);
        const el_noiseSpVal = getEl('noiseSpeed-value'); if(el_noiseSpVal) el_noiseSpVal.textContent = (appSettings.noiseSpeed * 10000).toFixed(0);
        const el_thickVal = getEl('lineThickness-value'); if(el_thickVal) el_thickVal.textContent = Number(appSettings.lineThickness).toFixed(1);
        
        const swatch = getEl('hueShiftColorSwatch'); 
        if (swatch && appSettings.dynamicColor) { 
             swatch.style.backgroundColor = `hsl(${appSettings.hueShift}, 80%, 70%)`;
        } else if (swatch) { swatch.style.backgroundColor = 'transparent';}
    }
    updateLabels(); 

    document.querySelectorAll('.controls input, .controls button').forEach(el => {
        if (el.tagName === 'BUTTON' && el.id !== 'reset' && el.id !== 'fullscreenButton') return;
        let eventType = (el.type === 'range' || el.type === 'color') ? 'input' : 'change';
        if (el.type === 'checkbox') eventType = 'change';
        if (el.tagName === 'BUTTON') eventType = 'click';

        el.addEventListener(eventType, e => { 
            const id = e.target.id; const target = e.target; let value;
            if (target.type === 'checkbox') value = target.checked;
            else if (target.type === 'range' || target.type === 'number') value = Number(target.value);
            else value = target.value;

            if (target.tagName !== 'BUTTON' && appSettings.hasOwnProperty(id)) { 
                appSettings[id] = value; 
            }
            const fLCC = getEl('fixedLineColorControl'); 
            const dCHSC = getEl('dynamicColorHueShiftControl');
            if (id === 'dynamicColor' && fLCC && dCHSC) {
                if (appSettings.dynamicColor) {
                    fLCC.style.display = 'none'; dCHSC.style.display = 'flex';
                } else {
                    fLCC.style.display = 'flex'; dCHSC.style.display = 'none';
                }
            }
            if (target.type === 'range') updateRangeSliderFill(target);
            if (id === 'backgroundColor' && typeof background === 'function') background(appSettings.backgroundColor); 
            updateLabels();
        });
    });
    
    const rstBtn = getEl('reset');
    if(rstBtn) rstBtn.addEventListener('click', () => {
        console.log("Anthozoa: Reset button clicked.");
        // Reset appSettings object to defaults
        appSettings.resolution = 20; appSettings.lineLength = 30; appSettings.noiseScale = 0.001;
        appSettings.noiseSpeed = 0.0001; appSettings.lineThickness = 1.5; // Use new default
        appSettings.lineColor = '#f0f2f5'; // Use new default
        appSettings.backgroundColor = '#1a1a1a'; // Use new default
        appSettings.freeze = false; appSettings.dynamicColor = false;
        appSettings.hueShift = 180; 
        // Reset any future Anthozoa-specific settings here too
        
        freezeNoiseTime = 0; 
        
        Object.keys(appSettings).forEach(key => {
            const input = document.getElementById(key); // Use direct getElementById here for safety
            if (input) {
                if (input.type === 'checkbox') input.checked = appSettings[key];
                else input.value = appSettings[key];
                if (input.type === 'range') updateRangeSliderFill(input);
            }
        });
        const fLCC = getEl('fixedLineColorControl'); 
        const dCHSC = getEl('dynamicColorHueShiftControl');
        if (fLCC && dCHSC) { fLCC.style.display = 'flex'; dCHSC.style.display = 'none'; }
        updateLabels(); 
        if(typeof background === 'function') background(appSettings.backgroundColor);
    });

    const fsBtn = getEl('fullscreenButton');
    if(fsBtn) fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(`Error: ${err.message} (${err.name})`));
        } else {
            if(document.exitFullscreen) document.exitFullscreen();
        }
    });

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => 
        document.addEventListener(event, windowResized)
    );
    console.log("Anthozoa: setupControls() finished successfully.");
    return true; 
}
console.log("Anthozoa.js: Script execution finished parsing.");
