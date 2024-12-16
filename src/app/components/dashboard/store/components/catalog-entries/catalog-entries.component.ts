import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EntryService } from 'src/app/services/entry.service';






@Component({
    selector: 'app-catalog-entries',
    templateUrl: './catalog-entries.component.html',
    styleUrls: ['./catalog-entries.component.scss']
})
export class CatalogEntriesComponent {

    loading: Boolean = false
    isDisabled: BooleanInput = false
    displayedColumns: string[] = ['batch', 'amount_entries', 'number_samples', 'completed_samples', 'status'];
    dataSource!: MatTableDataSource<any>;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatSort) sort!: MatSort;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _entryService: EntryService) {
        this.loadData()
    }
    loadData() {

        this.loading = true
        console.log(this.data.data.id_product)
        this._entryService.getAllData(this.data.data.id_product.toString()).subscribe({
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
