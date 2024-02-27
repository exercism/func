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

    it('return positive numbers', async () => {
        const elements: (string | number)[] = [1, 2, 3];
        expect(await template.get_evaluate(elements)).toEqual([1, 2, 3])
    });

    it('return negative numbers', async () => {
        const elements: (string | number)[] = [-1, -2, -3];
        expect(await template.get_evaluate(elements)).toEqual([-1, -2, -3])
    });

    it('add two positive numbers', async () => {
        const elements: (string | number)[] = [1, 2, '+'];
        expect(await template.get_evaluate(elements)).toEqual([3])
    });

    it('add one positive and one negative numbers', async () => {
        const elements: (string | number)[] = [1, -2, '+'];
        expect(await template.get_evaluate(elements)).toEqual([-1])
    });

    it('add two negative numbers', async () => {
        const elements: (string | number)[] = [-1, -2, '+'];
        expect(await template.get_evaluate(elements)).toEqual([-3])
    });

    it('subtract two positive numbers', async () => {
        const elements: (string | number)[] = [1, 2, '-'];
        expect(await template.get_evaluate(elements)).toEqual([-1])
    });

    it('subtract one positive and one negative numbers', async () => {
        const elements: (string | number)[] = [1, -2, '-'];
        expect(await template.get_evaluate(elements)).toEqual([3])
    });

    it('subtract two negative numbers', async () => {
        const elements: (string | number)[] = [-1, -2, '-'];
        expect(await template.get_evaluate(elements)).toEqual([1])
    });

    it('multiply two positive numbers', async () => {
        const elements: (string | number)[] = [1, 2, '*'];
        expect(await template.get_evaluate(elements)).toEqual([2])
    });

    it('multiply one positive and one negative numbers', async () => {
        const elements: (string | number)[] = [1, -2, '*'];
        expect(await template.get_evaluate(elements)).toEqual([-2])
    });

    it('multiply two negative numbers', async () => {
        const elements: (string | number)[] = [-1, -2, '*'];
        expect(await template.get_evaluate(elements)).toEqual([2])
    });

    it('multiply two big numbers', async () => {
        const elements: (string | number)[] = [200, 100, '*'];
        expect(await template.get_evaluate(elements)).toEqual([20000])
    });

    it('divide two positive numbers', async () => {
        const elements: (string | number)[] = [1, 2, '/'];
        expect(await template.get_evaluate(elements)).toEqual([0])
    });

    it('divide one positive and one negative numbers', async () => {
        const elements: (string | number)[] = [-1, 2, '/'];
        expect(await template.get_evaluate(elements)).toEqual([-1])
    });

    it('divide two negative numbers', async () => {
        const elements: (string | number)[] = [-1, -2, '/'];
        expect(await template.get_evaluate(elements)).toEqual([0])
    });

    it('divide two big numbers', async () => {
        const elements: (string | number)[] = [200, 100, '/'];
        expect(await template.get_evaluate(elements)).toEqual([2])
    });

    it('divide by zero', async () => {
        const elements: (string | number)[] = [1, 0, '/'];
        try {
            await template.get_evaluate(elements);
        } catch {
            return true;
        }
        throw('You must throw an error for division by zero!')
    });

    it('sum and sub combination', async () => {
        const elements: (string | number)[] = [1, 2, '+', 4, '-'];
        expect(await template.get_evaluate(elements)).toEqual([-1])
    });

    it('mul and div combination', async () => {
        const elements: (string | number)[] = [2, 4, '*', 3, '/'];
        expect(await template.get_evaluate(elements)).toEqual([2])
    });

    it('dup one', async () => {
        const elements: (string | number)[] = [1, 'dup'];
        expect(await template.get_evaluate(elements)).toEqual([1, 1])
    });

    it('dup two', async () => {
        const elements: (string | number)[] = [1, 2, 'dup'];
        expect(await template.get_evaluate(elements)).toEqual([1, 2, 2])
    });

    it('two dup', async () => {
        const elements: (string | number)[] = [1, 'dup', 2, 'dup'];
        expect(await template.get_evaluate(elements)).toEqual([1, 1, 2, 2])
    });

    it('drop', async () => {
        const elements: (string | number)[] = [1, 'drop'];
        expect(await template.get_evaluate(elements)).toEqual([])
    });

    it('drop drop', async () => {
        const elements: (string | number)[] = [1, 2, 'drop', 'drop'];
        expect(await template.get_evaluate(elements)).toEqual([])
    });

    it('swap two', async () => {
        const elements: (string | number)[] = [1, 2, 'swap'];
        expect(await template.get_evaluate(elements)).toEqual([2, 1])
    });

    it('swap three', async () => {
        const elements: (string | number)[] = [1, 2, 3, 'swap'];
        expect(await template.get_evaluate(elements)).toEqual([1, 3, 2])
    });

    it('over', async () => {
        const elements: (string | number)[] = [1, 2, 'over'];
        expect(await template.get_evaluate(elements)).toEqual([1, 2, 1])
    });

    it('over over', async () => {
        const elements: (string | number)[] = [1, 2, 3, 'over'];
        expect(await template.get_evaluate(elements)).toEqual([1, 2, 3, 2])
    });

    it('dup drop swap over ', async () => {
        const elements: (string | number)[] = [1, 2, 'dup', 'drop', 'swap', 'over'];
        expect(await template.get_evaluate(elements)).toEqual([2, 1, 2])
    });
});