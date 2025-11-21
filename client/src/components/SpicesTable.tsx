import {useState} from 'react';
import {useRowIds, useRow, useDelRowCallback} from 'tinybase/ui-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2} from 'lucide-react';
import {type Spice} from '../store';
import {SpiceForm} from './SpiceForm';

interface SpiceRowProps {
  spiceId: string;
}

function SpiceRow({spiceId}: SpiceRowProps) {
  const spice = useRow('spices', spiceId) as unknown as Spice;
  const [isEditing, setIsEditing] = useState(false);
  const handleDeleteSpice = useDelRowCallback('spices', spiceId, undefined);

  if (!spice) return null;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${spice.name}?`)) {
      handleDeleteSpice();
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{spice.name}</TableCell>
        <TableCell>
          <Badge variant="secondary">{spice.category || 'Uncategorized'}</Badge>
        </TableCell>
        <TableCell>{spice.quantity}g</TableCell>
        <TableCell>
          <Badge variant={spice.inStock ? 'default' : 'destructive'}>
            {spice.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <SpiceForm
        open={isEditing}
        onClose={() => setIsEditing(false)}
        spiceId={spiceId}
        initialData={spice}
      />
    </>
  );
}

export function SpicesTable() {
  const spiceIds = useRowIds('spices');

  if (spiceIds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No spices yet. Add your first spice to get started!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spiceIds.map((spiceId) => (
          <SpiceRow key={spiceId} spiceId={spiceId} />
        ))}
      </TableBody>
    </Table>
  );
}

