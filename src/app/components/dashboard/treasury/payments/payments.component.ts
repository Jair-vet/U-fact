import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CreatePaymentComponent } from '../components/create-payment/create-payment.component';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/models/payment.model';
import { AddPayToClientComponent } from '../components/add-pay-to-client/add-pay-to-client.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { AddAttachmentToPayComponent } from '../components/add-attachment-to-pay/add-attachment-to-pay.component';
import { RoutingService } from 'src/app/services/routing.service';
import { CreditNoteService } from 'src/app/services/credit-note.service';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  setPagePayments,
  setSearchPayments,
} from 'src/app/state/actions/filter-payments.actions';

import {
  selectPagePayment,
  selectSearchPayment,
} from 'src/app/state/selectors/filter-payments.selector';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  loading: boolean = true;
  error: boolean = false;
  error_msg: string = '';
  displayedColumns: string[] = [
    'number',
    'client',
    'date',
    'payment_method',
    'bank',
    'total',
    'saldo',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;
  colBig!: number;
  colMedium!: number;
  modalWidth!: string;
  total: number = 0;
  payments!: Payment[];
  dataPDFCreditNote: string = '';
  user!: User;
  numberPage: number = 1;
  totalPages: number = 0;

  search: Observable<string> = new Observable();
  pageState: Observable<number> = new Observable();
  valueSearch: string = '';
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchPayments({ search: this.dataSource.filter }));
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<any>,
    private _creditNoteService: CreditNoteService,
    private dialog: MatDialog,
    private _routingService: RoutingService,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _paymentService: PaymentService,
    private _userService: UserService
  ) {
    this.user = this._userService.user;
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
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '85%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '70%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '60%';
          }
        }
      });
    this.search = this.store.select(selectSearchPayment);
    this.pageState = this.store.select(selectPagePayment);
  }

  openBox() {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
    });
    dialogRef.componentInstance.dataChange.subscribe((updatedData) => {
      this.loadData();
    });
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPagePayments({ page: this.numberPage }));
      this.loadData();
    }
  }

  getClassToButtonClient(id: number) {
    return id == 0 ? 'unknow' : 'know';
  }

  openAddAttachment(payment: Payment) {
    const dialogRef = this.dialog.open(AddAttachmentToPayComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: payment,
    });
    dialogRef.componentInstance.dataChange.subscribe((addPay) => {
      console.log(addPay);
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this._paymentService.getAllData('1', this.numberPage).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp.payments);
        this.total = resp.total;
        this.totalPages = resp.total_pages;
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

  seeDetailsBalanceClient(payment: Payment) {
    if (payment.id_client == 0) {
      this.addPayToClient(payment);
    } else {
      this._routingService.setRouting(
        `/dashboard/payments/details-balance-client/${payment.id_client}`,
        `dashboard/payments`
      );
      this._router.navigateByUrl(
        `dashboard/payments/details-balance-client/${payment.id_client}`
      );
    }
  }

  openAttachment(payment: Payment) {
    this.loading = true;

    if (payment.path_attachment == '' && payment.id_payment_method == 6) {
      this.openCreditNote(payment);
    } else if (
      payment.path_attachment != '' &&
      payment.id_payment_method == 6
    ) {
      window.open(
        `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Credit_Notes/${payment.path_attachment}`,
        '_blank'
      );
      this.loading = false;
    } else if (
      payment.path_attachment != '' &&
      payment.id_payment_method != 6
    ) {
      window.open(
        `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/${payment.path_attachment}`,
        '_blank'
      );
      this.loading = false;
    }
  }

  openCreditNote(payment: Payment) {
    this.loading = true;
    this._creditNoteService
      .generateCreditNote(payment.id_credit_note)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.dataPDFCreditNote = resp;
        },
        complete: () => {
          this.printFile(payment);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  printFile(payment: Payment) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.dataPDFCreditNote,
        id_client: payment.id_client,
        sendEmail: false,
        type: 'credit-note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
      }
    });
  }

  addPayToClient(payment: Payment) {
    const dialogRef = this.dialog.open(AddPayToClientComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: payment,
    });
    dialogRef.componentInstance.dataChange.subscribe((addPay) => {
      this.loadData();
    });
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

  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }
}
