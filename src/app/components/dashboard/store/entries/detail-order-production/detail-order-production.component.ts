import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

import { ProductRequisition } from 'src/app/models/product-requisition.model';
import { ActivatedRoute, Router } from '@angular/router';

import { EntryService } from 'src/app/services/entry.service';
import { ProductRequisitionHistoryComponent } from '../../components/product-requisition-history/product-requisition-history.component';
import { CatalogEntriesComponent } from '../../components/catalog-entries/catalog-entries.component';
import { RoutingService } from 'src/app/services/routing.service';
import { Product } from 'src/app/models/product.model';
import { FormControl } from '@angular/forms';
import { StatusRequisition } from 'src/app/models/status-requisition.model';
import { StatusRequisitionService } from 'src/app/services/status-requisition.service';

@Component({
  selector: 'app-detail-order-production',
  templateUrl: './detail-order-production.component.html',
  styleUrls: ['./detail-order-production.component.scss']
})
export class DetailOrderProductionComponent implements OnInit {
  loading = true
  products: ProductRequisition[] = []
  error: boolean = false
  @Input() id_status: string = ''
  @Input() seeFilters: boolean = true
  error_msg: string = ''

  status_requisitions!: StatusRequisition[]
  displayedColumnsProductsRequisitions: string[] = ['code', 'description', 'amount', 'total_entries', 'entry', 'actions']
  path: string = 'dashboard/entries/generate-entry'
  dataSourceProductsRequisitions!: MatTableDataSource<any>
  isDisabled: BooleanInput = false
  colBig!: number
  colMedium!: number
  public statusRequisitionsCtrl: FormControl = new FormControl();
  public statusRequisitionsFilterCtrl: FormControl = new FormControl();
  public filteredStatusRequisitions: ReplaySubject<StatusRequisition[]> = new ReplaySubject<StatusRequisition[]>(1);
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

  constructor(private _statusRequisitionService: StatusRequisitionService, private _entryService: EntryService, private _router: Router, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _requisitionService: RequisitionService, private _routingService: RoutingService) {


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


  cancel() {
    this._router.navigateByUrl(`dashboard/entries`)
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
          this._routingService.setRouting(`dashboard/entries/detail-entry/${result.id}`, `dashboard/entries`)
          this._router.navigateByUrl(`dashboard/entries/detail-entry/${result.id}`)
        } else if (result.id_status == 3) {
          this._routingService.setRouting(`dashboard/entries/generate-entry/${result.id}`, `dashboard/entries`)
          this._router.navigateByUrl(`dashboard/entries/generate-entry/${result.id}`)
        } else {
          Swal.fire({ title: 'ERROR', text: 'LA ENTRADA HA SIDO RECHAZADA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
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

  setEntriesForRequisition(requisitions: ProductRequisition[], entries: number): ProductRequisition[] {
    let i = 0
    while (i < requisitions.length && entries > 0) {
      const missing_entries = Number(requisitions[i].amount) - (Number(requisitions[i].total_entries) + Number(requisitions[i].pending_entries))
      if (missing_entries <= entries) {
        requisitions[i].pending_entries = requisitions[i].pending_entries + missing_entries
        entries = entries - missing_entries
      } else {
        requisitions[i].pending_entries = requisitions[i].pending_entries + entries
        entries = entries - entries
      }
      i++
    }
    return requisitions
  }

  generateEntries(product_requisition: ProductRequisition) {

    if (product_requisition.entry > 0 && (Number(product_requisition.entry) + Number(product_requisition.total_entries)) <= (Number(product_requisition.amount))) {
      if (product_requisition.amount_pieces * product_requisition.entry > 0) {
        this.loading = true
        product_requisition.requisitions = this.setEntriesForRequisition(product_requisition.requisitions, product_requisition.entry)
        this._entryService.create(product_requisition.amount_pieces * product_requisition.entry, product_requisition.entry, product_requisition.id_product, product_requisition.requisitions).subscribe({
          next: (resp) => {
            this._entryService.current_product_requisition = product_requisition
            this._router.navigateByUrl(`${this.path}/${resp.data}`)
          },
          error: (err) => {
            this.loading = false
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
        })
      } else {
        Swal.fire({ title: 'ERROR', text: 'LAS PIEZAS DEBEN SER UN NUMERO VALIDO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      }
    } else {
      Swal.fire({ title: 'ERROR', text: 'LA ENTRADA ES INVALIDA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }



  loadProductsRequisition() {
    this.loading = true
    this._requisitionService.getProducts(this.id_status).subscribe({
      next: (resp) => {
        console.log(resp)
        this.products = resp
        console.log(this.products)
        this.dataSourceProductsRequisitions = new MatTableDataSource(this.products);
        this.loading = false
      },
      complete: () => {
        this.dataSourceProductsRequisitions.paginator = this.paginator;
        this.dataSourceProductsRequisitions.sort = this.sort;
        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
        console.log(err)
      },
    })
  }

  //CARGAR COMPONENTE PARA STATUS REQUICIONES
  protected filterStatusRequitions() {
    if (!this.status_requisitions) {
      return;
    }

  }
  loadStatusRequisitions() {
    this._statusRequisitionService.getStatus().subscribe({
      next: (resp) => {
        this.status_requisitions = resp
      },
      complete: () => {
        this.loadComponentSelecStatusRequisitions()
        this.statusRequisitionsCtrl.setValue(this.status_requisitions.filter(x => x.id == 0)[0])
        this.loadProductsRequisition()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  changeStatusRequisition() {
    this.id_status = this.statusRequisitionsCtrl.value.id
    this.loadProductsRequisition()
  }


  loadComponentSelecStatusRequisitions() {
    this.filteredStatusRequisitions.next(this.status_requisitions.slice());
    this.statusRequisitionsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStatusRequitions();
      });
  }

  ngOnInit(): void {
    this.loadStatusRequisitions()
    console.log(this.seeFilters)
    this.displayedColumnsProductsRequisitions = this.seeFilters ? ['code', 'description', 'amount', 'total_entries', 'actions'] : ['code', 'description', 'amount', 'total_entries', 'entry', 'actions']

  }
}
