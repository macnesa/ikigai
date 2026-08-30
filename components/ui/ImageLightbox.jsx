"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const DRAG_THRESHOLD = 8;
const SWIPE_THRESHOLD = 50;
const EXIT_DURATION = 150;

export function useImageLightbox() {
  const [activeIndex, setActiveIndex] = useState(null);
  const openerRef = useRef(null);
  const pointerGestureRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const handlePointerDown = useCallback((event) => {
    if (!event.isPrimary) return;

    pointerGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event) => {
    const gesture = pointerGestureRef.current;

    if (gesture.pointerId !== event.pointerId) return;

    const distanceX = Math.abs(event.clientX - gesture.startX);
    const distanceY = Math.abs(event.clientY - gesture.startY);

    if (distanceX > DRAG_THRESHOLD || distanceY > DRAG_THRESHOLD) {
      gesture.moved = true;
    }
  }, []);

  const handlePointerEnd = useCallback((event) => {
    if (pointerGestureRef.current.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    pointerGestureRef.current.pointerId = null;
  }, []);

  const handlePointerCancel = useCallback((event) => {
    if (pointerGestureRef.current.pointerId !== event.pointerId) return;

    pointerGestureRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
    };
  }, []);

  const openImage = useCallback((index, event) => {
    const gesture = pointerGestureRef.current;

    if (event.detail !== 0 && gesture.moved) {
      event.preventDefault();
      gesture.moved = false;
      return;
    }

    gesture.moved = false;
    openerRef.current = event.currentTarget;
    setActiveIndex(index);
  }, []);

  const closeImage = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return {
    activeIndex,
    closeImage,
    handlePointerCancel,
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    openImage,
    openerRef,
    setActiveIndex,
  };
}

export default function ImageLightbox({
  activeIndex,
  images,
  label,
  onClose,
  onIndexChange,
  returnFocusRef,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeTimerRef = useRef(null);
  const reduceMotionRef = useRef(false);
  const swipeRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    suppressClick: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImageSrc, setLoadedImageSrc] = useState(null);

  const activeImage = images[activeIndex];
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const goPrevious = useCallback(() => {
    if (canGoPrevious) {
      onIndexChange(activeIndex - 1);
    }
  }, [activeIndex, canGoPrevious, onIndexChange]);

  const goNext = useCallback(() => {
    if (canGoNext) {
      onIndexChange(activeIndex + 1);
    }
  }, [activeIndex, canGoNext, onIndexChange]);

  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) return;

    if (reduceMotionRef.current) {
      onClose();
      return;
    }

    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(onClose, EXIT_DURATION);
  }, [onClose]);

  useEffect(() => {
    reduceMotionRef.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.connection?.saveData === true;

    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(frame);

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const opener = returnFocusRef.current || document.activeElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const currentPaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    const previousBodyStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const previousScrollBehavior = root.style.scrollBehavior;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(focusFrame);

      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;

      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;

      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [returnFocusRef]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [goNext, goPrevious, requestClose]);

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) return;

    swipeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      suppressClick: false,
    };
  };

  const handlePointerUp = (event) => {
    const swipe = swipeRef.current;

    if (swipe.pointerId !== event.pointerId) return;

    const distanceX = event.clientX - swipe.startX;
    const distanceY = event.clientY - swipe.startY;
    const isHorizontalSwipe =
      Math.abs(distanceX) >= SWIPE_THRESHOLD &&
      Math.abs(distanceX) > Math.abs(distanceY) * 1.2;

    swipe.pointerId = null;

    if (!isHorizontalSwipe) return;

    swipe.suppressClick = true;

    if (distanceX < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleClickCapture = (event) => {
    if (!swipeRef.current.suppressClick) return;

    event.preventDefault();
    event.stopPropagation();
    swipeRef.current.suppressClick = false;
  };

  if (!activeImage) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label}, image ${activeIndex + 1} of ${images.length}`}
      tabIndex={-1}
      className={`fixed inset-0 z-[100] grid place-items-center bg-black/[0.96] px-4 py-14 text-white transition-opacity duration-150 ease-out [touch-action:pan-y] motion-reduce:transition-none md:px-20 md:py-12 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        swipeRef.current.pointerId = null;
        swipeRef.current.suppressClick = false;
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={requestClose}
        aria-label="Close image viewer"
        className="round-control absolute top-4 right-4 z-[2] border-white/30 bg-black/50 text-white focus-visible:outline-white md:top-6 md:right-6"
      >
        <X aria-hidden="true" size={19} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={goPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous image"
        className="round-control absolute left-5 z-[2] hidden border-white/30 bg-black/50 text-white focus-visible:outline-white disabled:opacity-25 md:grid lg:left-8"
      >
        <ArrowLeft aria-hidden="true" size={19} strokeWidth={1.5} />
      </button>

      <img
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        loading="eager"
        decoding="async"
        draggable="false"
        onLoad={() => setLoadedImageSrc(activeImage.src)}
        onError={() => setLoadedImageSrc(activeImage.src)}
        className={`block h-auto max-h-[calc(100dvh-7rem)] w-auto max-w-[calc(100vw-2rem)] select-none object-contain transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none md:max-h-[calc(100dvh-6rem)] md:max-w-[calc(100vw-10rem)] ${
          isVisible && loadedImageSrc === activeImage.src
            ? "scale-100 opacity-100"
            : "scale-[0.99] opacity-0"
        }`}
      />

      <button
        type="button"
        onClick={goNext}
        disabled={!canGoNext}
        aria-label="Next image"
        className="round-control absolute right-5 z-[2] hidden border-white/30 bg-black/50 text-white focus-visible:outline-white disabled:opacity-25 md:grid lg:right-8"
      >
        <ArrowRight aria-hidden="true" size={19} strokeWidth={1.5} />
      </button>
    </div>,
    document.body,
  );
}
