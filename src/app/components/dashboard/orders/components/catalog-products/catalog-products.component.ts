import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductOrderInterface } from 'src/app/interfaces/product-order-form.interface';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product.model';
import { ProductOrder } from 'src/app/models/product-order.model';

@Component({
  selector: 'app-catalog-products',
  templateUrl: './catalog-products.component.html',
  styleUrls: ['./catalog-products.component.scss'],
})
export class CatalogProductsComponent {
  loading: Boolean = false;
  products_orders: ProductOrderInterface[] = [];
  isDisabled: BooleanInput = false;
  displayedColumns: string[] = [
    'amount',
    'code',
    'description',
    'price',
    'store_inventory',
    'requested_inventory',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productOrderService: ProductOrderService,
    private _userService: UserService,
    public dialogRef: MatDialogRef<CatalogProductsComponent>
  ) {
    this.loadData();
  }
  updateProductsOrders(index: number) {
    if (this.products_orders[index].amount < 1) {
      this.products_orders[index].amount = 1;
    } else {
      this.products_orders[index].total = Number(
        (
          this.products_orders[index].price * this.products_orders[index].amount
        ).toFixed(2)
      );
    }
  }
  loadData() {
    this.loading = true;
    this._productOrderService
      .getProductsOrdersByClient(this.data.id_client, true)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.products_orders = resp.filter(
            (item: ProductOrder) => item.is_dollars == this.data.is_dollars
          );
          this.dataSource = new MatTableDataSource(this.products_orders);
        },
        complete: () => {
          this.loading = false;
          this.dataSource.sort = this.sort;
          this.isDisabled = false;
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
  }
  select(product_order: ProductOrderInterface) {
    product_order.is_select = !product_order.is_select;
  }
  saveProductsOrders() {
    let i = 0;
    this.loading = true;

    while (i < this.products_orders.length) {
      if (this.products_orders[i].is_select) {
        const searchObject = this._productOrderService.products_orders.find(
          (x) => x.id_product === this.products_orders[i].id_product
        );

        if (searchObject != undefined) {
          searchObject.amount =
            this.products_orders[i].amount + searchObject.amount;
          searchObject.total =
            this.products_orders[i].total + searchObject.total;
          const index = this._productOrderService.products_orders.findIndex(
            (x) => x.id === this.products_orders[i].id_product
          );
          if (index !== -1) {
            this._productOrderService.products_orders.splice(index, 1);
            this._productOrderService.products_orders.push(searchObject);
          }
        } else {
          this._productOrderService.products_orders.push(
            this.products_orders[i]
          );
        }
      }
      i++;
    }
    this.loading = false;
    this.dialogRef.close();
  }
}
