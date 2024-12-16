import { Component, OnInit, Provider, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProviderService } from 'src/app/services/provider.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent implements OnInit {

  waiting = false
  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: Boolean = true
  providers: Provider[] = []
  displayedColumns: string[] = ['number', 'name', 'rfc', 'select'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ListProvidersComponent>, private breakpointObserver: BreakpointObserver, private _providerService: ProviderService, private _userService: UserService) {

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
    this._providerService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.providers = resp
        this.dataSource = new MatTableDataSource(this.providers);
      },
      complete: () => {
        this.loading = false
        this.waiting = false
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
