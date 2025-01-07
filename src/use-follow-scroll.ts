import { useCallback } from "react";

import { useRef, useState } from "react";

import { FollowScroll } from "./follow-scroll";

const noop = () => {};

export function useFollowScroll() {
  const stbRef = useRef<FollowScroll>(undefined);
  const [isSticky, setSticky] = useState(false);

  const ref = useCallback((el: HTMLElement | null) => {
    if (el) {
      stbRef.current = new FollowScroll(el);
      stbRef.current.addEventListener("follow", () => setSticky(true));
      stbRef.current.addEventListener("unfollow", () => setSticky(false));
    }

    if (!el) {
      stbRef.current?.destroy();
    }
  }, []);

  return { ref, isSticky, gotoEnd: stbRef.current?.gotoEnd ?? noop };
}
