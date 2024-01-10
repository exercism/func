import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Template } from '../wrappers/Template';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { log } from 'console';

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

    function string2BigInt(string: String) {
        let binStr = string.split('').map(function (char) {
            let binary_string: string = char.charCodeAt(0).toString(2);
            while (binary_string.length < 8) {
                binary_string = "0" + binary_string;
            }
            return binary_string;
        }).join('');

        const lastIndex = binStr.length - 1;
        let total = BigInt(0);
        for (let i = 0; i < binStr.length; i++) {
            if (binStr[lastIndex - i] === '1') {
                total += (BigInt(2) ** BigInt(i));
            }
        }

        return total;
    }

    it('should return hello world', async () => {
        expect(await template.getHelloWorld()).toStrictEqual(string2BigInt("Hello, World!"));
    });
});
