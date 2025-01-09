import {Component,EventEmitter,Inject,OnInit,Output,ViewChild,ChangeDetectorRef,} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ListRequestProduct } from 'src/app/models/list-request-product.model';
import { MatIconModule } from '@angular/material/icon';

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
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  @Output() removeProduct: EventEmitter<ListRequestProduct> = new EventEmitter<ListRequestProduct>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    public dialogRef: MatDialogRef<PriceProductsComponent>,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
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
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadData() {
    this.waiting = true
    this.loading = true

    if (this.data && Array.isArray(this.data.listPrice)) {
      if (!Array.isArray(this.data.selectProducts)) {
        this.data.selectProducts = [];
      }

      // Inicializar la lista de productos con la propiedad `isSelected`
      this.products = this.data.listPrice.map((product: ListRequestProduct, index: number) => {
        const isSelected = this.data.selectProducts.some(
          (selectedProduct: ListRequestProduct) => selectedProduct.id_product === product.id_product
        );
  
        return {
          ...product,
          isSelected, 
          uniqueId: `product-${index}-${product.id_product}`,
        };
      });

      // Configuramos la fuente de datos para la tabla
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
      this.loading = false;
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
      (selectedProduct: ListRequestProduct) => selectedProduct.id_product === product.id_product
    );
  }

  ngOnInit(): void {
    this.loadData(); 
  }

  selectProduct(product: ListRequestProduct, select: boolean) {
    if (!product.id) {
      console.error('El id no está definido para este producto:', product);
      return;
    }
  
    // Encuentra el índice del producto en la lista de productos
    const productIndex = this.products.findIndex((p) => p.id === product.id);
    if (productIndex !== -1) {
      this.products[productIndex].isSelected = select;
    }
  
    if (select) {
      const selectedProduct = {
        ...product,
        uniqueId: `product-${product.id}`,
      };
  
      const existingProductIndex = this.data.selectProducts.findIndex(
        (item: ListRequestProduct) => item.id === selectedProduct.id
      );

      if (existingProductIndex === -1) {
        this.data.selectProducts.push(selectedProduct);
      }
  
    } else {
      // Remover si está deseleccionado
      const productIndex = this.data.selectProducts.findIndex(
        (item: ListRequestProduct) => item.id === product.id
      );
  
      if (productIndex > -1) {
        this.data.selectProducts.splice(productIndex, 1);
      }
    }
    this.dataChange.emit(this.data.selectProducts);
  }


  
}
