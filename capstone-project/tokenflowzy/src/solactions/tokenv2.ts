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
} from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
//import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { createTokenMetadata } from './metadata';

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
    // Null address to renounce ownership
    const nullAddress = new PublicKey('11111111111111111111111111111111');

    const payer = wallet.publicKey;
    const mintAuthority = wallet.publicKey;
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;

    const extensions: ExtensionType[] = [];

    if (config.extensions.transferFee) {
        extensions.push(ExtensionType.TransferFeeConfig);
    }
    if (config.extensions.interestBearing) {
        extensions.push(ExtensionType.InterestBearingConfig);
    }

    const mintLen = getMintLen(extensions);
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        space: mintLen,
        lamports: mintLamports,
        programId: TOKEN_2022_PROGRAM_ID,
        })
    );

    if (config.extensions.transferFee) {
        const feeBasisPoints = 100; // Example: 1% fee
        const maxFee = BigInt(9 * 10 ** config.decimals); // Example: 9 tokens
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

    transaction.add(
        createInitializeMintInstruction(
        mint,
        config.decimals,
        mintAuthority,
        null,
        TOKEN_2022_PROGRAM_ID
        )
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = payer;
    transaction.partialSign(mintKeypair);

    const signedTx = await wallet.signTransaction(transaction);
    const txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId, 'confirmed');

    console.log('New Token Created:', generateExplorerTxUrl(txId));

    const sourceAccount = await getAssociatedTokenAddress(
        mint,
        payer,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    
    // Create ATA transaction
    const createAtaTransaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            payer,
            sourceAccount,
            payer,
            mint,
            TOKEN_2022_PROGRAM_ID
        )
    );

    createAtaTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    createAtaTransaction.feePayer = payer;

    const signedAtaTx = await wallet.signTransaction(createAtaTransaction);
    const ataTxId = await connection.sendRawTransaction(signedAtaTx.serialize());
    await connection.confirmTransaction(ataTxId, 'confirmed');

    console.log('ATA Created:', generateExplorerTxUrl(ataTxId));

    
    const mintAmount = BigInt(Number(config.supply) * 10 ** config.decimals);
    const mintToTx = new Transaction().add(
        createMintToInstruction(
        mint,
        sourceAccount,
        mintAuthority,
        mintAmount,
        [],
        TOKEN_2022_PROGRAM_ID
        )
    );

    mintToTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    mintToTx.feePayer = payer;

    const signedMintToTx = await wallet.signTransaction(mintToTx);
    const mintSig = await connection.sendRawTransaction(signedMintToTx.serialize());
    await connection.confirmTransaction(mintSig, 'confirmed');

    console.log('Tokens Minted:', generateExplorerTxUrl(mintSig));

    if (config.extensions.renounce) {
        const renounceTx = new Transaction().add(
        createInitializeMintInstruction(
            mint,
            config.decimals,
            nullAddress,
            null,
            TOKEN_2022_PROGRAM_ID
        )
        );

        renounceTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        renounceTx.feePayer = payer;

        const signedRenounceTx = await wallet.signTransaction(renounceTx);
        const renounceSig = await connection.sendRawTransaction(signedRenounceTx.serialize());
        await connection.confirmTransaction(renounceSig, 'confirmed');

        console.log('Mint Authority Renounced:', generateExplorerTxUrl(renounceSig));
    }

    await createTokenMetadata({
        wallet,
        mintAddress: mint.toBase58(),
        name: config.name,
        symbol: config.symbol,
        
    })

    // After minting tokens and before returning, add metadata
    // const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    // const metadataAccount = PublicKey.findProgramAddressSync(
    //     [
    //         Buffer.from('metadata'),
    //         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    //         mint.toBuffer(),
    //     ],
    //     TOKEN_METADATA_PROGRAM_ID
    // )[0];

    // Upload image if provided
    // const imageUri = await uploadMetadata(config.image, config.name, config.symbol, config.description || '');

    // After minting tokens, create metadata
    // const metadataResult = await createTokenMetadata({
    //     wallet,
    //     mintAddress: mint.toString(),
    //     name: config.name,
    //     symbol: config.symbol,
    //     uri: imageUri || ''
    // });

    // const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));


    // await metaplex.nfts().create({
    //     mintAddress: mint.toStrng()
    //     name: config.name,
    //     symbol: config.symbol,
    //     uri: 'https://example.com/metadata.json',
    //   });
      
    // console.log('Metadata Created');
    // return {
    //     mint: mint.toString(),
    //     mintTx: txId,
    //     mintSig: mintSig,
    //     owner: payer.toString(),
    //     sourceAccount: sourceAccount.toString(),
    // };
    // console.log('Metadata Created:', generateExplorerTxUrl(metadataResult.signature));

    // return {
    //     mint: mint.toString(),
    //     mintTx: txId,
    //     mintSig: mintSig,
    //     metadataSig: metadataResult.signature,
    //     owner: payer.toString(),
    //     sourceAccount: sourceAccount.toString(),
    //     metadata: metadataResult?.metadataAddress.toString()
    // };
    
}
  