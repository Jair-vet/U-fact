import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Departure } from 'src/app/models/departure.model';
import { PaymentDeparture } from 'src/app/models/payment_departure.model';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsSaleNoteComponent } from '../components/payments-sale-note/payments-sale-note.component';
import { CreatePaymentComponent } from '../../treasury/components/create-payment/create-payment.component';
import { PreviewInvoiceComponent } from '../components/preview-invoice/preview-invoice.component';
import Swal from 'sweetalert2';
import { AddPayToSaleNoteComponent } from '../../treasury/components/add-pay-to-sale-note/add-pay-to-sale-note.component';
import { InvoicesBySaleNoteComponent } from '../components/invoices-by-sale-note/invoices-by-sale-note.component';
import { CreateCreditNoteComponent } from '../../credit-note/create-credit-note/create-credit-note.component';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CatalogClientsComponent } from '../../orders/components/catalog-clients/catalog-clients.component';
import {
  selectIdClientSaleNote,
  selectPageSaleNote,
  selectSearchSaleNote,
} from 'src/app/state/selectors/filter-sale-note.selector';
import {
  setClientSalesNotes,
  setPageSalesNotes,
  setSearchSalesNotes,
} from 'src/app/state/actions/filter-sale-note.actions';
import { Client } from 'src/app/models/client.model';

