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

### `fix-live-examples.js`

Automatically fixes common issues in live examples across all MDX files.

**Usage:**
```bash
# Fix live examples manually
node scripts/fix-live-examples.js

# Fix live examples using npm script
pnpm fix:live
```

**What it fixes:**
- Converts `React.React.useState` to `React.useState`
- Changes `tsx live` to `jsx live` code blocks
- Adds component rendering to example functions
- Removes duplicate component tags
- Ensures all live examples work properly

### `fix-all-live-examples.js`

Comprehensive script that fixes ALL live example issues systematically.

**Usage:**
```bash
# Fix all live examples comprehensively
node scripts/fix-all-live-examples.js

# Fix all live examples using npm script
pnpm fix:all
```

**What it fixes comprehensively:**
- All useState/React.useState issues
- All tsx live to jsx live conversions
- Component rendering for ALL example functions
- Component syntax errors (Modal, DateInput, Input)
- Malformed closing tags and syntax errors
- Proper spacing and formatting
- Handles nested braces and complex functions

## NPM Scripts

The following npm scripts are available in `package.json`:

- `pnpm build` - Build documentation normally
- `pnpm build:timestamp` - Update timestamps and build documentation
- `pnpm fix:live` - Fix basic live examples automatically
- `pnpm fix:all` - Fix ALL live examples comprehensively
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
