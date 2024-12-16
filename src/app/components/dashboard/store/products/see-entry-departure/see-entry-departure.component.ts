import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Inventory } from 'src/app/models/inventory.model';
import { KardexService } from 'src/app/services/kardex.service';

@Component({
  selector: 'app-see-entry-departure',
  templateUrl: './see-entry-departure.component.html',
  styleUrls: ['./see-entry-departure.component.scss']
})
export class SeeEntryDepartureComponent implements OnInit {

  error = false
  error_msg = ''
  displayedColumns: string[] = ['number', 'batch', 'status'];
  dataSource!: MatTableDataSource<Inventory>;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  loading: boolean = false

  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SeeEntryDepartureComponent>, private breakpointObserver: BreakpointObserver, private _kardexService: KardexService) {

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

  }

  loadData() {
    this.loading = true
    this._kardexService.getBoxes(this.data).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.sort = this.sort;

        this.loading = false

      },
      complete: () => {


      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },

    })


  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.loadData()
  }


}
