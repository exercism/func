import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, TupleBuilder, TupleItem, TupleReader, toNano } from 'ton-core';
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

    it('test_empty', async () => {
        expect(await template.get_flatten([])).toStrictEqual([])
    });

    xit('test no nesting', async () => {
        expect(await template.get_flatten([0, 1, 2])).toStrictEqual([0, 1, 2])
    });

    xit('test flattens a nested array', async () => {
        expect(await template.get_flatten([[[]]])).toStrictEqual([])
    });

    xit('test flattens array with just integers present', async () => {
        expect(await template.get_flatten([1, [2, 3, 4, 5, 6, 7], 8])).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8])
    });

    xit('test 5 level nesting', async () => {
        expect(await template.get_flatten([0, 2, [[2, 3], 8, 100, 4, [[[50]]]], -2])).toStrictEqual([0, 2, 2, 3, 8, 100, 4, 50, -2])
    });

    xit('test 6 level nesting', async () => {
        expect(await template.get_flatten([1, [2, [[3]], [4, [[5]]], 6, 7], 8])).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8])
    });

    xit('test null values are omitted from the final result', async () => {
        expect(await template.get_flatten([1, 2, null])).toStrictEqual([1, 2])
    });

    xit('test consecutive null values at the front of the list are omitted from the final result', async () => {
        expect(await template.get_flatten([null, null, 3])).toStrictEqual([3])
    });

    xit('test consecutive null values in the middle of the list are omitted from the final result', async () => {
        expect(await template.get_flatten([1, null, null, 4])).toStrictEqual([1, 4])
    });

    xit('test 6 level nest list with null values', async () => {
        expect(await template.get_flatten([0, 2, [[2, 3], 8, [[100]], null, [[null]]], -2])).toStrictEqual([0, 2, 2, 3, 8, 100, -2])
    });

    xit('test all values in nested list are null', async () => {
        expect(await template.get_flatten([null, [[[null]]], null, null, [[null, null], null], null])).toStrictEqual([])
    });
});
