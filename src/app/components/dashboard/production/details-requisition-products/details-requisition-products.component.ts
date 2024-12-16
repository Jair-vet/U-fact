import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

import { Subject } from 'rxjs';

import Swal from 'sweetalert2';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';

import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';


import { ProductRequisitionService } from 'src/app/services/product-requisition.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Requisition } from 'src/app/models/requisition.model';
import { ProductRequisition } from 'src/app/models/product-requisition.model';

@Component({
  selector: 'app-details-requisition-products',
  templateUrl: './details-requisition-products.component.html',
  styleUrls: ['./details-requisition-products.component.scss']
})
export class DetailsRequisitionProductsComponent implements OnInit {
  loading = true

  error: boolean = false
  error_msg: string = ''

  displayedColumnsProductsRequisitions: string[] = ['code', 'description', 'comments', 'amount', 'total_entries'];
  dataSourceProductsRequisitions!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colMedium!: number;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProductsRequisitions.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  path: string = 'dashboard/production'
  idRequisition: string = ''
  colXBig!: number
  colSmall!: number;
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Requisition, private _productsRequisitionsService: ProductRequisitionService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _requisitionService: RequisitionService, public dialogRef: MatDialogRef<DetailsRequisitionProductsComponent>) {
    this._helpService.helpCreateProduct()
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
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
        }
      }
    });


  }
  updateProductsRequisitions(index: number) {
    if (this._productsRequisitionsService.products_requisitions[index].amount < 1) {
      this._productsRequisitionsService.products_requisitions[index].amount = 1
    }
  }



  loadData() {
    this.loading = true
    this._requisitionService.getData(this.data.id.toString()).subscribe({
      next: (resp) => {
        this.dataSourceProductsRequisitions = new MatTableDataSource(resp.products_requisitions);
        this.loading = false
      },
      complete: () => {

        this.dataSourceProductsRequisitions.sort = this.sort;
        this.isDisabled = false

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }

  updateAmountProduct(product: ProductRequisition) {

    if (product.amount < product.total_entries) {
      Swal.fire({ title: 'ERROR', text: 'LA CANTIDAD NO PUEDE SER MENOR AL TOTAL YA RECEPCIONADO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      this.loadData()
    } else if (product.amount == 0) {
      Swal.fire({ title: 'ERROR', text: 'LA CANTIDAD NO PUEDE SER CERO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      this.loadData()
    } else {
      this.updateProduct(product)
    }
  }

  updateProduct(product: ProductRequisition) {
    this.loading = true
    this._productsRequisitionsService.updateProductsRequisition(product.id, product.amount, this.data.id).subscribe({
      next: (resp) => {
        Swal.fire({ title: 'OK', text: resp.message, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })

      },
      complete: () => {
        this.loading = false
        this.loadData()
      },
      error: (err) => {
        this.loading = false
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        this.loadData()
        console.log(err)
      },
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.loadData()
  }
}
