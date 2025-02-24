import { 
    createMetadataAccountV3,
    TokenStandard,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { 
    createSignerFromKeypair, 
    signerIdentity, 
    publicKey,
    Signer,
    percentAmount
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletContextState } from "@solana/wallet-adapter-react";

interface CreateToken2022MetadataParams {
    wallet: WalletContextState;
    mintAddress: string;
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints?: number;
    isMutable?: boolean;
}

export async function createTokenMetadata({
    wallet,
    mintAddress,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints = 0,
    isMutable = true
}: CreateToken2022MetadataParams) {
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    try {
        // Initialize Umi
        const umi = createUmi('https://api.devnet.solana.com');
        
        // Create and set wallet signer
        const walletSigner = createSignerFromWalletAdapter(wallet);
        umi.use(signerIdentity(walletSigner));

        // Convert mint address
        const mint = publicKey(mintAddress);

        // Find metadata PDA
        const metadata = findMetadataPda(umi, { mint });

        // Create metadata
        const tx = createMetadataAccountV3(
            umi,
            {
                metadata,
                mint,
                mintAuthority: walletSigner,
                payer: walletSigner,
                updateAuthority: walletSigner.publicKey,
                data: {
                    name: name.trim(),
                    symbol: symbol.trim().toUpperCase(),
                    uri: uri.trim(),
                    sellerFeeBasisPoints,
                    creators: null,
                    collection: null,
                    uses: null
                },
                isMutable,
                collectionDetails: null,
                // tokenStandard: TokenStandard.Fungible // Specify as Fungible token
            }
        );

        const result = await tx.sendAndConfirm(umi);

        return {
            signature: result.signature,
            metadata: {
                name,
                symbol,
                uri,
                sellerFeeBasisPoints
            }
        };

    } catch (error) {
        console.error("Error creating Token-2022 metadata:", error);
        throw error;
    }
}