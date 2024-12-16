import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterCreditNoteState } from 'src/app/models/models-state/filter-credit-note.state';

export const selectFilterCreditNote = (state: AppState) => state.filterCreditNote;

export const selectSearchCreditNote = createSelector(
    selectFilterCreditNote,
    (state: FilterCreditNoteState) => state.search
);
export const selectPageCreditNote = createSelector(
    selectFilterCreditNote,
    (state: FilterCreditNoteState) => state.page
)