# Documentation Scripts

This directory contains utility scripts for managing the React SuperAdmin
documentation.

## Scripts

### `update-timestamps.js`

Automatically updates build timestamps in MDX documentation files.

**Usage:**

```bash
# Update timestamps manually
node scripts/update-timestamps.js

# Update timestamps and build docs
pnpm build:timestamp
```

**What it does:**

- Updates build timestamps in key documentation files
- Places timestamps after frontmatter (not inside it)
- Removes duplicate timestamps
- Shows when documentation was last built

**Files updated:**

- `docs/index.md` - Main documentation page
- `docs/components/button.mdx` - Button component docs
- `docs/components/footer.mdx` - Footer component docs

**Example output:**

```
🔄 Updating build timestamps to: August 21, 2025 at 9:00 PM
✅ Updated: index.md
✅ Updated: components/button.mdx
✅ Updated: footer.mdx

🎉 Build timestamps updated successfully!
```

## NPM Scripts

The following npm scripts are available in `package.json`:

- `pnpm build` - Build documentation normally
- `pnpm build:timestamp` - Update timestamps and build documentation
- `pnpm serve` - Serve documentation locally for development

## Adding Timestamps to New Files

To add timestamps to new MDX files:

1. Add the file path to the `filesToUpdate` array in `update-timestamps.js`
2. Run `pnpm build:timestamp` to update all timestamps
3. The timestamp will appear as: `> **🔄 Last Built**: [Current Date/Time]`

## Timestamp Format

Timestamps are displayed in a user-friendly format:

- **Example**: `August 21, 2025 at 9:00 PM`
- **Format**: `[Month] [Day], [Year] at [Hour]:[Minute] [AM/PM]`
- **Timezone**: Local system timezone
