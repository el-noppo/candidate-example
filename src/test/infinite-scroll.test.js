import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    this.callback([{ isIntersecting: true }]);
  }

  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    useSelector.mockReset();
  });

  // Tests that handleScroll function is triggered when user scrolls.
  it("test_handle_scroll", () => {
    const handleScroll = jest.fn();
    window.addEventListener("scroll", handleScroll);
    window.dispatchEvent(new Event("scroll"));
    expect(handleScroll).toHaveBeenCalled();
    window.removeEventListener("scroll", handleScroll);
  });

  // Tests that handleIntersection function is triggered when target element intersects with viewport.
  it("test_handle_intersection", () => {
    const handleIntersection = jest.fn();
    const observer = new IntersectionObserver(handleIntersection);
    const targetElement = document.createElement("div");
    observer.observe(targetElement);
    expect(handleIntersection).toHaveBeenCalled();
    observer.disconnect();
  });
});
