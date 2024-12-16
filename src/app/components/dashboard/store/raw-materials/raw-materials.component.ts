
import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { RawMaterial } from 'src/app/models/raw-material.model';


import { HelpService } from 'src/app/services/help.service';
import { RawMaterialService } from 'src/app/services/raw-material.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.scss']
})
export class RawMaterialsComponent implements OnInit {
  loading: boolean = false
  inactive: boolean = false
  displayedColumns: string[] = ['number', 'description', 'inventory', 'tradename', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colMedium!: number;
  steps!: string[]


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly joyrideService: JoyrideService, private _helpService: HelpService, private _router: Router, private breakpointObserver: BreakpointObserver, private _rawMaterialService: RawMaterialService, private _userService: UserService) {
    this._helpService.helpClient()
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

  }

  inactiveRecord(record: RawMaterial) {

    Swal.fire({
      title: 'DESACTIVAR',
      text: '¿ESTAS SEGURO DE DESACTIVAR EL REGISTRO ' + record.description.toString() + ' CON NUMERO [' + record.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._rawMaterialService.inactive(record.id!.toString()).subscribe({
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

  changeStateInactive(state: boolean) {
    this.inactive = state
    this.changeData()
  }

  restore(record: RawMaterial) {

    Swal.fire({
      title: 'RESTAURAR',
      text: '¿ESTAS SEGURO DE RESTAURAR EL REGISTRO ' + record.description + ' CON NUMERO [' + record.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'RESTARURAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this._rawMaterialService.restore(record.id!.toString()).subscribe({
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
      this._router.navigateByUrl('dashboard/raw-materials/create-raw-material')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {

        this._helpService.helpCert()
        this.showHelp()

      })
    }
  }
  showHelp() {
    this.steps = this._helpService.help()
    this.joyrideService.startTour({
      steps: this.steps,
      customTexts: {
        next: '>',
        prev: '<',
        done: 'Ok'
      }
    });
    this._helpService.helpInvoice()
  }

  async changeData() {
    this.isDisabled = true
    this.loading = true
    this.loadData();

  }
  loadData() {

    this.loading = true
    this._rawMaterialService.getAllData(this._userService.user.getIdCompany.toString(), this.inactive).subscribe({
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
        this.loading = false
        console.log(err)
      },

    })
  }

  ngOnInit(): void {

    this.loadData();

  }

  ngAfterViewInit() {


  }

}
