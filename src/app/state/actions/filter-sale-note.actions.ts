import { createAction, props } from '@ngrx/store';
import { Client } from 'src/app/models/client.model';


export const setSearchSalesNotes = createAction(
    '[SearcH] Search Sales Notes',
    props<{ search: string }>()
);

export const setPageSalesNotes = createAction(
    '[Page] Page Sales Notes',
    props<{ page: number }>()
);

export const setClientSalesNotes = createAction(
    '[Client] Client Sales Notes',
    props<{ client: Client }>()
);


