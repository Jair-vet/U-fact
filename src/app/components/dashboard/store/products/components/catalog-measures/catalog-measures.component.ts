import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MeasureService } from 'src/app/services/measure.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-catalog-measures',
    templateUrl: './catalog-measures.component.html',
    styleUrls: ['./catalog-measures.component.scss']
})

export class CatalogMeasuresComponent {
    loading: Boolean = false
    isDisabled: BooleanInput = false
    displayedColumns: string[] = ['label', 'actions'];
    dataSource!: MatTableDataSource<any>;
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    @ViewChild(MatSort) sort!: MatSort;
    constructor(private _measureService: MeasureService, private _userService: UserService, private dialogRef: MatDialogRef<CatalogMeasuresComponent>) {
        this.loadData()
    }

    loadData() {
        this.loading = true
        this._measureService.getAllData(this._userService.user.id_company.toString()).subscribe({
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
