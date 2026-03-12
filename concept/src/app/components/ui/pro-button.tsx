"use client";

import { cn } from "./utils";
import { useState, useEffect } from "react";

type PixelColor = "emerald" | "sky" | "rose";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ProButtonProps {
    text?: string;
    className?: string;
    pixelColor?: PixelColor;
    size?: ButtonSize;
    onClick?: () => void;
}

interface BoxProps {
    pixelColor: PixelColor;
    size: ButtonSize;
}

const colorMap: Record<PixelColor, string> = {
    rose: "bg-gradient-to-b from-[#f03030] to-[#e11d2e]",
    sky: "bg-gradient-to-b from-[#007bff] to-blue-600",
    emerald: "bg-gradient-to-b from-emerald-600 to-emerald-700",
};

const sizeConfig = {
    xs: {
        button: "h-9 rounded-md py-1 pl-1 pr-3 gap-2",
        text: "text-sm leading-none",
        box: "w-7 h-7 rounded-[6px]",
        pixel: "w-[3px] h-[3px]",
        gridGap: "gap-[2px]",
        shadow:
            "shadow-[inset_0_1px_2px_rgba(0,0,0,0.18),0_6px_10px_-4px_rgba(0,0,0,0.2)]",
        boxShadow:
            "shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_4px_8px_rgba(0,0,0,0.3)]",
    },
    sm: {
        button: "rounded-[16px] py-1.5 pl-1.5 pr-6 gap-4",
        text: "text-[16px]",
        box: "w-12 h-12 rounded-[10px]",
        pixel: "w-[4px] h-[4px]",
        gridGap: "gap-[3px]",
        shadow:
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_16px_20px_-5px_rgba(0,0,0,0.1),0_8px_8px_-5px_rgba(0,0,0,0.04)]",
        boxShadow:
            "shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),0_8px_12px_rgba(0,0,0,0.35)]",
    },
    md: {
        button: "rounded-[20px] py-1.5 pl-1.5 pr-10 gap-8",
        text: "text-[22px]",
        box: "w-16 h-16 rounded-[14px]",
        pixel: "w-[5px] h-[5px]",
        gridGap: "gap-[4px]",
        shadow:
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
        boxShadow:
            "shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),0_10px_16px_rgba(0,0,0,0.35)]",
    },
    lg: {
        button: "rounded-[28px] py-2 pl-2 pr-14 gap-10",
        text: "text-[32px]",
        box: "w-24 h-24 rounded-[20px]",
        pixel: "w-[7px] h-[7px]",
        gridGap: "gap-[6px]",
        shadow:
            "shadow-[inset_0_3px_6px_rgba(0,0,0,0.25),0_25px_30px_-5px_rgba(0,0,0,0.15),0_12px_12px_-5px_rgba(0,0,0,0.06)]",
        boxShadow:
            "shadow-[inset_0_3px_3px_rgba(255,255,255,0.5),0_14px_20px_rgba(0,0,0,0.4)]",
    },
};

const ProButton = ({
                       text = "Pro Button",
                       className,
                       pixelColor = "sky",
                       size = "md",
                       onClick,
                   }: ProButtonProps) => {
    const s = sizeConfig[size];

    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex items-center cursor-pointer",
                "bg-gradient-to-b from-[#303030] to-black",
                s.shadow,
                s.button,
                className,
            )}
        >
            <Box pixelColor={pixelColor} size={size} />
            <span className={cn("text-white font-normal tracking-[0.025em]", s.text)}>
        {text}
      </span>
        </button>
    );
};

const Box = ({ pixelColor, size }: BoxProps) => {
    const [frame, setFrame] = useState(0);
    const s = sizeConfig[size];

    useEffect(() => {
        const timer = setInterval(() => {
            setFrame((prev) => (prev + 1) % 9);
        }, 150);
        return () => clearInterval(timer);
    }, []);

    const getPattern = (offset: number) => {
        const pattern: boolean[][] = [];
        for (let i = 0; i < 5; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < 5; j++) {
                const pos = j - offset;
                const isArrow =
                    (i === 2 && pos >= 0 && pos <= 4) ||
                    (i === 1 && pos === 3) ||
                    (i === 0 && pos === 2) ||
                    (i === 3 && pos === 3) ||
                    (i === 4 && pos === 2);
                row.push(isArrow && pos >= 0 && pos <= 4);
            }
            pattern.push(row);
        }
        return pattern;
    };

    const currentPattern = getPattern(frame - 5);

    return (
        <div
            className={cn(
                "flex items-center justify-center",
                s.boxShadow,
                s.box,
                colorMap[pixelColor],
            )}
        >
            <div className={cn("grid grid-cols-5 grid-rows-5", s.gridGap)}>
                {[0, 1, 2, 3, 4].map((row) =>
                    [0, 1, 2, 3, 4].map((col) => {
                        const isActive = currentPattern[row][col];
                        return (
                            <div
                                key={`${row}-${col}`}
                                className={cn(
                                    "transition-colors duration-150 ease-in",
                                    s.pixel,
                                    isActive ? "bg-white/95" : "bg-white/15",
                                )}
                            />
                        );
                    }),
                )}
            </div>
        </div>
    );
};

export default ProButton;
