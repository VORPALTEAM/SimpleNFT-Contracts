import { beginCell, Cell } from '@ton/core';

const OFFCHAIN_CONTENT_PREFIX = 0x01;

function bufferToChunks(buffer: Buffer, chunkSize: number): Buffer[] {
    const chunks: Buffer[] = [];
    let remaining = buffer;

    while (remaining.byteLength > 0) {
        chunks.push(remaining.subarray(0, chunkSize));
        remaining = remaining.subarray(chunkSize);
    }

    return chunks;
}

export function encodeOffchainContent(content: string): Cell {
    const data = Buffer.concat([Buffer.from([OFFCHAIN_CONTENT_PREFIX]), Buffer.from(content)]);
    const chunks = bufferToChunks(data, 127);

    if (chunks.length === 0) {
        return beginCell().endCell();
    }

    let current = beginCell().storeBuffer(chunks[chunks.length - 1]).endCell();

    for (let i = chunks.length - 2; i >= 0; i -= 1) {
        current = beginCell().storeBuffer(chunks[i]).storeRef(current).endCell();
    }

    return current;
}

export function normalizeContent(content: string | Cell): Cell {
    return typeof content === 'string' ? encodeOffchainContent(content) : content;
}
