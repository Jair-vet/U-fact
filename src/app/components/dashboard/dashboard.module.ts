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
import { ProvidersComponent } from './providers/providers.component';
import { CreateProviderComponent } from './providers/create-provider/create-provider.component';
import { EditProviderComponent } from './providers/edit-provider/edit-provider.component';
import { ListPricesComponent } from './list-prices/list-prices.component';
import { RawMaterialsComponent } from './store/raw-materials/raw-materials.component';
import { CreateRawMaterialComponent } from './store/raw-materials/create-raw-material/create-raw-material.component';
import { EditRawMaterialComponent } from './store/raw-materials/edit-raw-material/edit-raw-material.component';
import { CatalogFamiliesComponent } from './store/raw-materials/components/catalog-families/catalog-families.component';
import { CatalogSubFamiliesComponent } from './store/raw-materials/components/catalog-sub-families/catalog-sub-families.component';
import { CatalogTradenamesComponent } from './store/components/catalog-tradenames/catalog-tradenames.component';
import { CreateListPriceComponent } from './list-prices/create-list-price/create-list-price.component';
import { EditListPriceComponent } from './list-prices/edit-list-price/edit-list-price.component';
import { PaymentsSaleNoteComponent } from './invoices/components/payments-sale-note/payments-sale-note.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderComponent } from './orders/order.component';
import { CatalogProductsComponent } from './orders/components/catalog-products/catalog-products.component';
import { CatalogClientsComponent } from './orders/components/catalog-clients/catalog-clients.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ProductionComponent } from './production/production.component';
import { CatalogProductsRequisitionsComponent } from './production/components/catalog-products-requisitions/catalog-products-requisitions.component';
import { EditRequisitionComponent } from './production/edit-requisition/edit-requisition.component';
import { DetailsRequisitionProductsComponent } from './production/details-requisition-products/details-requisition-products.component';
import { OrderHistoryComponent } from './orders/components/order-history/order-history.component';
import { RequisitionHistoryComponent } from './production/components/requisition-history/requisition-history.component';
import { EntriesComponent } from './store/entries/entries.component';
import { AddRawMaterialIntoProductComponent } from './store/components/add-raw-material-into-product/add-raw-material-into-product.component';
import { EditProductComponent } from './store/products/edit-product/edit-product.component';
import { CreateProductComponent } from './store/products/create-product/create-product.component';
import { ProductComponent } from './store/products/product.component';
import { CatalogMoldsComponent } from './store/products/components/catalog-molds/catalog-molds.component';
import { CatalogMeasuresComponent } from './store/products/components/catalog-measures/catalog-measures.component';
import { CatalogSubFamiliesProductsComponent } from './store/products/components/catalog-sub-families/catalog-sub-families.component';
import { CatalogSatComponent } from './store/components/catalog-sat/catalog-sat.component';
import { CatalogFamiliesProductsComponent } from './store/products/components/catalog-families/catalog-families.component';
import { CatalogRequisitionsComponent } from './store/components/catalog-requisitions/catalog-requisitions.component';
import { SettingsComputerTableComponent } from './store/components/settings-computer-table/settings-computer-table.component';
import { CreateEntryComponent } from './store/entries/create-entry/create-entry.component';
import { DetailEntryComponent } from './store/entries/detail-entry/detail-entry.component';
import { ProductRequisitionHistoryComponent } from './store/components/product-requisition-history/product-requisition-history.component';
import { ThemeComponent } from './menu/components/theme/theme.component';
import { EditPhraseComponent } from './menu/components/edit-phrase/edit-phrase.component';
import { CatalogEntriesComponent } from './store/components/catalog-entries/catalog-entries.component';
import { PdfViewComponent } from './store/components/pdf-view/pdf-view.component';
import { ProductsOrderComponent } from './orders/products-order/products-order.component';
import { SuplyProductsComponent } from './orders/components/suply-products/suply-products.component';
import { CatalogDeparturesComponent } from './orders/components/catalog-departures/catalog-departures.component';
import { DetailOrderProductionComponent } from './store/entries/detail-order-production/detail-order-production.component';
import { SalesNotesComponent } from './invoices/sales-notes/sales-notes.component';
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
import { EntriesToPurchaseOrderComponent } from './store/components/entries-to-purchase-order/entries-to-purchase-order.component';
import { EntriesByPurchaseOrderComponent } from './store/components/entries-by-purchase-order/entries-by-purchase-order.component';
import { EntriesToPurchaseOrderProductComponent } from './store/components/entries-to-purchase-order-product/entries-to-purchase-order-product.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { AddOrderRequisitionComponent } from './production/add-order-requisition/add-order-requisition.component';
import { TotalTagComponent } from './common/total-tag/total-tag.component';
import { KardexEntriesDeparturesComponent } from './store/products/kardex-entries-departures/kardex-entries-departures.component';
import { SeeEntryDepartureComponent } from './store/products/see-entry-departure/see-entry-departure.component';
import { DetailDepartureSaleComponent } from './store/products/see-entry-departure/detail-departure-sale/detail-departure-sale.component';
import { DetailEntryPurchaseComponent } from './store/products/see-entry-departure/detail-entry-purchase/detail-entry-purchase.component';
import { DetailEntryProductionComponent } from './store/products/see-entry-departure/detail-entry-production/detail-entry-production.component';
import { BarChartComponent } from './common/bar-chart/bar-chart.component';
import { PurchaseOrderEntryComponent } from './store/entries/purchase-order-entry/purchase-order-entry.component';
import { CreditNotesComponent } from './credit-note/credit-notes/credit-notes.component';
import { CreateCreditNoteComponent } from './credit-note/create-credit-note/create-credit-note.component';
import { SalesReturnsComponent } from './store/entries/sales-returns/sales-returns.component';
import { CatalogAvailableInventoryComponent } from './store/components/catalog-available-inventory/catalog-available-inventory.component';
// import { SalesNotesPayableComponent } from './treasury/components/sales-notes-payable/sales-notes-payable.component';
import { InvoicesBalanceComponent } from './treasury/components/invoices-balance/invoices-balance.component';
import { BanksComponent } from './banks/banks.component';
import { CreateBankComponent } from './banks/create-bank/create-bank.component';

