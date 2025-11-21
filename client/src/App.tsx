import React, {StrictMode, useState} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {MergeableStore} from 'tinybase';
import {createLocalPersister} from 'tinybase/persisters/persister-browser';
import {createWsSynchronizer} from 'tinybase/synchronizers/synchronizer-ws-client';
import {
  Provider,
  useCreatePersister,
  useCreateSynchronizer,
} from 'tinybase/ui-react';
import {Inspector} from 'tinybase/ui-react-inspector';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {store, attachListeners} from './store';
import {SpicesSection} from './components/SpicesSection';

const SERVER_SCHEME = 'wss://';
const SERVER = 'vite.tinybase.cloud';

// Attach listeners once on module load
attachListeners();

export const App = () => {
  const serverPathId = location.pathname;
  const [showInspector, setShowInspector] = useState(false);

  useCreatePersister(
    store,
    (store) => createLocalPersister(store, 'local://spice-rack' + serverPathId),
    [],
    async (persister) => {
      await persister.startAutoLoad([
        {
          spices: {
            'spice-1': {
              name: 'Cinnamon',
              category: 'bark',
              quantity: 50,
              inStock: true,
            },
            'spice-2': {
              name: 'Basil',
              category: 'herb',
              quantity: 25,
              inStock: true,
            },
            'spice-3': {
              name: 'Cumin',
              category: 'seed',
              quantity: 0,
              inStock: false,
            },
            'spice-4': {
              name: 'Turmeric',
              category: 'root',
              quantity: 100,
              inStock: true,
            },
          },
        },
        {
          viewMode: 'cards', // Default view mode (local only, not synced)
        },
      ]);
      await persister.startAutoSave();
    },
  );

  useCreateSynchronizer(store, async (store: MergeableStore) => {
    const synchronizer = await createWsSynchronizer(
      store,
      new ReconnectingWebSocket(SERVER_SCHEME + SERVER + serverPathId),
      1,
      // Send only tables, not values (values are local UI state only)
      (requestJson) => {
        const request = JSON.parse(requestJson);
        if (request[3]) {
          delete request[3]; // Remove values from sync
        }
        return JSON.stringify(request);
      },
      // Receive only tables, not values
      (responseJson) => {
        const response = JSON.parse(responseJson);
        if (response[3]) {
          delete response[3]; // Ignore values from sync
        }
        return JSON.stringify(response);
      },
    );
    await synchronizer.startSync();

    // If the websocket reconnects in the future, do another explicit sync.
    synchronizer.getWebSocket().addEventListener('open', () => {
      synchronizer.load().then(() => synchronizer.save());
    });

    return synchronizer;
  });

  return (
    <StrictMode>
      <Provider store={store}>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Spice Rack Manager</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your spice collection and inventory
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowInspector(!showInspector)}
              >
                {showInspector ? 'Hide' : 'Show'} Inspector
              </Button>
            </div>

            <SpicesSection />

            {showInspector && (
              <Card>
                <CardHeader>
                  <CardTitle>Store Inspector</CardTitle>
                </CardHeader>
                <CardContent>
                  <Inspector />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Provider>
    </StrictMode>
  );
};
