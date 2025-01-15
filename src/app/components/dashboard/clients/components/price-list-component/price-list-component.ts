import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ListRequestProduct } from 'src/app/models/list-request-product.model';

@Component({
  selector: 'app-price-list-component',
  templateUrl: './price-list-component.html',
  styleUrls: ['./price-list-component.scss'],
})
export class PriceProductsComponent implements OnInit {
  waiting = false;
  error = false;
  error_msg = '';
  loading: boolean = true;
  objectsNoFound: number = 0;
  products: ListRequestProduct[] = [];
  displayedColumns: string[] = ['id', 'label', 'description', 'porcentage', 'select'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;
  @Output() removeProduct: EventEmitter<ListRequestProduct> = new EventEmitter<ListRequestProduct>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PriceProductsComponent>,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
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
            this.colSmall = 12;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.colSmall = 6;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 6;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 9;
            this.colMedium = 6;
            this.colSmall = 3;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 9;
            this.colMedium = 6;
            this.colSmall = 3;
          }
        }
      });
  }

  closeDialog() {
    this.dialogRef.close(this.data.selectProducts);
  }

  loadData() {
    this.waiting = true;
    this.loading = true;

    if (this.data && Array.isArray(this.data.listPrice)) {
      const selectProductsWithIds = this.data.selectProducts.map((selectedProduct : ListRequestProduct) => ({
        ...selectedProduct,
        uniqueId: `product-${this.data.listPrice.findIndex((p : ListRequestProduct) => p.id === selectedProduct.id)}-${selectedProduct.id}`,
      }));

      this.products = this.data.listPrice.map((product: ListRequestProduct, index: number) => {
        const uniqueId = `product-${index}-${product.id}`;
        const isSelected = selectProductsWithIds.some(
          (selectedProduct: ListRequestProduct) => selectedProduct.uniqueId === uniqueId
        );

        return {
          ...product,
          isSelected, // Marca los productos previamente seleccionados
          uniqueId, // Identificador único
        };
      });

      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
      this.loading = false;

      // Forzar la actualización de la vista
      this.cdr.detectChanges();
    } else {
      this.error = true;
      this.error_msg = 'No se encontraron productos seleccionados.';
      this.loading = false;
    }
  }

  // Verificar si un producto está seleccionado
  checkItemSelect(product: ListRequestProduct): boolean {
    return this.data.selectProducts.some(
      (selectedProduct: ListRequestProduct) => selectedProduct.id === product.id
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  selectProduct(product: ListRequestProduct, select: boolean) {
    const productIndex = this.products.findIndex((p) => p.uniqueId === product.uniqueId);

    if (productIndex !== -1) {
      this.products[productIndex].isSelected = select;
    }

    if (select) {
      const existingProductIndex = this.data.selectProducts.findIndex(
        (item: ListRequestProduct) => item.uniqueId === product.uniqueId
      );

      if (existingProductIndex === -1) {
        this.data.selectProducts.push({ ...product });
      }
    } else {
      const productIndex = this.data.selectProducts.findIndex(
        (item: ListRequestProduct) => item.uniqueId === product.uniqueId
      );

      if (productIndex > -1) {
        this.data.selectProducts.splice(productIndex, 1);
      }
    }

    // Emitir los cambios al componente padre en tiempo real
    this.dataChange.emit(this.data.selectProducts);
  }
}
