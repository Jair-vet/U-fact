import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterPaymentState } from 'src/app/models/models-state/filter-payment.state';

export const selectFilterPayment = (state: AppState) => state.filterPayment;

export const selectSearchPayment = createSelector(
    selectFilterPayment,
    (state: FilterPaymentState) => state.search

);

export const selectPagePayment = createSelector(
    selectFilterPayment,
    (state: FilterPaymentState) => state.page

)