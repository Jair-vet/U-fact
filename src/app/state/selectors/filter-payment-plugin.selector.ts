import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterPaymentPluginState } from 'src/app/models/models-state/filter-payment-plugin.state';

export const selectFilterPaymentPlugin = (state: AppState) => state.filterPaymentPlugin;
export const selectSearchPaymentPlugin = createSelector(
    selectFilterPaymentPlugin,
    (state: FilterPaymentPluginState) => state.search
);
export const selectPagePaymentPlugin = createSelector(
    selectFilterPaymentPlugin,
    (state: FilterPaymentPluginState) => state.page
)