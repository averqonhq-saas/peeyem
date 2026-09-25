"use client";

import { useEffect, useRef } from "react";

export interface ParallaxOptions {
  /** Maximum tilt angle in degrees. Default: 8 */
  maxTilt?: number;
  /** Max translation offset in pixels. Default: 20 */
  maxTranslate?: number;
  /** Scroll parallax factor. Default: 0.14 */
  scrollFactor?: number;
  /** Lerp smoothing factor (0.01 - 0.3). Default: 0.1 */
  smoothing?: number;
  /** Enable dynamic specular glare effect. Default: true */
  glare?: boolean;
  /** Enable device orientation tilt on supported mobile devices. Default: true */
  deviceOrientation?: boolean;
}

/**
 * High-performance 3D Parallax hook using CSS custom properties & requestAnimationFrame.
 * Updates `--rx`, `--ry`, `--mx`, `--my`, `--scroll-y`, and `--glare-*` directly on the container DOM element
 * with ZERO React re-renders for buttery 60 FPS GPU-accelerated rendering.
 *
 * Fully supports desktop mouse, touch screens, mobile scroll parallax, device orientation,
 * and respects `prefers-reduced-motion`.
 */
export function useParallax3D<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const containerRef = useRef<T | null>(null);

  const {
    maxTilt = 8,
    maxTranslate = 20,
    scrollFactor = 0.14,
    smoothing = 0.1,
    glare = true,
    deviceOrientation = true,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    const resetStyles = () => {
      container.style.setProperty("--rx", "0deg");
      container.style.setProperty("--ry", "0deg");
      container.style.setProperty("--mx", "0px");
      container.style.setProperty("--my", "0px");
      container.style.setProperty("--scroll-y", "0px");
      container.style.setProperty("--glare-x", "50%");
      container.style.setProperty("--glare-y", "50%");
      container.style.setProperty("--glare-opacity", "0");
    };

    if (isReducedMotion) {
      resetStyles();
      return;
    }

    // Target values
    let targetRx = 0;
    let targetRy = 0;
    let targetMx = 0;
    let targetMy = 0;
    let targetScrollY = 0;
    let targetGlareX = 50;
    let targetGlareY = 50;
    let targetGlareOpacity = 0;

    // Current interpolated values (lerp)
    let currentRx = 0;
    let currentRy = 0;
    let currentMx = 0;
    let currentMy = 0;
    let currentScrollY = 0;
    let currentGlareX = 50;
    let currentGlareY = 50;
    let currentGlareOpacity = 0;

    let isInteracting = false;
    let isVisible = true;
    let animationFrameId: number | null = null;

    const tick = () => {
      if (!isVisible || isReducedMotion) {
        animationFrameId = null;
        return;
      }

      // Smooth lerp interpolation
      currentRx += (targetRx - currentRx) * smoothing;
      currentRy += (targetRy - currentRy) * smoothing;
      currentMx += (targetMx - currentMx) * smoothing;
      currentMy += (targetMy - currentMy) * smoothing;
      currentScrollY += (targetScrollY - currentScrollY) * smoothing;
      currentGlareX += (targetGlareX - currentGlareX) * smoothing;
      currentGlareY += (targetGlareY - currentGlareY) * smoothing;
      currentGlareOpacity += (targetGlareOpacity - currentGlareOpacity) * smoothing;

      // Apply GPU-accelerated CSS custom properties to container
      container.style.setProperty("--rx", `${currentRx.toFixed(3)}deg`);
      container.style.setProperty("--ry", `${currentRy.toFixed(3)}deg`);
      container.style.setProperty("--mx", `${currentMx.toFixed(2)}px`);
      container.style.setProperty("--my", `${currentMy.toFixed(2)}px`);
      container.style.setProperty("--scroll-y", `${currentScrollY.toFixed(2)}px`);

      if (glare) {
        container.style.setProperty("--glare-x", `${currentGlareX.toFixed(1)}%`);
        container.style.setProperty("--glare-y", `${currentGlareY.toFixed(1)}%`);
        container.style.setProperty("--glare-opacity", `${currentGlareOpacity.toFixed(3)}`);
      }

      // Determine if animation loop can rest
      const isSettled =
        !isInteracting &&
        Math.abs(targetRx - currentRx) < 0.02 &&
        Math.abs(targetRy - currentRy) < 0.02 &&
        Math.abs(targetMx - currentMx) < 0.05 &&
        Math.abs(targetMy - currentMy) < 0.05 &&
        Math.abs(targetScrollY - currentScrollY) < 0.1 &&
        (!glare || currentGlareOpacity < 0.01);

      if (isSettled) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!animationFrameId && isVisible && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    // IntersectionObserver to pause loop when container is off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            handleScroll();
            startLoop();
          } else if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    // Universal Pointer Movement handler (works for mouse, trackpad, and touch stylus)
    const updatePointerCoords = (clientX: number, clientY: number) => {
      if (!isVisible) return;
      const rect = container.getBoundingClientRect();

      // Check if pointer is in proximity of the container
      const margin = 120;
      if (
        clientX < rect.left - margin ||
        clientX > rect.right + margin ||
        clientY < rect.top - margin ||
        clientY > rect.bottom + margin
      ) {
        if (isInteracting) {
          isInteracting = false;
          targetRx = 0;
          targetRy = 0;
          targetMx = 0;
          targetMy = 0;
          targetGlareOpacity = 0;
          startLoop();
        }
        return;
      }

      isInteracting = true;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates (-1 to 1)
      const normX = Math.max(-1, Math.min(1, (x - centerX) / (centerX || 1)));
      const normY = Math.max(-1, Math.min(1, (y - centerY) / (centerY || 1)));

      targetRx = -normY * maxTilt;
      targetRy = normX * maxTilt;
      targetMx = normX * maxTranslate;
      targetMy = normY * maxTranslate;

      if (glare) {
        targetGlareX = Math.max(0, Math.min(100, (x / (rect.width || 1)) * 100));
        targetGlareY = Math.max(0, Math.min(100, (y / (rect.height || 1)) * 100));
        targetGlareOpacity = 0.42;
      }

      startLoop();
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerCoords(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointerCoords(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      isInteracting = false;
      targetRx = 0;
      targetRy = 0;
      targetMx = 0;
      targetMy = 0;
      targetGlareOpacity = 0;
      startLoop();
    };

    // Scroll parallax calculation (moves vertically relative to viewport center)
    const handleScroll = () => {
      if (!isVisible || isReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const containerCenter = rect.top + rect.height / 2;
      const offset = (containerCenter - viewportCenter) * scrollFactor;

      targetScrollY = -offset;
      startLoop();
    };

    // Touch handlers for direct touch on card
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerCoords(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      handlePointerLeave();
    };

    // Device orientation handler for mobile gyroscopes
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!deviceOrientation || isReducedMotion || !isVisible || isInteracting) return;
      if (e.gamma === null || e.beta === null) return;

      const normX = Math.max(-1, Math.min(1, e.gamma / 22));
      const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 22));

      targetRx = -normY * (maxTilt * 0.75);
      targetRy = normX * (maxTilt * 0.75);
      targetMx = normX * (maxTranslate * 0.75);
      targetMy = normY * (maxTranslate * 0.75);

      startLoop();
    };

    // Live media query listener for prefers-reduced-motion
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        resetStyles();
      } else {
        handleScroll();
        startLoop();
      }
    };

    // Attach listeners across window and container for flawless responsiveness
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    container.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    if (deviceOrientation && typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    mediaQuery.addEventListener("change", handleMotionChange);

    // Initial run
    handleScroll();
    startLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handlePointerLeave);

      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      if (deviceOrientation && typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }

      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [maxTilt, maxTranslate, scrollFactor, smoothing, glare, deviceOrientation]);

  return containerRef;
}
