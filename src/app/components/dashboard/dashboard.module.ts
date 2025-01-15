import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './clients/clients.component';
import { MenuComponent } from './menu/menu.component';
import { CreateClientComponent } from './clients/create-client/create-client.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';

import { SettingsComponent } from './settings/settings.component';

import { InstallCsdComponent } from './settings/components/install-csd/install-csd.component';
import { AddUserComponent } from './settings/components/add-user/add-user.component';
import { ListPricesComponent } from './list-prices/list-prices.component';
import { CreateListPriceComponent } from './list-prices/create-list-price/create-list-price.component';
import { EditListPriceComponent } from './list-prices/edit-list-price/edit-list-price.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderComponent } from './orders/order.component';
import { CatalogProductsComponent } from './orders/components/catalog-products/catalog-products.component';
import { CatalogClientsComponent } from './orders/components/catalog-clients/catalog-clients.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { OrderHistoryComponent } from './orders/components/order-history/order-history.component';
import { EditProductComponent } from './store/products/edit-product/edit-product.component';
import { CreateProductComponent } from './store/products/create-product/create-product.component';
import { ProductComponent } from './store/products/product.component';
import { CatalogMoldsComponent } from './store/products/components/catalog-molds/catalog-molds.component';
import { CatalogSubFamiliesProductsComponent } from './store/products/components/catalog-sub-families/catalog-sub-families.component';
import { CatalogSatComponent } from './store/components/catalog-sat/catalog-sat.component';
import { CatalogFamiliesProductsComponent } from './store/products/components/catalog-families/catalog-families.component';
import { CatalogRequisitionsComponent } from './store/components/catalog-requisitions/catalog-requisitions.component';
import { SettingsComputerTableComponent } from './store/components/settings-computer-table/settings-computer-table.component';
import { ProductRequisitionHistoryComponent } from './store/components/product-requisition-history/product-requisition-history.component';
import { ThemeComponent } from './menu/components/theme/theme.component';
import { EditPhraseComponent } from './menu/components/edit-phrase/edit-phrase.component';
import { PdfViewComponent } from './store/components/pdf-view/pdf-view.component';
import { ProductsOrderComponent } from './orders/products-order/products-order.component';
import { CatalogDeparturesComponent } from './orders/components/catalog-departures/catalog-departures.component';
// import { SalesNotesComponent } from './invoices/sales-notes/sales-notes.component';
import { PaymentsComponent } from './treasury/payments/payments.component';
import { CreatePaymentComponent } from './treasury/components/create-payment/create-payment.component';
import { PreviewInvoiceComponent } from './invoices/components/preview-invoice/preview-invoice.component';
import { DetailsBalanceClientComponent } from './treasury/details-balance-client/details-balance-client.component';
import { PaymentsBalanceComponent } from './treasury/components/payments-balance/payments-balance.component';
import { SalesNotesByClientComponent } from './treasury/components/sales-notes/sales-notes.component';
import { AddPayToClientComponent } from './treasury/components/add-pay-to-client/add-pay-to-client.component';
import { InvoicesComponent } from './invoices/invoices/invoices.component';
import { AddPayToSaleNoteComponent } from './treasury/components/add-pay-to-sale-note/add-pay-to-sale-note.component';
import { PaymentPluginComponent } from './treasury/payment-plugin/payment-plugin.component';
import { BalanceClientComponent } from './treasury/components/balance-client/balance-client.component';
import { PaymentsPluginsComponent } from './invoices/payments-plugins/payments-plugins.component';
import { InvoicesByClientComponent } from './treasury/components/invoices-by-client/invoices-by-client.component';
import { SeeOrderComponent } from './orders/see-order/see-order.component';
import { AddAttachmentToPayComponent } from './treasury/components/add-attachment-to-pay/add-attachment-to-pay.component';
import { InvoicesBySaleNoteComponent } from './invoices/components/invoices-by-sale-note/invoices-by-sale-note.component';
import { TraceabilityComponent } from './orders/traceability/traceability.component';
import { DetailRequisitionComponent } from './orders/components/traceability-components/detail-requisition/detail-requisition.component';
import { DetailOrderComponent } from './orders/components/traceability-components/detail-order/detail-order.component';
import { InvoicesTraceabilityComponent } from './orders/components/traceability-components/invoices-traceability/invoices-traceability.component';
import { PaymentsPluginsTraceabilityComponent } from './orders/components/traceability-components/payments-plugins-traceability/payments-plugins-traceability.component';
import { ClientEmailsComponent } from './common/client-emails/client-emails.component';
import { DeparturesTraceabilityComponent } from './orders/components/traceability-components/departures-traceability/departures-traceability.component';
import { CertificatesTraceabilityComponent } from './orders/components/traceability-components/certificates-traceability/certificates-traceability.component';
import { DocumentPDFComponent } from './common/client-emails/components/document-pdf/document-pdf.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { TotalTagComponent } from './common/total-tag/total-tag.component';
import { KardexEntriesDeparturesComponent } from './store/products/kardex-entries-departures/kardex-entries-departures.component';
import { SeeEntryDepartureComponent } from './store/products/see-entry-departure/see-entry-departure.component';
import { DetailDepartureSaleComponent } from './store/products/see-entry-departure/detail-departure-sale/detail-departure-sale.component';
import { DetailEntryPurchaseComponent } from './store/products/see-entry-departure/detail-entry-purchase/detail-entry-purchase.component';
import { DetailEntryProductionComponent } from './store/products/see-entry-departure/detail-entry-production/detail-entry-production.component';
import { BarChartComponent } from './common/bar-chart/bar-chart.component';
import { CreditNotesComponent } from './credit-note/credit-notes/credit-notes.component';
import { CreateCreditNoteComponent } from './credit-note/create-credit-note/create-credit-note.component';
import { CatalogAvailableInventoryComponent } from './store/components/catalog-available-inventory/catalog-available-inventory.component';
import { InvoicesBalanceComponent } from './treasury/components/invoices-balance/invoices-balance.component';
import { BanksComponent } from './banks/banks.component';
import { CreateBankComponent } from './banks/create-bank/create-bank.component';
import { PaymentsSaleNoteComponent } from './invoices/components/payments-sale-note/payments-sale-note.component';
import { PriceProductsComponent } from './clients/components/price-list-component/price-list-component';

