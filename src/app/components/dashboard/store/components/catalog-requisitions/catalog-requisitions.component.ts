import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Requisition } from 'src/app/models/requisition.model';
import { RequisitionService } from 'src/app/services/requisition.service';
import { RequisitionHistoryComponent } from '../../../production/components/requisition-history/requisition-history.component';

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

  constructor(private dialog: MatDialog, private _requisitionsService: RequisitionService, private breakpointObserver: BreakpointObserver) {

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
    this._requisitionsService.getOrdersProduction().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        console.log(resp)
        console.log('REQUISICIONES')
      },
      complete: () => {
        this.loading = false
        this.dataSource.sort = this.sort;

        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }
  openRequisitionHistory(item: Requisition): void {
    console.log(item)
    const dialogRef = this.dialog.open(RequisitionHistoryComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: { data: item }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      console.log('Resultado:', result);
    });
  }
}
