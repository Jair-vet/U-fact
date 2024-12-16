import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { Invoice } from 'src/app/models/invoice.model';
import { User } from 'src/app/models/user.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UserService } from 'src/app/services/user.service';
import { ClientEmailsComponent } from '../../../common/client-emails/client-emails.component';

@Component({
  selector: 'app-invoices-by-sale-note',
  templateUrl: './invoices-by-sale-note.component.html',
  styleUrls: ['./invoices-by-sale-note.component.scss']
})
export class InvoicesBySaleNoteComponent implements OnInit {
  waiting = false
  error = false
  error_msg = ''
  loading: Boolean = true
  invoices: Invoice[] = []
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['number', 'uuid', 'date', 'client', 'payment_method', 'parcial', 'total', 'total_pay', 'actions']
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  withSystemEmail: string = '100%'
  user!: User


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Departure, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _invoiceService: InvoiceService, private _userService: UserService) {
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
          this.withSystemEmail = '100%'

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.withSystemEmail = '100%'

        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 6
          this.withSystemEmail = '85%'

        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
          this.withSystemEmail = '65%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
          this.withSystemEmail = '50%'
        }
      }
    });
  }

  setUUID(uuid: string) {
    return (uuid.length) > 20 ? (uuid.substring(0, 20 - 3) + '...') : (uuid)
  }

  loadData() {
    console.log(this.data)
    this.waiting = true
    this.loading = true
    this._invoiceService.getInvoicesByDeparture(this.data.id.toString()).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }


  openEmail(invoice: Invoice) {
    this.invoices = []
    invoice.selected = true
    this.invoices.push(invoice)
    const dialogRef = this.dialog.open(ClientEmailsComponent, {
      width: this.withSystemEmail,
      height: 'auto',
      data: { id_client: invoice.id_client.toString(), data: { invoices: this.invoices }, type: 'invoices' }
    })
  }




  ngOnInit(): void {
    this.loadData()
  }




}
