import { createReducer, on } from '@ngrx/store';
import { setPagePayments, setSearchPayments } from '../actions/filter-payments.actions';
import { FilterPaymentState } from 'src/app/models/models-state/filter-payment.state';

export const initialState: FilterPaymentState = { search: '', page: 1 }
export const filterPaymentReducer = createReducer(
    initialState,
    on(setSearchPayments, (state, { search }) => ({ ...state, search })),
    on(setPagePayments, (state, { page }) => ({ ...state, page })),
);