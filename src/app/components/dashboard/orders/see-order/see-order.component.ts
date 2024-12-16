import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ListPrice } from 'src/app/models/list-price.model';
import { Order } from 'src/app/models/order.model';
import { ShippingMethod } from 'src/app/models/shipping-method.model';
import { User } from 'src/app/models/user.model';
import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductOrderService } from 'src/app/services/product-order.service';
import { ShippingMethodService } from 'src/app/services/shipping-method.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-see-order',
  templateUrl: './see-order.component.html',
  styleUrls: ['./see-order.component.scss'],
})
export class SeeOrderComponent implements OnInit {
  order!: Order;
  loading = true;
  error = false;
  error_msg: string = '';
  changeFile: boolean = false;
  panelOpenState = false;
  types_prices!: ListPrice[];
  users!: User[];
  shipping_methods!: ShippingMethod[];
  isChangeImage = false;
  form: FormGroup;
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
  displayedColumnsProductsOrders: string[] = [
    'code',
    'description',
    'price',
    'total',
    'amount',
    'amount_departure',
    'supply',
  ];
  public sub_total: number = 0.0;
  public tax: number = 0.0;
  public total: number = 0.0;
  dataProductsOrders!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;
  user!: User;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  idOrder: string = '0';
  path: string = 'dashboard/orders';
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _productsOrdersService: ProductOrderService,
    private _helpService: HelpService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private _formBuider: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _listPriceService: ListPriceService,
    private _orderService: OrderService,
    private _shippingMethodService: ShippingMethodService
  ) {
    this.user = this._userService.user;
    this._helpService.helpCreateProduct();
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
      folio: [''],
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
      is_dollars: [false, Validators.required],
      id: [''],
    });
    this.idOrder = this._route.snapshot.paramMap.get('id') || '0';
  }

  loadData() {
    this._orderService.getData(this.idOrder.toString()).subscribe({
      next: (resp) => {
        this.order = resp;
        console.log(this.order);
      },
      complete: () => {
        this.setFields();
      },
      error: (err) => {
        this.error = true;
        this.error_msg = err.error.message;
        this.loading = false;
      },
    });
  }

  setFields() {
    this.form.controls['id'].setValue(this.order.id);
    this.form.controls['folio'].setValue(this.order.number);


    this.form.controls['is_dollars'].setValue(this.order.is_dollars);
    this.tax = this.order.iva;

    this.sub_total = this.order.sub_total;

    this.total = this.order.total;
    this.form.controls['id_company'].setValue(this.order.id_company);
    this.form.controls['id_seller'].setValue(this.order.id_seller);
    this.form.controls['id_shipping_method'].setValue(
      this.order.id_shipping_method
    );
    this.form.controls['id_type_price_list'].setValue(
      this.order.id_type_price_list
    );
    this.form.controls['is_iva'].setValue(this.order.is_iva);
    this.form.controls['id_client'].setValue(this.order.id_client);
    this.form.controls['client'].setValue(this.order.client);
    const dateParts = this.order.deadline.split('-');
    const deadline = new Date(
      parseInt(dateParts[0], 10),
      parseInt(dateParts[1], 10) - 1,
      parseInt(dateParts[2], 10)
    );
    this.form.controls['deadline'].setValue(deadline);
    this.form.controls['reference'].setValue(this.order.reference);
    this.form.controls['path_file'].setValue(this.order.path_file);
    this.form.controls['comments'].setValue(this.order.comments);
    this.userCtrl.setValue(
      this.users.filter((x) => x.id == this.order.id_seller)[0]
    );
    this.typePriceCtrl.setValue(
      this.types_prices.filter((x) => x.id == this.order.id_type_price_list)[0]
    );
    this.shippingMethodCtrl.setValue(
      this.shipping_methods.filter(
        (x) => x.id == this.order.id_shipping_method
      )[0]
    );
    this._productsOrdersService.products_orders = this.order.products_orders;
    this.loadProductsOrders();
    this.loading = false;
  }

  loadProductsOrders() {
    console.log(this._productsOrdersService.products_orders);
    this.dataProductsOrders = new MatTableDataSource(
      this._productsOrdersService.products_orders
    );

  }



  cancel() {
    this._router.navigateByUrl(this.path);
  }

  setTypePrice() {
    this.form.controls['id_type_price_list'].setValue(
      this.typePriceCtrl.value.id
    );
  }

  setUser() {
    this.form.controls['id_seller'].setValue(this.userCtrl.value.id);
  }

  setShippingMethod() {
    this.form.controls['id_shipping_method'].setValue(
      this.shippingMethodCtrl.value.id
    );
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
          this.error = true;
          this.error_msg = err.error.message;
          this.loading = false;
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
          this.loadData();
          this.loadComponentSelectUser();
        },
        error: (err) => {
          this.error = true;
          this.error_msg = err.error.message;
          this.loading = false;
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
        this.error = true;
        this.error_msg = err.error.message;
        this.loading = false;
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

  ngOnInit(): void {
    this.loadShippingMethods();
  }
}
