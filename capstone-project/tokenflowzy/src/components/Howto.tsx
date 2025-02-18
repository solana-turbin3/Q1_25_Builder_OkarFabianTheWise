import React from "react";
import { motion } from "framer-motion";

export const Howto: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[600px] p-6 rounded-xl border-2 border-[#009933] bg-black/40"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        How to Use TokenFlowzy
      </h2>

      <div className="space-y-6 text-gray-300">
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-[#009933]">
            1. Token Info
          </h3>
          <p className="text-sm">
            Fill in your token details including name, symbol, and supply. Add
            an optional description and image.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-[#009933]">
            2. Extensions
          </h3>
          <p className="text-sm">
            Click and drag extensions to connect them to your token:
          </p>
          <ul className="list-disc list-inside text-sm pl-2">
            <li>Transfer Fees - Charge a fee on every token transfer</li>
            <li>
              Royalty Fee - Implement creator royalties on secondary transfers
            </li>
            <li>
              Renounce - Permanently revoke minting or authority privileges
            </li>
            <li>
              Soul-Bound - Make tokens non-transferable (identity or reputation
              tokens)
            </li>
            <li>Interest-Bearing - Allow token balances to grow over time</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-[#009933]">3. Deploy</h3>
          <p className="text-sm">
            Review your configuration and click deploy to create your token on
            the Solana network.
          </p>
        </section>

        <div className="mt-6 p-4 bg-[#009933]/10 rounded-lg border border-[#009933]/20">
          <p className="text-xs text-[#009933]">
            💡 Tip: Make sure your wallet is connected and has sufficient SOL
            for deployment.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
