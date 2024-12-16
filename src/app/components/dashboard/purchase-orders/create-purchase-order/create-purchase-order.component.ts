
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { MatTableDataSource } from '@angular/material/table';
import { ListProductsComponent } from '../components/list-products/list-products.component';

import { MatDialog } from '@angular/material/dialog';
import { ListRawMaterialsComponent } from '../components/list-raw-materials/list-raw-materials.component';
import { ProductRawMaterial, PurchaseOrder } from 'src/app/models/purchase-order.model';
import { ListProvidersComponent } from '../components/list-providers/list-providers.component';
import { EditCurrentPurchaseOrderComponent } from '../components/edit-current-purchase-order/edit-current-purchase-order.component';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';


const clearFields = environment.clearFields

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.scss']
})
export class CreatePurchaseOrderComponent implements OnInit {

  isRawMaterial = false
  textButtonOpenProducts = 'SELECCIONAR PRODUCTOS TERMINADOS'
  loading = true
  panelOpenState = false
  error = false
  error_msg = ''
  products: ProductRawMaterial[] = []
  form: FormGroup
  purchaseOrders: PurchaseOrder[] = []
  colBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  path: string = 'dashboard/purchase-orders'
  pathImageDefault: string = './assets/img/no-image.png'


  displayedColumnsProducts: string[] = ['amount', 'sub_total', 'description', 'type', 'inventory', 'provider', 'actions'];
  dataSourceProducts!: MatTableDataSource<any>;
  displayedColumnsPurchaseOrders: string[] = ['store', 'type', 'comments', 'is_iva', 'iva', 'sub_total', 'total', 'provider', 'actions'];
  dataSourcePurchaseOrders!: MatTableDataSource<any>;
  protected _onDestroy = new Subject<void>();


  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _storeService: StoreService, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _purchaseOrderService: PurchaseOrderService) {

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
          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.modalWidth = '90%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalWidth = '70%'
        }
      }
    });
    this.form = this._formBuider.group({
      id_store: [''],
    })
  }

  openCatalogProducts() {
    if (this.isRawMaterial) {
      const dialogRef = this.dialog.open(ListRawMaterialsComponent, {
        width: this.modalWidth,
        height: 'auto',
        data: this.products
      })
      dialogRef.componentInstance.dataChange.subscribe((data) => {
        this.products = data
        this.insertOrUpdatePurchaseOrders(this.products[this.products.length - 1])
        this.updateTableProducts()
      })

      dialogRef.componentInstance.removeProduct.subscribe((data) => {
        this.removeProduct(data)
      })
    } else {
      const dialogRef = this.dialog.open(ListProductsComponent, {
        width: this.modalWidth,
        height: 'auto',
        data: this.products
      })
      dialogRef.componentInstance.dataChange.subscribe((data) => {
        this.products = data
        this.insertOrUpdatePurchaseOrders(this.products[this.products.length - 1])
        this.updateTableProducts()
      })

      dialogRef.componentInstance.removeProduct.subscribe((data) => {
        this.removeProduct(data)
      })
    }
  }



  changeProviderProductInPurchaseOrder(product: ProductRawMaterial) {
    let found = this.findPurchaseByProduct(product)
    if (found.length > 0) {
      found[0].products = found[0].products.filter(item => item.id !== product.id)
      this.updatePurchaseOrder(found[0])
    }
    this.updateTableProducts()
  }

  removeProduct(product: ProductRawMaterial) {
    let found = this.findPurchaseByProduct(product)
    if (found.length > 0) {
      found[0].products = found[0].products.filter(item => item.id !== product.id)
      this.updatePurchaseOrder(found[0])
    }
    this.products = this.products.filter(item => item.id !== product.id)
    this.updateTableProducts()
  }

  changeProvider(product: ProductRawMaterial) {
    const dialogRef = this.dialog.open(ListProvidersComponent, {
      width: this.modalWidth,
      height: 'auto'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != '' && result != undefined) {
        if (product.id_provider != result.id) {
          if (product.id_provider == 0) {
            product.id_provider = result.id
            product.provider = result.name
            this.insertOrUpdatePurchaseOrders(product)
          } else {
            this.changeProviderProductInPurchaseOrder(product)
            product.id_provider = result.id
            product.provider = result.name
            this.insertOrUpdatePurchaseOrders(product)
          }
        }
      }
    });
  }

  editPurchaseOrder(purchase: PurchaseOrder) {
    const dialogRef = this.dialog.open(EditCurrentPurchaseOrderComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: purchase
    })
    dialogRef.componentInstance.dataChange.subscribe((data) => {
      purchase = data
      this.updatePurchaseOrder(purchase)
    })
    dialogRef.componentInstance.removeProduct.subscribe((data) => {
      this.removeProduct(data)
    })
  }

  findPurchaseByProduct(product: ProductRawMaterial) {
    return this.purchaseOrders.filter(item => item.id_provider.toString() + '-' + item.id_type_inventory.toString() === product.id_provider.toString() + '-' + product.type.toString())
  }

  insertOrUpdatePurchaseOrders(product: ProductRawMaterial) {
    let found = this.findPurchaseByProduct(product)
    if (found.length > 0) {
      found[0].products.push(product)
      this.updatePurchaseOrder(found[0])
    } else {
      const object = new PurchaseOrder(0, 0, '', '', product.id_provider, product.provider, product.type, '', this._userService.user.id, '', false, 0, 0, 0, '', 0, 1, '', '')
      this.purchaseOrders.push(object)

      found = this.findPurchaseByProduct(product)
      found[0].products.push(product)
      this.changeIVA(found[0], true)
      this.updatePurchaseOrder(found[0])
    }
  }

  changeIVA(purchase: PurchaseOrder, status: boolean) {
    purchase.is_iva = status
    this.updatePurchaseOrder(purchase)
  }



  updateValorsProduct(product: ProductRawMaterial) {
    product.sub_total = Number((product.quantity * product.price_without_iva).toFixed(2))
    let found = this.findPurchaseByProduct(product)
    if (found.length > 0) {
      this.updatePurchaseOrder(found[0])
    }
  }

  updateTableProducts() {
    this.dataSourceProducts = new MatTableDataSource(this.products);
  }

  updateTablePurchaseOrders() {
    this.dataSourcePurchaseOrders = new MatTableDataSource(this.purchaseOrders);
  }

  updateAllPurchaseOrders() {
    this.purchaseOrders.forEach((purchase) => {
      this.updatePurchaseOrder(purchase)
    })
  }

  updatePurchaseOrder(purchase: PurchaseOrder) {
    purchase.iva = 0
    purchase.total = 0
    purchase.sub_total = 0
    purchase.products.forEach((product) => {
      if (purchase.is_iva) {
        product.sub_total = Number((product.quantity * product.price_without_iva).toFixed(2))
        product.iva = Number((product.sub_total * 0.16).toFixed(2))
        product.total = Number((product.iva + product.sub_total).toFixed(2))
      } else {
        product.sub_total = Number((product.quantity * product.price_without_iva).toFixed(2))
        product.iva = 0.00
        product.total = Number((product.iva + product.sub_total).toFixed(2))
      }
      purchase.sub_total = Number((purchase.sub_total + product.sub_total).toFixed(2))
      purchase.iva = Number((purchase.iva + product.iva).toFixed(2))
      purchase.total = Number((purchase.total + product.total).toFixed(2))

    })
    if (purchase.products.length == 0) {
      this.purchaseOrders = this.purchaseOrders.filter(item => (item.id_provider.toString() + '-' + item.id_type_inventory.toString() != purchase.id_provider.toString() + '-' + purchase.id_type_inventory.toString())) //ERROR ELIMINA TODO

    }
    this.updateTablePurchaseOrders()
  }

  removePurchaseOrder(purchase: PurchaseOrder) {
    purchase.products.forEach((product) => {
      this.removeProduct(product)
    })
  }


  cancel() {
    this._router.navigateByUrl(this.path)
  }

  clearFields() {
    if (clearFields) {
      this.purchaseOrders = []
      this.products = []
      this.updateTableProducts()
      this.updateTablePurchaseOrders()
    }
  }

  validatePurchaseOrders(): boolean {

    let i = 0
    while (i < this.purchaseOrders.length) {
      if (this.purchaseOrders[i].id_store == 0 || this.purchaseOrders[i].id_provider == 0) {
        return false
      }
      i++
    }
    return true
  }

  create() {
    this.loading = true
    if (this.purchaseOrders.length > 0) {
      if (this.validatePurchaseOrders()) {
        this._purchaseOrderService.addPurchaseOrders(this.purchaseOrders).subscribe({
          next: (resp) => {
            Swal.fire({
              title: `ORDENES DE COMPRA`,
              text: `¿DESEAS SEGUIR AGREGANDO O REGRESAR AL LISTADO?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'CONTINUAR AGREGANDO',
              cancelButtonText: 'SALIR',
              confirmButtonColor: '#58B1F7',
              reverseButtons: true,
              heightAuto: false,
            }).then(result => {
              console.log(result)
              if (!result.isConfirmed) {
                this.loading = false
                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                this._router.navigateByUrl('dashboard/purchase-orders')
              } else {
                this.clearFields()
                this.loading = false
                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
              }
            })
          },
          complete: () => {
            this.loading = false

          },
          error: (err) => {
            this.loading = false
            console.log(err)
            Swal.fire({
              title: 'ERROR', text: err.error.message, icon: 'error', heightAuto: false
            }
            )

          },
        })
      } else {
        this.loading = false
        Swal.fire({
          title: 'ERROR', text: 'HAY ORDENES NO VALIDAS, REVISA SI TIENEN ALMACEN ASIGNADO', icon: 'error', heightAuto: false
        })
      }
    } else {
      this.loading = false
      Swal.fire({
        title: 'ERROR', text: 'NO HAZ GENERADO NINGUNA ORDEN', icon: 'error', heightAuto: false
      })
    }
  }

  changeTypeProducts(status: boolean) {
    this.isRawMaterial = status
    if (this.isRawMaterial) {
      this.textButtonOpenProducts = 'SELECCIONAR MATERIA PRIMA'
    } else {
      this.textButtonOpenProducts = 'SELECCIONAR PRODUCTOS TERMINADOS'
    }
  }


  ngOnInit(): void {
    this.loading = false

  }
}
