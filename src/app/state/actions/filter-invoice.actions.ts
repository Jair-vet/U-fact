import { createAction, props } from '@ngrx/store';

export const setSearchInvoices = createAction(
    '[Search] Search Invoices',
    props<{ search: string }>()
);

export const setPageInvoices = createAction(
    '[Page] Page Invoices',
    props<{ page: number }>()
);

export const setDateStartInvoices = createAction(
    '[Date Start] Date Start Invoices',
    props<{ dateStart: Date }>()
);

export const setDateEndInvoices = createAction(
    '[Date End] Date End Invoices',
    props<{ dateEnd: Date }>()
);



