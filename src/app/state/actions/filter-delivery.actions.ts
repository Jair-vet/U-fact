import { createAction, props } from '@ngrx/store';

export const setSearchDelivery = createAction(
  '[Search] Search Delivery',
  props<{ search: string }>()
);

export const setPageDelivery = createAction(
  '[Page] Page Delivery',
  props<{ page: number }>()
);
