import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TokenInfoForm from "./TokenInfoForm";
import TokenExtensions, { TokenExtension } from "./TokenExtensions";
import { Howto } from "./Howto";
import { createCustomToken, TokenConfig } from "@/solactions/createToken";
import { toast } from "react-hot-toast"; // For error notifications
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export default function TokenCreator() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(6);
  const [supply, setSupply] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [activeExtensions, setActiveExtensions] = useState<TokenExtension[]>(
    []
  );

  const handleExtensionsChange = (extensions: TokenExtension[]) => {
    setActiveExtensions(extensions.filter((ext) => ext.isConnected));
  };

  // Inside your component
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  console.log(wallet?.publicKey);

  // Validation function
  const validateTokenConfig = (config: TokenConfig): boolean => {
    if (!config.name || config.name.trim() === "") {
      throw new Error("Token name is required");
    }
    if (!config.symbol || config.symbol.trim() === "") {
      throw new Error("Token symbol is required");
    }
    if (!config.supply || Number(config.supply) <= 0) {
      throw new Error("Token supply must be greater than 0");
    }
    if (config.decimals < 0 || config.decimals > 9) {
      throw new Error("Decimals must be between 0 and 9");
    }
    return true;
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // if (!wallet.connected) {
      //   throw new Error("Please connect your wallet first");
      // }
      if (!wallet) {
        toast.error("Please connect your wallet first");
        return;
      }

      const tokenConfig: TokenConfig = {
        name,
        symbol,
        decimals,
        supply,
        description,
        image,
        extensions: activeExtensions.reduce(
          (acc, ext) => ({
            ...acc,
            [ext.id]: ext.isConnected,
          }),
          {}
        ),
      };

      validateTokenConfig(tokenConfig);

      // toast.loading("Creating token...", { id: "create-token" });
      const tokenDetails = await createCustomToken({
        config: tokenConfig,
        wallet,
      });

      toast.success("Token created successfully!", { id: "create-token" });
      console.log("Token created:", tokenDetails);

      console.log("Token created successfully:", tokenDetails);
    } catch (error) {
      console.error("Failed to create token:", error);
      toast.error("Failed to create token");
      // Handle error in UI
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden bg-black pb-16">
      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Hero Section with enhanced animations */}
        <motion.div
          variants={itemVariants}
          className="relative z-10 mb-16 perspective-1000"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[400px] bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
          </div>

          <div className="text-center space-y-4 sm:space-y-6">
            <motion.div className="relative inline-block px-4 sm:px-0">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">
                <span className="font-extralight">Sol</span>
                <span className="font-medium"> Token </span>
                <span className="font-extralight">Creator</span>
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed tracking-wide font-light"
            >
              Create and deploy custom SPL tokens on Solana with elegance and
              precision
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              rotateX: 5,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300 },
            }}
            className="md:col-span-2 lg:col-span-1 row-span-2 perspective-1000"
          >
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-800/80 rounded-xl p-6 h-full border border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
              <TokenInfoForm
                name={name}
                symbol={symbol}
                decimals={decimals}
                supply={supply}
                description={description}
                image={image}
                onNameChange={setName}
                onSymbolChange={setSymbol}
                onDecimalsChange={setDecimals}
                onSupplyChange={setSupply}
                onDescriptionChange={setDescription}
                onImageChange={setImage}
                onSubmit={handleCreateToken}
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/50 rounded-xl p-6 h-full border border-gray-800 hover:border-purple-500/50 transition-colors duration-300">
              <TokenExtensions onExtensionChange={handleExtensionsChange} />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/50 rounded-xl p-6 h-full border border-gray-800 hover:border-purple-500/50 transition-colors duration-300">
              <Howto />
            </div>
          </motion.div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
