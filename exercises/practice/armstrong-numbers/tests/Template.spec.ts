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

    let True: number = -1; // True definition in FunC
    let False: number = 0; // False definition in FunC

    it('zero is an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(0)).toBe(True);
    });

    xit('single digit numbers are armstrong numbers', async () => {
        expect(await template.get_is_armstrong_number(5)).toBe(True);
    });

    xit('there are no two digit armstrong numbers', async () => {
        expect(await template.get_is_armstrong_number(10)).toBe(False);
    });

    xit('three digit number that is an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(153)).toBe(True);
    });

    xit('three digit number that is not an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(100)).toBe(False);
    });

    xit('four digit number that is an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(9_474)).toBe(True);
    });

    xit('four digit number that is not an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(9_475)).toBe(False);
    });

    xit('seven digit number that is an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(9_926_315)).toBe(True);
    });

    xit('seven digit number that is not an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(9_926_314)).toBe(False);
    });

    xit('nine digit number that is an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(912_985_153)).toBe(True);
    });

    xit('nine digit number that is not an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(999_999_999)).toBe(False);
    });

    xit('ten digit number that is not an armstrong number', async () => {
        expect(await template.get_is_armstrong_number(3_999_999_999)).toBe(False);
    });

});
