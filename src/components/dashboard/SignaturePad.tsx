"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePadLibrary from "signature_pad";
import { Button } from "@/components/ui";
import { RotateCcw, Trash2, Check } from "lucide-react";

interface SignaturePadProps {
  onSave: (base64Image: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePadLibrary | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Resize canvas to look good and capture correctly on high-DPI screens
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use absolute sizing relative to parent layout
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);

    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signaturePad = new SignaturePadLibrary(canvas, {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      penColor: "rgb(9, 64, 41)", // Brand forest green for pen
    });

    signaturePadRef.current = signaturePad;

    // Event listener to monitor when the user has drawn
    signaturePad.addEventListener("endStroke", () => {
      setIsEmpty(signaturePad.isEmpty());
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      signaturePad.off();
    };
  }, []);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleUndo = () => {
    if (signaturePadRef.current) {
      const data = signaturePadRef.current.toData();
      if (data && data.length > 0) {
        data.pop(); // remove the last stroke
        signaturePadRef.current.fromData(data);
        setIsEmpty(signaturePadRef.current.isEmpty());
      }
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const base64Data = signaturePadRef.current.toDataURL("image/png");
      onSave(base64Data);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full font-[family-name:var(--font-body)]">
      <div className="relative w-full h-48 sm:h-56 border-[1.5px] border-dashed border-[#C8C2BA] rounded-[20px] bg-white/60 backdrop-blur-[8px] overflow-hidden shadow-inner transition-colors duration-200 focus-within:border-[#094029]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#A09890] font-sans text-xs tracking-wider uppercase font-bold select-none">
            Sign here using your mouse, trackpad, or finger
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4.5 py-2.5 text-[0.6875rem] font-bold tracking-wider uppercase text-[#B91C1C] hover:bg-[#FEE2E2]/60 border border-[#B91C1C]/25 rounded-full cursor-pointer transition-colors"
            title="Clear signature"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-4.5 py-2.5 text-[0.6875rem] font-bold tracking-wider uppercase text-[#7A746C] hover:bg-[#F0EDE8] border border-[#C8C2BA] rounded-full cursor-pointer transition-colors"
            title="Undo last stroke"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </button>
        </div>

        <Button
          onClick={handleSave}
          disabled={isEmpty}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          Confirm Signature
        </Button>
      </div>
    </div>
  );
};
