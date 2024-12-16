import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ProductRawMaterial, PurchaseOrder } from 'src/app/models/purchase-order.model';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';


@Component({
  selector: 'app-edit-current-purchase-order',
  templateUrl: './edit-current-purchase-order.component.html',
  styleUrls: ['./edit-current-purchase-order.component.scss']
})
export class EditCurrentPurchaseOrderComponent implements OnInit {


  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: Boolean = true
  stores!: Store[]
  form: FormGroup
  public storeCtrl: FormControl = new FormControl();
  public storeFilterCtrl: FormControl = new FormControl();
  public filteredStore: ReplaySubject<Store[]> = new ReplaySubject<Store[]>(1);
  displayedColumnsProducts: string[] = ['amount', 'sub_total', 'description', 'type', 'inventory', 'provider', 'actions'];
  dataSourceProducts!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() removeProduct: EventEmitter<ProductRawMaterial> = new EventEmitter<ProductRawMaterial>()

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: PurchaseOrder, private _formBuider: FormBuilder, private _storeService: StoreService, public dialogRef: MatDialogRef<EditCurrentPurchaseOrderComponent>, private breakpointObserver: BreakpointObserver) {

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
    })
    this.form = this._formBuider.group({
      comments: [''],
    })
  }

  closeDialog() {
    this.dialogRef.close();

  }

  updateComments() {
    this.data.comments = this.form.value.comments
    this.dataChange.emit(this.data);
  }

  loadData() {
    this.updateTableProducts()
    this.loadStores()
  }

  setFields() {
    this.storeCtrl.setValue(this.stores.filter(x => x.id == this.data.id_store)[0])
    this.form.controls['comments'].setValue(this.data.comments)
  }


  deleteProduct(product: ProductRawMaterial) {
    this.removeProduct.emit(product)
    this.updateTableProducts()
    if (this.data.products.length == 0) {
      this.closeDialog()
    }
  }

  updateTableProducts() {
    this.dataSourceProducts = new MatTableDataSource(this.data.products);
  }


  updateValorsProduct(product: ProductRawMaterial) {
    product.sub_total = Number((product.quantity * product.price_without_iva).toFixed(2))
    this.dataChange.emit(this.data)
  }

  setStore() {
    this.data.id_store = this.storeCtrl.value.id
    this.data.store = this.storeCtrl.value.name
    this.dataChange.emit(this.data)
  }

  loadStores() {
    this._storeService.getAllData(false).subscribe({
      next: (resp) => {
        this.stores = resp
      },
      complete: () => {
        this.setFields()
        this.loading = false
        this.loadComponentSelectStore()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
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

  loadComponentSelectStore() {
    this.filteredStore.next(this.stores.slice());
    this.storeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStore();
      });
  }

  ngOnInit(): void {
    this.loadData()
  }


}
