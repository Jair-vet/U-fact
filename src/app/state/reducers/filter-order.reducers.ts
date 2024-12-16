import { createReducer, on } from '@ngrx/store';


import { FilterOrderState } from 'src/app/models/models-state/filter-order.state';
import { setIdStatusOrders, setPageOrders, setSearchOrders } from '../actions/filter-order.actions';



export const initialState: FilterOrderState = { search: '', id_status: '1', page: 1 }


export const filterOrderReducer = createReducer(
    initialState,
    on(setSearchOrders, (state, { search }) => ({ ...state, search })),
    on(setIdStatusOrders, (state, { id_status }) => ({ ...state, id_status })),
    on(setPageOrders, (state, { page }) => ({ ...state, page })),
);