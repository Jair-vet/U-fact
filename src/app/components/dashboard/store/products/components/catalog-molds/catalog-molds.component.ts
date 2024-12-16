import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MoldService } from 'src/app/services/mold.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'app-catalog-molds',
    templateUrl: './catalog-molds.component.html',
    styleUrls: ['./catalog-molds.component.scss']
})
export class CatalogMoldsComponent {

    loading: Boolean = false
    isDisabled: BooleanInput = false
    displayedColumns: string[] = ['label', 'actions'];
    dataSource!: MatTableDataSource<any>;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private _moldService: MoldService, private _userService: UserService, private dialogRef: MatDialogRef<CatalogMoldsComponent>) {
        this.loadData()
    }

    loadData() {
        this.loading = true
        this._moldService.getAllData(this._userService.user.id_company.toString()).subscribe({
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
        this.dialogRef.close()
    }



}
