import wallet from "./wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import * as path from 'path';

const filePath = path.resolve('/home/orkarfabianthewise/code/turbine/solana-starter/ts', 'generug.png');
console.log('Resolved File Path:', filePath);

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');


let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const image = await readFile(filePath)
        //2. Convert image to generic file.
        const generic_file = createGenericFile(image, 'generug.png', {
            displayName: 'THEWISE',
            contentType: 'image/png'
        });

        // const [myUri] = await umi.uploader.uploadJson(generic_file)
        const [myUri] = await umi.uploader.upload([generic_file]);
        console.log("Your image URI:", myUri);
        // Your image URI: devnet.irys.xyz/BH5U73gPpz9g7WKuYJSujX8WHbzmfBYiMCSYcqH2qLDF
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
