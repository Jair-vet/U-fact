import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';
import { RequisitionService } from 'src/app/services/requisition.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Requisition } from 'src/app/models/requisition.model';
import { CatalogRequisitionsComponent } from '../components/catalog-requisitions/catalog-requisitions.component';
import { ProductRequisition } from 'src/app/models/product-requisition.model';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EntryService } from 'src/app/services/entry.service';
import { ProductRequisitionHistoryComponent } from '../components/product-requisition-history/product-requisition-history.component';
import { CatalogEntriesComponent } from '../components/catalog-entries/catalog-entries.component';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  loading = true
  changeFile: boolean = false
  error: boolean = false
  current_tab: number = 0
  error_msg: string = ''
  requisition!: Requisition
  panelOpenState = false
  displayedColumnsProductsRequisitions: string[] = ['code', 'description', 'amount', 'comments', 'status', 'amount_pieces', 'total_entries', 'entry', 'actions']
  path: string = 'dashboard/entries/generate-entry'
  dataSourceProductsRequisitions!: MatTableDataSource<any>
  isDisabled: BooleanInput = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  modalWidthEntries!: string
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProductsRequisitions.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  colXBig!: number
  colSmall!: number;
  protected _onDestroy = new Subject<void>();

  constructor(private _entryService: EntryService, private _router: Router, private dialog: MatDialog, private breakpointObserver: BreakpointObserver) {

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
          this.colSmall = 12
          this.colXBig = 12
          this.modalWidth = '100%'
          this.modalWidthEntries = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12
          this.modalWidth = '100%'
          this.modalWidthEntries = '100%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12
          this.modalWidth = '80%'
          this.modalWidthEntries = '90%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '50%'
          this.modalWidthEntries = '70%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '40%'
          this.modalWidthEntries = '50%'
        }
      }
    });
  }

  openEntries(product_requisition: ProductRequisition) {
    console.log(product_requisition)
    const dialogRef = this.dialog.open(CatalogEntriesComponent, {
      disableClose: false,
      width: this.modalWidthEntries,
      height: 'auto',
      data: { data: product_requisition }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        console.log(result)
        if (result.id_status == 1) {
          this._router.navigateByUrl(`dashboard/entries/detail-entry/${result.id}`)
        } else if (result.id_status == 3) {
          this._router.navigateByUrl(`dashboard/entries/generate-entry/${result.id}`)
        } else {
          Swal.fire({ title: 'ERROR', text: 'LA ENTRADA HA SIDO RECHAZADA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      }
    });

  }
  openCatalogRequisitions() {
    const dialogRef = this.dialog.open(CatalogRequisitionsComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.requisition = result
        this._entryService.current_requisition = this.requisition
        this.dataSourceProductsRequisitions = new MatTableDataSource(this.requisition.products_requisitions);
      }
    });
  }

  openProductRequisitionHistory(item: ProductRequisition): void {
    const dialogRef = this.dialog.open(ProductRequisitionHistoryComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: { data: item }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      console.log('Resultado:', result);
    });
  }

  getPendingEntry(product_requisition: ProductRequisition) {

    this._entryService.current_product_requisition = product_requisition
    this._router.navigateByUrl(`${this.path}/${product_requisition.pending_entry[0].id}`)

  }
  seeBatch(product_requisition: ProductRequisition) {

    this._entryService.current_product_requisition = product_requisition
    this._router.navigateByUrl(`dashboard/entries/detail-entry/${product_requisition.id}`)

  }







  ngOnInit(): void {

  }
}
