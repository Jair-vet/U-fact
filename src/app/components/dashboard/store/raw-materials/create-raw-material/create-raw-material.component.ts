import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ProdServ, SatUnit } from 'src/app/models/sat.model';
import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

import { PriceForm } from 'src/app/interfaces/price-form.interface';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';
import { FamilyRawMaterialService } from 'src/app/services/family-raw-material.service';
import { CatalogFamiliesComponent } from '../components/catalog-families/catalog-families.component';
import { CatalogSubFamiliesComponent } from '../components/catalog-sub-families/catalog-sub-families.component';
import { CatalogTradenamesComponent } from '../../components/catalog-tradenames/catalog-tradenames.component';
import { RawMaterialService } from 'src/app/services/raw-material.service';
import { FamilyRawMaterial } from 'src/app/models/family-raw-material.model';

const clearFields = environment.clearFields

@Component({
  selector: 'app-create-raw-material',
  templateUrl: './create-raw-material.component.html',
  styleUrls: ['./create-raw-material.component.scss']
})
export class CreateRawMaterialComponent implements OnInit {

  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  loading = true
  panelOpenState = false
  isChangeImage = false

  form: FormGroup

  //VARIABLES: SELECT UNIT SAT
  units!: SatUnit[]
  prices: PriceForm[] = []
  code!: ProdServ

  public satUnitCtrl: FormControl = new FormControl();
  public satUnitFilterCtrl: FormControl = new FormControl();
  public filteredSatUnit: ReplaySubject<SatUnit[]> = new ReplaySubject<SatUnit[]>(1);



  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalFamilyW: string = ''
  modalSubFamilyW: string = ''
  path: string = 'dashboard/raw-materials'
  pathImageDefault: string = './assets/img/no-image.png'

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;


  protected _onDestroy = new Subject<void>();


