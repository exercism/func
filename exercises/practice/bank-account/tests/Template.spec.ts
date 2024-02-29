import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Template } from '../wrappers/Template';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Template', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Template');
    });

    let blockchain: Blockchain;
    let template: SandboxContract<Template>;
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const owner = await blockchain.treasury('owner');

        template = blockchain.openContract(Template.createFromConfig({account_state: 0, owner_address: owner.address}, code));

        const deployResult = await template.sendDeploy(owner.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            deploy: true,
            success: true,
        });
    });
    
    it('check balance after deploy', async () => {
        expect(await template.get_balance()).toBeCloseTo(0.05);
    });

    xit('check locked', async () => {
        expect(await template.get_account_state()).toBe(0);
    });

    xit('check double locked', async () => {
        const owner = await blockchain.treasury('owner');

        const lockResult = await template.sendLock(owner.getSender());
        expect(lockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: false,
            exitCode: 260
        });
    });

    xit('invalid locker', async () => {
        const invalidLocker = await blockchain.treasury('invalid locker');

        const lockResult = await template.sendLock(invalidLocker.getSender());
        expect(lockResult.transactions).toHaveTransaction({
            from: invalidLocker.address,
            to: template.address,
            success: false,
            exitCode: 250
        });
    });

    xit('check unlocked', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender());
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        expect(await template.get_account_state()).toBe(-1);
    });

    xit('check double unlocked', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult1 = await template.sendUnlock(owner.getSender());
        expect(unlockResult1.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const unlockResult2 = await template.sendUnlock(owner.getSender());
        expect(unlockResult2.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: false,
            exitCode: 270
        });
    });

    xit('invalid unlocker', async () => {
        const invalidUnlocker = await blockchain.treasury('invalid unlocker');

        const unlockResult = await template.sendLock(invalidUnlocker.getSender());
        expect(unlockResult.transactions).toHaveTransaction({
            from: invalidUnlocker.address,
            to: template.address,
            success: false,
            exitCode: 250
        });
    });

    xit('deposit to locked account', async () => {
        const owner = await blockchain.treasury('owner');

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            exitCode: 260
        });
    });

    xit('deposit test', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender()); // unlock
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        expect(await template.get_balance()).toBeCloseTo(100, 0);
    });

    xit('deposit-withdraw test', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender()); // unlock
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const withdrawResult = await template.sendWithdraw(owner.getSender(), '50', owner.address); // deposit
        expect(withdrawResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        expect(await template.get_balance()).toBeCloseTo(50, 0);
    });

    xit('withdraw invalid owner', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender()); // unlock
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const invalid_withdraw = await blockchain.treasury('invalid_withdraw');
        const withdrawResult = await template.sendWithdraw(invalid_withdraw.getSender(), '50', owner.address); // deposit
        expect(withdrawResult.transactions).toHaveTransaction({
            from: invalid_withdraw.address,
            to: template.address,
            success: false,
            exitCode: 250
        });
    });

    xit('withdraw from locked account', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender()); // unlock
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const lockResult = await template.sendLock(owner.getSender());
        expect(lockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true
        });

        const withdrawResult = await template.sendWithdraw(owner.getSender(), '50', owner.address); // deposit
        expect(withdrawResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: false,
            exitCode: 260
        });
    });

    xit('withdraw more than balance', async () => {
        const owner = await blockchain.treasury('owner');

        const unlockResult = await template.sendUnlock(owner.getSender()); // unlock
        expect(unlockResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const depositResult = await template.sendDeposit(owner.getSender(), '100'); // deposit
        expect(depositResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: true,
        });

        const withdrawResult = await template.sendWithdraw(owner.getSender(), '150', owner.address); // deposit
        expect(withdrawResult.transactions).toHaveTransaction({
            from: owner.address,
            to: template.address,
            success: false,
            exitCode: 280
        });
    });
});
