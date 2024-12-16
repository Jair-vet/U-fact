import { createAction, props } from '@ngrx/store';

export const setSearchPayments = createAction(
    '[Search] Search Payments',
    props<{ search: string }>()
);
export const setPagePayments = createAction(
    '[Page] Page Payments',
    props<{ page: number }>()
);



