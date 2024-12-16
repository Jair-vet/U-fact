import { createAction, props } from '@ngrx/store';

export const setSearchPurchaseOrders = createAction(
    '[Search] Search Purchase Orders',
    props<{ search: string }>()
);

export const setIdStatusPurchaseOrders = createAction(
    '[Status] Id Status Purchase Orders',
    props<{ id_status: string }>()
);

export const setPagePurchaseOrders = createAction(
    '[Page] Page Purchase Orders',
    props<{ page: number }>()
);

