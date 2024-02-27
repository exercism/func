import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Template } from '../wrappers/Template';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

enum ExitCode {
    Success = 0,
    IntegerOverflow = 4,
    IntegerOutOfRange = 5,
    CellOverflow = 8,
    CellUnderflow = 9,
    OutOfGasError = 13, // output -> -14
    ActionInvalid = 34,
    InvalidSourceAddress = 35,
    InvalidDestinationAddress = 36,
    NotEnoughTON = 37,
}

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

    it('exit code = 0', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.Success);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: true,
            exitCode: ExitCode.Success,
        });
    });

    xit('exit code = 4', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.IntegerOverflow);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            exitCode: ExitCode.IntegerOverflow,
        });
    });

    xit('exit code = 5', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.IntegerOutOfRange);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            exitCode: ExitCode.IntegerOutOfRange,
        });
    });

    xit('exit code = 8', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.CellOverflow);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            exitCode: ExitCode.CellOverflow,
        });
    });

    xit('exit code = 9', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.CellUnderflow);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            exitCode: ExitCode.CellUnderflow,
        });
    });

    xit('exit code = 13', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.OutOfGasError);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            exitCode: -14,
        });
    });

    xit('exit code = 34', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.ActionInvalid);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            actionResultCode: ExitCode.ActionInvalid,
        });
    });

    xit('exit code = 35', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.InvalidSourceAddress);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            actionResultCode: ExitCode.InvalidSourceAddress,
        });
    });

    xit('exit code = 36', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.InvalidDestinationAddress);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            actionResultCode: ExitCode.InvalidDestinationAddress,
        });
    });

    xit('exit code = 37', async () => {
        const deployer = await blockchain.treasury('deployer');
        const exitCodeResult = await template.sendExitCode(deployer.getSender(), ExitCode.NotEnoughTON);
        expect(exitCodeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: template.address,
            success: false,
            actionResultCode: ExitCode.NotEnoughTON,
        });
    });

});
