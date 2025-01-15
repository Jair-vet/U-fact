import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Client } from 'src/app/models/client.model';

import { ClientService } from 'src/app/services/client.service';

import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})


export class ClientsComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  error_msg: string = ''
  inactive: boolean = false
  displayedColumns: string[] = ['number', 'name', 'rfc', 'telephone', 'email', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colMedium!: number;
  steps!: string[]
  clients!: Client[]


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private _routingService: RoutingService, private _router: Router, private breakpointObserver: BreakpointObserver, private _clientService: ClientService, private _userService: UserService) {

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

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12

        }

        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 9
          this.colMedium = 3

        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2

        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2

        }
      }
    });

    this._routingService.setRouting(`dashboard/clients`, `dashboard/clients`)
  }

  deleteClient(client: Client) {

    Swal.fire({
      title: 'DESACTIVAR',
      text: '¿ESTAS SEGURO DE DESACTIVAR EL CLIENTE ' + client.name.toString() + ' CON NUMERO [' + client.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientService.deleteClient(client.id.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadClients();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },

        })
      }
    })
  }

  changeStateInactive(state: boolean) {
    this.inactive = state
    this.changeClients()
  }

  restoreClient(client: Client) {

    Swal.fire({
      title: 'RESTAURAR',
      text: '¿ESTAS SEGURO DE RESTAURAR EL CLIENTE ' + client.name + ' CON NUMERO [' + client.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'RESTARURAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientService.restoreClient(client.id.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'CLIENTE RESTAURADO', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadClients();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR INTENTANDO RESTAURAR EL CLIENTE', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },

        })
      }
    })


  }


  validateCSD() {
    if (this._userService.user.serial != '' && this._userService.user.postal_code != '') {
      this._router.navigateByUrl('dashboard/clients/create-client')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {

      })
    }
  }

  async changeClients() {
    this.isDisabled = true
    this.loading = true

    this.loadClients();



  }
  loadClients() {

    this.loading = true
    this._clientService.getClients(this._userService.user.getIdCompany.toString(), this.inactive).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        console.log(resp)
        this.loading = false

      },
      complete: () => {

        this.dataSource.sort = this.sort;
        this.isDisabled = false

      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
        console.log(err)
      },

    })
  }

  goToBalance(client: Client) {
    this._routingService.setRouting(`/dashboard/payments/details-balance-client/${client.id}`, `dashboard/clients`)
    this._router.navigateByUrl(`/dashboard/payments/details-balance-client/${client.id}`)
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit() {


  }




}
