import React, {useState} from 'react';
import {useRow} from 'tinybase/ui-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Pencil, Trash2} from 'lucide-react';
import {deleteSpice, type Spice} from '../store';
import {SpiceForm} from './SpiceForm';

interface SpiceCardProps {
  spiceId: string;
}

export function SpiceCard({spiceId}: SpiceCardProps) {
  const spice = useRow('spices', spiceId) as Spice;
  const [isEditing, setIsEditing] = useState(false);

  if (!spice) return null;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${spice.name}?`)) {
      deleteSpice(spiceId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{spice.name}</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <Badge variant="secondary">{spice.category || 'Uncategorized'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Quantity:</span>
            <span className="text-sm font-medium">{spice.quantity}g</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={spice.inStock ? 'default' : 'destructive'}>
              {spice.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <SpiceForm
        open={isEditing}
        onClose={() => setIsEditing(false)}
        spiceId={spiceId}
        initialData={spice}
      />
    </>
  );
}

