import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from 'src/app/models/product.model';
import { KardexService } from 'src/app/services/kardex.service';

@Component({
  selector: 'app-catalog-available-inventory',
  templateUrl: './catalog-available-inventory.component.html',
  styleUrls: ['./catalog-available-inventory.component.scss']
})
export class CatalogAvailableInventoryComponent implements OnInit {
  loading: Boolean = false
  product: string = ''
  displayedColumns: string[] = ['number', 'batch', 'status'];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialogRef: MatDialogRef<CatalogAvailableInventoryComponent>, private _kardexService: KardexService) {

  }
  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.product = this.data.description
    this.loading = true

    this._kardexService.getAvailableInventory(this.data.id).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
      },
      complete: () => {
        this.loading = false

        this.loading = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }


  closeDialog() {
    this.dialogRef.close()
  }


}
