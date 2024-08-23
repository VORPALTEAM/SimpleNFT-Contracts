import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/simple_n_f_t_collection.tact',
    options: {
        debug: true,
    },
};
