import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TokenVault } from '../target/types/token_vault';
import { expect } from 'chai';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

describe('token-vault', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.TokenVault as Program<TokenVault>;
    const vault = anchor.web3.Keypair.generate();
    const owner = provider.wallet.publicKey;

    it('Initializes the vault', async () => {
        await program.methods
            .initialize(owner)
            .accounts({
                vault: vault.publicKey,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([vault])
            .rpc();
    });

    it('Deposits SOL into vault', async () => {
        const depositAmount = new anchor.BN(1_000_000_000); // 1 SOL
        const balanceBefore = await provider.connection.getBalance(vault.publicKey);

        await program.methods
            .deposit(depositAmount)
            .accounts({
                vault: vault.publicKey,
                depositor: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const balanceAfter = await provider.connection.getBalance(vault.publicKey);
        expect(balanceAfter - balanceBefore).to.equal(depositAmount.toNumber());
    });

    it('Only owner can withdraw', async () => {
        const withdrawAmount = new anchor.BN(500_000_000); // 0.5 SOL
        const balanceBefore = await provider.connection.getBalance(owner);

        await program.methods
            .withdraw(withdrawAmount)
            .accounts({
                vault: vault.publicKey,
                owner: owner,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const balanceAfter = await provider.connection.getBalance(owner);
        expect(balanceAfter - balanceBefore).to.be.approximately(
            withdrawAmount.toNumber(),
            1000000 // Account for transaction fees
        );
    });

    it('Fails when non-owner tries to withdraw', async () => {
        const nonOwner = anchor.web3.Keypair.generate();
        const withdrawAmount = new anchor.BN(100_000_000);

        try {
            await program.methods
                .withdraw(withdrawAmount)
                .accounts({
                    vault: vault.publicKey,
                    owner: nonOwner.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .signers([nonOwner])
                .rpc();
            expect.fail('Expected transaction to fail');
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
        }
    });
});