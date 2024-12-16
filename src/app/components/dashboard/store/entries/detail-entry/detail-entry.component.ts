import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from 'src/app/models/inventory.model';
import { EntryService } from 'src/app/services/entry.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { PdfViewComponent } from '../../components/pdf-view/pdf-view.component';
import { MatDialog } from '@angular/material/dialog';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-detail-entry',
  templateUrl: './detail-entry.component.html',
  styleUrls: ['./detail-entry.component.scss']
})
export class DetailEntryComponent implements OnInit {
  loading = true
  error = false
  inventory: Inventory[] = []
  error_msg: string = ''
  id_entry: string = '0'
  displayedColumnsInventory: string[] = ['number', 'batch', 'date', 'status'];
  dataSourceInventory!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colXBig!: number
  colMedium!: number;
  colSmall!: number;
  data: string = ''
  path: string = 'dashboard/entries'
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInventory.filter = filterValue.trim().toLowerCase();
  }

  constructor(private _routingService: RoutingService, private dialog: MatDialog, private _route: ActivatedRoute, private _entryService: EntryService, private _inventoryService: InventoryService, private breakpointObserver: BreakpointObserver, private _router: Router) {
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
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
        }
      }
    });
    this.id_entry = this._route.snapshot.paramMap.get('id') || '0'
    this._routingService.setRouting(`dashboard/entries/detail-entry/${this.id_entry}`, this._routingService.previousRoute.includes('generate') ? `dashboard/entries` : this._routingService.previousRoute)
  }

  viewPDF(id_client: number, sendEmail: boolean) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.data, id_client: id_client, type: 'entries', sendEmail: sendEmail }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
      }
    });
  }

  loadData() {
    this._inventoryService.getData(this.id_entry.toString(), '1').subscribe({
      next: (resp) => {
        this.inventory = resp
        this.dataSourceInventory = new MatTableDataSource(resp);
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


  getTagsDataPDF() {
    this.loading = true
    this._inventoryService.getTags(this.id_entry.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.data = resp
      },
      complete: () => {
        this.viewPDF(0, false)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }
  getCertDataPDF() {
    this.loading = true
    this._inventoryService.getCert(this.id_entry.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.data = resp
      },
      complete: () => {
        this.viewPDF(0, false)
        this.loading = false
      },
      error: (err) => {
        this.loading = false
      },
    })
  }

  cancel() {
    this._router.navigateByUrl(this._routingService.previousRoute == '' ? 'dashboard/products' : this._routingService.previousRoute)

  }

  ngOnInit(): void {
    this.loadData()
  }

}
