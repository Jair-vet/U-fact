import { createReducer, on } from '@ngrx/store';
import { FilterPurchaseOrderState } from 'src/app/models/models-state/filter-purchase-order.state';
import { setIdStatusPurchaseOrders, setPagePurchaseOrders, setSearchPurchaseOrders } from '../actions/filter-purchase-order.actions';



export const initialState: FilterPurchaseOrderState = { search: '', id_status: '1', page: 1 }


export const filterPurchaseOrderReducer = createReducer(
    initialState,
    on(setSearchPurchaseOrders, (state, { search }) => ({ ...state, search })),
    on(setIdStatusPurchaseOrders, (state, { id_status }) => ({ ...state, id_status })),
    on(setPagePurchaseOrders, (state, { page }) => ({ ...state, page })),
);