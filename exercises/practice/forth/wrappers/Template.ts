import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItem, TupleReader } from 'ton-core';

export type TemplateConfig = {};

export function templateConfigToCell(config: TemplateConfig): Cell {
    return beginCell().endCell();
}

function tupleReaderToList(tuple: TupleReader): number[] {
    let arr: number[] = []
    let length: number = tuple.remaining
    for (let i = 0; i < length; i++) {
        arr.push(Number(tuple.readBigNumber()))
    }
    return arr
}

export class Template implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Template(address);
    }

    static createFromConfig(config: TemplateConfig, code: Cell, workchain = 0) {
        const data = templateConfigToCell(config);
        const init = { code, data };
        return new Template(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_evaluate(provider: ContractProvider, elements: (string | number)[]) {
        let number_and_operation: TupleItem[] = []
        for (const element of elements) {
            if(typeof element === 'number') {
                number_and_operation.push({ type: 'int', value: BigInt(element) })
            }
            else if(typeof element === 'string') {
                number_and_operation.push({ type: 'slice', cell: beginCell().storeStringTail(element).asCell() })
            }
        }
        const result = await provider.get('evaluate', [{ type: 'tuple', items: number_and_operation }]);
        
        return tupleReaderToList(result.stack.readTuple());
    }
}
