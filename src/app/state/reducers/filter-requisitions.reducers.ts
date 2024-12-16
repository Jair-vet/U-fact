import { createReducer, on } from '@ngrx/store';
import { FilterPurchaseOrderState } from 'src/app/models/models-state/filter-purchase-order.state';
import { setIdStatusRequisitions, setPageRequisitions, setSearchRequisitions } from '../actions/filter-requisition.actions';

export const initialState: FilterPurchaseOrderState = { search: '', id_status: '1', page: 1 }

export const filterRequisitionReducer = createReducer(
    initialState,
    on(setSearchRequisitions, (state, { search }) => ({ ...state, search })),
    on(setIdStatusRequisitions, (state, { id_status }) => ({ ...state, id_status })),
    on(setPageRequisitions, (state, { page }) => ({ ...state, page })),
);