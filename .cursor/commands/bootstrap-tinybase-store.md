# Bootstrap TinyBase Store

Generate a complete TinyBase MergeableStore implementation with schema, types, and CRUD operations.

## Objective

Create a reactive, mergeable data layer using TinyBase with a defined schema, TypeScript type definitions, and a complete API of reactive command functions. This command produces production-ready boilerplate that follows TinyBase best practices for local-first, collaborative applications.

## Context

TinyBase `MergeableStore` extends the standard Store to support synchronization and conflict-free data merging (CRDT). By defining a schema and reactive command functions, you create a structured, type-safe, and synchronizable data layer suitable for offline-first applications.

## Requirements

### Schema Definition
- Accept a schema definition with table names, cell types, and default values
- Support types: `string`, `number`, `boolean`
- Include default values where appropriate

### Code Generation
Generate the following artifacts:

1. **Schema Definition**: `TablesSchema` object compatible with TinyBase
2. **TypeScript Types**: Interface definitions for each table
3. **Store Creation**: Initialize MergeableStore with schema applied
4. **CRUD Functions**: For each table, create:
   - `add[TableName]` - Creates a new row
   - `update[TableName]` - Updates existing row (partial)
   - `delete[TableName]` - Removes a row
5. **Reactive Listeners**: Example listener setup demonstrating reactivity

### Best Practices
- Wrap all mutations in `store.transaction()` for batched updates
- Use `setPartialRow` for updates to avoid overwriting other cells
- Include JSDoc comments for all functions
- Generate singular, PascalCase names for types (e.g., `Pet` from `pets` table)
- Use transactions to ensure atomic operations
- Add a listener example showing reactivity

## Input Format

Provide the schema as a structured object. Example:

```javascript
{
  pets: {
    name: { type: 'string' },
    speciesId: { type: 'string' },
    sold: { type: 'boolean', default: false }
  },
  species: {
    name: { type: 'string' },
    price: { type: 'number', default: 0 }
  }
}
```

## Output

Generate a complete TypeScript file containing:

### 1. Imports
```typescript
import { createMergeableStore, type MergeableStore } from 'tinybase';
```

### 2. Schema Definition
```typescript
const schema = {
  pets: {
    name: { type: 'string' },
    speciesId: { type: 'string' },
    sold: { type: 'boolean', default: false },
  },
  species: {
    price: { type: 'number', default: 0 },
  },
} as const;
```

### 3. TypeScript Type Definitions
```typescript
export interface Pet {
  name: string;
  speciesId: string;
  sold: boolean;
}

export interface Species {
  price: number;
}

export type Tables = {
  pets: { [id: string]: Pet };
  species: { [id: string]: Species };
};
```

### 4. Store Creation
```typescript
export const store = createMergeableStore('store1').setTablesSchema(schema);
```

### 5. CRUD Functions (for each table)
```typescript
/**
 * Adds a new pet to the store.
 */
export function addPet(
  store: MergeableStore,
  petId: string,
  data: Omit<Pet, 'sold'> & Partial<Pick<Pet, 'sold'>>
): void {
  store.transaction(() => {
    store.setRow('pets', petId, data);
  });
}

/**
 * Updates an existing pet in the store.
 */
export function updatePet(
  store: MergeableStore,
  petId: string,
  data: Partial<Pet>
): void {
  store.transaction(() => {
    store.setPartialRow('pets', petId, data);
  });
}

/**
 * Deletes a pet from the store.
 */
export function deletePet(store: MergeableStore, petId: string): void {
  store.transaction(() => {
    store.delRow('pets', petId);
  });
}
```

### 6. Listener Setup Example
```typescript
/**
 * Example listener setup demonstrating reactivity.
 * Call this function to attach listeners to the store.
 */
export function attachListeners(store: MergeableStore): void {
  // Listen to all changes in the pets table
  store.addRowListener('pets', null, (store, tableId, rowId) => {
    console.log(`Row '${rowId}' in '${tableId}' changed`);
    if (store.hasRow(tableId, rowId)) {
      console.log('New data:', store.getRow(tableId, rowId));
    } else {
      console.log('Row was deleted');
    }
  });
}
```

### 7. Usage Example (commented)
```typescript
/*
// Usage Example:
import { store, addPet, updatePet, deletePet, attachListeners } from './store';

// Attach listeners
attachListeners(store);

// Add data
addPet(store, 'fido', { name: 'Fido', speciesId: 'dog' });

// Update data
updatePet(store, 'fido', { sold: true });

// Delete data
deletePet(store, 'fido');

// Read data
const pets = store.getTable('pets');
const fido = store.getRow('pets', 'fido');
*/
```

## File Structure

Organize generated code as:
- **`src/store/schema.ts`** - Schema definition and types
- **`src/store/store.ts`** - Store instance creation
- **`src/store/commands.ts`** - CRUD functions
- **`src/store/listeners.ts`** - Listener setup
- **`src/store/index.ts`** - Barrel export

Or as a single file if simpler:
- **`src/store.ts`** - All-in-one store implementation

## Process

1. **Parse Schema**: Extract table names and cell definitions
2. **Generate Types**: Create TypeScript interfaces for each table
3. **Create Schema Object**: Format as TinyBase `TablesSchema`
4. **Generate CRUD Functions**: Create add/update/delete for each table
5. **Add Listener Example**: Demonstrate reactivity pattern
6. **Include Usage Examples**: Show how to use the generated API
7. **Format Code**: Ensure proper TypeScript formatting and imports

## Naming Conventions

- **Tables**: Plural, lowercase (e.g., `pets`, `species`)
- **Types**: Singular, PascalCase (e.g., `Pet`, `Species`)
- **Functions**: camelCase with table name (e.g., `addPet`, `updateSpecies`)
- **Store ID**: Use project name or provide default (e.g., `'store1'`)

## Validation

Generated code should:
- [ ] Compile without TypeScript errors
- [ ] Follow project's linting rules
- [ ] Include all tables from schema
- [ ] Have complete CRUD operations for each table
- [ ] Include proper JSDoc comments
- [ ] Demonstrate listener usage
- [ ] Export all necessary types and functions

## Example Invocation

**User provides schema:**
```
Create a TinyBase store with tables:
- users: { name: string, email: string, active: boolean (default true) }
- posts: { title: string, content: string, userId: string, views: number (default 0) }
```

**AI generates**: Complete TypeScript implementation with schema, types, store, CRUD functions, and examples.

---

This command enables rapid scaffolding of type-safe, reactive TinyBase stores for local-first applications.


