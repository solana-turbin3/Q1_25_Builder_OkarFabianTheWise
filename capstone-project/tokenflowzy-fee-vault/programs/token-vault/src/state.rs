use anchor_lang::prelude::*;

// The state of the vault.
// This is the account that holds the funds for the vault.
#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub owner: Pubkey,
    pub vault_state_bump: u8,
    pub revenue: u64,
    pub tokens_deployed: u64,
}
