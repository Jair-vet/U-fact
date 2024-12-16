import { createReducer, on } from '@ngrx/store';
import { FilterCreditNoteState } from 'src/app/models/models-state/filter-credit-note.state';
import { setPageCreditNote, setSearchCreditNote } from '../actions/filter-credit-note.actions';

export const initialState: FilterCreditNoteState = { search: '', page: 1 }

export const filterCreditNoteReducer = createReducer(
    initialState,
    on(setSearchCreditNote, (state, { search }) => ({ ...state, search })),
    on(setPageCreditNote, (state, { page }) => ({ ...state, page })),
);