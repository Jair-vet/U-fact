import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';

import { Order } from 'src/app/models/order.model';

import { User } from 'src/app/models/user.model';
import { ListPriceService } from 'src/app/services/list-price.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { ShippingMethodService } from 'src/app/services/shipping-method.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {
  @Input() order!: Order;

  loading = true
  error = false
  error_msg: string = ''
  panelOpenState = false
  isChangeImage = false
  form: FormGroup
  displayedColumnsProductsOrders: string[] = ['amount', 'code', 'description', 'price', 'total', 'amount_departure', 'pending'];
  public sub_total: number = 0.0
  public tax: number = 0.0
  public total: number = 0.0
  dataProductsOrders!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  user!: User
  colBig!: number;
  colXBig!: number
  colMedium!: number;
  colSmall!: number;
  idOrder: string = '0'
  path: string = 'dashboard/orders'
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private _route: ActivatedRoute, private _productsOrdersService: ProductOrderService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _listPriceService: ListPriceService, private _orderService: OrderService, private _shippingMethodService: ShippingMethodService) {
    this.user = this._userService.user

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

    this.form = this._formBuider.group({
      comments: [''],
      reference: ['', Validators.required],
      deadline: ['', Validators.required],
      client: ['', Validators.required],
      seller: ['', Validators.required],
      type_price_list: ['', Validators.required],
      shipping_method: ['', Validators.required],
      total: [''],
      sub_total: [''],
      iva: [''],
      id: ['']
    })
    this.idOrder = this._route.snapshot.paramMap.get('id') || '0'
  }

  setFields() {
    this.form.controls['client'].setValue(this.order.client)
    this.form.controls['seller'].setValue(this.order.seller)
    this.form.controls['deadline'].setValue(this.order.deadline)
    this.form.controls['shipping_method'].setValue(this.order.shipping_method)
    this.form.controls['reference'].setValue(this.order.reference)
    this.form.controls['comments'].setValue(this.order.comments)
    this.form.controls['type_price_list'].setValue(this.order.type_price_list)
    this.loadProductsOrders()
    this.loading = false
  }


  loadProductsOrders() {

    this.dataProductsOrders = new MatTableDataSource(this.order.products_orders)
    this.calculateValors()
  }

  selectOrder(order: Order, select: boolean) {
    order.selected = select
  }


  calculateValors() {
    let i = 0
    this.sub_total = 0
    this.total = 0
    this.tax = 0
    while (i < this.order.products_orders.length) {
      this.order.products_orders[i].sub_total = this.order.products_orders[i].total / 1.16
      this.order.products_orders[i].tax = this.order.products_orders[i].sub_total * 0.16
      this.sub_total = this.order.products_orders[i].sub_total + this.sub_total
      this.tax = this.order.products_orders[i].tax + this.tax
      this.total = Number(this.order.products_orders[i].total) + this.total
      i++
    }
  }

  ngOnInit(): void {
    this.setFields()
  }


}
