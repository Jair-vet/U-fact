import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FilterPurchaseOrderState } from 'src/app/models/models-state/filter-purchase-order.state';

export const selectFilterPurchaseOrder = (state: AppState) => state.filterPurchaseOrder;

export const selectSearchPurchaseOrder = createSelector(
    selectFilterPurchaseOrder,
    (state: FilterPurchaseOrderState) => state.search
);

export const selectPagePurchaseOrder = createSelector(
    selectFilterPurchaseOrder,
    (state: FilterPurchaseOrderState) => state.page
)

export const selectIdStatusPurchaseOrder = createSelector(
    selectFilterPurchaseOrder,
    (state: FilterPurchaseOrderState) => state.id_status
);