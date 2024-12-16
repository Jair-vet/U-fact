import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Delivery } from 'src/app/models/delivery.model';

import { User } from 'src/app/models/user.model';
import { DeliveryService } from 'src/app/services/delivery.service';

import { UserService } from 'src/app/services/user.service';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';
import { Departure } from 'src/app/models/departure.model';
import { SalesNotesByDeliveryFinishedComponent } from '../sales-notes-by-delivery-finished/sales-notes-by-delivery-finisehd.component';

@Component({
    selector: 'app-see-delivery',
    templateUrl: './see-delivery.component.html',
    styleUrls: ['./see-delivery.component.scss'],
})
export class SeeDeliveryComponent implements OnInit {
    loading = true;
    error = false;
    error_msg: string = '';
    delivery!: Delivery;
    user!: User;

    colBig!: number;
    colXBig!: number;
    colMedium!: number;
    colSmall!: number;
    modalWidth: string = '100%';

    idDelivery: string = '0';
    displayedColumns: string[] = [
        'client',
        'address',
        'date',
        'status',
        'actions',
    ];
    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatSort) sort!: MatSort;
    isDisabled: BooleanInput = false;

    protected _onDestroy = new Subject<void>();

    constructor(
        private _route: ActivatedRoute,

        private breakpointObserver: BreakpointObserver,
        private dialog: MatDialog,
        private _router: Router,
        private _userService: UserService,
        private _deliveryService: DeliveryService
    ) {
        this.user = this._userService.user;

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
                        this.colMedium = 12;
                        this.colSmall = 12;
                        this.colXBig = 12;
                        this.modalWidth = '100%';
                    }
                    if (result.breakpoints[Breakpoints.Small]) {
                        this.colBig = 12;
                        this.colMedium = 12;
                        this.colSmall = 6;
                        this.colXBig = 12;
                        this.modalWidth = '100%';
                    }
                    if (result.breakpoints[Breakpoints.Medium]) {
                        this.colBig = 12;
                        this.colMedium = 4;
                        this.colSmall = 4;
                        this.colXBig = 12;
                        this.modalWidth = '80%';
                    }
                    if (result.breakpoints[Breakpoints.Large]) {
                        this.colBig = 6;
                        this.colMedium = 4;
                        this.colSmall = 2;
                        this.colXBig = 10;
                        this.modalWidth = '50%';
                    }
                    if (result.breakpoints[Breakpoints.XLarge]) {
                        this.colBig = 6;
                        this.colMedium = 4;
                        this.colSmall = 2;
                        this.colXBig = 10;
                        this.modalWidth = '50%';
                    }
                }
            });

        this.idDelivery = this._route.snapshot.paramMap.get('id') || '0';
    }

    openSalesNotes(departes: Departure[]) {
        this.dialog.open(SalesNotesByDeliveryFinishedComponent, {
            disableClose: false,
            width: this.modalWidth,
            height: 'auto',
            data: departes,
        });
    }

    loadData() {
        this.loading = true;
        this._deliveryService.getDelivery(this.idDelivery).subscribe({
            next: (resp) => {
                console.log(resp);
                this.delivery = { ...resp };

                this.dataSource = new MatTableDataSource(resp.clients);
            },
            complete: () => {
                this.loading = false;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
                this.error = true;
                this.error_msg = err.error.message;
            },
        });
    }
    cancel() {
        this._router.navigateByUrl('dashboard/deliveries');
    }

    ngOnInit(): void {
        this.loadData();
    }
}