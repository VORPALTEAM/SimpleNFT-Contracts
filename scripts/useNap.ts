import { Address, Contract } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SupertokenSdk } from "supertoken-sdk"

export async function run(provider: NetworkProvider) {

   const address = Address.parse("EQCmcJ2roDioCsOaYArMgT4fHb2nWL64wG47aKFpJHoA0BCv");

   const contract = provider.open(await SupertokenSdk.NAP.fromAddress(address));

}