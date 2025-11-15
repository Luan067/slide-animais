import debounce from "./debounce.js";
export default class Slide {
  constructor(slide, container) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.dist = { finalPos: 0, startX: 0, movement: 0 };
  }

  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      moveType = "mousemove";
      this.dist.startX = event.clientX;
    } else {
      moveType = "touchmove";
      this.dist.startX = event.changedTouches[0].clientX;
    }
    this.container.addEventListener(moveType, this.onMove);
  }

  onMove(event) {
    const pointerPos = event.type === "mousemove" ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPos);
    this.moveSlide(finalPosition);
  }

  updatePosition(clientX) {
    this.dist.movement = this.dist.startX - clientX;
    return this.dist.finalPos - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.container.removeEventListener(movetype, this.onMove);
    this.dist.finalPos = this.dist.movePosition;
  }

  addSlideEvents() {
    this.container.addEventListener("mousedown", this.onStart);
    this.container.addEventListener("mouseup", this.onEnd);
    this.container.addEventListener("touchstart", this.onStart);
    this.container.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  slideCenterPosition(slide) {
    const margin = (this.container.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((item) => {
      const position = this.slideCenterPosition(item);
      return {
        position,
        element: item,
      };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index + 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPos = activeSlide.position;
  }

  init() {
    this.bindEvents();
    this.slidesConfig();
    this.addSlideEvents();
    return this;
  }
}