  constructor(private _familyRawMaterialService: FamilyRawMaterialService, private breakpointObserver: BreakpointObserver, private _uploadService: UploadService, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _rawMaterialService: RawMaterialService, private _satService: SatService) {

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
          this.modalFamilyW = '100%'
          this.modalSubFamilyW = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.modalFamilyW = '100%'
          this.modalSubFamilyW = '100%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.modalFamilyW = '50%'
          this.modalSubFamilyW = '50%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalFamilyW = '50%'
          this.modalSubFamilyW = '50%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalFamilyW = '50%'
          this.modalSubFamilyW = '50%'
        }
      }
    });

    this.form = this._formBuider.group({
      id_tradename: [''],
      image: [''],
      id_sat_unit: [''],
      id_company: [''],
      tradename: ['', Validators.required],
      code: [''],
      description: ['', Validators.required],
      price_without_iva: ['0', Validators.required],
      family_product: ['', Validators.required],
      sub_family_product: ['', Validators.required],
      id_family_product: ['0'],
      id_sub_family_product: ['0'],
      initial_inventory: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      minimum_inventory: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
    })
  }

  clearFields() {
    if (clearFields) {
      this.imageTemp = './assets/img/no-image.png'
      this.image = null
      this.isChangeImage = false
      this.form.reset({
        id_tradename: '',
        image: '',
        id_sat_unit: '',
        id_company: '',
        tradename: '',
        code: '',
        description: '',
        price_without_iva: '0',
        family_product: '',
        sub_family_product: '',
        id_family_product: '0',
        id_sub_family_product: '0',
        initial_inventory: '0',
        minimum_inventory: '0'
      })
      this.satUnitCtrl.reset()
    }
  }

  openCatalogFamilyProducts(): void {
    const dialogRef = this.dialog.open(CatalogFamiliesComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result != '') {
        this._familyRawMaterialService.familyRawMaterial = result
        this.form.controls['family_product'].setValue(this._familyRawMaterialService.familyRawMaterial.family_product)
        this.form.controls['id_family_product'].setValue(this._familyRawMaterialService.familyRawMaterial.id)
      } else {
        if (this._familyRawMaterialService.familyRawMaterial == undefined) {

          this._familyRawMaterialService.familyRawMaterial = new FamilyRawMaterial('', this._userService.user.id_company, 0)
          this.form.controls['family_product'].setValue('')
          this.form.controls['id_family_product'].setValue('0')

        } else {
          this.form.controls['family_product'].setValue(this._familyRawMaterialService.familyRawMaterial.family_product)
          this.form.controls['id_family_product'].setValue(this._familyRawMaterialService.familyRawMaterial.id)
        }
      }
    });
  }

  openCatalogSubFamilyProducts(): void {
    const dialogRef = this.dialog.open(CatalogSubFamiliesComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.form.controls['sub_family_product'].setValue(result.sub_family_product)
        this.form.controls['id_sub_family_product'].setValue(result.id)
      }
    });

  }

  openCatalogTradenames(): void {
    const dialogRef = this.dialog.open(CatalogTradenamesComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result != '') {
        this.form.controls['tradename'].setValue(result.name)
        this.form.controls['id_tradename'].setValue(result.id)
      }
    });
  }




  cancel() {
    this._router.navigateByUrl(this.path)
  }

  setUnitSat() {
    this.form.controls['id_sat_unit'].setValue(this.satUnitCtrl.value.id)
  }

  changeImage(event: any): any {
    const file = event.target.files[0];
    this.image = file;
    if (this.image.name.split('.').pop() != 'png' && this.image.name.split('.').pop() != 'jpg') {
      this.image = null
    } else {
      if (!file) {
        this.imageTemp = this.pathImageDefault;
        this.isChangeImage = false
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.isChangeImage = true
      reader.onloadend = () => {
        this.imageTemp = reader.result;

      }
    }
  }

  createProduct() {

    if (this.satUnitCtrl.value != undefined) {
      this.loading = true
      if (this.isChangeImage) {
        this._uploadService.uploadImage(this.image, this._userService.user.rfc, 'ProductsMP', '')
          .then(img => {
            if (img != false) {
              this.form.controls['image'].setValue(img)
              this.form.controls['id_company'].setValue(this._userService.user.id_company)
              this._rawMaterialService.create(this.form.value).subscribe({
                next: (resp) => {
                  Swal.fire({
                    title: 'AGREGAR PRODUCTO',
                    text: '¿DESEAS SEGUIR AGREGANDO PRODUCTOS O REGRESAR AL LISTADO?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'CONTINUAR AGREGANDO',
                    cancelButtonText: 'SALIR',
                    confirmButtonColor: '#58B1F7',
                    reverseButtons: true,
                    heightAuto: false,
                  }).then(result => {
                    console.log(result)
                    if (!result.isConfirmed) {

                      Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                      this._router.navigateByUrl('dashboard/raw-materials')
                    } else {
                      this.clearFields()
                      Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                    }
                  })
                },
                error: (err) => {

                  this.prices = []
                  this.loading = false
                  Swal.fire({ title: 'ERROR', text: err, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
                },
                complete: () => {
                  this.prices = []
                  this.loading = false
                },

              })

            } else {
              this.loading = false
              Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
            }

          }).catch(err => {
            console.log(err);
            Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO SUBIR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
          })
      } else {

        this.form.controls['id_company'].setValue(this._userService.user.id_company)
        this._rawMaterialService.create(this.form.value).subscribe({
          next: (resp) => {
            Swal.fire({
              title: 'AGREGAR PRODUCTO',
              text: '¿DESEAS SEGUIR AGREGANDO PRODUCTOS O REGRESAR AL LISTADO?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'CONTINUAR AGREGANDO',
              cancelButtonText: 'SALIR',
              confirmButtonColor: '#58B1F7',
              reverseButtons: true,
              heightAuto: false,
            }).then(result => {
              console.log(result)
              if (!result.isConfirmed) {

                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                this._router.navigateByUrl('dashboard/raw-materials')
              } else {
                this.clearFields()
                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
              }
            })
          },
          error: (err) => {
            this.prices = []
            console.log(err.error)
            this.loading = false
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.prices = []
            this.loading = false
          },
        })
      }
    } else {
      Swal.fire({ title: 'ERROR', text: 'FALTAN CAMPOS POR INGRESAR', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }



  }

  loadUnits() {

    this._satService.getUnitSat().subscribe({
      next: (resp) => {
        this.units = resp
      },
      complete: () => {
        this.loading = false
        this.loadComponentSelectUnitSat()

      },
      error: (err) => {
        console.log(err)
      },

    })


  }




  ngOnDestroy() {

    this._onDestroy.next();
    this._onDestroy.complete();
  }



  protected setInitialValue() {
    this.filteredSatUnit
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SatUnit, b: SatUnit) => a && b && a.id === b.id;
      });


  }




  //CARGAR COMPONENTE PARA UNIT SAT
  protected filterSatUnit() {
    if (!this.units) {
      return;
    }
    let search = this.satUnitFilterCtrl.value;
    if (!search) {
      this.filteredSatUnit.next(this.units.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredSatUnit.next(
      this.units.filter(units => units.name.toLowerCase().indexOf(search) > -1)
    );
  }

  loadComponentSelectUnitSat() {
    this.filteredSatUnit.next(this.units.slice());
    this.satUnitFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSatUnit();
      });
  }



  ngOnInit(): void {
    this.loadUnits()

  }
}
