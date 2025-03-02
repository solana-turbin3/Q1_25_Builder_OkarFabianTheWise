use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Only the vault owner can withdraw funds")]
    UnauthorizedWithdrawal,
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
}
