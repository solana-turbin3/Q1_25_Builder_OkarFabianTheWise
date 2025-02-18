use anchor_lang::prelude::*;

declare_id!("3FivS2Wf2RX9GNSuM2dEF89GEja15i1qKRD9ctJDL3dC");

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
