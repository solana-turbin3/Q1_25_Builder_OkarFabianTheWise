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
  onSubmit: (e: React.FormEvent) => void;
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
  onSubmit,
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
    <div className="w-full">
      <motion.div
        className="w-full backdrop-blur-sm bg-black/30 rounded-2xl shadow-xl border border-[#009933]/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Create Token</h2>
          <form className="space-y-5">
            {[
              {
                icon: <FiFileText />,
                value: name,
                onChange: onNameChange,
                placeholder: "Token Name",
                type: "text",
              },
              {
                icon: <FiHash />,
                value: symbol,
                onChange: onSymbolChange,
                placeholder: "Token Symbol",
                type: "text",
              },
              {
                icon: <FiDatabase />,
                value: decimals,
                onChange: onDecimalsChange,
                placeholder: "Decimals",
                type: "number",
              },
              {
                icon: <FiDollarSign />,
                value: supply,
                onChange: onSupplyChange,
                placeholder: "Total Supply",
                type: "text",
              },
            ].map((field, index) => (
              <motion.div
                key={index}
                variants={inputVariants}
                className="relative"
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009933]">
                  {field.icon}
                </span>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-[#009933]/30 
                    focus:border-[#009933] focus:ring-1 focus:ring-[#009933] transition-all duration-200
                    text-white placeholder-gray-400 text-sm md:text-base"
                  placeholder={field.placeholder}
                  required
                />
              </motion.div>
            ))}

            <motion.div variants={inputVariants} className="relative">
              <span className="absolute left-3 top-3 text-[#009933]">
                <FiFile />
              </span>
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-[#009933]/30
                  focus:border-[#009933] focus:ring-1 focus:ring-[#009933] transition-all duration-200
                  text-white placeholder-gray-400 text-sm md:text-base resize-none"
                placeholder="Token Description"
                rows={4}
              />
            </motion.div>

            <motion.div variants={inputVariants} className="relative">
              <label
                className="flex items-center gap-2 p-3 rounded-xl cursor-pointer
                border border-dashed border-[#009933]/30 hover:border-[#009933] transition-colors"
              >
                <FiImage className="text-[#009933]" />
                <span className="text-sm text-gray-300">
                  Upload Token Image
                </span>
                <input
                  type="file"
                  onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </motion.div>

            <motion.button
              type="submit"
              onClick={onSubmit}
              className="w-full py-3 px-4 rounded-xl bg-[#009933] text-white font-medium
                hover:bg-[#00802b] transition-colors duration-200 text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-[#009933] focus:ring-offset-2 focus:ring-offset-black"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Token
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TokenInfoForm;
