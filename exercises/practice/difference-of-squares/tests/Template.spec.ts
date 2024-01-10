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

        template = blockchain.openContract(Template.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await template.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            deploy: true,
            success: true,
        });
    });

    it('test square of sum 1', async () => {
        expect(await template.get_square_of_sum(1)).toBe(1)
    });

    xit('test square of sum 5', async () => {
        expect(await template.get_square_of_sum(5)).toBe(225)
    });

    xit('test square of sum 100', async () => {
        expect(await template.get_square_of_sum(100)).toBe(25502500)
    });

    xit('test sum of squares 1', async () => {
        expect(await template.get_sum_of_squares(1)).toBe(1)
    });

    xit('test sum of squares 5', async () => {
        expect(await template.get_sum_of_squares(5)).toBe(55)
    });

    xit('test sum of squares 100', async () => {
        expect(await template.get_sum_of_squares(100)).toBe(338350)
    });

    xit('test difference of squares 1', async () => {
        expect(await template.get_difference_of_squares(1)).toBe(0)
    });

    xit('test difference of squares 5', async () => {
        expect(await template.get_difference_of_squares(5)).toBe(170)
    });

    xit('test difference of squares 100', async () => {
        expect(await template.get_difference_of_squares(100)).toBe(25164150)
    });
});
