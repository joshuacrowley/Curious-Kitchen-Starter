# Airtable Schema Lookup

Fetch and analyze an Airtable base's complete schema including tables, fields, field types, and relationships to provide context for integration work.

## Objective

Retrieve comprehensive schema information from an Airtable base to understand its structure, field types, relationships between tables, and data organization. This provides essential context for building integrations, designing data models, or troubleshooting API interactions.

## Requirements

- Valid Airtable API credentials (Personal Access Token or OAuth)
- Airtable Base ID (format: `appXXXXXXXXXXXXXX`)
- Access to Airtable Web API or Meta API
- Understanding of Airtable field type conventions

## Steps

1. **Authenticate**: Verify API credentials are available (environment variables, config files, or prompt user)

2. **Fetch Base Metadata**: 
   - Use `GET https://api.airtable.com/v0/meta/bases/{baseId}/tables` to retrieve all tables
   - Extract table IDs, names, and descriptions

3. **Analyze Each Table**:
   - For each table, retrieve field schema
   - Document field names, IDs, types, and options
   - Identify primary fields
   - Note any views if available

4. **Map Relationships**:
   - Identify `multipleRecordLinks` fields
   - Document which tables link to each other
   - Note inverse relationship fields

5. **Document Field Types**:
   - List all field types present in the base
   - Note special configurations (formulas, lookups, rollups)
   - Identify computed vs. editable fields

6. **Present Summary**:
   - Provide structured overview of entire base
   - Highlight key relationships and data flows
   - Note any complex field configurations

## Expected Information to Retrieve

For each table, capture:

- **Table ID** and **Name**
- **Description** (if available)
- **Primary Field** ID and name
- **Field List**:
  - Field ID
  - Field name
  - Field type (singleLineText, multipleRecordLinks, singleSelect, etc.)
  - Field options (for selects, links, formulas, etc.)
  - Read-only status

For linked record fields specifically:

- Source table and field
- Target table ID (`linkedTableId`)
- Inverse field ID (`inverseLinkFieldId`)
- Whether it prefers single record (`prefersSingleRecordLink`)

## Output Format

Provide a clear, structured summary:

```markdown
# Airtable Base Schema: [Base Name]

Base ID: `appXXXXXXXXXXXXXX`

## Tables Overview

### Table: [Table Name]
- **Table ID**: `tblXXXXXXXXXXXXXX`
- **Primary Field**: [Field Name] (ID: `fldXXXXXXXXXXXXXX`)
- **Description**: [Table description if available]

#### Fields

1. **[Field Name]** (`fldXXXXXXXXXXXXXX`)
   - Type: `[fieldType]`
   - Read-only: [Yes/No]
   - Options: [Key configuration details]
   - Notes: [Any important details about formulas, lookups, etc.]

2. **[Another Field]** (`fldYYYYYYYYYYYYYY`)
   - Type: `multipleRecordLinks`
   - Links to: [Target Table Name] (`tblZZZZZZZZZZZZZZ`)
   - Inverse field: [Field Name in linked table] (`fldWWWWWWWWWWWWWW`)

[Repeat for all fields]

---

### Table: [Another Table Name]
[Same structure as above]

---

## Relationships Diagram

```
[Table A] --[Field X]--> [Table B]
[Table B] --[Field Y]--> [Table C]
[Table C] --[Field Z]--> [Table A]
```

## Key Field Types Present

- Single line text: [count]
- Long text: [count]
- Number: [count]
- Single select: [count]
- Multiple select: [count]
- Date: [count]
- Checkbox: [count]
- Formula: [count]
- Lookup: [count]
- Rollup: [count]
- Linked records: [count]
- [Other types present]

## Special Configurations

- **Formulas**: [List fields with formulas and their purposes]
- **Lookups**: [List lookup fields and what they reference]
- **Rollups**: [List rollup fields and their aggregation types]
- **Computed Fields**: [List all read-only computed fields]

## Notes

- [Any important observations about the schema]
- [Potential integration considerations]
- [Unusual or complex field configurations]
```

## Reference: Common Airtable Field Types

When analyzing the schema, you'll encounter these field types:

**Text Fields**:
- `singleLineText` - Single line of text
- `multilineText` - Multiple lines (long text)
- `richText` - Rich text with formatting
- `email` - Email address
- `url` - URL
- `phoneNumber` - Phone number

**Numeric Fields**:
- `number` - Integer or decimal
- `currency` - Currency with symbol
- `percent` - Percentage value
- `duration` - Duration in seconds
- `rating` - Star rating (1-10)
- `autoNumber` - Auto-incrementing number

**Selection Fields**:
- `singleSelect` - Single choice from options
- `multipleSelects` - Multiple choices from options

**Date/Time Fields**:
- `date` - Date only
- `dateTime` - Date and time
- `createdTime` - Auto-populated creation time
- `lastModifiedTime` - Auto-populated modification time

**Relationship Fields**:
- `multipleRecordLinks` - Links to other tables
- `lookup` - Look up field from linked records
- `rollup` - Aggregate data from linked records

**Computed Fields** (read-only):
- `formula` - Computed value
- `count` - Count of linked records
- `rollup` - Aggregation of linked data
- `lookup` - Value from linked records

**User Fields**:
- `singleCollaborator` - Single user
- `multipleCollaborators` - Multiple users
- `createdBy` - User who created record
- `lastModifiedBy` - User who last modified record

**Other**:
- `checkbox` - Boolean checkbox
- `multipleAttachments` - File attachments
- `barcode` - Barcode data
- `button` - Action button
- `aiText` - AI-generated text

## API Endpoints

Use these endpoints to fetch schema information:

```bash
# Get all tables in a base (requires Meta API scopes)
GET https://api.airtable.com/v0/meta/bases/{baseId}/tables

# Get base schema (alternative endpoint)
GET https://api.airtable.com/v0/meta/bases/{baseId}

# List records from a table (to see data examples)
GET https://api.airtable.com/v0/{baseId}/{tableIdOrName}
```

## Tips

- Store credentials securely (environment variables, not hardcoded)
- Cache schema information to avoid repeated API calls
- Note that some field configurations (like formulas) include field IDs not field names
- Pay attention to `isValid: false` flags indicating broken references
- Consider rate limits when fetching data from multiple tables
- Use the returned field IDs (not names) for API operations

## Use Cases

This command is useful when you need to:

- Start a new Airtable integration project
- Understand an unfamiliar base structure
- Document an Airtable base for your team
- Debug API integration issues
- Plan data migrations or transformations
- Design matching database schemas
- Generate TypeScript types or validation schemas

