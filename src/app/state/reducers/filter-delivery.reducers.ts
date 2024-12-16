import { createReducer, on } from '@ngrx/store';
import { FilterDeliveryState } from 'src/app/models/models-state/filter-delivery.state';
import {
  setPageDelivery,
  setSearchDelivery,
} from '../actions/filter-delivery.actions';

export const initialState: FilterDeliveryState = { search: '', page: 1 };

export const filterDeliveryReducer = createReducer(
  initialState,
  on(setSearchDelivery, (state, { search }) => ({ ...state, search })),
  on(setPageDelivery, (state, { page }) => ({ ...state, page }))
);
