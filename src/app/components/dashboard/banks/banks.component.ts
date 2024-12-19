import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { BankAccount } from 'src/app/models/bank-account.model';
import { BankAccountService } from 'src/app/services/bank-account.service';


import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-banks',
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {

    loading: boolean = false
    inactive: boolean = false
    displayedColumns: string[] = ['bank', 'account', 'clabe', 'type_account', 'total_mxn', 'total_dollars', 'actions'];
    dataSource!: MatTableDataSource<any>;
    isDisabled: BooleanInput = false
    colBig!: number;
    colMedium!: number;
    steps!: string[]
    path: string = 'banks'

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;



    constructor(private _router: Router, private breakpointObserver: BreakpointObserver, private _bankAccountService: BankAccountService, private _userService: UserService) {


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

    }




    inactiveRecord(record: BankAccount) {

        Swal.fire({
            title: 'DESACTIVAR',
            text: '¿ESTAS SEGURO DE DESACTIVAR EL BANCO ' + record.bank + ' CON NUMERO [' + record.account + ']',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'CONFIRMAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#58B1F7',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this._bankAccountService.delete(record.id!.toString()).subscribe({
                    next: (resp) => {
                        Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                    },
                    complete: () => {
                        this.loadData();
                    },
                    error: (err) => {
                        console.log(err)
                        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
                    },

                })
            }
        })
    }

    changeStateInactive(state: boolean) {
        this.inactive = state
        this.changeData()
    }

    restore(record: BankAccount) {

        Swal.fire({
            title: 'RESTAURAR',
            text: '¿ESTAS SEGURO DE RESTAURAR EL BANCO ' + record.bank + ' CON NUMERO [' + record.account + ']',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'RESTARURAR',
            cancelButtonText: 'CANCELAR',
            confirmButtonColor: '#58B1F7',
            reverseButtons: true,
            heightAuto: false
        }).then((result) => {
            if (result.isConfirmed) {
                this._bankAccountService.restore(record.id!.toString()).subscribe({
                    next: (resp) => {
                        Swal.fire({ title: 'REGISTRO RESTAURADO', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                    },
                    complete: () => {
                        this.loadData();
                    },
                    error: (err) => {
                        console.log(err)
                        Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR INTENTANDO RESTAURAR EL REGISTRO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
                    },

                })
            }
        })


    }



    createBank() {
        this._router.navigateByUrl(`dashboard/${this.path}/create-bank`)
    }


    async changeData() {
        this.isDisabled = true
        this.loading = true
        this.loadData();

    }
    loadData() {

        this.loading = true
        this._bankAccountService.getAllData(this.inactive).subscribe({
            next: (resp) => {
                this.dataSource = new MatTableDataSource(resp);
                console.log(resp)
                this.loading = false

            },
            complete: () => {

                this.dataSource.sort = this.sort;
                this.isDisabled = false

            },
            error: (err) => {
                this.loading = false
                console.log(err)
            },

        })
    }

    ngOnInit(): void {

        this.loadData();

    }



}
