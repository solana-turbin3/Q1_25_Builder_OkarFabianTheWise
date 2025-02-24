import React, { useState } from "react";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  tokenMetadataInitializeWithRentTransfer,
  getTokenMetadata,
} from "@solana/spl-token";
// import { getTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { createSignerFromWalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";

export const UpdateTokenMetadata: React.FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const updateMetadata = async () => {
    if (!wallet) {
      setError("Wallet not connected");
      return;
    }
    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      const mintPubkey = new PublicKey(mintAddress);
      const extensions = [ExtensionType.MetadataPointer];

      const initAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintPubkey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          getMintLen(extensions)
        ),
        space: getMintLen(extensions),
        programId: TOKEN_2022_PROGRAM_ID,
      });

      const initPointerIx = await createInitializeMetadataPointerInstruction(
        mintPubkey,
        wallet.publicKey,
        mintPubkey,
        TOKEN_2022_PROGRAM_ID
      );

      const createInializeMintIx = await createInitializeMint2Instruction(
        mintPubkey,
        0,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      );

      const blockhash = await connection.getLatestBlockhash();
      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        instructions: [initAccountIx, initPointerIx, createInializeMintIx],
        recentBlockhash: blockhash.blockhash,
      }).compileToV0Message();

      const tx = new VersionedTransaction(message);
      await wallet.signTransaction(tx); // Wallet signs partially

      const initMintSig = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: true,
        maxRetries: 3,
      });

      await connection.confirmTransaction({
        signature: initMintSig,
        ...blockhash,
      });

      // const sig = await tokenMetadataInitializeWithRentTransfer(
      //   connection,
      //   walletSigner,
      //   mintPubkey,
      //   wallet.publicKey,
      //   wallet,
      //   name,
      //   symbol,
      //   uri,
      //   undefined,
      //   undefined,
      //   TOKEN_2022_PROGRAM_ID
      // );

      // setTxSignature(sig);
    } catch (err) {
      setError(`Error updating metadata: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      <input
        type="text"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
        placeholder="Token Mint Address"
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Token Name"
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Token Symbol"
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <input
        type="text"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        placeholder="Metadata URI"
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <button
        onClick={updateMetadata}
        disabled={
          !mintAddress || !name || !symbol || !uri || loading || !publicKey
        }
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Updating Metadata..." : "Update Metadata"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {txSignature && (
        <div className="text-green-500">
          ✅ Success!{" "}
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
};

export default UpdateTokenMetadata;