@NgModule({
  declarations: [
    InvoicesComponent,
    AddRawMaterialIntoProductComponent,
    DashboardComponent,
    HomeComponent,
    ClientsComponent,
    MenuComponent,
    CreateClientComponent,
    EditClientComponent,
    CatalogProductsComponent,
    CatalogClientsComponent,
    SettingsComponent,
    ProvidersComponent,
    CreateProviderComponent,
    EditProviderComponent,
    InstallCsdComponent,
    AddUserComponent,
    ListPricesComponent,
    RawMaterialsComponent,
    CreateRawMaterialComponent,
    EditRawMaterialComponent,
    ThemeComponent,
    CatalogSubFamiliesComponent,
    CatalogTradenamesComponent,
    CreateListPriceComponent,
    EditListPriceComponent,
    CatalogMoldsComponent,
    CatalogMeasuresComponent,
    CatalogSubFamiliesProductsComponent,
    UsersComponent,
    CreateUserComponent,
    CreateOrderComponent,
    OrderComponent,
    EditOrderComponent,
    EditUserComponent,
    ProductionComponent,
    CatalogProductsRequisitionsComponent,
    EditRequisitionComponent,
    DetailsRequisitionProductsComponent,
    RequisitionHistoryComponent,
    EntriesComponent,
    EditProductComponent,
    CreateProductComponent,
    ProductComponent,
    CatalogSatComponent,
    CatalogFamiliesComponent,
    CatalogFamiliesProductsComponent,
    CatalogRequisitionsComponent,
    SettingsComputerTableComponent,
    CreateEntryComponent,
    DetailEntryComponent,
    ProductRequisitionHistoryComponent,
    EditPhraseComponent,
    CatalogEntriesComponent,
    PdfViewComponent,
    ProductsOrderComponent,
    SuplyProductsComponent,
    CatalogDeparturesComponent,
    DetailOrderProductionComponent,
    SalesNotesComponent,
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
    EntriesToPurchaseOrderComponent,
    EntriesByPurchaseOrderComponent,
    EntriesToPurchaseOrderProductComponent,
    PaginationComponent,
    AddOrderRequisitionComponent,
    TotalTagComponent,
    KardexEntriesDeparturesComponent,
    SeeEntryDepartureComponent,
    DetailDepartureSaleComponent,
    DetailEntryPurchaseComponent,
    DetailEntryProductionComponent,
    BarChartComponent,
    PurchaseOrderEntryComponent,
    CreditNotesComponent,
    CreateCreditNoteComponent,
    SalesReturnsComponent,
    CatalogAvailableInventoryComponent,
    // SalesNotesPayableComponent,
    InvoicesBalanceComponent,
    BanksComponent,
    CreateBankComponent

  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule { }
