/**
 * Confetti Component
 *
 * Creates a celebratory confetti animation effect
 * Used to celebrate achievements, level ups, and mission completions
 *
 * Shows 50 colorful pieces falling from top of screen
 * Animation runs for 3 seconds then removes pieces
 */

// React hooks for state and lifecycle
import { useEffect, useState } from "react";

/**
 * Interface for individual confetti piece
 * Each piece has unique properties for randomized animation
 */
interface ConfettiPiece {
  id: number; // Unique identifier
  x: number; // Horizontal position (0-100%)
  color: string; // HSL color value
  delay: number; // Animation start delay in seconds
  size: number; // Size in pixels
}

/**
 * Props for Confetti component
 */
interface ConfettiProps {
  // Whether to show/trigger the confetti animation
  show: boolean;
  // Optional callback when animation completes
  onComplete?: () => void;
}

/**
 * Color palette for confetti pieces
 * Uses the app's color theme for visual consistency
 */
const colors = [
  "hsl(262, 83%, 58%)", // primary purple
  "hsl(330, 85%, 60%)", // accent pink
  "hsl(142, 76%, 45%)", // success green
  "hsl(38, 92%, 50%)", // warning yellow
  "hsl(200, 85%, 55%)", // blue
];

/**
 * Confetti Component
 *
 * Creates falling confetti animation with:
 * - Random colors from app theme
 * - Random sizes and positions
 * - Staggered animations with delays
 * - 3 second duration then cleanup
 *
 * @param show - Trigger confetti animation
 * @param onComplete - Callback when animation finishes
 */
export function Confetti({ show, onComplete }: ConfettiProps) {
  // State to track confetti pieces
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  /**
   * Effect: Create and manage confetti animation
   *
   * When show becomes true:
   * 1. Generate 50 random confetti pieces
   * 2. Animate them falling for 3 seconds
   * 3. Clear pieces and call onComplete callback
   */
  useEffect(() => {
    if (show) {
      // Generate 50 confetti pieces with random properties
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position
        color: colors[Math.floor(Math.random() * colors.length)], // Random color
        delay: Math.random() * 0.5, // Random animation delay (0-0.5s)
        size: Math.random() * 8 + 4, // Random size (4-12px)
      }));
      setPieces(newPieces);

      // Set timer to clear confetti after 3 seconds
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      // Cleanup function to clear timer
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  // Don't render if no confetti to show
  if (!show && pieces.length === 0) return null;

  return (
    // Full-screen container for confetti (pointer-events-none so it doesn't interfere with clicks)
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          // Use CSS animation class defined in tailwind config
          className="absolute animate-confetti"
          style={{
            // Position pieces across the top of screen
            left: `${piece.x}%`,
            top: "-20px",
            // Size properties
            width: piece.size,
            height: piece.size,
            // Color for the confetti piece
            backgroundColor: piece.color,
            // Random shape - either circle or square
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            // Stagger animation start times
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
