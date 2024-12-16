import { createReducer, on } from '@ngrx/store';

import { setClientSalesNotes, setPageSalesNotes, setSearchSalesNotes } from '../actions/filter-sale-note.actions';
import { FilterSaleNoteState } from 'src/app/models/models-state/filter-sale-note.state';
import { Client } from 'src/app/models/client.model';



export const initialState: FilterSaleNoteState = { search: '', page: 1, client: new Client(0, 'CLIENTE DESCONOCIDO') }


export const filterSalesNotesReducer = createReducer(
    initialState,
    on(setSearchSalesNotes, (state, { search }) => ({ ...state, search })),
    on(setPageSalesNotes, (state, { page }) => ({ ...state, page })),
    on(setClientSalesNotes, (state, { client }) => ({ ...state, client }))
);