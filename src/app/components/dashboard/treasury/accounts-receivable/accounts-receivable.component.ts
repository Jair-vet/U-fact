import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccountsReceivable } from 'src/app/models/accounts-receivable.model';
import { Client } from 'src/app/models/client.model';
import { AccountsReceivableService } from 'src/app/services/accounts-receivable.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import { SalesNotesPayableComponent } from '../components/sales-notes-payable/sales-notes-payable.component';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit {
  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  displayedColumns: string[] = ['number', 'client', 'total', 'total_pay', 'total_to_pay', 'due_saldo', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: boolean = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  total: number = 0
  total_pay: number = 0
  total_to_pay: number = 0
  due_saldo: number = 0
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _accountsReceivable: AccountsReceivableService, private dialog: MatDialog, private _routingService: RoutingService, private _router: Router, private breakpointObserver: BreakpointObserver, private _paymentService: PaymentService, private _userService: UserService) {

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.colBig = 12
          this.colMedium = 12
          this.modalWidth = '100%'

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.modalWidth = '100%'

        }

        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 9
          this.colMedium = 3
          this.modalWidth = '85%'

        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '75%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '65%'

        }
      }
    });
  }




  loadData() {
    this.loading = true
    this._accountsReceivable.getAccountsReceivable().subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataSource = new MatTableDataSource(resp.accounts_receivable);
        this.total = resp.total
        this.total_pay = resp.total_pay
        this.total_to_pay = resp.total_to_pay
        this.due_saldo = resp.due_saldo
        this.loading = false

      },
      complete: () => {

        this.dataSource.sort = this.sort;
        this.isDisabled = false

      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },

    })
  }

  seeDetailsBalanceClient(account: AccountsReceivable) {
    this._routingService.setRouting(`/dashboard/payments/details-balance-client/${account.id}`, `dashboard/accounts-receivable`)
    this._router.navigateByUrl(`dashboard/payments/details-balance-client/${account.id}`)

  }

  seeSalesNotesPayable(account: AccountsReceivable) {

    const dialogRef = this.dialog.open(SalesNotesPayableComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: account
    });

  }


  ngOnInit(): void {
    this.loadData();
  }

}
