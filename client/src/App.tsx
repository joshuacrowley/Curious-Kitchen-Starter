import {StrictMode} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {createMergeableStore, MergeableStore} from 'tinybase';
import {createLocalPersister} from 'tinybase/persisters/persister-browser';
import {createWsSynchronizer} from 'tinybase/synchronizers/synchronizer-ws-client';
import {
  Provider,
  useCreateMergeableStore,
  useCreatePersister,
  useCreateSynchronizer,
} from 'tinybase/ui-react';
import {attachListeners} from './store';
import {SpicesSection} from './components/SpicesSection';

const SERVER_SCHEME = 'wss://';
const SERVER = 'curious-kitchen-server.7mgd9h2b9s.workers.dev';

export const App = () => {
  const serverPathId = location.pathname;

  const store = useCreateMergeableStore(() => {
    const newStore = createMergeableStore('spiceStore')
      .setTablesSchema({
        spices: {
          name: { type: 'string' },
          category: { type: 'string', default: '' },
          quantity: { type: 'number', default: 0 },
          inStock: { type: 'boolean', default: false },
        },
      })
      .setValuesSchema({
        viewMode: { type: 'string', default: 'cards' },
      });
    
    // Attach listeners
    attachListeners(newStore);
    
    return newStore;
  });

  useCreatePersister(
    store,
    (store) => createLocalPersister(store, 'local://' + SERVER + serverPathId),
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
          viewMode: 'cards',
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
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Curious Kitchen</h1>
              <p className="text-muted-foreground mt-2">
                Manage your spice collection and inventory
              </p>
            </div>

            <SpicesSection />
          </div>
        </div>
      </Provider>
    </StrictMode>
  );
};
