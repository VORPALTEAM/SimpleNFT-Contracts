import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';

export async function checkCollectionWhitelist(provider: NetworkProvider, 
    collectionAddressStr: string, 
    walletAddressStr: string) {
  const ui = provider.ui();

  try {
    // Parse addresses
    const collectionAddress = Address.parse(collectionAddressStr);
    const walletAddress = Address.parse(walletAddressStr);

    ui.write(`Checking whitelist status for wallet ${walletAddress} in collection ${collectionAddress}\n`);

    const collection = provider.open(SimpleNftCollectionV2.fromAddress(collectionAddress));

    const buyerProfileAddress = await collection.getGetBuyerProfileAddress(walletAddress);

    ui.write(`Buyer profile address: ${buyerProfileAddress}\n`);

    const profile = provider.open(BuyerProfile.fromAddress(buyerProfileAddress));

    const isWhitelisted = await profile.getIsWhitelisted();

    ui.write(`Whitelist status: ${isWhitelisted ? '✅ Whitelisted' : '❌ Not whitelisted'}\n`);

    return isWhitelisted;
  } catch (error) {
    ui.write(`Error: ${(error as Error).message}\n`);
    return false;
  }
}

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const collectionAddressStr = await ui.input('Collection adddress (V2 or higher):');
    const walletAddressStr = await ui.input('Wallet:');
    await checkCollectionWhitelist (provider, collectionAddressStr, walletAddressStr);
}