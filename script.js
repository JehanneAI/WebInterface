const MAX_BRIGHTNESS = 64;
const INTERVAL = 60;

class PinkNoise {
  constructor() {
    this.b0 = 0.0;
    this.b1 = 0.0;
    this.b2 = 0.0;
    this.b3 = 0.0;
    this.b4 = 0.0;
    this.b5 = 0.0;
    this.b6 = 0.0;
  }

  nextValue() {
    const white = Math.random() * 2 - 1;
    this.b0 = 0.99886 * this.b0 + white * 0.0555179;
    this.b1 = 0.99332 * this.b1 + white * 0.0750759;
    this.b2 = 0.96900 * this.b2 + white * 0.1538520;
    this.b3 = 0.86650 * this.b3 + white * 0.3104856;
    this.b4 = 0.55000 * this.b4 + white * 0.5329522;
    this.b5 = -0.7616 * this.b5 - white * 0.0168980;
    const output = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362;
    this.b6 = white * 0.115926;
    return clamp((output / 10.0 + 0.5) * MAX_BRIGHTNESS);
  }
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();

  const ctx = canvas.getContext('2d');
  let red = new PinkNoise();
  let green = new PinkNoise();
  let blue = new PinkNoise();
  let currentValues = [red.nextValue(), green.nextValue(), blue.nextValue()];
  let targetValues = [red.nextValue(), green.nextValue(), blue.nextValue()];
  let frames = 0;
  const animate = () => {
    if (frames === 0) {
      currentValues = targetValues;
      targetValues = [red.nextValue(), green.nextValue(), blue.nextValue()];
      console.log(`(${currentValues}) -> (${targetValues})`);
    }
    let [r, g, b] = [0, 1, 2].map((i) => clamp(currentValues[i] + (targetValues[i] - currentValues[i]) * frames / INTERVAL));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    frames = (frames + 1) % INTERVAL;
    requestAnimationFrame(animate);
  }

  animate();
})

const clamp = (value)  => {
  return Math.floor(Math.min(Math.max(0, value), MAX_BRIGHTNESS));
}
