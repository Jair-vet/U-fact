import { createReducer, on } from '@ngrx/store';


import { FilterInvoiceState } from 'src/app/models/models-state/filter-invoice.state';

import { setDateEndInvoices, setDateStartInvoices, setPageInvoices, setSearchInvoices } from '../actions/filter-invoice.actions';


export const initialState: FilterInvoiceState = { search: '', dateStart: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()), dateEnd: new Date(), page: 1 }


export const filterInvoiceReducer = createReducer(
    initialState,
    on(setSearchInvoices, (state, { search }) => ({ ...state, search })),
    on(setDateStartInvoices, (state, { dateStart }) => ({ ...state, dateStart })),
    on(setDateEndInvoices, (state, { dateEnd }) => ({ ...state, dateEnd })),
    on(setPageInvoices, (state, { page }) => ({ ...state, page })),
);