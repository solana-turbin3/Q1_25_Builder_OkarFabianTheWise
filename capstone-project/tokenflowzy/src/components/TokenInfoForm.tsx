import React from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiHash,
  FiDatabase,
  FiDollarSign,
  FiFile,
  FiImage,
} from "react-icons/fi";

interface TokenInfoFormProps {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
  description: string;
  image: File | null;
  onNameChange: (value: string) => void;
  onSymbolChange: (value: string) => void;
  onDecimalsChange: (value: number) => void;
  onSupplyChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
}

const TokenInfoForm: React.FC<TokenInfoFormProps> = ({
  name,
  symbol,
  decimals,
  supply,
  description,
  onNameChange,
  onSymbolChange,
  onDecimalsChange,
  onSupplyChange,
  onDescriptionChange,
  onImageChange,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative text-white flex items-center justify-center px-4 sm:px-0">
      <motion.div
        className="w-full z-[1] max-w-md p-4 sm:p-8 rounded-xl shadow-lg bg-transparent border-2 border-[#009933]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <form className="space-y-4 sm:space-y-6">
          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative bg-transparent">
              <FiFileText
                color="#8B5CF6"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base"
                placeholder="Token Name"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative">
              <FiHash
                color="#8B5CF6"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                value={symbol}
                onChange={(e) => onSymbolChange(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base"
                placeholder="Token Symbol"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative">
              <FiDatabase
                color="#8B5CF6"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="number"
                value={decimals}
                onChange={(e) => onDecimalsChange(Number(e.target.value))}
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base"
                placeholder="Decimals"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative">
              <FiDollarSign
                color="#8B5CF6"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                value={supply}
                onChange={(e) => onSupplyChange(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base"
                placeholder="Total Supply"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative">
              <FiFile color="#8B5CF6" className="absolute left-3 top-3" />
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base"
                placeholder="Token Description"
                rows={4}
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} className="space-y-2">
            <div className="relative">
              <FiImage
                color="#8B5CF6"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              />
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-white
          file:mr-4 file:py-2.5 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-normal
          file:bg-[#009933] file:text-white
          file:cursor-pointer
          hover:file:bg-[#00802b]
          cursor-pointer
          pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 
          rounded-lg border border-[#009933] 
          bg-black/80 
          focus:outline-none focus:ring-2 
          focus:ring-[#009933]"
                  accept="image/*"
                />
              </div>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-[#009933] bg-black/80 focus:outline-none focus:ring-2 focus:ring-[#009933] text-sm sm:text-base align-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Token
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TokenInfoForm;
