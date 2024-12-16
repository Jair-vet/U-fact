import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PdfViewComponent } from 'src/app/components/dashboard/store/components/pdf-view/pdf-view.component';
import { Departure } from 'src/app/models/departure.model';
import { User } from 'src/app/models/user.model';
import { DepartureService } from 'src/app/services/departure.service';

@Component({
  selector: 'app-departures-traceability',
  templateUrl: './departures-traceability.component.html',
  styleUrls: ['./departures-traceability.component.scss']
})
export class DeparturesTraceabilityComponent implements OnInit {

  @Input() departures: Departure[] = [];
  @Input() user!: User
  data: any
  loading = false
  displayedColumns: string[] = ['folio', 'comments', 'date', 'packing_list', 'sales_notes'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = true
  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _departureService: DepartureService) {

  }

  ngOnInit(): void {
    console.log(this.departures)
    this.dataSource = new MatTableDataSource(this.departures);
    this.isDisabled = false
  }

  printFile() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }

  getDataPackingListPDF(departure: Departure) {
    this.isDisabled = true
    this._departureService.getPackingList(departure.id.toString()).subscribe({
      next: (resp) => {
        this.data = resp
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

  getDataSaleNotePDF(departure: Departure) {
    this.isDisabled = true
    this._departureService.getSaleNote(departure.id.toString()).subscribe({
      next: (resp) => {
        this.data = resp
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

  selectSaleNote(departure: Departure, select: boolean) {
    departure.select_sale_note = select
  }

  selectPackingList(departure: Departure, select: boolean) {
    departure.select_packing_list = select
  }


}
