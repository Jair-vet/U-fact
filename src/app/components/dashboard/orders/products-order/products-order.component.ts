import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';;
import Swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';
import { OrderService } from 'src/app/services/order.service';
import { ProductOrder } from 'src/app/models/product-order.model';
import { DepartureInventory } from 'src/app/models/departure_inventory.model';
import { DepartureService } from 'src/app/services/departure.service';
import { CatalogDeparturesComponent } from '../components/catalog-departures/catalog-departures.component';

@Component({
  selector: 'app-products-order',
  templateUrl: './products-order.component.html',
  styleUrls: ['./products-order.component.scss']
})

export class ProductsOrderComponent implements OnInit {
  products_orders!: ProductOrder[]
  ids_product: number[] = []
  loading = true
  error = false
  error_msg: string = ''
  departure_inventory: DepartureInventory[] = []
  form: FormGroup
  displayedColumnsProductsOrders: string[] = ['code', 'description', 'amount', 'amount_departure', 'pending', 'suply']
  data!: any
  dataProductsOrders!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  idOrder: string = '0'
  path: string = 'dashboard/orders'
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect
  protected _onDestroy = new Subject<void>()
  constructor(private _route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _orderService: OrderService, private _departureService: DepartureService) {
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
          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12
          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12
          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '70%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '50%'
        }
      }
    });
    this.form = this._formBuider.group({
      comments: [''],
    })
    this.idOrder = this._route.snapshot.paramMap.get('id') || '0'
  }


  loadData() {
    return new Promise<[boolean]>((resolve, reject) => {
      this.loading = true
      this._orderService.getData(this.idOrder.toString()).subscribe({
        next: (resp) => {
          this.products_orders = resp.products_orders
        },
        complete: () => {
          this.dataProductsOrders = new MatTableDataSource(this.products_orders)
          this.loading = false
          resolve([true])
        },
        error: (err) => {
          this.error = true
          this.error_msg = err.error.message
          this.loading = false
          resolve([false])
        },
      })
    })
  }


  calculateCurrentSuply(product_order: ProductOrder): number {
    return this.departure_inventory.filter((item: DepartureInventory) => item.id_product_order === product_order.id).length;
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }

  create() {
    this.loading = true
    if (this.departure_inventory.length > 0) {
      console.log(this.departure_inventory)
      this._departureService.create(this.form.value.comments, this.idOrder, this.departure_inventory).subscribe({
        next: (resp) => {
          console.log(resp)
          this.departure_inventory = []
          Swal.fire({ title: 'OK', text: resp.message, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.loadData()
        },
        error: (err) => {
          this.loading = false
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
      })
    } else {
      this.loading = false
      Swal.fire({ title: 'ERROR', text: 'NO HAZ AGREGADO PRODUCTOS', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }

  validateBoxesToAdd(product_order: ProductOrder): boolean {
    let i = 0
    while (i < this.products_orders.length) {
      if (this.products_orders[i].id == product_order.id) {
        if (this.products_orders[i].amount <= this.products_orders[i].amount_departure) {
          return false
        } else {
          return true
        }
      }
      i++
    }
    return false
  }

  openCatalogDepartures() {
    this.data = { id_order: this.idOrder }
    this.dialog.open(CatalogDeparturesComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: this.data
    })
  }


  async ngOnInit(): Promise<void> {
    await this.loadData()
  }

}
