import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { PaymentsSaleNoteComponent } from '../../../invoices/components/payments-sale-note/payments-sale-note.component';
import { PaymentDeparture } from 'src/app/models/payment_departure.model';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../../store/components/pdf-view/pdf-view.component';
import { AddPayToSaleNoteComponent } from '../add-pay-to-sale-note/add-pay-to-sale-note.component';
import { Invoice } from 'src/app/models/invoice.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-invoices-balance',
    templateUrl: './invoices-balance.component.html',
    styleUrls: ['./invoices-balance.component.scss']
})
export class InvoicesBalanceComponent implements OnInit {

    @Input() invoices: Invoice[] = []
    @Input() total: number = 0;
    displayedColumns: string[] = ['number', 'date', 'client', 'type_payment', 'total', 'total_pay', 'saldo', 'actions']

    dataSource!: MatTableDataSource<any>
    isDisabled: BooleanInput = true
    colBig!: number
    colMedium!: number
    colSmall!: number
    modalWidth!: string
    user!: User
    dataPDFSaleNote!: any
    constructor(private breakpointObserver: BreakpointObserver, private _userService: UserService) {
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
                    this.modalWidth = '80%'
                }
                if (result.breakpoints[Breakpoints.Large]) {
                    this.colBig = 10
                    this.colMedium = 2
                    this.modalWidth = '50%'
                }
                if (result.breakpoints[Breakpoints.XLarge]) {
                    this.colBig = 10
                    this.colMedium = 2
                    this.modalWidth = '30%'

                }
            }
        });
        this.user = this._userService.user
    }















    ngOnInit(): void {

        this.dataSource = new MatTableDataSource(this.invoices);
        this.isDisabled = false
    }

}
