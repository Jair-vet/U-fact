import { createAction, props } from '@ngrx/store';

export const setSearchRequisitions = createAction(
    '[Search] Search Requisitions',
    props<{ search: string }>()
);

export const setIdStatusRequisitions = createAction(
    '[Status] Id Status Requisitions',
    props<{ id_status: string }>()
);

export const setPageRequisitions = createAction(
    '[Page] Page Requisitions',
    props<{ page: number }>()
);

