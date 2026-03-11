import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
};

if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}
