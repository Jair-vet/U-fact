import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EntryPurchase } from 'src/app/models/entry-purchase.model';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { User } from 'src/app/models/user.model';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entries-by-purchase-order',
  templateUrl: './entries-by-purchase-order.component.html',
  styleUrls: ['./entries-by-purchase-order.component.scss']
})
export class EntriesByPurchaseOrderComponent implements OnInit {
  error = false
  error_msg = ''
  loading: boolean = true
  displayedColumns: string[] = ['batch', 'description', 'amount_entries', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>;
  entries: EntryPurchase[] = []
  colBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  user!: User
  constructor(@Inject(MAT_DIALOG_DATA) public data: PurchaseOrder, private _router: Router, public dialogRef: MatDialogRef<EntriesByPurchaseOrderComponent>, private breakpointObserver: BreakpointObserver, private _purchaseOrderService: PurchaseOrderService, private _userService: UserService, private _routingService: RoutingService) {
    this.user = this._userService.user
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




  seeEntry(entry: EntryPurchase) {
    console.log(entry)
    if (entry.id_status == 1) {
      this.closeDialog()
      this._routingService.setRouting(`dashboard/entries/detail-entry/${entry.id_entry}`, `dashboard/entries/purchase-orders`)
      this._router.navigateByUrl(`dashboard/entries/detail-entry/${entry.id_entry}`)
    } else {
      Swal.fire({ title: 'ERROR', text: 'LA ENTRADA HA SIDO RECHAZADA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }


  loadData() {
    console.log(this.data)

    this.loading = true
    this._purchaseOrderService.getEntriesByPurchaseOrder(this.data.id).subscribe({
      next: (resp) => {
        this.entries = resp
        this.dataSource = new MatTableDataSource(this.entries);
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
