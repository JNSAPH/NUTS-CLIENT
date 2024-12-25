"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';

import { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootWrapper({ children }: { children: ReactNode }) {
    return (
        <div className='select-none h-full w-full'>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        </div>
    );
}

