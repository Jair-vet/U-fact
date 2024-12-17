import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';

import { ProductComponent } from './store/products/product.component';
import { SettingsComponent } from './settings/settings.component';

import { CreateClientComponent } from './clients/create-client/create-client.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';

import { CreateProductComponent } from './store/products/create-product/create-product.component';
import { EditProductComponent } from './store/products/edit-product/edit-product.component';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProvidersComponent } from './providers/providers.component';
import { CreateProviderComponent } from './providers/create-provider/create-provider.component';
import { EditProviderComponent } from './providers/edit-provider/edit-provider.component';
import { ListPricesComponent } from './list-prices/list-prices.component';
import { RawMaterialsComponent } from './store/raw-materials/raw-materials.component';
import { CreateRawMaterialComponent } from './store/raw-materials/create-raw-material/create-raw-material.component';
import { EditRawMaterialComponent } from './store/raw-materials/edit-raw-material/edit-raw-material.component';
import { CreateListPriceComponent } from './list-prices/create-list-price/create-list-price.component';
import { EditListPriceComponent } from './list-prices/edit-list-price/edit-list-price.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderComponent } from './orders/order.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { ProductionComponent } from './production/production.component';
import { DetailsRequisitionProductsComponent } from './production/details-requisition-products/details-requisition-products.component';
import { EditRequisitionComponent } from './production/edit-requisition/edit-requisition.component';
import { EntriesComponent } from './store/entries/entries.component';
import { CreateEntryComponent } from './store/entries/create-entry/create-entry.component';
import { DetailEntryComponent } from './store/entries/detail-entry/detail-entry.component';
import { ProductsOrderComponent } from './orders/products-order/products-order.component';
import { DetailOrderProductionComponent } from './store/entries/detail-order-production/detail-order-production.component';
import { SalesNotesComponent } from './invoices/sales-notes/sales-notes.component';
import { PaymentsComponent } from './treasury/payments/payments.component';
import { DetailsBalanceClientComponent } from './treasury/details-balance-client/details-balance-client.component';
import { InvoicesComponent } from './invoices/invoices/invoices.component';
import { PaymentPluginComponent } from './treasury/payment-plugin/payment-plugin.component';
import { PaymentsPluginsComponent } from './invoices/payments-plugins/payments-plugins.component';
import { SeeOrderComponent } from './orders/see-order/see-order.component';
import { TraceabilityComponent } from './orders/traceability/traceability.component';
import { AddOrderRequisitionComponent } from './production/add-order-requisition/add-order-requisition.component';
import { KardexEntriesDeparturesComponent } from './store/products/kardex-entries-departures/kardex-entries-departures.component';
import { CreditNotesComponent } from './credit-note/credit-notes/credit-notes.component';
import { CreateCreditNoteComponent } from './credit-note/create-credit-note/create-credit-note.component';
import { SalesReturnsComponent } from './store/entries/sales-returns/sales-returns.component';
import { AccountsReceivableComponent } from './treasury/accounts-receivable/accounts-receivable.component';
import { AccountsPaysComponent } from './treasury/accounts-pays/accounts-pays.component';
import { BanksComponent } from './banks/banks.component';
import { CreateBankComponent } from './banks/create-bank/create-bank.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'clients', component: ClientsComponent },

      { path: 'clients/create-client', component: CreateClientComponent },
      { path: 'clients/edit-client/:id', component: EditClientComponent },

      { path: 'entries', component: EntriesComponent },

      { path: 'entries/generate-entry/:id', component: CreateEntryComponent },
      { path: 'entries/detail-entry/:id', component: DetailEntryComponent },
      { path: 'entries/sales-returns', component: SalesReturnsComponent },
      {
        path: 'store/detail-order-production/:id',
        component: DetailOrderProductionComponent,
      },

      { path: 'products', component: ProductComponent },
      { path: 'products/create-product', component: CreateProductComponent },
      { path: 'products/edit-product/:id', component: EditProductComponent },
      {
        path: 'products/kardex/:id',
        component: KardexEntriesDeparturesComponent,
      },

      { path: 'raw-materials', component: RawMaterialsComponent },
      {
        path: 'raw-materials/create-raw-material',
        component: CreateRawMaterialComponent,
      },
      {
        path: 'raw-materials/edit-raw-material/:id',
        component: EditRawMaterialComponent,
      },

      { path: 'banks', component: BanksComponent },

      {
        path: 'banks/create-bank',
        component: CreateBankComponent,
      },

      { path: 'list-prices', component: ListPricesComponent },

      {
        path: 'list-prices/create-list-price',
        component: CreateListPriceComponent,
      },
      {
        path: 'list-prices/edit-list-price/:id',
        component: EditListPriceComponent,
      },

      { path: 'settings', component: SettingsComponent },

      { path: 'providers', component: ProvidersComponent },
      { path: 'providers/create-provider', component: CreateProviderComponent },
      { path: 'providers/edit-provider/:id', component: EditProviderComponent },

      { path: 'users', component: UsersComponent },
      { path: 'users/create-user', component: CreateUserComponent },
      { path: 'users/edit-user/:id', component: EditUserComponent },

      { path: 'credit-notes', component: CreditNotesComponent },

      { path: 'orders', component: OrderComponent },
      { path: 'orders/create-order', component: CreateOrderComponent },
      { path: 'orders/edit-order/:id', component: EditOrderComponent },
      { path: 'orders/traceability/:id', component: TraceabilityComponent },
      { path: 'orders/see-order/:id', component: SeeOrderComponent },
      { path: 'orders/products-order/:id', component: ProductsOrderComponent },

      { path: 'production', component: ProductionComponent },
      {
        path: 'production/add-requisition',
        component: AddOrderRequisitionComponent,
      },
      {
        path: 'production/details-requisition-products/:id',
        component: DetailsRequisitionProductsComponent,
      },
      {
        path: 'production/edit-requisition/:id',
        component: EditRequisitionComponent,
      },

      { path: 'invoices', component: InvoicesComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'sales-notes', component: SalesNotesComponent },

      { path: 'payments-plugins', component: PaymentsPluginsComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'accounts-receivable', component: AccountsReceivableComponent },
      { path: 'accounts-pays', component: AccountsPaysComponent },
      {
        path: 'payments/payment-plugin/:id_payment',
        component: PaymentPluginComponent,
      },
      {
        path: 'payments/details-balance-client/:id_client',
        component: DetailsBalanceClientComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
