import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    PublicKey,
} from '@solana/web3.js';
import {
    ExtensionType,
    createInitializeMintInstruction,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
    createInitializeTransferFeeConfigInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    TYPE_SIZE,
    LENGTH_SIZE,
    createInitializeMetadataPointerInstruction,
    createInitializePermanentDelegateInstruction,
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
//import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { createInitializeInstruction, pack, TokenMetadata } from '@solana/spl-token-metadata';


async function uploadMetadata(image: File | null | undefined, name: string, symbol: string, description: string) {
    if (!image) return null;
    
    try {
        const formData = new FormData();
        formData.append('file', image);
        
        // Upload to a service like NFT.Storage or Arweave
        const response = await fetch('https://hidden-broken-yard.solana-devnet.quiknode.pro/7fef0c379b4a84c33cf93ab6d9ada7a5916eba9b', {
            method: 'POST',
            body: formData,
        });
        
        const { uri } = await response.json();
        return uri;
    } catch (error) {
        console.error('Error uploading metadata:', error);
        return null;
    }
}

export interface TokenConfig {
    name: string;
    symbol: string;
    decimals: number;
    supply: string;
    description?: string;
    image?: File | null;
    extensions: {
        transferFee?: boolean;
        interestBearing?: boolean;
        renounce?: boolean;
    };
}
  
function generateExplorerTxUrl(txId: string | any) {
    return `https://explorer.solana.com/tx/${txId}?cluster=devnet`;
}
  
interface CreateTokenParams {
    config: TokenConfig;
    wallet: WalletContextState;
}
  
export async function createCustomToken({ config, wallet }: CreateTokenParams) {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
    }
    console.log(config)

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const nullAddress = new PublicKey('11111111111111111111111111111111');
    const payer = wallet.publicKey;
    const mintAuthority = wallet.publicKey;
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;

    if (!config.description) {
        config.description = 'No description provided';
    }
    const metadata: TokenMetadata = {
        mint: mint,
        name: config.name,
        symbol: config.symbol,
        uri: '',
        additionalMetadata: [['description', config.description]],
    };


    // Bundle all instructions into a single transaction
    const transaction = new Transaction();
    
    // Calculate mint account size and rent
    const extensions: ExtensionType[] = [ExtensionType.MetadataPointer];
    if (config.extensions.transferFee) {
        extensions.push(ExtensionType.TransferFeeConfig);
    }
    if (config.extensions.interestBearing) {
        extensions.push(ExtensionType.InterestBearingConfig);
    }
    const mintLen = getMintLen(extensions);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    // Add create mint account instruction
    if (config.extensions.renounce) {
        console.log(config.extensions.renounce);
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint,
                space: mintLen,
                lamports: mintLamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            
            createInitializeMetadataPointerInstruction(
                mint, 
                payer, 
                mint, 
                TOKEN_2022_PROGRAM_ID
            ),

            createInitializeMintInstruction(
                mint,
                config.decimals,
                nullAddress,
                nullAddress,
                TOKEN_2022_PROGRAM_ID
            ),

            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mint,
                metadata: mint,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: nullAddress,
                updateAuthority: nullAddress,
            }),
        );
    } else {
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mint,
                space: mintLen,
                lamports: mintLamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            
            createInitializeMetadataPointerInstruction(
                mint, 
                payer, 
                mint, 
                TOKEN_2022_PROGRAM_ID
            ),

            createInitializeMintInstruction(
                mint, 
                config.decimals, 
                payer, 
                payer, 
                TOKEN_2022_PROGRAM_ID
            ),

            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mint,
                metadata: mint,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: payer,
                updateAuthority: payer,
            }),
        );
    }

    
    // Add transfer fee config if enabled
    if (config.extensions.transferFee) {
        const feeBasisPoints = 100;
        const maxFee = BigInt(9 * 10 ** config.decimals);
        transaction.add(
            createInitializeTransferFeeConfigInstruction(
                mint,
                payer,
                payer,
                feeBasisPoints,
                maxFee,
                TOKEN_2022_PROGRAM_ID
            )
        );
    }

    

    // Create and add ATA instruction
    const sourceAccount = await getAssociatedTokenAddress(
        mint,
        payer,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    
    transaction.add(
        createAssociatedTokenAccountInstruction(
            payer,
            sourceAccount,
            payer,
            mint,
            TOKEN_2022_PROGRAM_ID
        )
    );

    // Add mint-to instruction
    const mintAmount = BigInt(Number(config.supply) * 10 ** config.decimals);
    transaction.add(
        createMintToInstruction(
            mint,
            sourceAccount,
            mintAuthority,
            mintAmount,
            [],
            TOKEN_2022_PROGRAM_ID
        )
    );

    // // Add renounce instruction if enabled
    // if (config.extensions.renounce) {
    //     transaction.add(
    //         createInitializeMintInstruction(
    //             mint,
    //             config.decimals,
    //             nullAddress,
    //             null,
    //             TOKEN_2022_PROGRAM_ID
    //         )
    //     );
    // }


    // Sign and send transaction
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = payer;  // Set wallet as fee payer
    
    // First sign with mint keypair
    transaction.partialSign(mintKeypair);
    
    // Then let the wallet sign to pay fees
    const signedTx = await wallet.signTransaction(transaction);
    
    // Send with preflight disabled and retry on failure
    const txId = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 3,
    });
    
    // Wait for confirmation with commitment
    await connection.confirmTransaction({
        signature: txId,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }, 'confirmed');

    console.log('Token Created and Initialized:', generateExplorerTxUrl(txId));

    // Add delay before metadata creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create metadata in a separate transaction
    console.log("Creating metadata for token:", {
        mint: mint.toBase58(),
        name: config.name,
        symbol: config.symbol
    });

    // return {
    //     mint: mint.toString(),
    //     txId,
    //     owner: payer.toString(),
    //     sourceAccount: sourceAccount.toString(),
    // };
}
