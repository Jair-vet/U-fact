import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { QuotationRequestProduct } from 'src/app/models/quotation-request-product.model';
// import { QuotationRequestService } from 'src/app/services/quotation-request.service';



@Component({
  selector: 'app-quotation-products-inventory',
  templateUrl: './quotation-products-inventory.component.html',
  styleUrls: ['./quotation-products-inventory.component.scss']
})
export class QuotationProductsInventoryComponent implements OnInit {

  waiting = false
  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: boolean = true
  products: QuotationRequestProduct[] = []
  displayedColumns: string[] = ['code', 'description', 'store_inventory', 'requested_inventory', 'price', 'select'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  @Output() removeProduct: EventEmitter<QuotationRequestProduct> = new EventEmitter<QuotationRequestProduct>()
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>()

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QuotationProductsInventoryComponent>, private breakpointObserver: BreakpointObserver, ) {

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

  closeDialog() {
    this.dialogRef.close();
  }

  loadData() {
    console.log(this.data)
    this.waiting = true
    this.loading = true
  }

  checkItemSelect(product: QuotationRequestProduct) {
    return this.data.selectedProducts.find((item: QuotationRequestProduct) => item.id_product === product.id_product) ? true : false
  }

  ngOnInit(): void {
    this.loadData()
  }

  getPercentageExtra(price: number) {

    return (this.data.listPrice.porcentage * price / 100)

  }

  select(product: QuotationRequestProduct, select: boolean) {
    if (select) {
      this.data.selectedProducts.push(product)
      this.dataChange.emit(this.data.selectedProducts)
    } else {
      this.removeProduct.emit(this.data.selectedProducts.find((item: QuotationRequestProduct) => (item.id_product.toString() === product.id_product.toString())))
      this.data.selectedProducts = this.data.selectedProducts.filter((item: QuotationRequestProduct) => (item.id_product.toString() != product.id_product.toString()))
    }
  }

}
