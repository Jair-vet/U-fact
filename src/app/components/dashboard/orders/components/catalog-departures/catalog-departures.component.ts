import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../../store/components/pdf-view/pdf-view.component';

@Component({
  selector: 'app-catalog-departures',
  templateUrl: './catalog-departures.component.html',
  styleUrls: ['./catalog-departures.component.scss']
})
export class CatalogDeparturesComponent implements OnInit {

  error = false
  error_msg = ''

  loading: Boolean = true
  departures: Departure[] = []

  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['folio', 'comments', 'date', 'actions'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _departureService: DepartureService) {

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
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
        }
      }
    });
  }

  loadData() {

    this.loading = true
    this._departureService.getDepartureByOrder(this.data.id_order).subscribe({
      next: (resp) => {

        this.dataSource = new MatTableDataSource(resp);
      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = 'ERROR AL CARGAR LOS DATOS'
        console.log(err)
      },
    })
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


  ngOnInit(): void {
    this.loadData()
  }


}
