import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { Payment } from 'src/app/models/payment.model';
import { PaymentDeparture } from 'src/app/models/payment_departure.model';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { PreviewInvoiceComponent } from '../preview-invoice/preview-invoice.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { DepartureService } from 'src/app/services/departure.service';

@Component({
    selector: 'app-payments-sale-note',
    templateUrl: './payments-sale-note.component.html',
    styleUrls: ['./payments-sale-note.component.scss']
})
export class PaymentsSaleNoteComponent implements OnInit {

    waiting = false
    error = false
    total = 0
    total_pay = 0
    error_msg = ''
    departures: Departure[] = []
    loading: Boolean = true

    payments: PaymentDeparture[] = []
    isDisabled: BooleanInput = false
    displayedColumns: string[] = ['payment_method', 'total', 'date', 'actions'];
    dataSource!: MatTableDataSource<any>;
    colBig!: number
    colXBig!: number
    colMedium!: number
    colSmall!: number
    modalWidth!: string
    user!: User
    @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatSort) sort!: MatSort;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _paymentService: PaymentService, private _userService: UserService, private _departureService: DepartureService) {
        this.user = this._userService.user
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
                    this.colSmall = 12
                }
                if (result.breakpoints[Breakpoints.Small]) {
                    this.colBig = 12
                    this.colMedium = 12
                    this.colSmall = 6
                }
                if (result.breakpoints[Breakpoints.Medium]) {
                    this.colBig = 12
                    this.colMedium = 6
                    this.colSmall = 6
                }
                if (result.breakpoints[Breakpoints.Large]) {
                    this.colBig = 6
                    this.colMedium = 4
                    this.colSmall = 3
                }
                if (result.breakpoints[Breakpoints.XLarge]) {
                    this.colBig = 6
                    this.colMedium = 4
                    this.colSmall = 3
                }
            }
        });
        this.total = data.total

    }

    loadData() {
        this.loading = true
        this.waiting = true
        this._departureService.getDeparture(this.data.id).subscribe({
            next: (resp) => {
                console.log(resp)
                this.data = resp
                this.departures = []
                this.data.boxes = []
                this.departures.push(this.data)
                this.payments = resp.payments

                this.total_pay = resp.total_pay
                this.dataSource = new MatTableDataSource(this.payments);
            },
            complete: () => {
                this.loading = false
                this.waiting = false
            },
            error: (err) => {
                this.loading = false
                this.waiting = false
                this.error = true
                this.error_msg = err.error.message
            },
        })
    }

    // loadData() {
    //     this.waiting = true
    //     this.loading = true
    //     console.log(this.data)
    //     this.departures = []
    //     this.departures.push(this.data)
    //     this._paymentService.getDataByDeparture(this.data.id).subscribe({
    //         next: (resp) => {
    //             this.payments = resp.payments
    //             this.total_pay = resp.total
    //             this.dataSource = new MatTableDataSource(this.payments);
    //         },
    //         complete: () => {
    //             this.loading = false
    //             this.waiting = false
    //         },
    //         error: (err) => {
    //             this.loading = false
    //             this.waiting = false
    //             this.error = true
    //             this.error_msg = err.error.message
    //         },
    //     })
    // }



    seePreviewInvoice(payment: PaymentDeparture) {

        if (this.departures.length > 0) {
            console.log(payment)
            console.log(this.departures[0])
            this.departures[0].total_invoice = this.departures[0].total_invoice + payment.total
            console.log(this.departures[0].total_invoice)
            this.departures[0].payment_method = payment.id_payment_method_invoice.toString()
            const dialogRef = this.dialog.open(PreviewInvoiceComponent, {
                disableClose: false,
                width: '1050px',
                height: '700px',
                data: { departures: this.departures, is_pue: true, total_pay: payment.total, id_payment_departure: payment.id, is_international: false, id_exportation: 1 }
            })
            dialogRef.afterClosed().subscribe(result => {
                this.departures[0].total_invoice = this.departures[0].total_invoice - payment.total
                this.loadData()
                this.dataChange.emit(this.dataChange);
            });
        } else {
            Swal.fire({ title: 'ERROR', text: 'NO HAZ SELECCIONADO NINGUNA SALIDA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
    }


    ngOnInit(): void {
        this.loadData()
    }



}
