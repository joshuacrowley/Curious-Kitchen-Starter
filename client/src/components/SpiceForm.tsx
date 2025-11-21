import React, {useState, useEffect} from 'react';
import {useSetPartialRowCallback, useStore} from 'tinybase/ui-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {SPICE_CATEGORIES, type Spice} from '../store';

interface SpiceFormProps {
  open: boolean;
  onClose: () => void;
  spiceId?: string;
  initialData?: Spice;
}

export function SpiceForm({open, onClose, spiceId, initialData}: SpiceFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [inStock, setInStock] = useState(false);
  const store = useStore();

  const handleUpdateSpice = useSetPartialRowCallback(
    'spices',
    spiceId ?? '',
    () => ({
      name,
      category,
      quantity: typeof quantity === 'number' ? quantity : 0,
      inStock,
    }),
    [name, category, quantity, inStock],
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setInStock(initialData.inStock);
    } else {
      setName('');
      setCategory('');
      setQuantity('');
      setInStock(false);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (spiceId) {
      handleUpdateSpice();
    } else {
      store?.addRow('spices', {
        name,
        category,
        quantity: typeof quantity === 'number' ? quantity : 0,
        inStock,
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{spiceId ? 'Edit Spice' : 'Add New Spice'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cinnamon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SPICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (grams)</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Enter quantity"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked === true)}
              />
              <Label htmlFor="inStock" className="cursor-pointer">
                In Stock
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {spiceId ? 'Update' : 'Add'} Spice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

