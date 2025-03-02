use crate::state::VaultState;
use anchor_lang::prelude::*;
// Instruction to initialize the vault.
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + VaultState::INIT_SPACE,
        seeds = [b"vault_state"],
        bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>,
}
// Initialize the vault.
pub fn initialize(ctx: Context<Initialize>, owner: Pubkey) -> Result<()> {
    // Initialize the vault state. This function is called by the program owner to initialize the vault states, with the owner's public key.
    let vault_state = &mut ctx.accounts.vault_state;
    vault_state.owner = owner;
    vault_state.vault_state_bump = ctx.bumps.vault_state;
    vault_state.revenue = 0;
    vault_state.tokens_deployed = 0;
    Ok(())
}
