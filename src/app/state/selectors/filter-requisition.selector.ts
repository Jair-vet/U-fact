import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterRequisitionState } from 'src/app/models/models-state/filter-requisition.state';

export const selectFilterRequisition = (state: AppState) => state.filterRequisition;

export const selectSearchRequisition = createSelector(
    selectFilterRequisition,
    (state: FilterRequisitionState) => state.search
);

export const selectPageRequisition = createSelector(
    selectFilterRequisition,
    (state: FilterRequisitionState) => state.page
)

export const selectIdStatusRequisition = createSelector(
    selectFilterRequisition,
    (state: FilterRequisitionState) => state.id_status
);