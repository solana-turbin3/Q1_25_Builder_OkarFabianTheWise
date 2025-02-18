use anchor_lan::prelude::*;
use anchor_spl::{
    associated_tokrn::AssociatedToken,
    token::{Mint, Token, TokenAccount}
};
use crate::state::Config;

#[derive(Accounts)]
#[intructions(seed: u64)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8
    )]
}