@Component({
  selector: 'app-sales-notes',
  templateUrl: './sales-notes.component.html',
  styleUrls: ['./sales-notes.component.scss'],
})
export class SalesNotesComponent implements OnInit {
  loading: boolean = true;
  error: boolean = false;
  error_msg: string = '';
  inactive: boolean = false;
  displayedColumns: string[] = [
    'number',
    'date',
    'client',
    'status',
    'payment_method',
    'total',
    'total_pay',
    'saldo',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;

  colBig!: number;
  colMedium!: number;
  steps!: string[];
  numberPage: number = 1;
  totalPages: number = 0;
  departures: Departure[] = [];
  salesNotes: Departure[] = [];
  sales_notes: Departure[] = [];
  modalWidth: string = '100%';
  formFilter: FormGroup;
  widthModalInvoices: string = '100%';
  dataPDFSaleNote!: any;
  search: Observable<string> = new Observable();
  pageState: Observable<number> = new Observable();
  clientState: Observable<Client> = new Observable();
  private mySubscription!: Subscription;
  valueSearch: string = '';
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(
      setSearchSalesNotes({ search: this.dataSource.filter })
    );
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  constructor(
    private store: Store<any>,
    private _formBuider: FormBuilder,
    private dialog: MatDialog,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _departureService: DepartureService
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
            this.widthModalInvoices = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
            this.widthModalInvoices = '100%';
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '80%';
            this.widthModalInvoices = '100%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '50%';
            this.widthModalInvoices = '85%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '50%';
            this.widthModalInvoices = '75%';
          }
        }
      });
    this.search = this.store.select(selectSearchSaleNote);
    this.pageState = this.store.select(selectPageSaleNote);
    this.clientState = this.store.select(selectIdClientSaleNote);

    this.formFilter = this._formBuider.group({
      client: ['CLIENTE DESCONOCIDO'],
      id_client: ['0'],
    });
  }

  openCatalogClients(): void {
    if (!this.loading) {
      const dialogRef = this.dialog.open(CatalogClientsComponent, {
        disableClose: false,
        width: '100%',
        height: 'auto',
      });
      this.mySubscription = dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          this.clearPage();
          this.store.dispatch(
            setClientSalesNotes({ client: new Client(result.id, result.name) })
          );
          this.loadData();
        }
      });
    }
  }

  clearClient() {
    if (!this.loading) {
      this.clearPage();
      this.store.dispatch(
        setClientSalesNotes({ client: new Client(0, 'CLIENTE DESCONOCIDO') })
      );
      this.loadData();
    }
  }

  getPaymentMethod(payments: PaymentDeparture[]) {
    return payments.length > 0 ? payments[0].payment_method : 'SIN PAGOS AÚN';
  }

  printFile(saleNote: Departure) {
    this.salesNotes = [];
    saleNote.select_sale_note = true;
    this.salesNotes.push(saleNote);
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: {
        data: this.dataPDFSaleNote,
        id_client: saleNote.id_client,
        type: 'departures',
        pdf_elements: this.salesNotes,
        sendEmail: true,
      },
    });
    this.mySubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
      }
    });
  }

  clearPage() {
    this.store.dispatch(setPageSalesNotes({ page: 1 }));
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
  }

  getDataSaleNotePDF(departure: Departure) {
    this.loading = true;
    this.mySubscription = this._departureService
      .getSaleNote(departure.id.toString())
      .subscribe({
        next: (resp) => {
          this.dataPDFSaleNote = resp;
          console.log(resp);
        },
        complete: () => {
          this.printFile(departure);
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  checkItemSelect(departure: Departure) {
    return this.departures.find((item: Departure) => item.id === departure.id)
      ? true
      : false;
  }

  checkFoundTypeDollars(departure: Departure): boolean {
    let i = 0;
    while (i < this.departures.length) {
      if (departure.is_dollars != this.departures[i].is_dollars) {
        i = this.departures.length;
        return false;
      }
      i++;
    }
    return true;
  }

  selectItem(departure: Departure, is_select: boolean) {
    if (is_select) {
      if (this.checkFoundTypeDollars(departure)) {
        if (this.departures.length > 0) {
          if (this.departures[0].payments.length == 0) {
            if (departure.payments.length == 0) {
              this.departures.push(departure);
              if (this.departures.length == 1) {
                this.clearPage();
                this.store.dispatch(
                  setClientSalesNotes({
                    client: new Client(
                      this.departures[0].id,
                      this.departures[0].client
                    ),
                  })
                );
                this.loadData();
              }
            } else {
              Swal.fire({
                title: 'ERROR',
                text: 'NO PUEDES HACER ESTA COMBINACIÓN',
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            }
          }
        } else {
          this.departures.push(departure);
          if (this.departures.length == 1) {
            this.clearPage();
            this.store.dispatch(
              setClientSalesNotes({
                client: new Client(
                  this.departures[0].id_client,
                  this.departures[0].client
                ),
              })
            );
            console.log('LOAD');
            this.loadData();
          }
        }
      } else {
        Swal.fire({
          title: 'ERROR',
          text: 'NO PUEDES COMBINAR NOTAS DE VENTA HECHAS EN DISTINTA MONEDA',
          icon: 'error',
          confirmButtonColor: '#58B1F7',
          heightAuto: false,
        });
      }
    } else {
      this.departures = this.departures.filter(
        (item: Departure) => item.id !== departure.id
      );
      if (this.departures.length == 0) {
        this.clearPage();
        this.store.dispatch(
          setClientSalesNotes({ client: new Client(0, 'CLIENTE DESCONOCIDO') })
        );
        this.loadData();
      }
    }
  }

  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }

  seePreviewInvoice() {
    if (this.departures.length > 0) {
      console.log(this.departures)
      const dialogRef = this.dialog.open(PreviewInvoiceComponent, {
        disableClose: false,
        width: '1050px',
        height: '700px',
        data: {
          departures: this.departures,
          is_pue: false,
          id_payment_departure: 0,
          is_international: this.departures[0].is_international,
          id_exportation: this.departures[0].is_international ? 2 : 1
        },
      });
      this.mySubscription = dialogRef.componentInstance.dataChange.subscribe(
        (updatedData) => {
          this.departures = [];
          this.loadData();
        }
      );
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'NO HAZ SELECCIONADO NINGUNA SALIDA',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  addPayToSaleNote(sale_note: Departure) {
    const dialogRef = this.dialog.open(AddPayToSaleNoteComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: sale_note,
    });
    this.mySubscription = dialogRef.componentInstance.dataChange.subscribe(
      (addPay) => {
        this.loadData();
      }
    );
  }

  seePayments(departure: Departure) {
    const dialogRef = this.dialog.open(PaymentsSaleNoteComponent, {
      width: 'auto',
      height: 'auto',
      data: departure,
    });
    dialogRef.componentInstance.dataChange.subscribe((dataChange) => {
      this.loadData();
    });
  }

  getClassToButton(id_status: number) {
    return id_status == 1 ? 'no-pay' : id_status == 4 || id_status == 2 ? 'partial' : id_status == 3 || id_status == 5 ? 'pay' : 'no-pay'
  }

  openBox(departure: Departure) {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
    });
    this.mySubscription = dialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  seeInvoices(departure: Departure) {
    const dialogRef = this.dialog.open(InvoicesBySaleNoteComponent, {
      disableClose: false,
      width: this.widthModalInvoices,
      height: 'auto',
      data: departure,
    });
    this.mySubscription = dialogRef.afterClosed().subscribe((result) => { });
  }

  loadAllData() {
    this.departures = [];
    this.loading = true;
    this.mySubscription = this._departureService
      .getSalesNotes(this.numberPage)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.sales_notes = resp.sales_notes;
          this.totalPages = resp.total_pages;
          this.dataSource = new MatTableDataSource(this.sales_notes);
        },
        complete: () => {
          this.dataSource.sort = this.sort;
          this.applySearch();
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.error_msg = err.error.message;
        },
      });
  }

  loadDataByClient() {
    this.loading = true;

    this.mySubscription = this._departureService
      .getSalesNotesByClient(this.formFilter.value.id_client, this.numberPage)
      .subscribe({
        next: (resp) => {
          console.log('resp', resp);
          this.sales_notes = resp.sales_notes;
          this.totalPages = resp.total_pages;
          this.dataSource = new MatTableDataSource(this.sales_notes);
        },
        complete: () => {
          this.dataSource.sort = this.sort;
          this.applySearch();
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.error_msg = err.error.message;
        },
      });
  }

  ngOnInit(): void {
    this.mySubscription = this.clientState.subscribe((response: Client) => {
      this.formFilter.controls['client'].setValue(response.name);
      this.formFilter.controls['id_client'].setValue(response.id.toString());
    });

    this.mySubscription = this.pageState.subscribe((response: number) => {
      this.numberPage = response;
    });

    this.mySubscription = this.mySubscription = this.search.subscribe(
      (response: string) => {
        this.valueSearch = response;
      }
    );

    this.loadData();
  }

  createCreditNote(saleNote: Departure) {
    const dialogRef = this.dialog.open(CreateCreditNoteComponent, {
      disableClose: false,
      width: this.widthModalInvoices,
      height: 'auto',
      data: {
        id_departure: saleNote.id,
        is_invoice: false,
        id_invoice: 0,
        id_client: saleNote.id_client,
      },
    });
    this.mySubscription = dialogRef.componentInstance.dataChange.subscribe(
      (addCreditNote) => { }
    );
  }

  loadData() {
    console.log(this.formFilter.value.id_client);
    if (this.formFilter.value.id_client == '0') {
      this.loadAllData();
    } else {
      this.loadDataByClient();
    }
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPageSalesNotes({ page: this.numberPage }));
      this.loadData();
    }
  }
}
