use solana_client::rpc_client::RpcClient;
use solana_program::system_program;
use solana_program::{pubkey::Pubkey, system_instruction::transfer};
use solana_sdk::signer::keypair;

#[allow(unused_imports)]
use solana_sdk::{
    bs58,
    message::Message,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};

use std::io::{self, BufRead};
use std::str::FromStr;
mod programs;

use crate::programs::Turbin3_prereq::{CompleteArgs, Turbin3PrereqProgram};

// RPC URL for Solana devnet
const RPC_URL: &str = "https://api.devnet.solana.com";

// Use `lazy_static` for global keypair and RPC client
lazy_static::lazy_static! {
    static ref KEYPAIR: Keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
    static ref CLIENT: RpcClient = RpcClient::new(RPC_URL);
    static ref SIGNER: Keypair = read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn keygen() {
        // Create a new keypair
        let kp = Keypair::new();
        println!(
            "You've generated a new Solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn airdrop() {
        // Claim 2 devnet SOL tokens (2 billion lamports)
        match CLIENT.request_airdrop(&KEYPAIR.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println!("Success! Check out your TX here:");
                println!(
                    "https://explorer.solana.com/tx/{}?cluster=devnet",
                    s.to_string()
                );
            }
            Err(e) => println!("Oops, something went wrong: {}", e.to_string()),
        };
    }

    #[test]
    fn transfer_sol() {
        // Define the recipient public key
        let to_pubkey = Pubkey::from_str("EQwTVcC9gQAPAbuXKJNAG4Rahm7BgXEcV3Rq9xa8CEvS").unwrap();

        // Get balance of dev wallet
        let balance = CLIENT
            .get_balance(&KEYPAIR.pubkey())
            .expect("Failed to get balance");

        // Get recent blockhash
        let recent_blockhash = CLIENT
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Create a test transaction to calculate fees
        let message = Message::new_with_blockhash(
            &[transfer(&KEYPAIR.pubkey(), &to_pubkey, balance)],
            Some(&KEYPAIR.pubkey()),
            &recent_blockhash,
        );

        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        let fee = CLIENT
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        // Create the transfer transaction
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&KEYPAIR.pubkey(), &to_pubkey, balance - fee)],
            Some(&KEYPAIR.pubkey()),
            &vec![&*KEYPAIR],
            recent_blockhash,
        );

        // Send the transaction
        let signature = CLIENT
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        // Print the transaction signature
        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn wallet_to_base58() {
        println!("Input your private key as a wallet file byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }

    #[test]
    fn enroll() {
        let prereq = Turbin3PrereqProgram::derive_program_address(&[
            b"prereq",
            SIGNER.pubkey().to_bytes().as_ref(),
        ]);

        // Define our instruction data
        let args = CompleteArgs {
            github: b"OkarFabianTheWise".to_vec(),
        };

        // Get recent blockhash
        let recent_blockhash = CLIENT
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        // Now we can invoke the "complete" function
        let transaction = Turbin3PrereqProgram::complete(
            &[&SIGNER.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&SIGNER.pubkey()),
            &[&SIGNER],
            recent_blockhash,
        );

        // Send the transaction
        let signature = CLIENT
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        // Print our transaction out
        println!(
            "Success! Check out your TX here:
https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}
