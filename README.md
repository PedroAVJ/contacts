# Contacts

Contacts is the user's dual-client plugin for live Apple Contacts access
on macOS. Its `contacts` CLI uses Apple's public Contacts framework to inventory
and search raw cards with their account containers, read rich structured cards,
discover and add exact directional relationships on My Card, add verified email
addresses, and safely add or remove postal addresses without visual automation.

The plugin stores no contact data, credentials, exports, or local database.
macOS owns authorization and the live address book.

## Common commands

```bash
./bin/contacts --json doctor
./bin/contacts --json list --container iCloud --limit 100 --offset 0
./bin/contacts --json search "name or phone" --container iCloud
./bin/contacts --json read CONTACT_ID
./bin/contacts --json me
./bin/contacts --json relationships
./bin/contacts --json relationships CONTACT_ID
./bin/contacts --json relationship add OWNER_CONTACT_ID RELATED_CONTACT_ID --label manager
./bin/contacts --json email add CONTACT_ID --label home --value person@example.com
./bin/contacts --json address add CONTACT_ID \
  --label home --street "Street" --city "City" --state "State" \
  --postal-code "Postal code" --country "Country" --country-code MX
```

Search returns raw cards rather than Contacts' unified people. This makes the
account boundary visible before a write when the same person exists in both
iCloud and Google.

## Relationship model

Apple contact relationships are directional labeled names, not persistent
links between two contact IDs. For example, My Card can store `sister -> Jane
Doe`; that value does not automatically create `brother -> the user` on Jane's
card. `relationships` reads the unified My Card and reports exact raw-card name
matches as `exact`, `ambiguous`, or `unmatched` so callers do not silently guess.
If Apple does not expose My Card, callers can supply one exact raw contact ID;
the plugin never guesses which person is the user.

`relationship add` requires exact raw IDs for both the owner and related card.
It stores the related card's current full name under the requested directional
label, is idempotent, and verifies the saved value by reading the owner card
back. `boss` is accepted as an alias for Apple's standard `manager` label.

`email add` requires one exact raw card ID and a verified email value. It is
additive and idempotent: an existing normalized value returns
`already_present`; a missing value is appended and read back before success is
reported. It never replaces a different email address or silently corrects a
suspected typo.

Detailed reads expose the structured fields Contacts owns well: name parts,
nickname and phonetic names; organization, department, and job title; phones,
email, addresses, URLs, messaging accounts, and social profiles; birthdays and
other labeled dates; relationships; and photo availability. Contact notes are
not read because modern Apple platforms protect them with a restricted
entitlement.

Phone reads preserve Apple's raw `value` and also expose `e164`,
`e164_source`, and `default_country_code`. Numbers already stored with `+` are
canonicalized as explicit values; historical Mexican `+521` transport values
are emitted as current `+52` with `explicit_legacy_mexico` provenance. An unprefixed national number is normalized
with Contacts' device-default country when the plugin supports that numbering
plan; the result is marked `default_country` rather than presented as an
explicitly stored country code. Short numbers and unsupported formats remain
`unavailable`.

## Validation

```bash
npm test
```
