import React from 'react';
import {ValueOrUndefined} from 'tinybase';
import {useAddRowCallback, useSetValueCallback} from 'tinybase/ui-react';
import {Button} from '@/components/ui/button';

// Convenience function for generating a random integer
const getRandom = (max = 100) => Math.floor(Math.random() * max);

export const Buttons = () => {
  // Attach events to the buttons to mutate the data in the TinyBase Store
  const handleCount = useSetValueCallback(
    'counter',
    () => (value: ValueOrUndefined) => ((value ?? 0) as number) + 1,
  );
  const handleRandom = useSetValueCallback('random', () => getRandom());
  const handleAddPet = useAddRowCallback('pets', (_, store) => ({
    name: ['fido', 'felix', 'bubbles', 'lowly', 'polly'][getRandom(5)],
    species: store.getRowIds('species')[getRandom(5)],
  }));

  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 border-y">
      <Button onClick={handleCount} variant="default">
        Increment number
      </Button>
      <Button onClick={handleRandom} variant="outline">
        Random number
      </Button>
      <Button onClick={handleAddPet} variant="secondary">
        Add a pet
      </Button>
    </div>
  );
};
