import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';



@Component({
  selector: 'app-catalog-requisitions',
  templateUrl: './catalog-requisitions.component.html',
  styleUrls: ['./catalog-requisitions.component.scss']
})
export class CatalogRequisitionsComponent {

  loading: Boolean = false
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['folio', 'date', 'store', 'productor', 'comments', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>;

  modalWidth!: string


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter)
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,  private breakpointObserver: BreakpointObserver) {

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {

          this.modalWidth = '100%'

        }
        if (result.breakpoints[Breakpoints.Small]) {

          this.modalWidth = '100%'

        }
        if (result.breakpoints[Breakpoints.Medium]) {

          this.modalWidth = '80%'

        }
        if (result.breakpoints[Breakpoints.Large]) {

          this.modalWidth = '50%'

        }
        if (result.breakpoints[Breakpoints.XLarge]) {

          this.modalWidth = '40%'

        }
      }
    });
    this.loadData()
  }
  loadData() {
    this.loading = true
  }
}
