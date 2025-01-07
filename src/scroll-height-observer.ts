type ScrollHeightObserverCallback = (scrollHeight: number) => void;

export class ScrollHeightObserver {
  #container: HTMLElement;
  #callback: ScrollHeightObserverCallback;
  #mo: MutationObserver;
  #ro: ResizeObserver;

  public constructor(
    container: HTMLElement,
    callback: ScrollHeightObserverCallback
  ) {
    this.#container = container;
    this.#callback = callback;

    this.#mo = new MutationObserver(this.#onMutation);
    this.#mo.observe(this.#container, { childList: true });
    this.#ro = new ResizeObserver(this.#onResize);

    Array.from(this.#container.children).forEach((el) => {
      this.#ro.observe(el, { box: "border-box" });
    });

    this.#callback(this.#container.scrollHeight);
  }

  /**
   * destroy
   */
  public disconnect() {
    this.#mo.disconnect();
    this.#ro.disconnect();
  }

  #onResize = () => {
    this.#callback(this.#container.scrollHeight);
  };

  #onMutation = (mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          this.#ro.observe(node);
        }
      }
      for (const node of mutation.removedNodes) {
        if (node instanceof HTMLElement) {
          this.#ro.unobserve(node);
        }
      }
    }
  };
}
