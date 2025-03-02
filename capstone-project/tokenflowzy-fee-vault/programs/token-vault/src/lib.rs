#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("Be9kXVWMNSQgF7DjfU61Dutj3EK8QbTEYNJ8cRvuVrWK");

#[program]
pub mod token_vault {
    use super::*;
    // Initialize the token vault
    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey) -> Result<()> {
        instructions::initialize::initialize(ctx, owner)
    }

    // Deposit sol into the vault to pay for token creation
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::deposit(ctx, amount)
    }

    // Owner only withdrawal of funds
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw::withdraw(ctx, amount)
    }
}
