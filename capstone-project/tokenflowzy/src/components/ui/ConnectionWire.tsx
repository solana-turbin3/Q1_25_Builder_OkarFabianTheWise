import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConnectionWireProps {
  isConnected: boolean;
  targetRef: React.RefObject<HTMLDivElement>;
  sourceRef: React.RefObject<HTMLDivElement>;
  mousePosition?: { x: number; y: number };
}

const ConnectionWire: React.FC<ConnectionWireProps> = ({
  isConnected,
  targetRef,
  sourceRef,
  mousePosition,
}) => {
  const [wireStyle, setWireStyle] = useState({
    width: "0px",
    top: "0px",
    rotate: "0deg",
  });

  useEffect(() => {
    const updateWirePosition = () => {
      if (sourceRef.current) {
        const sourceRect = sourceRef.current.getBoundingClientRect();
        const sourceCenter = {
          x: sourceRect.left + sourceRect.width,
          y: sourceRect.top + sourceRect.height / 2,
        };

        if (mousePosition && !isConnected) {
          // Follow cursor
          const width = Math.hypot(
            mousePosition.x - sourceCenter.x,
            mousePosition.y - sourceCenter.y
          );
          const angle = Math.atan2(
            mousePosition.y - sourceCenter.y,
            mousePosition.x - sourceCenter.x
          );

          setWireStyle({
            width: `${width}px`,
            top: `${sourceRect.height / 2}px`,
            rotate: `${(angle * 180) / Math.PI}deg`,
          });
        } else if (isConnected && targetRef.current) {
          // Connect to form
          const targetRect = targetRef.current.getBoundingClientRect();
          const width = Math.abs(targetRect.left - sourceCenter.x);
          setWireStyle({
            width: `${width}px`,
            top: `${sourceRect.height / 2}px`,
            rotate: "0deg",
          });
        }
      }
    };

    updateWirePosition();
    window.addEventListener("resize", updateWirePosition);
    return () => window.removeEventListener("resize", updateWirePosition);
  }, [targetRef, sourceRef, mousePosition, isConnected]);

  return (
    <motion.div
      className="absolute h-[2px]"
      style={{
        ...wireStyle,
        right: "0",
        transformOrigin: "right",
      }}
      initial={{ scaleX: 0 }}
      animate={{
        scaleX: 1,
        backgroundColor: isConnected ? "#009933" : "#4B5563",
      }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default ConnectionWire;
