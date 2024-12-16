import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Order } from 'src/app/models/order.model';

import { OrderService } from 'src/app/services/order.service';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { CatalogDeparturesComponent } from './components/catalog-departures/catalog-departures.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { setIdStatusOrders, setPageOrders, setSearchOrders } from 'src/app/state/actions/filter-order.actions';
import { selectIdStatusOrder, selectPageOrder, selectSearchOrder } from 'src/app/state/selectors/filter-order.selector';

@Component({
  selector: 'app-product',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  numberPage: number = 1
  totalPages: number = 0
  total: number = 0
  orders: Order[] = []
  loading: boolean = true
  error: boolean = false
  error_msg: string = ''
  inactive: boolean = false
  displayedColumns: string[] = ['number', 'deadline', 'client', 'seller', 'date', 'status', 'total', 'actions']
  dataSource!: MatTableDataSource<any>
  isDisabled: BooleanInput = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  steps!: string[]
  idType: string = '1'
  search: Observable<string> = new Observable()
  statusState: Observable<string> = new Observable()
  pageState: Observable<number> = new Observable()
  valueSearch: string = ''
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(setSearchOrders({ search: this.dataSource.filter }))
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<any>, private dialog: MatDialog, private _router: Router, private breakpointObserver: BreakpointObserver, private _orderService: OrderService, private _userService: UserService) {

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
          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '70%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '50%'
        }
      }
    });
    this.search = this.store.select(selectSearchOrder)
    this.statusState = this.store.select(selectIdStatusOrder)
    this.pageState = this.store.select(selectPageOrder)

  }



  changeStatus() {
    this.clearPage()
    this.store.dispatch(setIdStatusOrders({ id_status: this.idType }))
    this.loadData()
  }


  openHistory(item: Order) {
    const dialogRef = this.dialog.open(OrderHistoryComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: { data: item }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      console.log('Resultado:', result);
    });
  }

  inactiveRecord(record: Order) {
    Swal.fire({
      title: 'CANCELAR PEDIDO',
      text: '¿ESTAS SEGURO DE CANCEAR EL PEDIDO ' + record.code.toString() + ' CON NUMERO [' + record.number!.toString() + '], ESTA ACCIÓN NO SE PODRÁ REVERTIR',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._orderService.inactive(record.id!.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadData();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
        })
      }
    })
  }

  clearPage() {
    this.store.dispatch(setPageOrders({ page: 1 }))
  }

  openCatalogDepartures(order: Order) {
    const data = { id_order: order.id }
    this.dialog.open(CatalogDeparturesComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: data
    })
  }


  restore(record: Order) {
    Swal.fire({
      title: 'RESTAURAR',
      text: '¿ESTAS SEGURO DE RESTAURAR EL REGISTRO ' + record.code + ' CON NUMERO [' + record.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'RESTARURAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this._orderService.restore(record.id!.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'REGISTRO RESTAURADO', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadData();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR INTENTANDO RESTAURAR EL REGISTRO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
        })
      }
    })
  }

  validateCSD() {
    if (this._userService.user.serial != '' && this._userService.user.postal_code != '') {
      this._router.navigateByUrl('dashboard/orders/create-order')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {
      })
    }
  }

  applySearch() {
    this.dataSource.filter = this.valueSearch
    this.loading = false
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage
      this.store.dispatch(setPageOrders({ page: this.numberPage }))
      this.loadData()
    }
  }

  loadData() {
    this.loading = true
    this._orderService.getAllData(this._userService.user.getIdCompany.toString(), this.idType, this.numberPage).subscribe({
      next: (resp) => {
        this.orders = resp.orders
        this.totalPages = resp.total_pages
        this.total = resp.total
        this.dataSource = new MatTableDataSource(this.orders);

      },
      complete: () => {
        this.dataSource.sort = this.sort;
        this.applySearch()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
        this.error = true
        this.error_msg = err.error.message
      },
    })
  }


  ngOnInit(): void {
    this.statusState.subscribe((response: string) => {
      this.idType = response
    })

    this.pageState.subscribe((response: number) => {
      this.numberPage = response
    })

    this.search.subscribe((response: string) => {
      this.valueSearch = response
    })

    this.loadData()

  }



}
