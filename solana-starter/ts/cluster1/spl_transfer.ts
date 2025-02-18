import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wallet/wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("EELsthavYsD8pDp6yq5xhNV1Jpa3N2RooMnmkaeMkUn8");

// Recipient address
const to = new PublicKey("UrjiUJGSyZMxoquMRypNmsJJMK9L8RUp9Dk1xCQbzEj");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`fromAta is: ${fromAta.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        console.log(`toAta is: ${toAta.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(connection, keypair, fromAta.address, toAta.address, keypair, 2e9)
        console.log("kaboom here is the trx:", tx)
        // fromAta is: CAKQrBDedqF4aREQQkEAicgUGue6D9bCvMAqBi7PnXMJ
        // toAta is: 2AbFQincDTvFzfnZaPDLWzyRtjFohKFdrWUzvFCQyAaP
        // kaboom here is the trx: 5UY5sPyX8dWmdnFtCn2wAPhAJwp6nSKk4UyJnWsc8AWBPrhSgYYTyVokUbRqRXoGC9QwVcXfdRBgPxbYNYMWE2Uq
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();