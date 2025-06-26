import React, { useEffect, useState } from "react";

const LoadingWithBar = ({
  message = "Please wait, it's loading...",
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);

      if (percentage < 100) {
        requestAnimationFrame(animate);
      } else {
        start = Date.now();
        setProgress(0);
        requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animate);
  }, [duration]);

  // Create 100 dots
  const dots = Array.from({ length: 100 }, (_, i) => {
    const isActive = i < progress;
    let color = "#dc2626"; // red

    if (progress > 33 && i < progress) {
      color = "#f59e0b"; // yellow/orange
    }
    if (progress > 66 && i < progress) {
      color = "#16a34a"; // green
    }

    return (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive ? "opacity-100 scale-110" : "opacity-30 scale-100"
        }`}
        style={{
          backgroundColor: isActive ? color : "#e5e7eb",
        }}
      />
    );
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="text-center space-y-8">
        {/* Message */}
        <h2 className="text-2xl font-medium text-gray-700 mb-8">
          {message}
        </h2>

        {/* Progress percentage */}
        <div className="text-4xl font-bold text-gray-800 mb-6">
          {Math.floor(progress)}%
        </div>

        {/* Dots grid */}
        <div className="grid grid-cols-10 gap-2 max-w-md mx-auto">
          {dots}
        </div>
      </div>
    </div>
  );
};

export default LoadingWithBar;