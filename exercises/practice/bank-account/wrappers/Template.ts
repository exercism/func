import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano, fromNano } from 'ton-core';

export type TemplateConfig = {
    account_state: number,
    owner_address: Address
}

export function templateConfigToCell(config: TemplateConfig): Cell {
    return beginCell().storeInt(config.account_state, 8).storeAddress(config.owner_address).endCell();
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

    async sendLock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(300, 32).endCell(),
        });
    }

    async sendUnlock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(400, 32).endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, depositAmount: string) {
        await provider.internal(via, {
            value: toNano(depositAmount),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(500, 32).endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, withdrawal_amount: string, receiver: Address) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(600, 32).storeCoins(toNano(withdrawal_amount)).storeAddress(receiver).endCell(),
        });
    }

    async get_account_state(provider: ContractProvider) {
        const result = await provider.get('get_account_state', []);
        return Number(result.stack.readBigNumber());
    }

    async get_balance(provider: ContractProvider) {
        const result = await provider.get('my_balance', []);
        return Number(fromNano(result.stack.readBigNumber()));
    }

}
