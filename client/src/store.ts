import {
  createMergeableStore,
  type MergeableStore,
} from 'tinybase';

// =============================================================================
// Schema Definition
// =============================================================================

const schema = {
  spices: {
    name: { type: 'string' },
    category: { type: 'string', default: '' },
    quantity: { type: 'number', default: 0 },
    inStock: { type: 'boolean', default: false },
  },
} as const;

const valuesSchema = {
  viewMode: { type: 'string', default: 'cards' }, // 'cards' or 'table'
} as const;

// =============================================================================
// TypeScript Types
// =============================================================================

// Spice categories enum
export const SPICE_CATEGORIES = [
  'herb',
  'seed',
  'bark',
  'root',
  'flower',
  'fruit',
  'leaf',
  'other',
] as const;

export type SpiceCategory = typeof SPICE_CATEGORIES[number];

export interface Spice {
  name: string;
  category: string;
  quantity: number;
  inStock: boolean;
}

export type Tables = {
  spices: { [id: string]: Spice };
};

// =============================================================================
// Store Creation
// =============================================================================

export const store: MergeableStore = createMergeableStore('spiceStore')
  .setTablesSchema(schema)
  .setValuesSchema(valuesSchema);

// =============================================================================
// CRUD Functions - Spices
// =============================================================================

/**
 * Adds a new spice to the store.
 */
export function addSpice(
  spiceId: string,
  data: Omit<Spice, 'category' | 'quantity' | 'inStock'> &
    Partial<Pick<Spice, 'category' | 'quantity' | 'inStock'>>
): void {
  store.transaction(() => {
    store.setRow('spices', spiceId, data);
  });
}

/**
 * Updates an existing spice in the store.
 */
export function updateSpice(spiceId: string, data: Partial<Spice>): void {
  store.transaction(() => {
    store.setPartialRow('spices', spiceId, data);
  });
}

/**
 * Deletes a spice from the store.
 */
export function deleteSpice(spiceId: string): void {
  store.transaction(() => {
    store.delRow('spices', spiceId);
  });
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get all spices from the store.
 */
export function getAllSpices(): Array<Spice & { id: string }> {
  const spiceIds = store.getRowIds('spices');
  return spiceIds.map(id => ({
    id,
    ...(store.getRow('spices', id) as unknown as Spice),
  }));
}

/**
 * Get a single spice by ID.
 */
export function getSpice(spiceId: string): Spice | undefined {
  return store.getRow('spices', spiceId) as unknown as Spice | undefined;
}

// =============================================================================
// UI State Management (Values - not synced)
// =============================================================================

/**
 * Get the current view mode.
 */
export function getViewMode(): 'cards' | 'table' {
  return (store.getValue('viewMode') as 'cards' | 'table') || 'cards';
}

/**
 * Set the view mode.
 */
export function setViewMode(mode: 'cards' | 'table'): void {
  store.setValue('viewMode', mode);
}

// =============================================================================
// Listener Setup Example
// =============================================================================

/**
 * Example listener setup demonstrating reactivity.
 * Call this function to attach listeners to the store.
 */
export function attachListeners(storeInstance: MergeableStore = store): void {
  // Listen to changes in the spices table
  storeInstance.addRowListener('spices', null, (store, tableId, rowId) => {
    console.log(`[Spices] Row '${rowId}' changed`);
    if (store.hasRow(tableId, rowId)) {
      console.log('New data:', store.getRow(tableId, rowId));
    } else {
      console.log('Row was deleted');
    }
  });

  console.log('✓ All listeners attached');
}

// =============================================================================
// Usage Example
// =============================================================================

/*
// ============================================
// Example Usage
// ============================================

import {
  store,
  attachListeners,
  addSpice,
  updateSpice,
  deleteSpice,
  getAllSpices,
  getSpice,
} from './store';

// Attach listeners to see changes in real-time
attachListeners();

// ============================================
// 1. Add spices
// ============================================

addSpice('cinnamon', {
  name: 'Cinnamon',
  category: 'bark',
  quantity: 50,
  inStock: true,
});

addSpice('basil', {
  name: 'Basil',
  category: 'herb',
  quantity: 25,
  inStock: true,
});

addSpice('cumin', {
  name: 'Cumin',
  category: 'seed',
  quantity: 0,
  inStock: false,
});

// ============================================
// 2. Read spices
// ============================================

const allSpices = getAllSpices();
console.log('All spices:', allSpices);

const cinnamon = getSpice('cinnamon');
console.log('Single spice:', cinnamon);

// ============================================
// 3. Update a spice
// ============================================

// Add more quantity and mark as in stock
updateSpice('cumin', { quantity: 30, inStock: true });

// ============================================
// 4. Delete a spice
// ============================================

deleteSpice('basil');

// ============================================
// 5. Direct store access for advanced queries
// ============================================

// Get all spices that are in stock
const inStockSpices = getAllSpices().filter(spice => spice.inStock);
console.log('In stock spices:', inStockSpices);

// Get all herbs
const herbs = getAllSpices().filter(spice => spice.category === 'herb');
console.log('Herbs:', herbs);

*/
