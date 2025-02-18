// Import necessary functions and constants from the Solana web3.js and SPL Token packages
import {
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    Cluster,
    PublicKey,
    TransactionSignature,
    SignatureStatus,
    TransactionConfirmationStatus
} from '@solana/web3.js';

import {
    ExtensionType,
    createInitializeMintInstruction,
    mintTo,
    createAccount,
    getMintLen,
    getTransferFeeAmount,
    unpackAccount,
    TOKEN_2022_PROGRAM_ID,
    createInitializeTransferFeeConfigInstruction,
    harvestWithheldTokensToMint,
    transferCheckedWithFee,
    withdrawWithheldTokensFromAccounts,
    withdrawWithheldTokensFromMint,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccountIdempotent
} from '@solana/spl-token';
import { readFile } from "fs/promises"
import * as path from 'path';
// import wallet from "../dev-wallet.json"
const walletPath = path.resolve('/home/orkarfabianthewise/code/token-2022', 'dev-wallet');
const wallet = await readFile(walletPath)

// console.log('Resolved File Path:', wallet);

// Initialize connection to local Solana node
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Generate keys for payer, mint authority, and mint
const payer = Keypair.fromSecretKey(new Uint8Array(wallet));
const mintAuthority = payer.publicKey;
const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;

// Generate keys for transfer fee config authority and withdrawal authority
const transferFeeConfigAuthority = payer;
const withdrawWithheldAuthority = payer;

// Define the extensions to be used by the mint
const extensions = [
    ExtensionType.TransferFeeConfig,
];

// Calculate the length of the mint
const mintLen = getMintLen(extensions);

// Set the decimals, fee basis points, and maximum fee
const decimals = 9;
const feeBasisPoints = 100; // 1%
const maxFee = BigInt(9 * Math.pow(10, decimals)); // 9 tokens

// Define the amount to be minted and the amount to be transferred, accounting for decimals
const mintAmount = BigInt(1_000_000 * Math.pow(10, decimals)); // Mint 1,000,000 tokens
const transferAmount = BigInt(1_000 * Math.pow(10, decimals)); // Transfer 1,000 tokens

// Calculate the fee for the transfer
const calcFee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000); // expect 10 fee
const fee = calcFee > maxFee ?  maxFee : calcFee; // expect 9 fee
// Helper function to generate Explorer URL

function generateExplorerTxUrl(txId: string) {
    return `https://explorer.solana.com/tx/${txId}?cluster=devnet`;
}

async function confirmTransaction(
    connection: Connection,
    signature: TransactionSignature,
    desiredConfirmationStatus: TransactionConfirmationStatus = 'confirmed',
    timeout: number = 30000,
    pollInterval: number = 1000,
    searchTransactionHistory: boolean = false
): Promise<SignatureStatus> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const { value: statuses } = await connection.getSignatureStatuses([signature], { searchTransactionHistory });

        if (!statuses || statuses.length === 0) {
            throw new Error('Failed to get signature status');
        }

        const status = statuses[0];

        if (status === null) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            continue;
        }

        if (status.err) {
            throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
        }

        if (status.confirmationStatus && status.confirmationStatus === desiredConfirmationStatus) {
            return status;
        }

        if (status.confirmationStatus === 'finalized') {
            return status;
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
}

async function main() {
    // Step 1 - Airdrop to Payer
    // const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    // await confirmTransaction(connection, airdropSignature);

    // Step 2 - Create a New Token
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);
    const mintTransaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeTransferFeeConfigInstruction(
            mint,
            transferFeeConfigAuthority.publicKey,
            withdrawWithheldAuthority.publicKey,
            feeBasisPoints,
            maxFee,
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(mint, decimals, mintAuthority, null, TOKEN_2022_PROGRAM_ID)
    );
    const newTokenTx = await sendAndConfirmTransaction(connection, mintTransaction, [payer, mintKeypair], undefined);
    console.log("New Token Created:", generateExplorerTxUrl(newTokenTx));

    // Step 3 - Mint tokens to Owner
    const owner = payer;
    const sourceAccount = await createAssociatedTokenAccountIdempotent(connection, payer, mint, owner.publicKey, {}, TOKEN_2022_PROGRAM_ID);
    const mintSig = await mintTo(connection,payer,mint,sourceAccount,mintAuthority,mintAmount,[],undefined,TOKEN_2022_PROGRAM_ID);
    console.log("Tokens Minted:", generateExplorerTxUrl(mintSig));

    // Step 4 - Send Tokens from Owner to a New Account
    const destinationOwner = new PublicKey('2aRnYRDi94vwgxpUvQVCiZH8S7R1XSvpR6vahLzXWrH7');
    const destinationAccount = await createAssociatedTokenAccountIdempotent(connection, payer, mint, destinationOwner, {}, TOKEN_2022_PROGRAM_ID);
    const transferSig = await transferCheckedWithFee(
        connection,
        payer,
        sourceAccount,
        mint,
        destinationAccount,
        owner,
        transferAmount,
        decimals,
        fee,
        []
    );

    console.log("Tokens Transfered:", generateExplorerTxUrl(transferSig));

    // Step 5 - Fetch Fee Accounts

    // Step 6 - Harvest Fees
}