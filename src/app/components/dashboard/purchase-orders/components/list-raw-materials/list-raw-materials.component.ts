import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductRawMaterial } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { ListProductsComponent } from '../list-products/list-products.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-raw-materials',
  templateUrl: './list-raw-materials.component.html',
  styleUrls: ['./list-raw-materials.component.scss']
})
export class ListRawMaterialsComponent implements OnInit {

  waiting = false
  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: Boolean = true
  inventory: ProductRawMaterial[] = []
  displayedColumns: string[] = ['code', 'description', 'price', 'inventory', 'select'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeProduct: EventEmitter<ProductRawMaterial> = new EventEmitter<ProductRawMaterial>()
  protected _onDestroy = new Subject<void>();
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductRawMaterial[], public dialogRef: MatDialogRef<ListProductsComponent>, private breakpointObserver: BreakpointObserver, private _purchaseOrderService: PurchaseOrderService) {

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
    this._purchaseOrderService.getRawMaterials().subscribe({
      next: (resp) => {
        this.inventory = resp
        this.dataSource = new MatTableDataSource(this.inventory);
      },
      complete: () => {
        this.loading = false
        this.waiting = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  checkItemSelect(product: ProductRawMaterial) {
    return this.data.find((item: ProductRawMaterial) => item.id === product.id && item.type === product.type) ? true : false
  }

  ngOnInit(): void {
    this.loadData()
  }

  select(product: ProductRawMaterial, select: boolean) {
    if (select) {
      this.data.push(product);
      this.dataChange.emit(this.data);
    } else {
      this.removeProduct.emit(this.data.find((item: ProductRawMaterial) => (item.id.toString() + '-' + item.type.toString() === product.id.toString() + '-' + product.type.toString())))
      this.data = this.data.filter((item: ProductRawMaterial) => (item.id.toString() + '-' + item.type.toString() != product.id.toString() + '-' + product.type.toString()))
      console.log(this.data)
    }
  }


}
