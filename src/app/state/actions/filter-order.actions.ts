import { createAction, props } from '@ngrx/store';

export const setSearchOrders = createAction(
    '[Search] Search Orders',
    props<{ search: string }>()
);

export const setIdStatusOrders = createAction(
    '[Status] Id Status Orders',
    props<{ id_status: string }>()
);

export const setPageOrders = createAction(
    '[Page] Page Orders',
    props<{ page: number }>()
);


