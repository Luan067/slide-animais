import debounce from "./debounce.js";
export default class Slide {
  constructor(slide, container) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.dist = { finalPos: 0, startX: 0, movement: 0 };
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.container.addEventListener("mousemove", this.onMove);
  }

  updatePosition(clientX) {
    this.dist.movement = this.dist.startX - clientX;
    return this.dist.finalPos - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    this.dist.finalPos = this.dist.movePosition;
    this.container.removeEventListener("mousemove", this.onMove);
  }

  addSlideEvents() {
    this.container.addEventListener("mousedown", this.onStart);
    this.container.addEventListener("mouseup", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
