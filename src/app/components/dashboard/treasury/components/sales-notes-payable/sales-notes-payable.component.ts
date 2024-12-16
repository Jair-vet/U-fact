import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccountsReceivable } from 'src/app/models/accounts-receivable.model';
import { Departure } from 'src/app/models/departure.model';
import { AccountsReceivableService } from 'src/app/services/accounts-receivable.service';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../../store/components/pdf-view/pdf-view.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AccountBalanceService } from 'src/app/services/account-balance.service';

@Component({
  selector: 'app-sales-notes-payable',
  templateUrl: './sales-notes-payable.component.html',
  styleUrls: ['./sales-notes-payable.component.scss']
})
export class SalesNotesPayableComponent implements OnInit {

  loading: boolean = false
  client: string = ''
  total: number = 0
  total_pay: number = 0
  departures: Departure[] = []
  total_to_pay: number = 0
  due_saldo: number = 0
  colBig!: number
  dataPrint: string = ''
  colMedium!: number
  displayedColumns: string[] = ['number', 'date', 'due_date', 'days', 'total', 'total_pay', 'total_to_pay', 'due_saldo', 'actions'];
  dataSource!: MatTableDataSource<Departure>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: AccountsReceivable, private _accountBalanceService: AccountBalanceService, private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<SalesNotesPayableComponent>, private _accountsReceivable: AccountsReceivableService, private _departureService: DepartureService, private dialog: MatDialog) {
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
          this.colBig = 6
          this.colMedium = 6
        }

        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 8
          this.colMedium = 4
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 9
          this.colMedium = 3
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 9
          this.colMedium = 3
        }
      }
    });
  }
  ngOnInit() {
    this.loadData()
  }

  stateAccount() {
    this.loading = true
    this._accountBalanceService.getStateSaleNote(this.data.id.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataPrint = resp
      },
      complete: () => {
        this.printStateAccount()
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }
  loadData() {

    this.client = this.data.name
    this.loading = true

    this._accountsReceivable.getSalesNotesPayableByClient(this.data.id).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp.sales_notes);
        this.total = resp.total
        this.total_pay = resp.total_pay
        this.total_to_pay = resp.total_to_pay
        this.due_saldo = resp.due_saldo
      },
      complete: () => {
        this.loading = false

        this.loading = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }
  printStateAccount() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPrint }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
      }
    });
  }
  printFile(departure: Departure) {
    this.departures = []
    this.departures.push(departure)

    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.data, id_client: departure.id_client, type: 'departures', pdf_elements: this.departures, sendEmail: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }

  getDataPackingListPDF(departure: Departure) {

    departure.select_packing_list = true
    departure.select_sale_note = false
    this.loading = true
    this._departureService.getPackingList(departure.id.toString()).subscribe({
      next: (resp) => {
        this.data = resp
      },
      complete: () => {
        this.printFile(departure)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }

  getDataSaleNotePDF(departure: Departure) {
    this.loading = true
    departure.select_sale_note = true
    departure.select_packing_list = false
    this._departureService.getSaleNote(departure.id.toString()).subscribe({
      next: (resp) => {
        this.data = resp
      },
      complete: () => {
        this.printFile(departure)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }


  closeDialog() {
    this.dialogRef.close()
  }


}
