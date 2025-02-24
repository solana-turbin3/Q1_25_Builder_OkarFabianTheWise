import React from "react";
import { motion } from "framer-motion";

export const Howto: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="backdrop-blur-sm bg-black/30 rounded-2xl shadow-xl border border-[#009933]/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Guide</h2>

        <div className="space-y-6">
          {[
            {
              title: "1. Token Information",
              content:
                "Fill in basic token details like name, symbol, and supply. Add description and image to enhance token identity.",
            },
            {
              title: "2. Choose Extensions",
              content:
                "Select from various extension modules to add functionality:",
              list: [
                "Transfer Fees - Automated fee collection",
                "Royalty Fee - Creator rewards",
                "Vault Fee - Secure token storage",
                "Soul-Bound - Non-transferable tokens",
                "Interest-Bearing - Growing token balances",
              ],
            },
            {
              title: "3. Deploy",
              content: "Review and deploy your token to the Solana network.",
            },
          ].map((section, index) => (
            <motion.section
              key={index}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-[#009933]">
                {section.title}
              </h3>
              <p className="text-sm text-gray-300">{section.content}</p>
              {section.list && (
                <ul className="space-y-1 mt-2">
                  {section.list.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <span className="text-[#009933]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}

          <div className="mt-6 p-4 rounded-xl bg-[#009933]/10 border border-[#009933]/20">
            <p className="text-sm text-[#009933] flex items-center gap-2">
              <span>💡</span>
              Ensure your wallet is connected with sufficient SOL balance
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
