import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Departure } from 'src/app/models/departure.model';
import { PaymentPlugin } from 'src/app/models/payment-plugin.model';
import { User } from 'src/app/models/user.model';

import { PaymentPluginService } from 'src/app/services/payment-plugin.service';
import { UserService } from 'src/app/services/user.service';
import { ClientEmailsComponent } from '../../common/client-emails/client-emails.component';
import { Observable } from 'rxjs';
import {
  setPagePaymentPlugin,
  setSearchPaymentPlugin,
} from 'src/app/state/actions/filter-payment-plugin.actions';
import { Store } from '@ngrx/store';
import {
  selectPagePaymentPlugin,
  selectSearchPaymentPlugin,
} from 'src/app/state/selectors/filter-payment-plugin.selector';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments-plugins',
  templateUrl: './payments-plugins.component.html',
  styleUrls: ['./payments-plugins.component.scss'],
})
export class PaymentsPluginsComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  error_msg: string = '';
  inactive: boolean = false;
  displayedColumns: string[] = [
    'number',
    'date',
    'client',
    'total',
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
  withSystemEmail: string = '100%';
  numberPage: number = 1;
  dataPDFSaleNote!: any;
  totalPages: number = 1;
  user!: User;
  paymentPlugins: PaymentPlugin[] = [];
  search: Observable<string> = new Observable();
  statusState: Observable<string> = new Observable();
  pageState: Observable<number> = new Observable();
  valueSearch: string = '';
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(
      setSearchPaymentPlugin({ search: this.dataSource.filter })
    );
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<any>,
    private _userService: UserService,
    private dialog: MatDialog,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _paymentPluginService: PaymentPluginService
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
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
            this.withSystemEmail = '100%';
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '80%';
            this.withSystemEmail = '85%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '50%';
            this.withSystemEmail = '65%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '30%';
            this.withSystemEmail = '50%';
          }
        }
      });
    this.user = this._userService.user;

    this.search = this.store.select(selectSearchPaymentPlugin);
    this.pageState = this.store.select(selectPagePaymentPlugin);
  }
  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }

  cancel(plugin: PaymentPlugin) {
    Swal.fire({
      title:
        'SELECCIONA LA RAZÓN DE CANCELACIÓN DEL COMPLEMENTO DE PAGO [' +
        plugin.serie +
        '-' +
        plugin.number +
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
        this._paymentPluginService
          .cancelPaymentPlugin(plugin.id, result.value)
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

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPagePaymentPlugin({ page: this.numberPage }));
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this._paymentPluginService
      .getPaymentsPlugins('0', this.numberPage)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.totalPages = resp.total_pages;
          this.dataSource = new MatTableDataSource(resp.payments_plugins);
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

  openEmail(payment: PaymentPlugin) {
    this.paymentPlugins = [];
    payment.selected = true;
    this.paymentPlugins.push(payment);
    const dialogRef = this.dialog.open(ClientEmailsComponent, {
      width: this.withSystemEmail,
      height: 'auto',
      data: {
        id_client: payment.id_client.toString(),
        data: { payments_plugins: this.paymentPlugins },
        type: 'payment-plugins',
      },
    });
  }

  clearPage() {
    this.store.dispatch(setPagePaymentPlugin({ page: 1 }));
  }

  ngOnInit(): void {
    this.pageState.subscribe((response: number) => {
      this.numberPage = response;
    });

    this.search.subscribe((response: string) => {
      this.valueSearch = response;
    });

    this.loadData();
  }
}
