use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use anchor_lang::system_program::Transfer;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(ctx.bumps)?;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)?;
        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()?;
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub vault_system_account_bump: u8,
    pub vault_state_bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + VaultState::INIT_SPACE, //add 8 for discriminator
        seeds = [b"state", signer.key().as_ref()],
        bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        seeds = [vault_state.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, VaultState>,
    pub system_program: Program<'info, System>,
}

// Aligns more with Rust style to use impl
impl<'info> Initialize<'info> {
    fn initialize(&mut self, bumps: InitializeBumps) -> Result<()> {
        self.vault_state.vault_system_account_bump = bumps.vault;
        self.vault_state.vault_state_bump = bumps.vault_state;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"state", signer.key().as_ref()],
        bump = vault_state.vault_state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [vault_state.key().as_ref()],
        bump = vault_state.vault_system_account_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Deposit<'info> {
    fn deposit(&mut self, amount: u64) -> Result<()> {
        let system_program = self.system_program.to_account_info();
        let accounts = Transfer {
            from: self.signer.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(system_program, accounts);

        transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"state", signer.key().as_ref()],
        bump = vault_state.vault_state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [vault_state.key().as_ref()],
        bump = vault_state.vault_system_account_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.signer.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.vault_state_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        assert!(self.signer.is_signer);
        assert!(amount <= self.vault.lamports() && amount > 0);
        transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"state", signer.key().as_ref()],
        bump = vault_state.vault_state_bump,
        close = vault_state
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [vault_state.key().as_ref()],
        bump = vault_state.vault_system_account_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
impl<'info> Close<'info> {
    fn close(&mut self) -> Result<()> {
        assert!(
            self.vault.lamports() <= Rent::get()?.minimum_balance(8) && self.vault.lamports() > 0
        );
        self.vault_state.close(self.vault.to_account_info())?;
        Ok(())
    }
}
