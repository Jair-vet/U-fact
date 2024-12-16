import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreditNote } from 'src/app/models/credit-note.model';
import { CreditNoteService } from 'src/app/services/credit-note.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { PdfViewComponent } from '../../components/pdf-view/pdf-view.component';

@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.scss']
})
export class SalesReturnsComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  inactive: boolean = false
  displayedColumns: string[] = ['folio', 'invoice', 'sale_note', 'type', 'total', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: boolean = false
  colBig!: number;
  colMedium!: number;
  modalWidth!: string
  dataPDF: string = ''
  numberPage: number = 1
  totalPages: number = 0


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _router: Router, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _creditNoteService: CreditNoteService, private _userService: UserService) {

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
          this.modalWidth = '60%'

        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '40%'

        }
      }
    });
  }



  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage
      this.loadData()
    }
  }
  getDataCreditNote(creditNote: CreditNote) {
    this.loading = true
    this._creditNoteService.generateCreditNote(creditNote.id).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataPDF = resp
      },
      complete: () => {
        this.printFile(creditNote)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
    // this._purchaseOrderService.generatePurchaseOrder(purchase.id).subscribe({
    //   next: (resp) => {
    //     console.log(resp)
    //     this.dataPDF = resp
    //   },
    //   complete: () => {
    //     this.printFile(purchase)
    //     this.loading = false
    //   },
    //   error: (err) => {
    //     this.loading = false
    //   },
    // })
  }


  printFile(creditNote: CreditNote) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDF, id_client: creditNote.id_client, sendEmail: false, type: 'credit-note' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }







  loadData() {
    this.loading = true
    this._creditNoteService.getCreditNotes(this.numberPage, 2).subscribe({
      next: (resp) => {
        console.log(resp)
        this.totalPages = resp.total_pages
        this.dataSource = new MatTableDataSource(resp.data);
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

  ngOnInit(): void {

    this.loadData();

  }

}
