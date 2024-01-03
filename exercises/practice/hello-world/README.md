# func-hello-world

Basic hello-world in Func - smart contract lang for [The Open Network](https://ton.org/).
Our first smart contract (`contracts/hello_world.fc`) includes just one get method which returns "Hello world".

## Project structure

-   `contracts` - source code of our smart contract, for demo purpose we have the only one `hello_world.fc`
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts. We have just one basic which verify that we got our string
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Test

This will be enough to check how it works and play:

`npx blueprint test` or `yarn blueprint test`

### Continue to play

If you want to continue, you can do it in this playground, but I recommend to create a new project from the latest [blueprint](https://github.com/ton-community/blueprint).

Don't forget to also check the home page of [TON for builders](https://ton.org/en/dev).

# License
MIT
