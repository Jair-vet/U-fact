import { createReducer, on } from '@ngrx/store';
import { FilterPaymentPluginState } from 'src/app/models/models-state/filter-payment-plugin.state';
import {
  setPagePaymentPlugin,
  setSearchPaymentPlugin,
} from '../actions/filter-payment-plugin.actions';

export const initialState: FilterPaymentPluginState = { search: '', page: 1 };

export const filterPaymentPluginReducer = createReducer(
  initialState,
  on(setSearchPaymentPlugin, (state, { search }) => ({ ...state, search })),
  on(setPagePaymentPlugin, (state, { page }) => ({ ...state, page }))
);
