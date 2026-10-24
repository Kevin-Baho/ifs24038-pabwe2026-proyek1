import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

const passthrough = (state = {}) => state;

// Reducer sementara; akan diganti reducer asli di Langkah 3
const defaultReducer = { auth: passthrough, users: passthrough, duties: passthrough };

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    reducer = defaultReducer,
    store = configureStore({ reducer, preloadedState }),
    route = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
