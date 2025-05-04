import { NetworkProvider } from "@ton/blueprint";
import { Address } from "@ton/core";

export async function waitForDeploy(
    provider: NetworkProvider,
    address: Address,
    maxAttempts = 12,
    interval = 5000
): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const deployed = await provider.isContractDeployed(address);
        if (deployed) {
            console.log(`✅ Creation after ${attempt} intervals`);
            return true;
        }
        console.log(`⏳ Period ${attempt}/${maxAttempts}: not deployed, wait ${interval / 1000} seconds...`);
        await new Promise((r) => setTimeout(r, interval));
    }
    console.warn(`❌ Not deployed after${maxAttempts} times`);
    return false;
}