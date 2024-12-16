import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Client } from 'src/app/models/client.model';
import { AccountBalanceService } from 'src/app/services/account-balance.service';
import { AccountsReceivableService } from 'src/app/services/accounts-receivable.service';

import { ClientService } from 'src/app/services/client.service';

import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';



@Component({
    selector: 'app-accounts-pays',
    templateUrl: './accounts-pays.component.html',
    styleUrls: ['./accounts-pays.component.scss']
})




export class AccountsPaysComponent implements OnInit {

    loading: boolean = false
    error: boolean = false
    error_msg: string = ''
    inactive: boolean = false
    total_debt_invoices_mxn_no_vigency: number = 0
    total_debt_invoices_mxn_vigency: number = 0
    total_debt_invoices_usd_no_vigency: number = 0
    total_debt_invoices_usd_vigency: number = 0
    total_debt_sales_notes_mxn_no_vigency: number = 0
    total_debt_sales_notes_mxn_vigency: number = 0
    total_debt_sales_notes_usd_no_vigency: number = 0
    total_debt_sales_notes_usd_vigency: number = 0
    displayedColumns: string[] = ['name', 'debt_sales_notes_mxn_no_vigency', 'debt_sales_notes_mxn_vigency', 'debt_sales_notes_usd_no_vigency', 'debt_sales_notes_usd_vigency', 'debt_invoices_mxn_no_vigency', 'debt_invoices_mxn_vigency', 'debt_invoices_usd_no_vigency', 'debt_invoices_usd_vigency', 'actions'];
    dataSource!: MatTableDataSource<any>;
    isDisabled: BooleanInput = false
    colBig!: number;
    colMedium!: number;
    steps!: string[]
    clients!: Client[]


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;



    constructor(private _routingService: RoutingService, private _router: Router, private breakpointObserver: BreakpointObserver, private _accountBalanceService: AccountBalanceService, private _userService: UserService) {

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

                }
                if (result.breakpoints[Breakpoints.Small]) {
                    this.colBig = 12
                    this.colMedium = 12

                }

                if (result.breakpoints[Breakpoints.Medium]) {
                    this.colBig = 9
                    this.colMedium = 3

                }
                if (result.breakpoints[Breakpoints.Large]) {
                    this.colBig = 10
                    this.colMedium = 2

                }
                if (result.breakpoints[Breakpoints.XLarge]) {
                    this.colBig = 10
                    this.colMedium = 2

                }
            }
        });

        this._routingService.setRouting(`dashboard/clients`, `dashboard/clients`)
    }










    loadClients() {

        this.loading = true
        this._accountBalanceService.getAccountsPays().subscribe({
            next: (resp) => {
                this.dataSource = new MatTableDataSource(resp.clients);
                console.log(resp)
                this.total_debt_invoices_mxn_no_vigency = resp.total_debt_invoices_mxn_no_vigency
                this.total_debt_invoices_mxn_vigency = resp.total_debt_invoices_mxn_vigency
                this.total_debt_invoices_usd_no_vigency = resp.total_debt_invoices_usd_no_vigency
                this.total_debt_invoices_usd_vigency = resp.total_debt_invoices_usd_vigency
                this.total_debt_sales_notes_mxn_no_vigency = resp.total_debt_sales_notes_mxn_no_vigency
                this.total_debt_sales_notes_mxn_vigency = resp.total_debt_sales_notes_mxn_vigency
                this.total_debt_sales_notes_usd_no_vigency = resp.total_debt_sales_notes_usd_no_vigency
                this.total_debt_sales_notes_usd_vigency = resp.total_debt_sales_notes_usd_vigency
                this.loading = false

            },
            complete: () => {

                this.dataSource.sort = this.sort;
                this.isDisabled = false

            },
            error: (err) => {
                this.error = true
                this.error_msg = err.error.message
                this.loading = false
                console.log(err)
            },

        })
    }

    goToBalance(client: Client) {
        this._routingService.setRouting(`/dashboard/payments/details-balance-client/${client.id}`, `dashboard/accounts-pays`)
        this._router.navigateByUrl(`/dashboard/payments/details-balance-client/${client.id}`)
    }

    ngOnInit(): void {
        this.loadClients();
    }

    ngAfterViewInit() {


    }




}
