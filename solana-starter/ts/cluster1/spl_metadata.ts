import wallet from "./wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
// const mint = publicKey("7efeK5MMfmgcNeJkutSduzBGskFHziBhvmoPcPrJBmuF")
const mint = publicKey("9A4jpbm6RY2syKZSfeSWkFZzK28J3RomD3kGEAynLurk")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "Rukewe",
            symbol: "POF",
            uri: 'https://arweave.net/123456',
            sellerFeeBasisPoints: 0, // floating point is the worst choice in computing on blockchain
            // more accuracy > increase
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
        // date: 15th january 2025
        // 2QZ1opJZZqZc2bTnciVi9z8K1jV5CrzVasCASWYUhaTFxoLN6Fkdt8McPddkwVp1D4BtTWBAa2Deh6LdYH8tB5DY
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
