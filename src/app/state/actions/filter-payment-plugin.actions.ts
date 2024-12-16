import { createAction, props } from '@ngrx/store';

export const setSearchPaymentPlugin = createAction(
    '[Search] Search Payment Plugin',
    props<{ search: string }>()
);

export const setPagePaymentPlugin = createAction(
    '[Page] Page Payment Plugin',
    props<{ page: number }>()
);


