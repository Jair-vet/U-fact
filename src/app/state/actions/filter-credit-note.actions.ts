import { createAction, props } from '@ngrx/store';

export const setSearchCreditNote = createAction(
    '[Search] Search Credit Note',
    props<{ search: string }>()
)

export const setPageCreditNote = createAction(
    '[Page] Page Credit Note',
    props<{ page: number }>()
);
