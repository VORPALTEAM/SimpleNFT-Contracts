import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, toNano } from '@ton/core';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import '@ton/test-utils';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { NftItem } from '../wrappers/SimpleNftItem';
import { makeSnakeAddressCell, makeSnakeAddressCellPerOne, readSnakeAddressCell } from '../utils/cell';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';

describe('Snake', () => {
    const addresses = [
        '0QCFjpcIG0XNJ7xFGy_W2_xVT7SnWqTory4ptsc1zzEGGQ2C',
        '0QAmkF21ZAsVzOYyo780KdQKvtxGWOX4d1PFlJbUbemLSVY_',
        '0QCCku9sx5XQ-mVqR9W84lUqVNFGkOSMScvZ_jZGQ2GYehPu',
        '0QCaC0SwCpA9stMsn_YuFTyi4LFIN-CCQ-RMlxkgkSBMaEas',
        '0QDem0ukH5HX3sdymO21Jo6xm5xhnIB8-3GOLoDvDjJZRUqF',
        '0QDoZejPXMujk9fRvcKo4YejaEescW6TcsPVp-QYjKFMvZZQ',
        '0QCdQxZkivlFodMK76-woIDE7sUsoG4gaXYQEOKsHwqtdB9e',
    ];
    const arr = addresses.map((a) => Address.parse(a));

    it('should equal', async () => {
        const snakeCellPer3 = makeSnakeAddressCell(arr);
        const snakeCellPer1 = makeSnakeAddressCellPerOne(arr);

        console.log('Per 3:', snakeCellPer3.toString());
        console.log('Per 1:', snakeCellPer1.toString());

        const read3 = readSnakeAddressCell(snakeCellPer3);
        const read1 = readSnakeAddressCell(snakeCellPer1);

        const comparision3 = addresses.map((a, i) => Address.parse(a) === read3[i]);
        const comparision1 = addresses.map((a, i) => Address.parse(a) === read1[i]);

        console.log('Comparisions:', comparision3, comparision1);
        expect(comparision1.indexOf(false) === -1);
    });
});
