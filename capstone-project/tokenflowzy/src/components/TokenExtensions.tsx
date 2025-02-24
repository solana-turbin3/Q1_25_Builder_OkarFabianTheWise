import React, { useState } from "react";
import { motion } from "framer-motion";

export interface TokenExtension {
  id: string;
  name: string;
  isConnected: boolean;
}

interface TokenExtensionsProps {
  onExtensionChange: (extensions: TokenExtension[]) => void;
}

const TokenExtensions: React.FC<TokenExtensionsProps> = ({
  onExtensionChange,
}) => {
  const [extensions, setExtensions] = useState<TokenExtension[]>([
    { id: "transfer-fee", name: "Transfer Fees", isConnected: false },
    { id: "royalty-fee", name: "Royalty Fee", isConnected: false },
    { id: "renounce", name: "Renounce", isConnected: false },
    { id: "interest-bsearing", name: "Interest-Bearing", isConnected: false },
  ]);

  const toggleConnection = (id: string) => {
    const updatedExtensions = extensions.map((ext) =>
      ext.id === id ? { ...ext, isConnected: !ext.isConnected } : ext
    );
    setExtensions(updatedExtensions);
    onExtensionChange(updatedExtensions);
  };

  return (
    <div className="w-full">
      <div className="backdrop-blur-sm bg-black/30 rounded-2xl shadow-xl border border-[#009933]/30 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Extensions</h3>
        <div className="grid gap-3">
          {extensions.map((extension) => (
            <motion.div
              key={extension.id}
              className={`
                relative overflow-hidden rounded-xl cursor-pointer
                transition-all duration-200 ease-out
                ${
                  extension.isConnected
                    ? "bg-[#009933]/10 border-[#009933]/50"
                    : "bg-black/50 border-gray-800"
                }
                border hover:border-[#009933]/30
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleConnection(extension.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-3 h-3 rounded-full transition-colors duration-200
                    ${extension.isConnected ? "bg-[#009933]" : "bg-gray-600"}
                  `}
                  />
                  <span className="text-white text-sm md:text-base font-medium">
                    {extension.name}
                  </span>
                </div>
                <motion.div
                  animate={{
                    scale: extension.isConnected ? 1 : 0.8,
                    opacity: extension.isConnected ? 1 : 0.5,
                  }}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  {extension.isConnected ? "✓" : ""}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenExtensions;
