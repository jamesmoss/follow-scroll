import { ScrollHeightObserver } from "./scroll-height-observer";

export type FollowScrollOptions = {
  threshold: number;
  behavior: "auto" | "smooth" | "instant";
};

export class FollowScroll extends EventTarget {
  #container: HTMLElement;
  #options: FollowScrollOptions;
  #ro: ResizeObserver;
  #sho: ScrollHeightObserver;
  #raf: number = 0;
  #isFollowing: boolean = true;
  #isOverflowing: boolean = false;
  #containerHeight: number = 0;
  #lastScroll: number = 0;

  public constructor(
    ref: HTMLElement,
    options: Partial<FollowScrollOptions> = {}
  ) {
    super();
    this.#container = ref;
    this.#options = { threshold: 5, behavior: "smooth", ...options };

    this.#ro = new ResizeObserver(this.#onResize);
    this.#ro.observe(this.#container);
    this.#sho = new ScrollHeightObserver(this.#container, this.#recalc);
    this.#container.addEventListener("scroll", this.#onScroll);
  }

  /**
   * destroy
   */
  public destroy() {
    cancelAnimationFrame(this.#raf);
    this.#container.removeEventListener("scroll", this.#onScroll);
    this.#ro.disconnect();
    this.#sho.disconnect();
  }

  public gotoEnd = (behavior?: FollowScrollOptions["behavior"]) => {
    this.#container.scrollTo({
      top: this.#container.scrollHeight,
      behavior: behavior ?? this.#options.behavior,
    });
  };

  #onResize = (entries: ResizeObserverEntry[]) => {
    this.#containerHeight = entries[0].contentRect.height;
    this.#recalc();
  };

  #recalc = () => {
    const isOverflowing = this.#container.scrollHeight > this.#containerHeight;

    if (!isOverflowing && this.#isOverflowing) {
      this.#isFollowing = true;
      this.dispatchEvent(new Event("follow"));
    }

    this.#isOverflowing = isOverflowing;

    if (this.#isOverflowing && this.#isFollowing) {
      cancelAnimationFrame(this.#raf);
      // this.#raf = requestAnimationFrame(() => {
      this.#container.scrollTo({
        top: this.#container.scrollHeight,
        behavior: this.#options.behavior,
      });
      //   });
    }
  };

  #onScroll = () => {
    const didScrollUp = this.#container.scrollTop < this.#lastScroll;

    const distanceToEnd =
      this.#container.scrollHeight -
      this.#container.scrollTop -
      this.#containerHeight;

    const isAtEnd =
      this.#isOverflowing && distanceToEnd < this.#options.threshold;

    if (didScrollUp && this.#isFollowing) {
      this.#isFollowing = false;
      this.dispatchEvent(new Event("unfollow"));
    }

    if (isAtEnd && !this.#isFollowing) {
      this.#isFollowing = true;
      this.dispatchEvent(new Event("follow"));
    }

    this.#lastScroll = this.#container.scrollTop;
  };
}
