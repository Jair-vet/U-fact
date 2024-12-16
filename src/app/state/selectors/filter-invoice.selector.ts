import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterInvoiceState } from 'src/app/models/models-state/filter-invoice.state';




export const selectFilterInvoice = (state: AppState) => state.filterInvoice;


// export const selectCollectionState = createFeatureSelector<
//   ReadonlyArray<string>
// >('collection');

export const selectSearchInvoice = createSelector(
    selectFilterInvoice,
    (state: FilterInvoiceState) => state.search
)

export const selectPageInvoice = createSelector(
    selectFilterInvoice,
    (state: FilterInvoiceState) => state.page
)

export const selectDateStartInvoice = createSelector(
    selectFilterInvoice,
    (state: FilterInvoiceState) => state.dateStart
)


export const selectDateEndInvoice = createSelector(
    selectFilterInvoice,
    (state: FilterInvoiceState) => state.dateEnd
)

