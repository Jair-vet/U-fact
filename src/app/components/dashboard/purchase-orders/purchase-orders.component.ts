import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { HistoryPurchaseOrderComponent } from './components/history-purchase-order/history-purchase-order.component';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewComponent } from '../store/components/pdf-view/pdf-view.component';
import { Observable } from 'rxjs';
import { setIdStatusPurchaseOrders, setPagePurchaseOrders, setSearchPurchaseOrders } from 'src/app/state/actions/filter-purchase-order.actions';
import { Store } from '@ngrx/store';
import { selectIdStatusPurchaseOrder, selectPagePurchaseOrder, selectSearchPurchaseOrder } from 'src/app/state/selectors/filter-purchase-order.selector';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent implements OnInit {


  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  inactive: boolean = false
  displayedColumns: string[] = ['folio', 'provider', 'buyer', 'type', 'store', 'total', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: boolean = false
  colBig!: number;
  colMedium!: number;
  modalWidth!: string
  dataPDF: string = ''
  numberPage: number = 1
  totalPages: number = 0
  idStatus: string = '1'


  search: Observable<string> = new Observable()
  statusState: Observable<string> = new Observable()
  pageState: Observable<number> = new Observable()
  valueSearch: string = ''

  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchPurchaseOrders({ search: this.dataSource.filter }))
  }


  @ViewChild(MatSort) sort!: MatSort;



  constructor(private store: Store<any>, private _router: Router, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _purchaseOrderService: PurchaseOrderService, private _userService: UserService) {

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
    })
    this.search = this.store.select(selectSearchPurchaseOrder)
    this.statusState = this.store.select(selectIdStatusPurchaseOrder)
    this.pageState = this.store.select(selectPagePurchaseOrder)
  }

  validateCSD() {
    if (this._userService.user.serial != '' && this._userService.user.postal_code != '') {
      this._router.navigateByUrl('dashboard/purchase-orders/create-purchase-order')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {
      })
    }
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage
      this.store.dispatch(setPagePurchaseOrders({ page: this.numberPage }))
      this.loadData()
    }
  }
  applySearch() {
    this.dataSource.filter = this.valueSearch
    this.loading = false
  }
  getDataPurchaseOrder(purchase: PurchaseOrder) {
    this.loading = true
    this._purchaseOrderService.generatePurchaseOrder(purchase.id).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataPDF = resp
      },
      complete: () => {
        this.printFile(purchase)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }

  getClassToButton(id_status: number) {
    return id_status == 1 ? 'to-authorize' : id_status == 2 ? 'authorized' : id_status == 3 ? 'receiving' : id_status == 4 ? 'received' : 'cancel'
  }


  getNextStage(id_status: number) {
    return id_status == 1 ? 'POR AUTORIZAR' : ''
  }

  nextStage(purchase: PurchaseOrder) {
    if (purchase.id_status == 1) {

      const next = purchase.id_status == 1 ? 'AUTORIZADA' : ''
      Swal.fire({
        title: 'AUTORIZAR',
        text: '¿DESEAS QUE LA ORDEN DE COMPRA [' + purchase.folio + '] SEA ' + next + '?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'SALIR',
        confirmButtonColor: '#58B1F7',
        reverseButtons: true,
        heightAuto: false,
      }).then(result => {
        if (result.isConfirmed) {
          this._purchaseOrderService.authorizedPurchaseOrder(purchase.id).subscribe({
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
  }

  printFile(purchase: PurchaseOrder) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDF, id_client: purchase.id_provider, pdf_elements: purchase, sendEmail: true, type: 'purchase-order' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }


  cancel(purchase: PurchaseOrder) {
    Swal.fire({
      title: 'DESACTIVAR',
      text: '¿ESTAS SEGURO DE CANCELAR LA ORDEN DE COMPRA CON FOLIO [' + purchase.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._purchaseOrderService.cancelPurchaseOrder(purchase.id).subscribe({
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

  openHistory(purchase: PurchaseOrder) {
    const dialogRef = this.dialog.open(HistoryPurchaseOrderComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: purchase
    })
  }

  changeStatus() {
    this.clearPage()
    console.log(this.idStatus)
    this.store.dispatch(setIdStatusPurchaseOrders({ id_status: this.idStatus }))
    this.loadData()
  }

  clearPage() {
    this.store.dispatch(setPagePurchaseOrders({ page: 1 }))
  }

  loadData() {
    this.loading = true
    this._purchaseOrderService.getPurchaseOrders(this.idStatus, this.numberPage).subscribe({
      next: (resp) => {
        console.log(resp)
        this.totalPages = resp.total_pages
        this.dataSource = new MatTableDataSource(resp.data);

      },
      complete: () => {
        this.dataSource.sort = this.sort;
        this.applySearch()
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },

    })
  }

  ngOnInit(): void {

    this.statusState.subscribe((response: string) => {
      this.idStatus = response
    })
    this.pageState.subscribe((response: number) => {
      this.numberPage = response
    })
    this.search.subscribe((response: string) => {
      this.valueSearch = response
    })
    this.loadData();

  }


}
