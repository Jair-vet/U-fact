

import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderHistory } from 'src/app/models/order-history.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  loading = true
  currentStatus!: number
  list_status_one: OrderHistory[] = []
  list_status_two: OrderHistory[] = []
  list_status_three: OrderHistory[] = []
  list_status_four: OrderHistory[] = []
  oneFormGroup = this._formBuilder.group({
    oneCtrl: ['', Validators.required],
  })
  twoFormGroup = this._formBuilder.group({
    twoCtrl: ['', Validators.required],
  })
  threeFormGroup = this._formBuilder.group({
    threeCtrl: ['', Validators.required],
  })
  fourFormGroup = this._formBuilder.group({
    fourCtrl: ['', Validators.required],
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) {

  }

  loadData() {
    let i = 0
    this.currentStatus = this.data.data.id_status - 1
    while (i < this.data.data.order_history.length) {
      if (this.data.data.order_history[i].id_status == 1) {
        this.list_status_one.push(this.data.data.order_history[i])
      }
      else if (this.data.data.order_history[i].id_status == 2) {
        this.list_status_two.push(this.data.data.order_history[i])
      }
      else if (this.data.data.order_history[i].id_status == 3) {
        this.list_status_three.push(this.data.data.order_history[i])
      }
      else if (this.data.data.order_history[i].id_status == 4) {
        this.list_status_four.push(this.data.data.order_history[i])
      }
      i++
    }

  }

  ngOnInit() {

    this.loadData()
    this.loading = false
  }





}
