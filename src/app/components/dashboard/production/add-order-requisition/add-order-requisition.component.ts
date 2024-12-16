import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Store } from 'src/app/models/store.model';
import { ProductRequisitionService } from 'src/app/services/product-requisition.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { CatalogProductsRequisitionsComponent } from '../components/catalog-products-requisitions/catalog-products-requisitions.component';
import { Requisition } from 'src/app/models/requisition.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { BooleanInput } from '@angular/cdk/coercion';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-add-order-requisition',
  templateUrl: './add-order-requisition.component.html',
  styleUrls: ['./add-order-requisition.component.scss']
})
export class AddOrderRequisitionComponent implements OnInit {

  loading = true

  error: boolean = false
  error_msg: string = ''
  panelOpenState = false
  stores!: Store[]

  form: FormGroup
  public storeCtrl: FormControl = new FormControl();
  public storeFilterCtrl: FormControl = new FormControl();
  public filteredStore: ReplaySubject<Store[]> = new ReplaySubject<Store[]>(1);

  displayedColumnsProductsRequisitions: string[] = ['amount', 'code', 'description', 'inventory', 'comments', 'actions'];

  dataProductsRequisitions!: MatTableDataSource<any>;

  isDisabled: BooleanInput = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  path: string = 'dashboard/production'
  steps!: string[]


  @ViewChild(MatSort) sort!: MatSort;
  colXBig!: number
  colSmall!: number;
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();
  constructor(private _storeService: StoreService, private _productsRequisitionsService: ProductRequisitionService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _requisitionService: RequisitionService) {

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
          this.modalWidth = '50%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '40%'
        }
      }
    });
    this.form = this._formBuider.group({
      comments_global: [''],
      productor: ['', Validators.required],
      id_productor: ['', Validators.required],
      id_store: ['', Validators.required],
      id_company: ['']
    })
  }


  updateProductsRequisitions(index: number) {
    if (this._productsRequisitionsService.products_requisitions[index].amount < 1) {
      this._productsRequisitionsService.products_requisitions[index].amount = 1
    }
  }


  openCatalogProducts(): void {
    const dialogRef = this.dialog.open(CatalogProductsRequisitionsComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadProductsRequisitions();
      }
    });
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }


  loadProductsRequisitions() {
    this.dataProductsRequisitions = new MatTableDataSource(this._productsRequisitionsService.products_requisitions)
  }


  setStore() {
    this.form.controls['id_store'].setValue(this.storeCtrl.value.id)
  }

  deleteProductRequisition(index: number) {
    this._productsRequisitionsService.products_requisitions.splice(index, 1)
    this.dataProductsRequisitions = new MatTableDataSource(this._productsRequisitionsService.products_requisitions);
  }

  setFields() {
    this.form.controls['id_store'].setValue('')
    this.form.controls['comments_global'].setValue('')
  }

  create() {
    this.loading = true
    if (this._productsRequisitionsService.products_requisitions.length > 0) {
      this.form.controls['id_company'].setValue(this._userService.user.id_company)
      this._requisitionService.create(this.form.value, this._productsRequisitionsService.products_requisitions).subscribe({
        next: (resp) => {
          this._productsRequisitionsService.products_requisitions = []
          this.setFields()
          this.loadStores()
          this.loadProductsRequisitions()
          Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        error: (err) => {
          this.loading = false
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
      })
    } else {
      this.loading = false
      Swal.fire({ title: 'ERROR', text: 'NO HAZ INGRESADO NINGUN PRODUCTO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }


  loadStores() {
    this._storeService.getAllData(false).subscribe({
      next: (resp) => {
        this.stores = resp
      },
      complete: () => {
        this.loadComponentSelecStore()
        this.loadProductor()

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  protected setInitialValue() {
    this.filteredStore
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Store, b: Store) => a && b && a.id === b.id;
      });

  }


  protected filterStore() {
    if (!this.stores) {
      return;
    }
    let search = this.storeFilterCtrl.value;
    if (!search) {
      this.filteredStore.next(this.stores.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStore.next(
      this.stores.filter(stores => stores.name.toLowerCase().indexOf(search) > -1)
    );
  }


  loadComponentSelecStore() {
    this.filteredStore.next(this.stores.slice());
    this.storeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStore();
      });
  }

  loadProductor() {
    this.form.controls['id_productor'].setValue(this._userService.user.id)
    this.form.controls['productor'].setValue(this._userService.user.name)
    this.setFields()
    this.loading = false
  }

  ngOnInit(): void {
    this.loadStores()
  }

}
