use anchor_lang::prelude::*;

declare_id!("JAAAWNVaMuQzXUA7cbJzff2yhazimaABsZvh7k3awsCD");

#[program]
pub mod amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
