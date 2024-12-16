import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductRawMaterial, PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import Swal from 'sweetalert2';
import { EntriesByPurchaseOrderComponent } from '../entries-by-purchase-order/entries-by-purchase-order.component';

@Component({
  selector: 'app-entries-to-purchase-order',
  templateUrl: './entries-to-purchase-order.component.html',
  styleUrls: ['./entries-to-purchase-order.component.scss']
})
export class EntriesToPurchaseOrderComponent implements OnInit {

  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: boolean = true
  displayedColumns: string[] = ['code', 'description', 'quantity', 'total', 'quantity_received', 'quantity_to_received'];
  dataSource!: MatTableDataSource<any>;
  products: ProductRawMaterial[] = []
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  currentStatus!: number

  @Output() entryCreate: EventEmitter<any> = new EventEmitter<any>()


  constructor(@Inject(MAT_DIALOG_DATA) public data: PurchaseOrder, private dialog: MatDialog, public dialogRef: MatDialogRef<EntriesToPurchaseOrderComponent>, private breakpointObserver: BreakpointObserver, private _purchaseOrderService: PurchaseOrderService) {

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

  saveEntries() {
    if (this.validateEntries()) {
      Swal.fire({
        title: `RECEPCIÓN`,
        text: `¿ESTAS SEGURO DE HACER ESTA RECEPCIÓN?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        confirmButtonColor: '#58B1F7',
        reverseButtons: true,
        heightAuto: false,
      }).then(result => {
        if (result.isConfirmed) {


          this.loading = true
          this._purchaseOrderService.entryToRawMaterials(this.products, this.data).subscribe({
            next: (resp) => {
              Swal.fire({ title: 'OK', text: 'RECEPCIÓN EXITOSA', icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })

            },
            complete: () => {
              this.entryCreate.emit(true);
              this.loadData()

            },
            error: (err) => {
              this.loading = false
              console.log(err)
            },
          })
          // Swal.fire({ title: 'ERROR', text: 'AUN NO IMPLEMENTADO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })

        }
      })
    } else {
      Swal.fire({ title: 'ERROR', text: 'ENTRADAS INVALIDAS', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })

    }
  }

  validateEntries() {
    let i = 0
    while (i < this.products.length) {
      if (this.products[i].quantity_to_received != null) {
        if (Number(this.products[i].quantity_to_received + this.products[i].quantity_received) <= this.products[i].quantity) {
          if (this.products[i].quantity_to_received > 0) {
            return true
          }
        } else {
          return false
        }
      } else {
        this.products[i].quantity_to_received = 0
        this.dataSource = new MatTableDataSource(this.products);

      }
      i++
    }
    return false
  }

  openEntries() {
    if (this.data.id_type_inventory == 1) {
      const dialogRef = this.dialog.open(EntriesByPurchaseOrderComponent, {
        width: '80%',
        height: 'auto',
        data: this.data
      })
    }
  }


  loadData() {
    console.log(this.data)

    this.loading = true
    this._purchaseOrderService.getProductsByPurchaseOrder(this.data.id).subscribe({
      next: (resp) => {
        this.products = resp.products
        this.dataSource = new MatTableDataSource(this.products);
      },
      complete: () => {
        this.loading = false

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }



  ngOnInit(): void {
    this.loadData()
  }


}
