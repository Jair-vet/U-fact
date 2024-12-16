import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';

import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';
import { CatalogProductsComponent } from '../components/catalog-products/catalog-products.component';
import { CatalogClientsComponent } from '../components/catalog-clients/catalog-clients.component';

import { ProductOrderService } from 'src/app/services/product-order.service';
import { OrderService } from 'src/app/services/order.service';
import { ListPrice } from 'src/app/models/list-price.model';
import { ListPriceService } from 'src/app/services/list-price.service';
import { User } from 'src/app/models/user.model';
import { ShippingMethod } from 'src/app/models/shipping-method.model';
import { ShippingMethodService } from 'src/app/services/shipping-method.service';
import { Order } from 'src/app/models/order.model';


@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {

  order!: Order
  loading = true
  error = false
  error_msg: string = ''
  changeFile: boolean = false
  panelOpenState = false
  types_prices!: ListPrice[]
  users!: User[]
  shipping_methods!: ShippingMethod[]
  isChangeImage = false
  form: FormGroup
  selectedFileAux: any = null;
  selectedFile: any = null;
  selectedFilename: string = ''
  public typePriceCtrl: FormControl = new FormControl();
  public typePriceFilterCtrl: FormControl = new FormControl();
  public filteredTypePrice: ReplaySubject<ListPrice[]> = new ReplaySubject<ListPrice[]>(1);
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public shippingMethodCtrl: FormControl = new FormControl();
  public shippingMethodFilterCtrl: FormControl = new FormControl();
  public filteredShippingMethod: ReplaySubject<ShippingMethod[]> = new ReplaySubject<ShippingMethod[]>(1);
  displayedColumnsProductsOrders: string[] = ['amount', 'code', 'description', 'price', 'inventory', 'total', 'actions'];
  public sub_total: number = 0.0
  public iva: number = 0.0
  public total: number = 0.0
  dataProductsOrders!: MatTableDataSource<any>;

  isDisabled: BooleanInput = false

  colBig!: number;
  colXBig!: number
  colMedium!: number;
  colSmall!: number;
  idOrder: string = '0'
  path: string = 'dashboard/orders'

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private _route: ActivatedRoute, private _productsOrdersService: ProductOrderService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _uploadService: UploadService, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _listPriceService: ListPriceService, private _orderService: OrderService, private _shippingMethodService: ShippingMethodService) {
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

    this.form = this._formBuider.group({
      comments: [''],
      path_file: [''],
      reference: ['', Validators.required],
      deadline: ['', Validators.required],
      client: ['', Validators.required],
      id_client: ['', Validators.required],
      is_iva: [false, Validators.required],
      id_type_price_list: ['', Validators.required],
      id_shipping_method: ['', Validators.required],
      id_seller: ['', Validators.required],

      id_company: [''],
      total: [''],
      sub_total: [''],
      iva: [''],
      id: ['']
    })

    this.idOrder = this._route.snapshot.paramMap.get('id') || '0'
  }


  loadData() {
    this._orderService.getData(this.idOrder.toString()).subscribe({
      next: (resp) => {
        this.order = resp
      },

      complete: () => {
        this.setFields()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },

    })
  }

  setFields() {
    this.form.controls['id'].setValue(this.order.id)
    this.form.controls['iva'].setValue(this.order.iva)
    this.iva = this.order.iva
    this.form.controls['sub_total'].setValue(this.order.sub_total)
    this.sub_total = this.order.sub_total
    this.form.controls['total'].setValue(this.order.total)
    this.total = this.order.total

    this.form.controls['id_company'].setValue(this.order.id_company)

    this.form.controls['id_seller'].setValue(this.order.id_seller)
    this.form.controls['id_shipping_method'].setValue(this.order.id_shipping_method)
    this.form.controls['id_type_price_list'].setValue(this.order.id_type_price_list)
    this.form.controls['is_iva'].setValue(this.order.is_iva)
    this.form.controls['id_client'].setValue(this.order.id_client)
    this.form.controls['client'].setValue(this.order.client)
    const dateParts = this.order.deadline.split('-');
    const deadline = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));

    this.form.controls['deadline'].setValue(deadline)
    this.form.controls['reference'].setValue(this.order.reference)
    this.form.controls['path_file'].setValue(this.order.path_file)
    this.form.controls['comments'].setValue(this.order.comments)

    this.userCtrl.setValue(this.users.filter(x => x.id == this.order.id_seller)[0])
    this.typePriceCtrl.setValue(this.types_prices.filter(x => x.id == this.order.id_type_price_list)[0])

    this.shippingMethodCtrl.setValue(this.shipping_methods.filter(x => x.id == this.order.id_shipping_method)[0])

    this._productsOrdersService.products_orders = this.order.products_orders

    this.loadProductsOrders()

    this.loading = false
  }


  updateProductsOrders(index: number) {
    if (this._productsOrdersService.products_orders[index].amount < 1) {
      this._productsOrdersService.products_orders[index].amount = 1
      this._productsOrdersService.products_orders[index].total = Number((this._productsOrdersService.products_orders[index].price * this._productsOrdersService.products_orders[index].amount).toFixed(2))
    }
    else {
      this._productsOrdersService.products_orders[index].total = Number((this._productsOrdersService.products_orders[index].price * this._productsOrdersService.products_orders[index].amount).toFixed(2))
    }
    this.calculateValors()
  }


  deleteAllData() {
    this._productsOrdersService.products_orders = []

  }
  openCatalogProducts(): void {
    const dialogRef = this.dialog.open(CatalogProductsComponent, {
      disableClose: true,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadProductsOrders();
      }
    });
  }
  onFileSelected(event: any): void {


    this.selectedFile = event.target.files[0] ?? null;
    if (this.selectedFile.name.split('.').pop() == 'pdf' || this.selectedFile.name.split('.').pop() == 'png' || this.selectedFile.name.split('.').pop() == 'jpg') {
      if (this.selectedFile != null) {
        this.selectedFileAux = this.selectedFile
        this.selectedFilename = this.selectedFile.name
        this.changeFile = true

      } else if (this.selectedFileAux != null) {
        this.selectedFile = this.selectedFileAux
        this.selectedFilename = this.selectedFile.name

      }
    } else {
      this.selectedFile = null
    }

  }
  openCatalogClients(): void {
    const dialogRef = this.dialog.open(CatalogClientsComponent, {
      disableClose: true,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.form.controls['client'].setValue(result.name);
        this.form.controls['id_client'].setValue(result.id)
        this.userCtrl.setValue(this.users.filter(x => x.id == result.id_seller)[0])
        this.typePriceCtrl.setValue(this.types_prices.filter(x => x.id == result.id_type_price)[0])
        this.setUser()
        this.setTypePrice()
      }
    });
  }


  loadProductsOrders() {
    console.log(this._productsOrdersService.products_orders)
    this.dataProductsOrders = new MatTableDataSource(this._productsOrdersService.products_orders)
    this.calculateValors()
  }

  changeTypeIva() {
    this.calculateValors()
  }

  calculateValors() {
    let i = 0
    this.sub_total = 0
    this.total = 0
    this.iva = 0
    while (i < this._productsOrdersService.products_orders.length) {
      this.sub_total = this._productsOrdersService.products_orders[i].total + this.sub_total
      i++
    }
    if (this.form.value.is_iva) {
      this.iva = Number((this.sub_total * 0.16).toFixed(2))
      this.total = Number(this.sub_total.toFixed(2)) + this.iva

    } else {
      this.iva = 0
      this.total = this.sub_total + this.iva
    }
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }



  setTypePrice() {
    this.form.controls['id_type_price_list'].setValue(this.typePriceCtrl.value.id)
  }

  setUser() {
    this.form.controls['id_seller'].setValue(this.userCtrl.value.id)
  }

  setShippingMethod() {
    this.form.controls['id_shipping_method'].setValue(this.shippingMethodCtrl.value.id)
  }

  deleteProductOrder(index: number) {
    this._productsOrdersService.products_orders.splice(index, 1)
    this.dataProductsOrders = new MatTableDataSource(this._productsOrdersService.products_orders);
    this.calculateValors()
  }

  update() {
    this.loading = true
    if (this._productsOrdersService.products_orders.length > 0) {
      this.form.controls['total'].setValue(this.total)
      this.form.controls['sub_total'].setValue(this.sub_total)
      this.form.controls['iva'].setValue(this.iva)
      if (this.changeFile) {
        this._uploadService.uploadImage(this.selectedFile, this._userService.user.rfc, 'Pedidos', '')
          .then(img => {
            if (img != false) {
              this.form.controls['path_file'].setValue(img)
              this.form.controls['id_company'].setValue(this._userService.user.id_company)
              this._orderService.update(this.form.value, this._productsOrdersService.products_orders).subscribe({
                next: (resp) => {
                  this._productsOrdersService.products_orders = []
                  Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                  this._router.navigateByUrl(this.path)
                },
                error: (err) => {
                  this.loading = false
                  Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
                },
                complete: () => {
                  this.loading = false
                },
              })
            } else {
              this.loading = false
              Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
            }
          }).catch(err => {
            console.log(err);
            this.loading = false
            Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO SUBIR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
          })
      } else {
        this.form.controls['id_company'].setValue(this._userService.user.id_company)
        this._orderService.update(this.form.value, this._productsOrdersService.products_orders).subscribe({
          next: (resp) => {
            this._productsOrdersService.products_orders = []
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            this._router.navigateByUrl(this.path)
          },
          error: (err) => {
            console.log(err.error)
            this.loading = false
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loading = false
            console.log('completado');
          },
        })
      }
    } else {
      this.loading = false
      Swal.fire({ title: 'ERROR', text: 'NO HAZ INGRESADO NINGUN PRODUCTO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }


  loadTypePrices() {
    this._listPriceService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.types_prices = resp
      },
      complete: () => {
        this.loadUsers()
        this.loadComponentSelectTypePrice()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })
  }

  loadUsers() {
    this._userService.getSellers(this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.users = resp
      },
      complete: () => {
        this.loadData()
        this.loadComponentSelectUser()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })
  }

  loadShippingMethods() {
    this._shippingMethodService.getMethods().subscribe({
      next: (resp) => {
        this.shipping_methods = resp
      },
      complete: () => {
        this.loadTypePrices()
        this.loadComponentSelecShippingMethod()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredTypePrice
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: ListPrice, b: ListPrice) => a && b && a.id === b.id;
      });

    this.filteredUser
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: User, b: User) => a && b && a.id === b.id;
      });
    this.filteredShippingMethod
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: ShippingMethod, b: ShippingMethod) => a && b && a.id === b.id;
      });
  }


  //CARGAR COMPONENTE PARA UNIT SAT
  protected filterTypePrice() {
    if (!this.types_prices) {
      return;
    }
    let search = this.typePriceFilterCtrl.value;
    if (!search) {
      this.filteredTypePrice.next(this.types_prices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTypePrice.next(
      this.types_prices.filter(types_prices => types_prices.label.toLowerCase().indexOf(search) > -1)
    );
  }


  loadComponentSelectTypePrice() {
    this.filteredTypePrice.next(this.types_prices.slice());
    this.typePriceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTypePrice();
      });
  }



  //CARGAR COMPONENTE PARA VENDEDORES
  protected filterUser() {
    if (!this.users) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUser.next(this.users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUser.next(
      this.users.filter(users => users.name.toLowerCase().indexOf(search) > -1)
    );
  }


  loadComponentSelectUser() {
    this.filteredUser.next(this.users.slice());
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUser();
      });
  }

  //CARGAR COMPONENTE PARA VENDEDORES
  protected filterShippingMethod() {
    if (!this.shipping_methods) {
      return;
    }
    let search = this.shippingMethodFilterCtrl.value;
    if (!search) {
      this.filteredShippingMethod.next(this.shipping_methods.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredShippingMethod.next(
      this.shipping_methods.filter(shipping_methods => shipping_methods.label.toLowerCase().indexOf(search) > -1)
    );
  }

  loadComponentSelecShippingMethod() {
    this.filteredShippingMethod.next(this.shipping_methods.slice());
    this.shippingMethodFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterShippingMethod();
      });
  }

  ngOnInit(): void {
    this.loadShippingMethods()
  }
}
