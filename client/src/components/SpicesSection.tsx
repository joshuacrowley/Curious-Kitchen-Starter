import {useState} from 'react';
import {useRowIds, useValue, useSetValueCallback} from 'tinybase/ui-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {SpiceCard} from './SpiceCard';
import {SpicesTable} from './SpicesTable';
import {SpiceForm} from './SpiceForm';
import {Plus, LayoutGrid, Table} from 'lucide-react';

export function SpicesSection() {
  const spiceIds = useRowIds('spices');
  const viewMode = useValue('viewMode') as 'cards' | 'table' || 'cards';
  const [isAdding, setIsAdding] = useState(false);
  const setViewModeCards = useSetValueCallback('viewMode', () => 'cards', []);
  const setViewModeTable = useSetValueCallback('viewMode', () => 'table', []);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Spices</CardTitle>
            <div className="flex gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={setViewModeCards}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="size-4" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={setViewModeTable}
                  className="rounded-l-none"
                >
                  <Table className="size-4" />
                  Table
                </Button>
              </div>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="size-4" />
                Add Spice
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {spiceIds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No spices yet. Add your first spice to get started!</p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {spiceIds.map((spiceId) => (
                <SpiceCard key={spiceId} spiceId={spiceId} />
              ))}
            </div>
          ) : (
            <SpicesTable />
          )}
        </CardContent>
      </Card>

      <SpiceForm open={isAdding} onClose={() => setIsAdding(false)} />
    </>
  );
}

