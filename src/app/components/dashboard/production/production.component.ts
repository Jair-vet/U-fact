import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';
import { Store } from '@ngrx/store';
import { ProductRequisitionService } from 'src/app/services/product-requisition.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { MatSort } from '@angular/material/sort';
import { RequisitionHistoryComponent } from './components/requisition-history/requisition-history.component';
import { Requisition } from 'src/app/models/requisition.model';
import { StatusRequisitionService } from 'src/app/services/status-requisition.service';
import { DetailsRequisitionProductsComponent } from './details-requisition-products/details-requisition-products.component';
import { selectIdStatusRequisition, selectPageRequisition, selectSearchRequisition } from 'src/app/state/selectors/filter-requisition.selector';
import { setIdStatusRequisitions, setPageRequisitions, setSearchRequisitions } from 'src/app/state/actions/filter-requisition.actions';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {
  loading = true
  changeFile: boolean = false
  error: boolean = false
  error_msg: string = ''
  panelOpenState = false
  displayedColumnsRequisitions: string[] = ['folio', 'date', 'store', 'productor', 'comments', 'status', 'actions'];
  dataSourceRequisitions!: MatTableDataSource<any>;

  colBig!: number
  colMedium!: number
  modalWidth!: string
  steps!: string[]
  numberPage: number = 1
  totalPages: number = 0
  quantity_automatic: number = 0
  quantity_manual: number = 0
  idType: string = '1'
  search: Observable<string> = new Observable()
  statusState: Observable<string> = new Observable()
  pageState: Observable<number> = new Observable()
  valueSearch: string = ''

  applyFilter() {
    this.dataSourceRequisitions.filter = this.valueSearch;
    this.store.dispatch(setSearchRequisitions({ search: this.dataSourceRequisitions.filter }))
  }

  @ViewChild(MatSort) sort!: MatSort;
  colXBig!: number
  colSmall!: number;

  protected _onDestroy = new Subject<void>();
  constructor(private store: Store<any>, private _router: Router, private _statusRequisitionService: StatusRequisitionService, private _productsRequisitionsService: ProductRequisitionService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _userService: UserService, private _requisitionService: RequisitionService) {

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
          this.modalWidth = '85%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '75%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '65%'
        }
      }
    })
    this.search = this.store.select(selectSearchRequisition)
    this.statusState = this.store.select(selectIdStatusRequisition)
    this.pageState = this.store.select(selectPageRequisition)
  }

  reject(requisition: Requisition) {
    Swal.fire({
      title: 'RECHAZAR',
      text: '¿ESTAS SEGURO DE RECHZAR LA REQUISICIÓN CON FOLIO [' + requisition.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._requisitionService.updateStatus(4, requisition.id).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadData();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },

        })
      }
    })
  }

  openDetailRequisition(requisition: Requisition) {
    const dialogRef = this.dialog.open(DetailsRequisitionProductsComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: requisition
    });

  }

  updateProductsRequisitions(index: number) {
    if (this._productsRequisitionsService.products_requisitions[index].amount < 1) {
      this._productsRequisitionsService.products_requisitions[index].amount = 1
    }
  }

  openRequisitionHistory(item: Requisition): void {
    const dialogRef = this.dialog.open(RequisitionHistoryComponent, {
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

  getClassToButton(id_status: number) {
    return id_status == 1 ? 'by-producing' : id_status == 2 ? 'producing' : id_status == 3 ? 'finished' : 'finished'
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage
      this.store.dispatch(setPageRequisitions({ page: this.numberPage }))
      this.loadData()
    }
  }


  getNextStage(id_status: number) {
    return id_status == 1 ? 'AVANZAR A PRODUCIENDO' : ''
  }

  nextStage(requisition: Requisition) {
    if (requisition.id_status == 1) {
      const next = requisition.id_status == 1 ? 'PRODUCIENDO' : ''
      Swal.fire({
        title: 'AVANZAR',
        text: '¿DESEAS QUE LA REQUISICION [' + requisition.number + '] AVANCE A ' + next + '?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'SALIR',
        confirmButtonColor: '#58B1F7',
        reverseButtons: true,
        heightAuto: false,
      }).then(result => {
        if (result.isConfirmed) {
          requisition.id_status++
          this._requisitionService.updateStatus(requisition.id_status, requisition.id).subscribe({
            next: (resp) => {
              this.loadData()
              Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
            error: (err) => {
              requisition.id_status--
              this.loading = false
              Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
          })
        }
      })
    }
  }

  loadData() {
    this.loading = true
    this._requisitionService.getAllData(this.idType, this.numberPage).subscribe({
      next: (resp) => {
        this.dataSourceRequisitions = new MatTableDataSource(resp.requisitions);
        this.totalPages = resp.total_pages
        this.quantity_automatic = resp.total_automatic
        this.quantity_manual = resp.total_manual
      },
      complete: () => {
        this.dataSourceRequisitions.sort = this.sort;
        this.applySearch()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  createRequisition() {
    this._router.navigateByUrl('dashboard/production/add-requisition')
  }

  applySearch() {
    this.dataSourceRequisitions.filter = this.valueSearch
    this.loading = false
  }

  ngOnInit(): void {
    this.statusState.subscribe((response: string) => {
      this.idType = response
    })
    this.pageState.subscribe((response: number) => {
      this.numberPage = response
    })
    this.search.subscribe((response: string) => {
      this.valueSearch = response
    })
    this.loadData()
  }

  changeStatus() {
    this.clearPage()
    this.store.dispatch(setIdStatusRequisitions({ id_status: this.idType }))
    this.loadData()
  }

  clearPage() {
    this.store.dispatch(setPageRequisitions({ page: 1 }))
  }


}
