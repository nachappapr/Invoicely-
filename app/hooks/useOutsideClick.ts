import { useCallback, useEffect, type RefObject } from "react";

type EventListener = (event: MouseEvent) => void;

export const useOutsideClick = <T extends HTMLElement>({
  ref,
  callback,
}: {
  ref: RefObject<T>;
  callback: EventListener;
}): void => {
  const handleClickOutside: EventListener = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    },
    [callback, ref]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useOutsideClick;
