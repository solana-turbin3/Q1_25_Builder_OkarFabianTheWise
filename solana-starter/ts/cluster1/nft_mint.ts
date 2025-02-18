import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint,
        sellerFeeBasisPoints: percentAmount(4),
        name: "THEWISE",
        uri: "devnet.irys.xyz/3g1zRhk2Rb3WvWPFcuCCGz79z1W1VzS4MD3b7n2zaCC2"
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);

    // Succesfully Minted! Check out your TX here:
    // https://explorer.solana.com/tx/5BpUmDUq4Zrw2hzpZyJbfzhLHbyhhRqzdSqbSsZnP4uyfxA9QfCRSmrbWKzjMxZQuSrPJ5ehvgQcE4qBwVDfomfn?cluster=devnet
    // Mint Address:  9Ve4J8P82ER8QTuyi6ZwtMnQiMimTmsT8f3a9LxERea3
})();