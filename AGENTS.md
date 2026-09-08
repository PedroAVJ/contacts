# Repository guidance

- This repository is the canonical source for the `contacts` plugin.
- Keep the Codex and Claude manifests synchronized.
- Marketplace catalogs reference this repository; do not duplicate runtime
  behavior into a marketplace repository.
- Keep personal contact data out of Git. The plugin operates only on the live
  macOS Contacts store through Apple's Contacts framework.
- Search raw, non-unified cards and preserve account/container identity so a
  write cannot silently cross from iCloud into Google or another account.
- Require exact contact and address identifiers for destructive operations,
  and verify every write by reading it back.
- Bump the plugin version for released behavior changes and run `npm test`
  before publishing.
