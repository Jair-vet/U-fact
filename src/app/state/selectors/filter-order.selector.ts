import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterOrderState } from 'src/app/models/models-state/filter-order.state';

export const selectFilterOrder = (state: AppState) => state.filterOrder;

export const selectSearchOrder = createSelector(
    selectFilterOrder,
    (state: FilterOrderState) => state.search
);

export const selectPageOrder = createSelector(
    selectFilterOrder,
    (state: FilterOrderState) => state.page
)

export const selectIdStatusOrder = createSelector(
    selectFilterOrder,
    (state: FilterOrderState) => state.id_status
);