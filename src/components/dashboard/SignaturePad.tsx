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
      backgroundColor: "rgb(255, 255, 255)",
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
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full h-48 sm:h-64 border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-sans text-sm select-none">
            Sign here using your mouse or finger
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-full cursor-pointer transition-colors"
            title="Clear signature"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full cursor-pointer transition-colors"
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
          className="flex items-center gap-1"
        >
          <Check className="w-4 h-4" />
          Confirm Signature
        </Button>
      </div>
    </div>
  );
};
