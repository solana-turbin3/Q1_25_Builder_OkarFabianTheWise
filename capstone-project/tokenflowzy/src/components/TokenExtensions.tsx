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
    { id: "vault-fee", name: "Vault Fee", isConnected: false },
    { id: "renounce", name: "Renounce", isConnected: false },
    { id: "soul-bound", name: "Soul-Bound", isConnected: false },
    { id: "interest-bearing", name: "Interest-Bearing", isConnected: false },
  ]);

  const toggleConnection = (id: string) => {
    const updatedExtensions = extensions.map((ext) =>
      ext.id === id ? { ...ext, isConnected: !ext.isConnected } : ext
    );
    setExtensions(updatedExtensions);
    onExtensionChange(updatedExtensions);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Token Extensions</h3>
      <div className="flex flex-col gap-3">
        {extensions.map((extension) => (
          <motion.div
            key={extension.id}
            className={`
              p-4 rounded-lg cursor-pointer border-2
              ${
                extension.isConnected
                  ? "border-[#009933] bg-[#009933]/20"
                  : "border-gray-600 bg-black/40"
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleConnection(extension.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{extension.name}</span>
              <div
                className={`
                w-3 h-3 rounded-full
                ${extension.isConnected ? "bg-[#009933]" : "bg-gray-600"}
              `}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TokenExtensions;
