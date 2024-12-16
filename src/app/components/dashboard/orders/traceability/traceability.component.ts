import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { HelpService } from 'src/app/services/help.service';
import { UserService } from 'src/app/services/user.service';
import { ClientEmailsComponent } from '../../common/client-emails/client-emails.component';
import { MatDialog } from '@angular/material/dialog';
import { TraceabilityService } from 'src/app/services/traceability.service';
import { Invoice } from 'src/app/models/invoice.model';
import { Order } from 'src/app/models/order.model';
import { OrderHistoryComponent } from '../components/order-history/order-history.component';

@Component({
  selector: 'app-traceability',
  templateUrl: './traceability.component.html',
  styleUrls: ['./traceability.component.scss']
})
export class TraceabilityComponent implements OnInit {

  loading = true
  error = false
  data: any
  user!: User
  order!: Order
  error_msg: string = ''
  currentStatus!: number
  users!: User[]
  colBig!: number;
  colXBig!: number
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string
  idOrder: string = '0'
  path: string = 'dashboard/orders'
  isSelectAll: boolean = false
  traceabilityFormGroup = this._formBuilder.group({
    oneCtrl: ['', Validators.required],
  })




  constructor(private _traceabilityService: TraceabilityService, private dialog: MatDialog, private _route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private _router: Router, private _userService: UserService, private _formBuilder: FormBuilder) {
    this.user = this._userService.user
    this.currentStatus = 0
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
          this.colSmall = 12
          this.colXBig = 12
          this.modalWidth = '100%'

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12
          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12
          this.modalWidth = '85%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '65%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10
          this.modalWidth = '50%'
        }
      }
    });



    this.idOrder = this._route.snapshot.paramMap.get('id') || '0'
  }


  loadData() {

    this._traceabilityService.getTraceability(this.idOrder).subscribe({
      next: (resp) => {
        console.log(resp)
        this.data = resp
        this.order = this.data.order[0]

      },
      complete: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }

  openEmailsByClient() {

    const dialogRef = this.dialog.open(ClientEmailsComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: { id_client: this.order.id_client.toString(), data: this.data, type: 'traceability' }

    })
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  selectAll(select: boolean) {
    this.isSelectAll = select
    this.selectAllInvoices(select)
    this.selectAllPaymentsPlugins(select)
    this.selectAllDepartures(select)
    this.selectAllCertificates(select)
    this.selectAllOrders(select)

  }

  selectAllInvoices(select: boolean) {
    let i = 0
    while (i < this.data.invoices.length) {
      this.data.invoices[i].selected = select
      i++
    }
  }

  selectAllOrders(select: boolean) {
    let i = 0
    while (i < this.data.order.length) {
      if (this.data.order[i].path_file != '') {
        this.data.order[i].selected = select
      }
      i++
    }
  }

  selectAllDepartures(select: boolean) {
    let i = 0
    while (i < this.data.departures.length) {
      this.data.departures[i].select_sale_note = select
      this.data.departures[i].select_packing_list = select
      i++
    }
  }

  selectAllCertificates(select: boolean) {
    let i = 0
    while (i < this.data.certificates.length) {
      this.data.certificates[i].selected = select
      i++
    }
  }

  selectAllPaymentsPlugins(select: boolean) {
    let i = 0
    while (i < this.data.payments_plugins.length) {
      this.data.payments_plugins[i].selected = select
      i++
    }
  }

  openHistory() {
    console.log(this.data.order)
    const dialogRef = this.dialog.open(OrderHistoryComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: { data: this.data.order[0] }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      console.log('Resultado:', result);
    });
  }

  ngOnInit(): void {
    this.loadData()
  }
}
