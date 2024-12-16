import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { HistoryPurchaseOrderComponent } from '../../../purchase-orders/components/history-purchase-order/history-purchase-order.component';
import { PdfViewComponent } from '../pdf-view/pdf-view.component';
import { EntriesToPurchaseOrderComponent } from '../entries-to-purchase-order/entries-to-purchase-order.component';
import { EntriesToPurchaseOrderProductComponent } from '../entries-to-purchase-order-product/entries-to-purchase-order-product.component';

@Component({
  selector: 'app-catalog-purchase-orders',
  templateUrl: './catalog-purchase-orders.component.html',
  styleUrls: ['./catalog-purchase-orders.component.scss']
})
export class CatalogPurchaseOrdersComponent implements OnInit {

  dataPDF: string = ''
  loading: boolean = false

  displayedColumns: string[] = ['folio', 'provider', 'buyer', 'type', 'store', 'total', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>;

  modalWidth!: string


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter)
  }


  constructor(private dialog: MatDialog, private _purchaseService: PurchaseOrderService, private breakpointObserver: BreakpointObserver) {

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

  }
  loadData() {
    this.loading = true
    this._purchaseService.getPurchaseOrdersToEntries().subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        console.log(resp)
      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
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

  openProductsByEntry(purchase: PurchaseOrder) {
    console.log(purchase)
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
    this._purchaseService.generatePurchaseOrder(purchase.id).subscribe({
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

  ngOnInit(): void {

    this.loadData();

  }
}
