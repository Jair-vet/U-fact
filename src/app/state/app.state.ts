import { ActionReducerMap } from '@ngrx/store';
import { FilterSaleNoteState } from '../models/models-state/filter-sale-note.state';
import { filterSalesNotesReducer } from './reducers/filter-sale-note.reducers';
import { FilterOrderState } from '../models/models-state/filter-order.state';
import { filterOrderReducer } from './reducers/filter-order.reducers';
import { FilterPaymentState } from '../models/models-state/filter-payment.state';
import { filterPaymentReducer } from './reducers/filter-payments.reducers';
import { FilterInvoiceState } from '../models/models-state/filter-invoice.state';
import { filterInvoiceReducer } from './reducers/filter-invoices.reducers';
import { FilterRequisitionState } from '../models/models-state/filter-requisition.state';
import { filterRequisitionReducer } from './reducers/filter-requisitions.reducers';
import { FilterPaymentPluginState } from '../models/models-state/filter-payment-plugin.state';
import { filterPaymentPluginReducer } from './reducers/filter-payments-plugins.reducers';
import { FilterCreditNoteState } from '../models/models-state/filter-credit-note.state';
import { filterCreditNoteReducer } from './reducers/filter-credit-note.reducers';

export interface AppState {
  filterSaleNote: FilterSaleNoteState;
  filterOrder: FilterOrderState;
  filterPayment: FilterPaymentState;
  filterInvoice: FilterInvoiceState;
  filterRequisition: FilterRequisitionState;
  filterPaymentPlugin: FilterPaymentPluginState;
  filterCreditNote: FilterCreditNoteState;
}
export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  filterSaleNote: filterSalesNotesReducer,
  filterOrder: filterOrderReducer,
  filterPayment: filterPaymentReducer,
  filterInvoice: filterInvoiceReducer,
  filterRequisition: filterRequisitionReducer,
  filterPaymentPlugin: filterPaymentPluginReducer,
  filterCreditNote: filterCreditNoteReducer,
};
