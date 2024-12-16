import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseOrder, PurchaseOrderHistory } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';

@Component({
  selector: 'app-history-purchase-order',
  templateUrl: './history-purchase-order.component.html',
  styleUrls: ['./history-purchase-order.component.scss']
})
export class HistoryPurchaseOrderComponent implements OnInit {

  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: boolean = true


  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  currentStatus!: number
  history: PurchaseOrderHistory[] = []
  list_status_one: PurchaseOrderHistory[] = []
  list_status_two: PurchaseOrderHistory[] = []
  list_status_three: PurchaseOrderHistory[] = []
  list_status_four: PurchaseOrderHistory[] = []
  list_status_five: PurchaseOrderHistory[] = []
  formGroup = this._formBuilder.group({
    oneCtrl: ['', Validators.required],
  })



  constructor(@Inject(MAT_DIALOG_DATA) public data: PurchaseOrder, private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<HistoryPurchaseOrderComponent>, private breakpointObserver: BreakpointObserver, private _purchaseOrderService: PurchaseOrderService) {

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

  setData() {
    let i = 0
    this.currentStatus = this.data.id_status - 1
    while (i < this.history.length) {
      if (this.history[i].id_status == 1) {
        this.list_status_one.push(this.history[i])
      }
      else if (this.history[i].id_status == 2) {
        this.list_status_two.push(this.history[i])
      }
      else if (this.history[i].id_status == 3) {
        this.list_status_three.push(this.history[i])
      }
      else if (this.history[i].id_status == 4) {
        this.list_status_four.push(this.history[i])
      }

      else if (this.history[i].id_status == 5) {
        this.list_status_five.push(this.history[i])
      }
      i++
    }
    this.loading = false

  }


  loadData() {
    console.log(this.data)

    this.loading = true
    this._purchaseOrderService.getPurchaseOrderHistory(this.data.id).subscribe({
      next: (resp) => {
        this.history = resp

      },
      complete: () => {
        this.setData()

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }



  ngOnInit(): void {
    this.loadData()
  }



}
