import { KeyPair } from "@ton/crypto";
import { beginCell, Cell, WalletContractV5R1 } from "@ton/ton";
import { Address, Builder, OpenedContract } from "@ton/core";

export function buildAddressListCell(addresses: Address[]) {
  const cell = beginCell();
  cell.storeUint(addresses.length, 8);
  for (const address of addresses) {
    cell.storeAddress(address);
  }
  return cell.endCell();
}

export function makeSnakeAddressCell(addresses: Address[]): Cell {
    const buildChain = (fromIndex: number): Cell => {
        const cell = beginCell();
        let i = fromIndex;

        // Limit: 3 address per cell
        for (let j = 0; j < 3 && i < addresses.length; j++, i++) {
            cell.storeAddress(addresses[i]);
        }

        if (i < addresses.length) {
            cell.storeRef(buildChain(i));  // ✅ Ref when build only
        }

        return cell.endCell();
    };

    return buildChain(0);
}

function hasReference(cell: Cell): boolean {
  const cs = cell.beginParse();
  return cs.remainingRefs > 0;
}


export function makeSnakeAddressCellPerOne (addresses: Address[]): Cell {
    let next: Cell | null = null;

    for (let i = addresses.length - 1; i >= 0; i--) {
        const cell = beginCell();
        cell.storeAddress(addresses[i]);

        if (next) {
            cell.storeRef(next);
        }

        next = cell.endCell();
    }

    return next ?? beginCell().endCell();
}

export function readSnakeAddressCell(root: Cell): Address[] {
    console.log("Read started for:", root, "Ref:", hasReference(root))
  const addresses: Address[] = [];
  let current = root.beginParse();
  let counter = 1;

  while (true) {
    // Parsing while enough bits
    console.log("Iteration:", counter)
    while (current.remainingBits >= 267) {
      const newAddress = current.loadAddress();
      addresses.push(newAddress);
      console.log("Read:", newAddress);
    }
    
    // Checking the next cell
    if (current.remainingRefs > 0) {
      console.log('Next ref...');
      counter++;
      current = current.loadRef().beginParse();
    } else {
      break;
    }
  }

  return addresses;
}