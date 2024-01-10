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

    it('should return hello world', async () => {
        expect(await template.getHelloWorld()).toStrictEqual(5735816763073854918203775149089n);
        
    });
});