@NgModule({
  declarations: [
    InvoicesComponent,
    DashboardComponent,
    HomeComponent,
    ClientsComponent,
    MenuComponent,
    CreateClientComponent,
    EditClientComponent,
    CatalogProductsComponent,
    CatalogClientsComponent,
    SettingsComponent,
    InstallCsdComponent,
    AddUserComponent,
    ListPricesComponent,
    ThemeComponent,
    CreateListPriceComponent,
    EditListPriceComponent,
    CatalogMoldsComponent,
    CatalogSubFamiliesProductsComponent,
    UsersComponent,
    CreateUserComponent,
    CreateOrderComponent,
    OrderComponent,
    EditOrderComponent,
    EditUserComponent,
    EditProductComponent,
    CreateProductComponent,
    ProductComponent,
    CatalogSatComponent,
    CatalogFamiliesProductsComponent,
    CatalogRequisitionsComponent,
    SettingsComputerTableComponent,
    ProductRequisitionHistoryComponent,
    EditPhraseComponent,
    PdfViewComponent,
    ProductsOrderComponent,
    CatalogDeparturesComponent,
    // SalesNotesComponent,
    PaymentsComponent,
    CreatePaymentComponent,
    PaymentsSaleNoteComponent,
    PreviewInvoiceComponent,
    DetailsBalanceClientComponent,
    PaymentsBalanceComponent,
    SalesNotesByClientComponent,
    OrderHistoryComponent,
    AddPayToClientComponent,
    AddPayToSaleNoteComponent,
    PaymentPluginComponent,
    BalanceClientComponent,
    PaymentsPluginsComponent,
    InvoicesByClientComponent,
    SeeOrderComponent,
    AddAttachmentToPayComponent,
    InvoicesBySaleNoteComponent,
    TraceabilityComponent,
    DetailRequisitionComponent,
    DetailOrderComponent,
    InvoicesTraceabilityComponent,
    PaymentsPluginsTraceabilityComponent,
    ClientEmailsComponent,
    DeparturesTraceabilityComponent,
    CertificatesTraceabilityComponent,
    DocumentPDFComponent,
    PaginationComponent,
    TotalTagComponent,
    KardexEntriesDeparturesComponent,
    SeeEntryDepartureComponent,
    DetailDepartureSaleComponent,
    DetailEntryPurchaseComponent,
    DetailEntryProductionComponent,
    BarChartComponent,
    CreditNotesComponent,
    CreateCreditNoteComponent,
    CatalogAvailableInventoryComponent,
    InvoicesBalanceComponent,
    BanksComponent,
    CreateBankComponent,
    PriceProductsComponent

  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule { }
