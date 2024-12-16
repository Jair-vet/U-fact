import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Balance } from 'src/app/models/balance.model';
import { Client } from 'src/app/models/client.model';
import { Departure } from 'src/app/models/departure.model';
import { ClientService } from 'src/app/services/client.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, shareReplay } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';
import { AccountBalanceService } from 'src/app/services/account-balance.service';

@Component({
  selector: 'app-details-balance-client',
  templateUrl: './details-balance-client.component.html',
  styleUrls: ['./details-balance-client.component.scss'],
})
export class DetailsBalanceClientComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  @Input() sales_notes: Departure[] = [];
  loading: boolean = false;
  is_dollars: boolean = false;
  error: boolean = false;
  balance!: Balance;
  idClient: string = '0';
  error_msg: String = '';
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  data: string = '';
  dateStart: Date = new Date();
  dateEnd: Date = new Date();
  range = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });

  constructor(
    private dialog: MatDialog,
    private _accountBalanceService: AccountBalanceService,

    private _routingService: RoutingService,
    private _router: Router,
    private _route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,

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
            this.colSmall = 12;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 12;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 6;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 3;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 3;
          }
        }
      });
    this.idClient = this._route.snapshot.paramMap.get('id_client') || '0';
  }

  ngOnInit(): void {
    this.initDates();
  }

  changeTypeCurrency(type: boolean) {
    this.is_dollars = type;
    this.loadData()
  }

  initDates() {
    this.dateStart.setFullYear(this.dateStart.getFullYear() - 1);
    this.dateStart = this.changeHourToDate(this.dateStart, 5, 59, 59);
    this.dateEnd = this.changeHourToDate(this.dateEnd, 23, 59, 59);
    this.range.get('start')?.setValue(this.dateStart);
    this.range.get('end')?.setValue(this.dateEnd);
    this.loadData();
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
      console.log(this.dateStart, this.dateEnd);
      this.loadData();
    }
  }

  cancel() {
    this._router.navigateByUrl(
      this._routingService.previousRoute == ''
        ? 'dashboard/payments'
        : this._routingService.previousRoute
    );
  }

  loadData() {
    this.loading = true;
    this._accountBalanceService
      .getBalance(this.idClient.toString(), this.dateStart, this.dateEnd, this.is_dollars ? 2 : 1)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.balance = resp;
        },
        complete: () => {
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.error_msg = err.error.message;
          this.loading = false;
        },
      });
  }

  historyPayments() {
    this.loading = true;
    this._accountBalanceService
      .getHistory(this.idClient.toString(), this.dateStart, this.dateEnd, this.is_dollars ? 1 : 0)
      .subscribe({
        next: (resp) => {
          this.data = resp;
        },
        complete: () => {
          this.print();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  stateAccount() {
    this.loading = true;
    this._accountBalanceService
      .getState(this.idClient.toString(), this.is_dollars ? 2 : 1)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.data = resp;
        },
        complete: () => {
          this.print();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  print() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
      }
    });
  }
}
