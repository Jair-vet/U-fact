import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ListPrice } from 'src/app/models/list-price.model';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ListPriceService } from 'src/app/services/list-price.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { QuotationRequestProduct } from 'src/app/models/quotation-request-product.model';
import { CatalogClientsComponent } from '../../orders/components/catalog-clients/catalog-clients.component';
import { MatSelect } from '@angular/material/select';
import { QuotationProductsInventoryComponent } from '../components/quotation-products-inventory/quotation-products-inventory.component';
import { QuotationRequestService } from 'src/app/services/quotation-request.service';
import { QuotationRequest } from 'src/app/models/quotation-request.model';

@Component({
  selector: 'app-edit-quotation-request',
  templateUrl: './edit-quotation-request.component.html',
  styleUrls: ['./edit-quotation-request.component.scss']
})
export class EditQuotationRequestComponent implements OnInit {

  loading = true
  error: boolean = false
  error_msg: string = ''
  form: FormGroup
  colBig!: number;
  colXBig!: number
  colMedium!: number;
  modalWidth: string = ''
  types_prices: ListPrice[] = []
  products: QuotationRequestProduct[] = []
  colSmall!: number;
  public typePriceCtrl: FormControl = new FormControl();
  public typePriceFilterCtrl: FormControl = new FormControl();
  public filteredTypePrice: ReplaySubject<ListPrice[]> = new ReplaySubject<ListPrice[]>(1);
  displayedColumnsProductsOrders: string[] = ['amount', 'amount_pieces', 'code', 'description', 'price', 'price_unit', 'total', 'actions'];
  idQuotationRequest: string = '0'
  dataProducts!: MatTableDataSource<any>;
  isDisabled: boolean = false

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();
  path: string = 'dashboard/quotation-request'

  constructor(private dialog: MatDialog, private _route: ActivatedRoute, private _listPriceService: ListPriceService, private el: ElementRef, private _userService: UserService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _quotationRequestService: QuotationRequestService) {

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
          this.modalWidth = '90%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '70%'
        }
      }
    });

    this.form = this._formBuider.group({
      comments: [''],
      id: ['', Validators.required],
      client: ['', Validators.required],
      id_client: ['', Validators.required],
      id_list_price: ['', Validators.required],
      total_invest: ['0.0', Validators.required],
    })
    this.idQuotationRequest = this._route.snapshot.paramMap.get('id') || '0'
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }

  getTitleListPrice() {
    if (this.typePriceCtrl.value == null) {
      return 'PORCENTAJE 0%'
    } else {
      return `PORCENTAJE ${this.typePriceCtrl.value.porcentage}%`
    }
  }

  addNewProduct() {
    this.products.push(new QuotationRequestProduct(0, 1, 1, '', '', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, '0', 0, 0))
    this.loadProducts()
  }


  openCatalogProducts() {
    if (this.form.value.id_client) {
      const dialogRef = this.dialog.open(QuotationProductsInventoryComponent, {
        width: this.modalWidth,
        height: 'auto',
        data: { selectedProducts: this.products, listPrice: this.typePriceCtrl.value }
      })
      dialogRef.componentInstance.dataChange.subscribe((data) => {
        this.products = data
        this.calculateAllProducts()
        this.loadProducts()
      })
      dialogRef.componentInstance.removeProduct.subscribe((data) => {
        this.deleteProduct(data)
      })
    } else {
      Swal.fire({ title: 'ERROR', text: 'NO HAZ SELECCIONADO UN CLIENTE', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }

  openCatalogClients(): void {
    const dialogRef = this.dialog.open(CatalogClientsComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.form.controls['client'].setValue(result.name)
        this.form.controls['id_client'].setValue(result.id)
        this.typePriceCtrl.setValue(this.types_prices.filter(x => x.id == result.id_type_price)[0])
        this.setTypePrice()
      }
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadProducts() {
    this.dataProducts = new MatTableDataSource(this.products)
  }

  setTypePrice() {
    this.form.controls['id_list_price'].setValue(this.typePriceCtrl.value.id)
    this.calculateAllProducts()
  }

  calculateAllProducts() {
    this.products.forEach((item, index) => {
      this.calculateValors(index)
    })
  }

  loadTypePrices() {
    this._listPriceService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.types_prices = resp
      },
      complete: () => {
        this.loadComponentSelectTypePrice()
        this.loadData()
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  deleteProduct(product: QuotationRequestProduct) {
    this.products = this.products.filter(item => item.id !== product.id)
    this.loadProducts()
  }

  deleteProductByIndex(index: number) {
    this.products.splice(index, 1)
    this.loadProducts()
  }

  validateAmount(index: number) {
    if (this.products[index].amount < 1) {
      this.products[index].amount = 1
    }
    if (this.products[index].amount_pieces < 1) {
      this.products[index].amount_pieces = 1
    }
    this.calculateValors(index)
  }


  validatePrice(index: number) {
    if (this.products[index].price < 0) {
      this.products[index].price = 0
    }
    this.calculateValors(index)
  }

  setValues(quotationRequest: QuotationRequest) {
    this.form.controls['id_client'].setValue(quotationRequest.id_client)
    this.form.controls['id'].setValue(quotationRequest.id)
    this.form.controls['client'].setValue(quotationRequest.client)
    this.form.controls['comments'].setValue(quotationRequest.comments)
    this.form.controls['total_invest'].setValue(quotationRequest.total_invest)
    this.typePriceCtrl.setValue(this.types_prices.filter(x => x.id == quotationRequest.id_list_price)[0])
    this.products = quotationRequest.products
    this.calculateAllProducts()
    this.loadProducts()
    this.setTypePrice()
  }

  loadData() {
    this._quotationRequestService.getData(this.idQuotationRequest).subscribe({
      next: (resp) => {
        console.log(resp)
        this.setValues(resp)
      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })



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


  calculateValors(i: number) {
    if (this.products[i].id_product == 0) {
      this.products[i].total_percentage = 0
    } else {
      this.products[i].total_percentage = (this.typePriceCtrl.value.porcentage * this.products[i].price_without_percentage) / 100
      this.products[i].price = (this.products[i].price_without_percentage + this.products[i].total_percentage)
    }
    this.products[i].price_unit = (this.products[i].price) / this.products[i].amount_pieces
    this.products[i].sub_total = this.products[i].price * this.products[i].amount
    this.products[i].tax = this.products[i].sub_total * 0.16
    this.products[i].total = this.products[i].sub_total + this.products[i].tax
  }

  validateProducts() {
    let i = 0
    let isValid = true
    while (i < this.products.length) {
      if (this.products[i].code == '' || this.products[i].description == '' || this.products[i].amount_pieces < 1) {
        isValid = false
        i = this.products.length
      }
      i++
    }
    return isValid
  }


  update() {
    if (this.validateProducts()) {
      this.loading = true
      this._quotationRequestService.update(this.form.value, this.products).subscribe({
        next: (resp) => {
          Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.loading = false
        },
        error: (err) => {
          this.loading = false
          console.log(err)
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })

        },
      })
    } else {
      this.loading = false
      Swal.fire({ title: 'ERROR', text: 'ALGUNOS PRODUCTOS NO ESTAN COMPLETO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }

  ngOnInit(): void {

    this.loadTypePrices()
  }

}
