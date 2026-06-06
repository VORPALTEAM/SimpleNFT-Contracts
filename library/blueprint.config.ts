import { Config } from '@ton/blueprint';

// console.log("Settings:", process.env);


export const config: Config = {
    network: {
        endpoint: "https://toncenter.com/api/v2/jsonRPC", // 'https://testnet.toncenter.com/api/v2/jsonRPC',
        type:  'mainnet', // 'testnet', // 'mainnet'
        key: process.env.API_KEY
    },

}