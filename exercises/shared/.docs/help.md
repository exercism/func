# Help

<!-- TODO: write document

  This document should contain track-specific instructions on how to get help when
  the student is stuck.

  The instructions should be short and to the point.

  You could link to resources like Gitter channels, forums or mailing lists:
  whatever can help a student become unstuck.

  This document should **not** link to Exercism-wide (track-agnostic) help resources,
  as those resources will automatically be included in the HELP.md file.

  The links in this document can overlap with those in docs/LEARNING.md or docs/RESOURCES.md

  When a student downloads an exercise via the CLI, this file's contents are
  included into the HELP.md file.

  See https://exercism.org/docs/building/tracks/shared-files for more information. -->

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies. You are expected to edit only contracts/template.fc file.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.
