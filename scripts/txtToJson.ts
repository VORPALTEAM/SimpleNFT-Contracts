import { NetworkProvider } from '@ton/blueprint';
import * as fs from 'fs';
import * as path from 'path';

const inputFile = path.resolve(__dirname, 'wallets.txt');
const outputFile = path.resolve(__dirname, 'wallets.json');

export async function run(provider: NetworkProvider) {
// Read text
const text = fs.readFileSync(inputFile, 'utf-8');

// Split to rows
const lines = text.split('\n');

const wallets: {
    address: string;
    mnemonic: string[];
}[] = [];

let current: { address?: string; mnemonic?: string } = {};

for (const line of lines) {
    if (line.startsWith('Address:')) {
        current.address = line.replace('Address:', '').trim();
    } else if (line.startsWith('Mnemonic:')) {
        current.mnemonic = line.replace('Mnemonic:', '').trim();
    } else if (line.trim() === '') {
        if (current.address && current.mnemonic) {
            wallets.push({
                address: current.address,
                mnemonic: current.mnemonic.split(' '),
            });
        }
        current = {};
    }
}

// If last row not empty
if (current.address && current.mnemonic) {
    wallets.push({
        address: current.address,
        mnemonic: current.mnemonic.split(' '),
    });
}

fs.writeFileSync(outputFile, JSON.stringify(wallets, null, 2), 'utf-8');

console.log(`✅ Saved ${wallets.length} wallets to ${outputFile}`);
}