import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { HistoryPurchaseOrderComponent } from '../../../purchase-orders/components/history-purchase-order/history-purchase-order.component';
import { EntriesToPurchaseOrderProductComponent } from '../../components/entries-to-purchase-order-product/entries-to-purchase-order-product.component';
import { EntriesToPurchaseOrderComponent } from '../../components/entries-to-purchase-order/entries-to-purchase-order.component';
import { PdfViewComponent } from '../../components/pdf-view/pdf-view.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { setIdStatusPurchaseOrders, setPagePurchaseOrders, setSearchPurchaseOrders } from 'src/app/state/actions/filter-purchase-order.actions';
import { selectIdStatusPurchaseOrder, selectPagePurchaseOrder, selectSearchPurchaseOrder } from 'src/app/state/selectors/filter-purchase-order.selector';

@Component({
  selector: 'app-purchase-order-entry',
  templateUrl: './purchase-order-entry.component.html',
  styleUrls: ['./purchase-order-entry.component.scss']
})
export class PurchaseOrderEntryComponent implements OnInit {
  dataPDF: string = ''
  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  numberPage: number = 1
  totalPages: number = 0
  displayedColumns: string[] = ['folio', 'provider', 'buyer', 'type', 'store', 'total', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number;
  colMedium!: number;
  modalWidth!: string
  idType: string = '1'
  search: Observable<string> = new Observable()
  statusState: Observable<string> = new Observable()
  pageState: Observable<number> = new Observable()
  valueSearch: string = ''

  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchPurchaseOrders({ search: this.dataSource.filter }))
  }


  constructor(private store: Store<any>, private dialog: MatDialog, private _purchaseOrderService: PurchaseOrderService, private breakpointObserver: BreakpointObserver) {

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

  loadData() {
    this.loading = true
    this._purchaseOrderService.getPurchaseOrders(this.idType, this.numberPage).subscribe({
      next: (resp) => {

        this.totalPages = resp.total_pages
        this.dataSource = new MatTableDataSource(resp.data);
      },
      complete: () => {
        this.applySearch()
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },

    })
  }
  openHistory(purchase: PurchaseOrder) {
    const dialogRef = this.dialog.open(HistoryPurchaseOrderComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: purchase
    })

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

  openProductsByEntry(purchase: PurchaseOrder) {
    if (purchase.id_type_inventory == 1) {
      const dialogRef = this.dialog.open(EntriesToPurchaseOrderProductComponent, {
        width: '100%',
        height: 'auto',
        data: purchase
      })
      dialogRef.componentInstance.entryCreate.subscribe((data) => {
        this.loadData()
      })
    }
    if (purchase.id_type_inventory == 2) {
      const dialogRef = this.dialog.open(EntriesToPurchaseOrderComponent, {
        width: '100%',
        height: 'auto',
        data: purchase
      })
      dialogRef.componentInstance.entryCreate.subscribe((data) => {
        this.loadData()
      })
    }

  }

  printFile() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDF }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }

  getDataPurchaseOrder(purchase: PurchaseOrder) {
    this.loading = true
    this._purchaseOrderService.generatePurchaseOrder(purchase.id).subscribe({
      next: (resp) => {
        this.dataPDF = resp
      },
      complete: () => {
        this.printFile()
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }

  changeStatus() {
    this.clearPage()
    console.log(this.idType)
    this.store.dispatch(setIdStatusPurchaseOrders({ id_status: this.idType }))
    this.loadData()
  }

  clearPage() {
    this.store.dispatch(setPagePurchaseOrders({ page: 1 }))
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
    this.loadData();

  }
}
