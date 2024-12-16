import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import {
  setPagePaymentPlugin,
  setSearchPaymentPlugin,
} from 'src/app/state/actions/filter-payment-plugin.actions';
import { Store } from '@ngrx/store';
import {
  selectPagePaymentPlugin,
  selectSearchPaymentPlugin,
} from 'src/app/state/selectors/filter-payment-plugin.selector';

import { Delivery } from 'src/app/models/delivery.model';
import {
  setPageDelivery,
  setSearchDelivery,
} from 'src/app/state/actions/filter-delivery.actions';
import { DeliveryService } from 'src/app/services/delivery.service';
import { PdfViewComponent } from '../store/components/pdf-view/pdf-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
})
export class DeliveriesComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  error_msg: string = '';
  inactive: boolean = false;
  displayedColumns: string[] = [
    'number',
    'date',
    'driver',
    'truck',
    'type_delivery',
    'status',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false;
  colBig!: number;
  colMedium!: number;
  steps!: string[];
  numberPage: number = 1;
  totalPages: number = 1;
  dataPDFDeliveryFinished: string = '';
  deliveries: Delivery[] = [];
  search: Observable<string> = new Observable();
  modalWidth: string = '';
  pageState: Observable<number> = new Observable();
  valueSearch: string = '';
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchDelivery({ search: this.dataSource.filter }));
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<any>,
    private _deliveryService: DeliveryService,
    private _router: Router,
    private dialog: MatDialog,
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
            this.colMedium = 12;
            this.modalWidth = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '80%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '80%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '50%';
          }

        }
      });

    this.search = this.store.select(selectSearchPaymentPlugin);
    this.pageState = this.store.select(selectPagePaymentPlugin);
  }
  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }
  printFile() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: {
        data: this.dataPDFDeliveryFinished,
        sendEmail: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
      }
    });
  }

  getDataDeliveryPDF(id_delivery: number) {
    this.loading = true;

    this._deliveryService.getDeliveryPDF(id_delivery.toString()).subscribe({
      next: (resp) => {
        console.log(resp);
        this.dataPDFDeliveryFinished = resp;
      },
      complete: () => {
        this.printFile();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPageDelivery({ page: this.numberPage }));
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this._deliveryService.getDeliveries(this.numberPage).subscribe({
      next: (resp) => {
        console.log(resp);
        this.totalPages = resp.total_pages;
        this.dataSource = new MatTableDataSource(resp.deliveries);
      },
      complete: () => {
        this.dataSource.sort = this.sort;
        this.applySearch();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.error = true;
        this.error_msg = err.error.message;
      },
    });
  }

  clearPage() {
    this.store.dispatch(setPageDelivery({ page: 1 }));
  }

  ngOnInit(): void {
    this.pageState.subscribe((response: number) => {
      this.numberPage = response;
    });

    this.search.subscribe((response: string) => {
      this.valueSearch = response;
    });

    this.loadData();
  }
}
