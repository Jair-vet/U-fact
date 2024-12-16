import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TradenameService } from 'src/app/services/tradename.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-catalog-tradenames',
  templateUrl: './catalog-tradenames.component.html',
  styleUrls: ['./catalog-tradenames.component.scss']
})
export class CatalogTradenamesComponent {

  loading: Boolean = false
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['name', 'provider', 'actions'];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _tradenameService: TradenameService, private _userService: UserService) {
    this.loadData()
  }

  loadData() {
    this.loading = true
    this._tradenameService.getTradenamesForCompany(this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.dataSource = resp;
        console.log(resp)
      },
      complete: () => {
        this.loading = false
        this.dataSource.sort = this.sort;
        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }
}
