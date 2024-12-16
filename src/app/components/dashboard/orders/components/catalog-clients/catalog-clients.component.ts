import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientService } from 'src/app/services/client.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-catalog-clients',
  templateUrl: './catalog-clients.component.html',
  styleUrls: ['./catalog-clients.component.scss']
})
export class CatalogClientsComponent {

  loading: Boolean = false
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['number', 'name', 'rfc', 'actions'];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _clientService: ClientService, private _userService: UserService, public dialogRef: MatDialogRef<CatalogClientsComponent>) {
    this.loadData()
  }

  loadData() {
    this.loading = true
    this._clientService.getClients(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
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

  closeDialog() {
    this.dialogRef.close();
  }



}
