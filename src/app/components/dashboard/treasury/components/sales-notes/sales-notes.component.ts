import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { PaymentsSaleNoteComponent } from '../../../invoices/components/payments-sale-note/payments-sale-note.component';
import { PaymentDeparture } from 'src/app/models/payment_departure.model';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../../store/components/pdf-view/pdf-view.component';
import { AddPayToSaleNoteComponent } from '../add-pay-to-sale-note/add-pay-to-sale-note.component';

@Component({
  selector: 'app-sales-notes-by-client',
  templateUrl: './sales-notes.component.html',
  styleUrls: ['./sales-notes.component.scss']
})
export class SalesNotesByClientComponent implements OnInit {

  @Input() sales_notes: Departure[] = []
  @Input() total: number = 0;
  displayedColumns: string[] = ['number', 'seller', 'client', 'total', 'total_pay', 'saldo', 'actions']

  dataSource!: MatTableDataSource<any>
  isDisabled: BooleanInput = true
  colBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  dataPDFSaleNote!: any
  constructor(private dialog: MatDialog, private _router: Router, private breakpointObserver: BreakpointObserver, private _departureService: DepartureService) {
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
  }

  getPaymentMethod(payments: PaymentDeparture[]) {
    return payments.length > 0 ? payments[0].payment_method : 'SIN PAGOS AÚN'
  }

  printFile() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDFSaleNote }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
      }
    });
  }

  addPayToSaleNote(sale_note: Departure) {
    const dialogRef = this.dialog.open(AddPayToSaleNoteComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: sale_note
    })

  }


  getDataSaleNotePDF(departure: Departure) {
    this.isDisabled = true
    this._departureService.getSaleNote(departure.id.toString()).subscribe({
      next: (resp) => {
        this.dataPDFSaleNote = resp
      },
      complete: () => {
        this.printFile()
        this.isDisabled = false
      },
      error: (err) => {
        this.isDisabled = false
      },
    })
  }



  seePayments(departure: Departure) {
    console.log(departure)
    const dialogRef = this.dialog.open(PaymentsSaleNoteComponent, {
      width: 'auto',
      height: 'auto',
      data: departure
    })
  }

  getClassToButton(payments: PaymentDeparture[]) {
    return payments.length == 0 ? 'na' : 'success-payment'
  }





  ngOnInit(): void {
    console.log(this.sales_notes)
    this.dataSource = new MatTableDataSource(this.sales_notes);
    this.isDisabled = false
  }

}
