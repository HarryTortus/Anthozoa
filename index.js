// Select the canvas and set up the context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variables to track drawing state
let isDrawing = false;
let points = [];

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  points = [{ x: e.clientX, y: e.clientY }];
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const point = { x: e.clientX, y: e.clientY };
  points.push(point);

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
});

// Stop drawing and trigger the repulsive curve logic
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  if (points.length > 1) {
    generateRepulsiveCurve(points);
  }
});

// Placeholder for repulsive curve logic
function generateRepulsiveCurve(initialPoints) {
  console.log('Generating repulsive curve with points:', initialPoints);
  // TODO: Implement the algorithm based on your research
}
