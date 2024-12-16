import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
import { environment } from 'src/environments/environment';
import { ProductOrder } from 'src/app/models/product-order.model';
import { ToolService } from 'src/app/services/tools.service';
import { Pedimento } from 'src/app/models/pedimento.model';
import { Incoterm } from 'src/app/models/incoterm.model';
import { CatalogService } from 'src/app/services/catalogs.service';
const clearFields = environment.clearFields;

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  loading = true;
  is_international: boolean = false
  changeFile: boolean = false;
  error: boolean = false;
  error_msg: string = '';
  panelOpenState = false;
  types_prices!: ListPrice[];
  users!: User[];
  shipping_methods!: ShippingMethod[];
  incoterm!: Incoterm[];
  pedimentos!: Pedimento[];
  isChangeImage = false;
  form: FormGroup;
  loadingExchangeRate: boolean = false;
  selectedFileAux: any = null;
  selectedFile: any = null;
  selectedFilename: string = '';
  public typePriceCtrl: FormControl = new FormControl();
  public typePriceFilterCtrl: FormControl = new FormControl();
  public filteredTypePrice: ReplaySubject<ListPrice[]> = new ReplaySubject<
    ListPrice[]
  >(1);
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public shippingMethodCtrl: FormControl = new FormControl();
  public shippingMethodFilterCtrl: FormControl = new FormControl();
  public filteredShippingMethod: ReplaySubject<ShippingMethod[]> =
    new ReplaySubject<ShippingMethod[]>(1);

  public incotermCtrl: FormControl = new FormControl();
  public incotermFilterCtrl: FormControl = new FormControl();
  public filteredIncoterm: ReplaySubject<Incoterm[]> =
    new ReplaySubject<Incoterm[]>(1);

  public pedimentoCtrl: FormControl = new FormControl();
  public pedimentoFilterCtrl: FormControl = new FormControl();
  public filteredPedimento: ReplaySubject<Pedimento[]> =
    new ReplaySubject<Pedimento[]>(1);
  displayedColumnsProductsOrders: string[] = [
    'amount',
    'code',
    'description',
    'price',
    'inventory',
    'total',
    'actions',
  ];
  public sub_total: number = 0.0;
  public tax: number = 0.0;
  public total: number = 0.0;

  dataProductsOrders!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  exchange_rate: number = 1;
  path: string = 'dashboard/orders';
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private _productsOrdersService: ProductOrderService,
    private breakpointObserver: BreakpointObserver,
    private _uploadService: UploadService,
    private dialog: MatDialog,
    private _formBuider: FormBuilder,
    private _toolsService: ToolService,
    private _router: Router,
    private _userService: UserService,
    private _listPriceService: ListPriceService,
    private _orderService: OrderService,
    private _shippingMethodService: ShippingMethodService,
    private _catalogService: CatalogService
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.colSmall = 12;
            this.colXBig = 12;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.colSmall = 6;
            this.colXBig = 12;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 4;
            this.colSmall = 4;
            this.colXBig = 12;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;
            this.colXBig = 10;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;
            this.colXBig = 10;
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
      is_iva: [true, Validators.required],
      id_type_price_list: ['', Validators.required],
      id_shipping_method: ['', Validators.required],
      id_seller: ['', Validators.required],
      id_company: [''],
      total: [''],
      sub_total: [''],
      iva: [''],
      is_dollars: [false, Validators.required],
      exchange_rate: ['1', Validators.required],
      id_incoterm: ['0'],
      id_pedimento: ['0'],
    });
  }

  updateProductsOrders(index: number) {
    if (this._productsOrdersService.products_orders[index].amount < 1) {
      this._productsOrdersService.products_orders[index].amount = 1;
    } else {
      this._productsOrdersService.products_orders[index].total = Number(
        (
          this._productsOrdersService.products_orders[index].price *
          this._productsOrdersService.products_orders[index].amount
        ).toFixed(2)
      );
    }
    this.calculateValors();
  }

  deleteAllData() {
    this._productsOrdersService.products_orders = [];
  }

  openCatalogProducts(): void {
    if (this.form.value.id_client) {
      const dialogRef = this.dialog.open(CatalogProductsComponent, {
        disableClose: false,
        width: '100%',
        height: 'auto',
        data: {
          id_client: this.form.value.id_client,
          is_dollars: this.form.value.is_dollars,
        },
      });
      dialogRef.afterClosed().subscribe({
        next: () => {
          this.loadProductsOrders();
        },
      });
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'NO HAZ SELECCIONADO UN CLIENTE',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    if (
      this.selectedFile.name.split('.').pop() == 'pdf' ||
      this.selectedFile.name.split('.').pop() == 'png' ||
      this.selectedFile.name.split('.').pop() == 'jpg'
    ) {
      if (this.selectedFile != null) {
        this.selectedFileAux = this.selectedFile;
        this.selectedFilename = this.selectedFile.name;
        this.changeFile = true;
      } else if (this.selectedFileAux != null) {
        this.selectedFile = this.selectedFileAux;
        this.selectedFilename = this.selectedFile.name;
      }
    } else {
      this.selectedFile = null;
    }
  }
  openCatalogClients(): void {
    const dialogRef = this.dialog.open(CatalogClientsComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result)
        this._productsOrdersService.products_orders = [];
        this.loadProductsOrders();
        this.is_international = result.id_residence == 1 ? false : result.id_residence == 2 ? true : false
        this.form.controls['client'].setValue(result.name);
        this.form.controls['id_client'].setValue(result.id);
        this.userCtrl.setValue(
          this.users.filter((x) => x.id == result.id_seller)[0]
        );
        this.typePriceCtrl.setValue(
          this.types_prices.filter((x) => x.id == result.id_type_price)[0]
        );
        this.setUser();
        this.setTypePrice();
        console.log('INTERNATIONAL', this.is_international)
        if (this.is_international) {
          this.form.controls['id_incoterm'].setValue('')
          this.form.controls['id_incoterm'].setValidators(Validators.required);
          this.form.controls['id_pedimento'].setValue('')
          this.form.controls['id_pedimento'].setValidators(Validators.required);
          this.changeIsIva(false)
          this.changeIsDollars(true)
        } else {
          this.form.controls['id_incoterm'].setValue('0')
          this.form.controls['id_incoterm'].clearValidators()
          this.form.controls['id_pedimento'].setValue('0')
          this.form.controls['id_pedimento'].clearValidators()
          this.changeIsIva(true)
        }
        console.log('change')

      }
    });
  }

  loadProductsOrders() {
    this.dataProductsOrders = new MatTableDataSource(
      this._productsOrdersService.products_orders
    );
    this.calculateValors();
  }

  changeTypeIva() {
    this.calculateValors();
  }

  getPrice(product: ProductOrder): number {
    return product.price;
  }

  calculateValors() {
    let i = 0;
    this.sub_total = 0;
    this.total = 0;
    this.tax = 0;
    console.log(this._productsOrdersService.products_orders);
    while (i < this._productsOrdersService.products_orders.length) {
      if (this.form.value.is_iva) {
        this._productsOrdersService.products_orders[i].sub_total =
          this.getPrice(this._productsOrdersService.products_orders[i]) *
          this._productsOrdersService.products_orders[i].amount;
        this._productsOrdersService.products_orders[i].tax =
          this._productsOrdersService.products_orders[i].sub_total * 0.16;
        this._productsOrdersService.products_orders[i].total =
          this._productsOrdersService.products_orders[i].sub_total +
          this._productsOrdersService.products_orders[i].tax;
        this.sub_total =
          this._productsOrdersService.products_orders[i].sub_total +
          this.sub_total;
        this.tax =
          this._productsOrdersService.products_orders[i].tax + this.tax;
        this.total =
          Number(this._productsOrdersService.products_orders[i].total) +
          this.total;
      } else {
        this._productsOrdersService.products_orders[i].sub_total =
          this.getPrice(this._productsOrdersService.products_orders[i]) *
          this._productsOrdersService.products_orders[i].amount;
        this._productsOrdersService.products_orders[i].tax = 0;
        this._productsOrdersService.products_orders[i].total =
          this._productsOrdersService.products_orders[i].sub_total +
          this._productsOrdersService.products_orders[i].tax;
        this.sub_total =
          this._productsOrdersService.products_orders[i].sub_total +
          this.sub_total;
        this.tax =
          this._productsOrdersService.products_orders[i].tax + this.tax;
        this.total =
          Number(this._productsOrdersService.products_orders[i].total) +
          this.total;
      }
      i++;
    }
  }

  changeIsIva(status: boolean) {
    if (this.is_international && !status) {
      this.form.controls['is_iva'].setValue(status);
      this.calculateValors();
    }
    if (!this.is_international && status) {
      this.form.controls['is_iva'].setValue(status);
      this.calculateValors();
    }
  }

  changeIsDollars(status: boolean) {
    if ((this.is_international && status) || (!this.is_international)) {
      if (this._productsOrdersService.products_orders.length == 0) {
        if (this.exchange_rate == 1 && status) {
          this.loadingExchangeRate = true;
          this._toolsService.getExchangeRateToDollars().subscribe({
            next: (resp) => {
              console.log(resp);
              this.exchange_rate = resp.value;
            },
            complete: () => {
              this.loadingExchangeRate = false;
            },
            error: (err) => {
              console.log(err);
              Swal.fire({
                title: 'ERROR',
                text: 'HUBO UN PROBLEMA AL OBTENER LA TASA DE CAMBIO',
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
          });
        }
        this.form.controls['is_dollars'].setValue(status);
      } else {
        Swal.fire({
          title: 'ERROR',
          text: 'MIENTRAS TENGAS PRODUCTOS NO ES POSIBLE ACTUALIZAR ESTE VALOR, POR FAVOR ELIMINA LOS PRODUCTOS',
          icon: 'error',
          confirmButtonColor: '#58B1F7',
          heightAuto: false,
        });
      }
    }

  }

  cancel() {
    this._router.navigateByUrl(this.path);
  }

  setTypePrice() {
    console.log('change', this.typePriceCtrl.value.id)
    this.form.controls['id_type_price_list'].setValue(
      this.typePriceCtrl.value.id
    );
  }

  setUser() {
    console.log('CHANGE SELL')
    this.form.controls['id_seller'].setValue(this.userCtrl.value.id);
  }

  setShippingMethod() {
    this.form.controls['id_shipping_method'].setValue(
      this.shippingMethodCtrl.value.id
    );
  }

  setIncoterm() {
    this.form.controls['id_incoterm'].setValue(
      this.incotermCtrl.value.id
    );
  }

  setPedimento() {
    this.form.controls['id_pedimento'].setValue(
      this.pedimentoCtrl.value.id
    );
  }

  deleteProductOrder(index: number) {
    this._productsOrdersService.products_orders.splice(index, 1);
    this.dataProductsOrders = new MatTableDataSource(
      this._productsOrdersService.products_orders
    );
    this.calculateValors();
  }

  clearFields() {
    if (clearFields) {
      this.is_international = false

      this.form.reset({
        comments: '',
        path_file: '',
        reference: '',
        deadline: '',
        client: '',
        id_client: '',
        is_iva: true,
        id_type_price_list: '',
        id_shipping_method: '',
        id_seller: '',
        id_company: '',
        total: '',
        sub_total: '',
        iva: '',
        id_incoterm: '',
        id_pedimento: '',
        is_dollars: false,
      });

      this._productsOrdersService.products_orders = [];
      this.dataProductsOrders = new MatTableDataSource(
        this._productsOrdersService.products_orders
      );
      this.typePriceCtrl.reset();
      this.userCtrl.reset();
      this.shippingMethodCtrl.reset();
    }
  }

  create() {
    this.loading = true;
    if (this._productsOrdersService.products_orders.length > 0) {
      this.form.controls['exchange_rate'].setValue(this.exchange_rate);
      this.form.controls['total'].setValue(this.total);
      this.form.controls['sub_total'].setValue(this.sub_total);
      this.form.controls['iva'].setValue(this.tax);
      if (this.changeFile) {
        this._uploadService
          .uploadImage(
            this.selectedFile,
            this._userService.user.rfc,
            'Pedidos',
            ''
          )
          .then((img) => {
            if (img != false) {
              this.form.controls['path_file'].setValue(img);
              this.form.controls['id_company'].setValue(
                this._userService.user.id_company
              );
              this._orderService
                .create(
                  this.form.value,
                  this._productsOrdersService.products_orders
                )
                .subscribe({
                  next: (resp) => {
                    Swal.fire({
                      title: 'AGREGAR PEDIDO',
                      text: '¿DESEAS SEGUIR AGREGANDO PEDIDOS O REGRESAR AL LISTADO?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'CONTINUAR AGREGANDO',
                      cancelButtonText: 'SALIR',
                      confirmButtonColor: '#58B1F7',
                      reverseButtons: true,
                      heightAuto: false,
                    }).then((result) => {
                      console.log(result);
                      if (!result.isConfirmed) {
                        this._productsOrdersService.products_orders = [];
                        Swal.fire({
                          title: 'OK',
                          text: resp,
                          icon: 'success',
                          confirmButtonColor: '#58B1F7',
                          heightAuto: false,
                        });
                        this._router.navigateByUrl(this.path);
                      } else {
                        this.clearFields();
                        Swal.fire({
                          title: 'OK',
                          text: resp,
                          icon: 'success',
                          confirmButtonColor: '#58B1F7',
                          heightAuto: false,
                        });
                      }
                    });
                  },
                  error: (err) => {
                    this.loading = false;
                    Swal.fire({
                      title: 'ERROR',
                      text: err.error.message,
                      icon: 'error',
                      confirmButtonColor: '#58B1F7',
                      heightAuto: false,
                    });
                  },
                  complete: () => {
                    this.loading = false;
                  },
                });
            } else {
              this.loading = false;
              Swal.fire({
                title: 'ERROR',
                text: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN',
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: 'ERROR',
              text: 'NO SE HA PODIDO SUBIR LA IMAGEN',
              icon: 'error',
              confirmButtonColor: '#58B1F7',
              heightAuto: false,
            });
          });
      } else {
        this.form.controls['id_company'].setValue(
          this._userService.user.id_company
        );
        this._orderService
          .create(this.form.value, this._productsOrdersService.products_orders)
          .subscribe({
            next: (resp) => {
              Swal.fire({
                title: 'AGREGAR PRODUCTO',
                text: '¿DESEAS SEGUIR AGREGANDO PRODUCTOS O REGRESAR AL LISTADO?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'CONTINUAR AGREGANDO',
                cancelButtonText: 'SALIR',
                confirmButtonColor: '#58B1F7',
                reverseButtons: true,
                heightAuto: false,
              }).then((result) => {
                console.log(result);
                if (!result.isConfirmed) {
                  this._productsOrdersService.products_orders = [];
                  Swal.fire({
                    title: 'OK',
                    text: resp,
                    icon: 'success',
                    confirmButtonColor: '#58B1F7',
                    heightAuto: false,
                  });
                  this._router.navigateByUrl(this.path);
                } else {
                  this.clearFields();
                  Swal.fire({
                    title: 'OK',
                    text: resp,
                    icon: 'success',
                    confirmButtonColor: '#58B1F7',
                    heightAuto: false,
                  });
                }
              });
            },
            error: (err) => {
              console.log(err.error);
              this.loading = false;
              Swal.fire({
                title: 'ERROR',
                text: err.error.message,
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
            complete: () => {
              this.loading = false;
              console.log('completado');
            },
          });
      }
    } else {
      this.loading = false;
      Swal.fire({
        title: 'ERROR',
        text: 'NO HAZ INGRESADO NINGUN PRODUCTO',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  loadTypePrices() {
    this._listPriceService
      .getAllData(this._userService.user.id_company.toString(), false)
      .subscribe({
        next: (resp) => {
          this.types_prices = resp;
        },
        complete: () => {
          this.loadUsers();
          this.loadComponentSelectTypePrice();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadUsers() {
    this._userService
      .getSellers(this._userService.user.id_company.toString())
      .subscribe({
        next: (resp) => {
          this.users = resp;
        },
        complete: () => {
          this.loadIncoterm()
          // this.loading = false;
          this.loadComponentSelectUser();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadShippingMethods() {
    this._shippingMethodService.getMethods().subscribe({
      next: (resp) => {
        this.shipping_methods = resp;
      },
      complete: () => {
        this.loadTypePrices();
        this.loadComponentSelecShippingMethod();
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  loadIncoterm() {
    this._catalogService.getIncoterm().subscribe({
      next: (resp) => {
        this.incoterm = resp;
      },
      complete: () => {
        this.loadPedimentos()
        this.loadComponentSelectIncoterm()
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  loadPedimentos() {
    this._catalogService.getPedimento().subscribe({
      next: (resp) => {
        this.pedimentos = resp;
      },
      complete: () => {
        this.loading = false
        this.loadComponentSelectPedimento()

      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredTypePrice
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: ListPrice, b: ListPrice) =>
          a && b && a.id === b.id;
      });

    this.filteredUser
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: User, b: User) =>
          a && b && a.id === b.id;
      });
    this.filteredShippingMethod
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (
          a: ShippingMethod,
          b: ShippingMethod
        ) => a && b && a.id === b.id;
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
      this.types_prices.filter(
        (types_prices) => types_prices.label.toLowerCase().indexOf(search) > -1
      )
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
      this.users.filter(
        (users) => users.name.toLowerCase().indexOf(search) > -1
      )
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
      this.shipping_methods.filter(
        (shipping_methods) =>
          shipping_methods.label.toLowerCase().indexOf(search) > -1
      )
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

  //CARGAR INCOTERM
  protected filterIncoterm() {
    if (!this.incoterm) {
      return;
    }
    let search = this.incotermFilterCtrl.value;
    if (!search) {
      this.filteredIncoterm.next(this.incoterm.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIncoterm.next(
      this.incoterm.filter(
        (incoterm) =>
          incoterm.code.toLowerCase().indexOf(search) > -1
      )
    );
  }

  loadComponentSelectIncoterm() {
    this.filteredIncoterm.next(this.incoterm.slice());
    this.incotermFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterIncoterm();
      });
  }

  //CARGAR PEDIMENTO
  protected filterPedimento() {
    if (!this.pedimentos) {
      return;
    }
    let search = this.pedimentoFilterCtrl.value;
    if (!search) {
      this.filteredPedimento.next(this.pedimentos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIncoterm.next(
      this.pedimentos.filter(
        (pedimentos) =>
          pedimentos.code.toLowerCase().indexOf(search) > -1
      )
    );
  }

  loadComponentSelectPedimento() {
    this.filteredPedimento.next(this.pedimentos.slice());
    this.pedimentoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPedimento();
      });
  }


  ngOnInit(): void {
    this._productsOrdersService.products_orders = [];
    // this.error = this._userService.checkPermissionSeller().error
    // this.error_msg = this._userService.checkPermissionSeller().message
    if (!this.error) {
      this.loadShippingMethods();
    } else {
      this.loading = false;
    }
  }
}
