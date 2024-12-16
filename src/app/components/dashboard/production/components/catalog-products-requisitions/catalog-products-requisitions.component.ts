import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductRequisitionInterface } from 'src/app/interfaces/product-requisition-form.interface';
import { ProductRequisitionService } from 'src/app/services/product-requisition.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { ProductRequisition } from 'src/app/models/product-requisition.model';


@Component({
  selector: 'app-catalog-products-requisitions',
  templateUrl: './catalog-products-requisitions.component.html',
  styleUrls: ['./catalog-products-requisitions.component.scss']
})
export class CatalogProductsRequisitionsComponent {

  loading: Boolean = false
  products_requisitions: ProductRequisition[] = []
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['amount', 'code', 'description', 'price', 'inventory', 'actions'];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _productRequisitionService: ProductRequisitionService, private _userService: UserService, public dialogRef: MatDialogRef<CatalogProductsRequisitionsComponent>) {
    this.loadData()
  }
  updateProductsOrders(index: number) {
    if (this.products_requisitions[index].amount < 1) {
      this.products_requisitions[index].amount = 1
    }

  }
  loadData() {
    this.loading = true
    this._productRequisitionService.getProductsRequisitions(this._userService.user.id_company.toString(), true).subscribe({
      next: (resp) => {
        this.products_requisitions = resp
        this.dataSource = new MatTableDataSource(this.products_requisitions);
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
  select(product_requisition: ProductRequisition) {
    product_requisition.is_select = !product_requisition.is_select
  }
  saveProductsRequisitions() {
    let i = 0
    this.loading = true
    console.log(this.products_requisitions[i])
    while (i < this.products_requisitions.length) {
      if (this.products_requisitions[i].is_select) {
        const searchObject = this._productRequisitionService.products_requisitions.find(x => x.id_product === this.products_requisitions[i].id_product)
        console.log(searchObject)
        if (searchObject != undefined) {
          searchObject.amount = this.products_requisitions[i].amount + searchObject.amount
          const index = this._productRequisitionService.products_requisitions.findIndex(x => x.id === this.products_requisitions[i].id_product)
          if (index !== -1) {
            this._productRequisitionService.products_requisitions.splice(index, 1)
            this._productRequisitionService.products_requisitions.push(searchObject)
          }
        } else {
          this._productRequisitionService.products_requisitions.push(this.products_requisitions[i])
        }
      }
      i++
    }
    this.loading = false
    this.dialogRef.close();
  }




}
