import wallet from "./wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const image_path = '../generug.png';

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "devnet.irys.xyz/BH5U73gPpz9g7WKuYJSujX8WHbzmfBYiMCSYcqH2qLDF"
        const metadata = {
            name: "Legend of Thewise",
            symbol: "LTW",
            description: "The Ear that Sees",
            image: "?",
            attributes: [
                {trait_type: '?', value: '?'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
        // https://arweave.net/3g1zRhk2Rb3WvWPFcuCCGz79z1W1VzS4MD3b7n2zaCC2
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
