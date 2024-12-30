import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  objectsNoFound: number = 0;
  loading: boolean = true;
  products: ListRequestProduct[] = [];
  displayedColumns: string[] = ['id', 'label', 'description', 'porcentage', 'select'];
  dataSource!: MatTableDataSource<ListRequestProduct>;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;

  @Output() removeProduct: EventEmitter<ListRequestProduct> = new EventEmitter<ListRequestProduct>();
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  protected _onDestroy = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  // Arreglo para almacenar los productos seleccionados
  selectedProduct: number | null = null; // Solo un ID seleccionado a la vez

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

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    console.log(this.data);

    if (this.data && Array.isArray(this.data.listPrice)) {
      this.products = this.data.listPrice;

      // Inicializamos el dataSource para la tabla
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Verificar si un producto está seleccionado
  checkItemSelect(product: ListRequestProduct) {
    return this.selectedProduct === product.id_product; // Verifica si el ID del producto es el seleccionado
  }

  // Manejar la selección de productos
  toggleSelection(item: ListRequestProduct, select: boolean) {
    if (select) {
      // Si seleccionamos un producto, lo asignamos a selectedProduct
      this.selectedProduct = item.id_product; // Solo se puede seleccionar un producto a la vez
    } else {
      // Si desmarcamos, lo quitamos del arreglo
      this.selectedProduct = null; // Desmarcar el producto
    }

    // Emitir el producto seleccionado o nulo
    this.dataChange.emit(this.selectedProduct);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // Función para obtener el ID del producto seleccionado
  getSelectedProductId() {
    return this.selectedProduct;
  }
}
