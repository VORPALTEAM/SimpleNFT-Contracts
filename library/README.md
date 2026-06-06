# SimpleNFT API SDK

```ts

/* -------- EXAMPLE USAGE -------- */
import { Address, SimpleNft } from "@simplenft/api";

const sdk = new SimpleNft({
  mnemonic: process.env.WALLET_MNEMONIC?.split(" "),
  network: "mainnet",
  hostname: "https://api.simplenft.io",
});

const parsed = sdk.getters.parseAddress("UQ..."); // Always return EQ...
const blockchainCollection = await sdk.getters.blockchain.collectionData(Address.parse("EQ..."));
const serverCollection = await sdk.getters.server.collectionData(Address.parse("EQ..."));
const serverItem = await sdk.getters.server.itemData(Address.parse("EQ..."));

const created = await sdk.transactions.createCollection({
  master: Address.parse("EQ..."),
  collectionContent: "https://example.com/collection.json",
  nftIndividualContent: "https://example.com/item.json",
});

if (created.status === "deployed_server_data_unavailable") {
  // Contract is deployed on-chain, but project server data is not available yet.
}
```

Transactions require `mnemonic` in the constructor.
