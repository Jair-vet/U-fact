import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterSaleNoteState } from 'src/app/models/models-state/filter-sale-note.state';


export const selectFilterSaleNote = (state: AppState) => state.filterSaleNote;


// export const selectCollectionState = createFeatureSelector<
//   ReadonlyArray<string>
// >('collection');

export const selectSearchSaleNote = createSelector(
    selectFilterSaleNote,
    (state: FilterSaleNoteState) => state.search

);

export const selectPageSaleNote = createSelector(
    selectFilterSaleNote,
    (state: FilterSaleNoteState) => state.page

)

export const selectIdClientSaleNote = createSelector(
    selectFilterSaleNote,
    (state: FilterSaleNoteState) => state.client

)