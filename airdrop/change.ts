/// This file converts a base58-encoded private key of a Solana wallet into a Keypair object.

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Replace with your base58-encoded private key
const base58PrivateKey = '5hFLoeoFCiUAH7pbvhwDwXLz6EKm9q6CQZ8ERLFhisoJR4pen1bBsyXL3cnRPrNjceeAmYbDx4Sg5KbCWPLRWqyY'; // Add your private key here

const arraykey = [5, 233, 241, 202, 141, 127, 139, 189, 157, 158, 130, 9, 148, 128, 40, 223, 51, 110, 59, 170, 224, 211, 220, 97, 128, 60, 210, 44, 156, 113, 241, 39, 218, 168, 19, 21, 219, 236, 252, 63, 135, 153, 225, 72, 240, 149, 227, 246, 182, 34, 135, 44, 186, 247, 205, 126, 164, 103, 220, 251, 158, 200, 226, 237]


try {
  // Validate that the seed is a 32-byte array
  // if (arraykey.length !== 32) {
  //   throw new Error("Seed must be a 32-byte array.");
  // }

  // Generate the keypair
  const keypair = Buffer.from(Uint8Array.from(arraykey)).toString("hex");
  console.log(keypair)

  // console.log("Keypair generated successfully!");
  // console.log("Public Key:", keypair.publicKey.toString()); // Correct public key
  // console.log("Pkey string:", keypair.secretKey.toString()); // Correct public key

  // Optionally log the private key if necessary (NOT recommended for production)
  // console.log("Private Key (base58):", bs58.encode(keypair.secretKey));
} catch (error: any) {
  console.error("Failed to generate Keypair. Ensure the seed array is 32 bytes.");
  console.error(error.message);
}