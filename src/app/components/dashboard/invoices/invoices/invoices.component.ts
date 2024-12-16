import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Departure } from 'src/app/models/departure.model';

import { MatDialog } from '@angular/material/dialog';

import { InvoiceService } from 'src/app/services/invoice.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Invoice } from 'src/app/models/invoice.model';
import { ClientEmailsComponent } from '../../common/client-emails/client-emails.component';
import { CreateCreditNoteComponent } from '../../credit-note/create-credit-note/create-credit-note.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  setDateEndInvoices,
  setDateStartInvoices,
  setPageInvoices,
  setSearchInvoices,
} from 'src/app/state/actions/filter-invoice.actions';
import {
  selectDateEndInvoice,
  selectDateStartInvoice,
  selectPageInvoice,
  selectSearchInvoice,
} from 'src/app/state/selectors/filter-invoice.selector';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  loading: boolean = false;
  error: boolean = false;
  error_msg: string = '';
  inactive: boolean = false;
  displayedColumns: string[] = [
    'number',
    'date',
    'client',
    'cfdi',
    'payment_method',
    'total',
    'total_pay',
    'saldo',
    'status',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;
  colBig!: number;
  colMedium!: number;
  steps!: string[];
  departures: Departure[] = [];
  modalWidth: string = '100%';
  totalPages: number = 0;
  search: Observable<string> = new Observable();
  pageState: Observable<number> = new Observable();
  dateStartState: Observable<Date> = new Observable();
  dateEndState: Observable<Date> = new Observable();

  numberPage: number = 1;
  withSystemEmail: string = '100%';
  widthModalInvoices: string = '100%';
  dataPDFSaleNote!: any;
  user!: User;
  invoices: Invoice[] = [];
  dateStart: Date = new Date();
  dateEnd: Date = new Date();
  valueSearch: string = '';
  range = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });
  private subscription!: Subscription;

  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchInvoices({ search: this.dataSource.filter }));
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<any>,
    private _userService: UserService,
    private dialog: MatDialog,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _invoiceService: InvoiceService
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
            this.withSystemEmail = '100%';
            this.widthModalInvoices = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
            this.withSystemEmail = '100%';
            this.widthModalInvoices = '100%';
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '80%';
            this.withSystemEmail = '85%';
            this.widthModalInvoices = '100%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '50%';
            this.withSystemEmail = '65%';
            this.widthModalInvoices = '85%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '30%';
            this.withSystemEmail = '50%';
            this.widthModalInvoices = '75%';
          }
        }
      });
    this.user = this._userService.user;
    this.search = this.store.select(selectSearchInvoice);
    this.pageState = this.store.select(selectPageInvoice);
    this.dateStartState = this.store.select(selectDateStartInvoice);
    this.dateEndState = this.store.select(selectDateEndInvoice);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initDates() {
    this.dateStart = this.changeHourToDate(this.dateStart, 5, 59, 59);
    this.dateEnd = this.changeHourToDate(this.dateEnd, 23, 59, 59);
    this.range.get('start')?.setValue(this.dateStart);
    this.range.get('end')?.setValue(this.dateEnd);
    this.loadData();
  }

  cancel(invoice: Invoice) {
    Swal.fire({
      title:
        'SELECCIONA LA RAZÓN DE CANCELACIÓN DE LA FACTURA [' +
        invoice.serie +
        '-' +
        invoice.number +
        ']',
      input: 'select',
      inputOptions: {
        '1': '[01] Comprobante emitido con errores con relación',
        '2': '[02] Comprobante emitido con errores sin relación',
        '3': '[03] No se llevó acabo la operación',
        '4': '[04] Operación nominativa relacionada en una factura global',
      },
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.subscription = this._invoiceService
          .cancelInvoice(invoice.id, result.value)
          .subscribe({
            next: (resp) => {
              console.log(resp);

              Swal.fire({
                title: 'OK',
                text: resp.message,
                icon: 'success',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
            complete: () => {
              this.loadData();
            },
            error: (err) => {
              this.loading = false;
              console.log(err);
              Swal.fire({
                title: 'ERROR',
                text: err.error.message,
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
          });
      }
    });
  }

  changeHourToDate(date: Date, h: number, m: number, s: number) {
    date.setHours(h);
    date.setMinutes(m);
    date.setSeconds(s);

    return date;
  }

  setDates() {
    if (
      !(
        this.range.controls['end'].hasError('matEndDateInvalid') ||
        this.range.controls['start'].hasError('matStartDateInvalid')
      ) &&
      !(this.range.value.end == null || this.range.value.start == null)
    ) {
      this.dateStart = this.range.value.start;
      this.dateEnd = this.range.value.end;
      this.dateStart = this.changeHourToDate(this.dateStart, 0, 0, 0);
      this.dateEnd = this.changeHourToDate(this.dateEnd, 23, 59, 59);
      this.store.dispatch(setDateStartInvoices({ dateStart: this.dateStart }));
      this.store.dispatch(setDateEndInvoices({ dateEnd: this.dateEnd }));
      this.clearPage();
      this.loadData();
    }
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPageInvoices({ page: this.numberPage }));
      this.loadData();
    }
  }

  openEmail(invoice: Invoice) {
    this.invoices = [];
    invoice.selected = true;
    this.invoices.push(invoice);
    const dialogRef = this.dialog.open(ClientEmailsComponent, {
      width: this.withSystemEmail,
      height: 'auto',
      data: {
        id_client: invoice.id_client.toString(),
        data: { invoices: this.invoices },
        type: 'invoices',
      },
    });
  }

  clearPage() {
    this.store.dispatch(setPageInvoices({ page: 1 }));
  }

  loadData() {
    this.loading = true;
    this.subscription = this._invoiceService
      .getInvoices('0', this.numberPage, this.dateStart, this.dateEnd)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.totalPages = resp.total_pages;
          this.dataSource = new MatTableDataSource(resp.invoices);
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

  createCreditNote(invoice: Invoice) {
    const dialogRef = this.dialog.open(CreateCreditNoteComponent, {
      disableClose: false,
      width: this.widthModalInvoices,
      height: 'auto',
      data: {
        id_departure: 0,
        is_invoice: true,
        id_invoice: invoice.id,
        id_client: invoice.id_client,
      },
    });
    this.subscription = dialogRef.componentInstance.dataChange.subscribe(
      (addCreditNote) => {
        this.loadData();
      }
    );
  }

  ngOnInit(): void {
    this.subscription = this.dateStartState.subscribe((response: Date) => {
      console.log(response);
      this.dateStart = response;
    });

    this.subscription = this.dateEndState.subscribe((response: Date) => {
      console.log(response);

      this.dateEnd = response;
    });

    this.subscription = this.pageState.subscribe((response: number) => {
      this.numberPage = response;
    });

    this.subscription = this.search.subscribe((response: string) => {
      this.valueSearch = response;
    });

    this.initDates();
  }

  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }
}
