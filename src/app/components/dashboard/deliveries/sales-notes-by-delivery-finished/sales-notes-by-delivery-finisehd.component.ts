import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Departure } from 'src/app/models/departure.model';
import { DepartureService } from 'src/app/services/departure.service';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';

@Component({
    selector: 'app-sales-notes-by-delivery-finished',
    templateUrl: './sales-notes-by-delivery-finished.component.html',
    styleUrls: ['./sales-notes-by-delivery-finished.component.scss'],
})
export class SalesNotesByDeliveryFinishedComponent implements OnInit {
    error = false;
    error_msg = '';

    loading: Boolean = true;
    departures: Departure[] = [];

    isDisabled: BooleanInput = false;
    displayedColumns: string[] = ['folio', 'comments', 'date', 'actions'];
    dataSource!: MatTableDataSource<any>;
    colBig!: number;
    colXBig!: number;
    colMedium!: number;
    colSmall!: number;
    modalWidth!: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Departure[],
        private dialog: MatDialog,
        private _departureService: DepartureService,
        private breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
            ])
            .subscribe((result) => {
                if (result.matches) {
                    if (result.breakpoints[Breakpoints.XSmall]) {
                        this.colBig = 12;
                        this.colSmall = 12;
                    }
                    if (result.breakpoints[Breakpoints.Small]) {
                        this.colBig = 12;
                        this.colMedium = 12;
                        this.colSmall = 6;
                    }
                    if (result.breakpoints[Breakpoints.Medium]) {
                        this.colBig = 12;
                        this.colMedium = 6;
                        this.colSmall = 6;
                    }
                    if (result.breakpoints[Breakpoints.Large]) {
                        this.colBig = 9;
                        this.colMedium = 6;
                        this.colSmall = 3;
                    }
                    if (result.breakpoints[Breakpoints.XLarge]) {
                        this.colBig = 9;
                        this.colMedium = 6;
                        this.colSmall = 3;
                    }
                }
            });
    }
    printFile(departure: Departure) {
        this.departures = [];
        this.departures.push(departure);
        const dialogRef = this.dialog.open(PdfViewComponent, {
            width: '50%',
            height: 'auto',
            data: {
                data: this.data,
                id_client: departure.id_client,
                type: 'departures',
                pdf_elements: this.departures,
                sendEmail: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result != '') {
            }
        });
    }

    getDataSaleNotePDF(departure: Departure) {
        this.loading = true;
        departure.select_sale_note = true;
        departure.select_packing_list = false;
        this._departureService.getSaleNote(departure.id.toString()).subscribe({
            next: (resp) => {
                this.data = resp;
            },
            complete: () => {
                this.printFile(departure);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            },
        });
    }
    loadData() {
        console.log(this.data);
        this.dataSource = new MatTableDataSource(this.data);
        this.loading = false;
    }
    ngOnInit(): void {
        this.loadData();
    }
}