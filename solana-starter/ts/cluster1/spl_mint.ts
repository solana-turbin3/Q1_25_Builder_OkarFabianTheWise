import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wallet/wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_amount = 1_000_000 * 10e9; // amount of tokens

// Mint address
const mint = new PublicKey("7efeK5MMfmgcNeJkutSduzBGskFHziBhvmoPcPrJBmuF");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, token_amount); 
        console.log(`Your mint txid: ${mintTx}`);
        // Your ata is: CAKQrBDedqF4aREQQkEAicgUGue6D9bCvMAqBi7PnXMJ
        // Your mint txid: 4BBBR1iVUa8oDj1XaJq7HPFSKGTrLJJuQES8yikKiuoVmiAkNJ1xTmnEnv8hpFYncaN3epZrzi19bmpd25TXyBKq
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
