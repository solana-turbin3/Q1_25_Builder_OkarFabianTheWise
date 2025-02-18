import { useState } from "react";
import TokenInfoForm from "./TokenInfoForm";
import TokenExtensions, { TokenExtension } from "./TokenExtensions";
import { Howto } from "./Howto";
import { CustomWalletMultiButton } from "@/solactions/WalletConnect";

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

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 flex">
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Sol Token Creator</h1>
        <p className="text-gray-300 mt-2">spl flows for you!</p>
        <div className="flex gap-8">
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
          />
          <TokenExtensions onExtensionChange={handleExtensionsChange} />
          <Howto />
        </div>
      </div>
    </div>
  );
}
