import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { LogEntryDeparture } from 'src/app/models/log-entry-departure.model';
import { User } from 'src/app/models/user.model';
import { KardexService } from 'src/app/services/kardex.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import { SeeEntryDepartureComponent } from '../see-entry-departure/see-entry-departure.component';

@Component({
  selector: 'app-kardex-entries-departures',
  templateUrl: './kardex-entries-departures.component.html',
  styleUrls: ['./kardex-entries-departures.component.scss']
})
export class KardexEntriesDeparturesComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  displayedColumns: string[] = ['product', 'amount', 'store_inventory', 'date', 'type', 'actions'];
  dataSource!: MatTableDataSource<LogEntryDeparture>;
  isDisabled: boolean = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  idProduct!: string
  path: string = 'dashboard/products'
  totalDepartures: number = 0
  totalEntries: number = 0
  dateStart: Date = new Date()
  dateEnd: Date = new Date()
  range = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _route: ActivatedRoute, private dialog: MatDialog, private _routingService: RoutingService, private _router: Router, private breakpointObserver: BreakpointObserver, private _kardexService: KardexService) {

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
          this.modalWidth = '100%'

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.modalWidth = '100%'

        }

        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 9
          this.colMedium = 3
          this.modalWidth = '75%'

        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '60%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '50%'

        }
      }
    })
    this.idProduct = this._route.snapshot.paramMap.get('id') || '0'
  }

  setDates() {
    if (!(this.range.controls['end'].hasError('matEndDateInvalid') || this.range.controls['start'].hasError('matStartDateInvalid')) && !(this.range.value.end == null || this.range.value.start == null)) {
      this.dateStart = this.range.value.start
      this.dateEnd = this.range.value.end
      this.dateStart = this.changeHourToDate(this.dateStart, 0, 0, 0)
      this.dateEnd = this.changeHourToDate(this.dateEnd, 23, 59, 59)
      this.loadData()
    }
  }

  changeHourToDate(date: Date, h: number, m: number, s: number) {
    date.setHours(h)
    date.setMinutes(m)
    date.setSeconds(s)
    return date
  }

  openDetail(data: LogEntryDeparture) {
    if (data.id_type == 2 || data.id_type == 4 || data.id_type == 5) {
      const dialogRef = this.dialog.open(SeeEntryDepartureComponent, {
        disableClose: false,
        width: this.modalWidth,
        height: 'auto',
        data: data
      })
    }

  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }

  loadData() {
    this.loading = true
    this._kardexService.getLogEntriesDeparturesByProduct(this.idProduct, this.dateStart, this.dateEnd).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataSource = new MatTableDataSource(resp.logs);
        this.totalDepartures = resp.totalDepartures
        this.totalEntries = resp.totalEntries

        this.loading = false

      },
      complete: () => {

        this.dataSource.sort = this.sort;
        this.isDisabled = false

      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },

    })

  }

  ngOnInit(): void {
    this.initDates()
  }

  initDates() {
    this.dateStart.setMonth(this.dateStart.getMonth() - 1)
    this.dateStart = this.changeHourToDate(this.dateStart, 5, 59, 59)
    this.dateEnd = this.changeHourToDate(this.dateEnd, 23, 59, 59)
    this.range.get('start')?.setValue(this.dateStart)
    this.range.get('end')?.setValue(this.dateEnd)
    this.loadData()
  }

}
