import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { SatUnit } from 'src/app/models/sat.model';
import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


import { UploadService } from 'src/app/services/upload.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';
import { FamilyRawMaterialService } from 'src/app/services/family-raw-material.service';
import { CatalogFamiliesComponent } from '../components/catalog-families/catalog-families.component';
import { CatalogSubFamiliesComponent } from '../components/catalog-sub-families/catalog-sub-families.component';
import { CatalogTradenamesComponent } from '../../components/catalog-tradenames/catalog-tradenames.component';
import { RawMaterialService } from 'src/app/services/raw-material.service';
import { RawMaterial } from 'src/app/models/raw-material.model';
import { FamilyRawMaterial } from 'src/app/models/family-raw-material.model';

@Component({
  selector: 'app-edit-raw-material',
  templateUrl: './edit-raw-material.component.html',
  styleUrls: ['./edit-raw-material.component.scss']
})
export class EditRawMaterialComponent implements OnInit {


  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  loading = true
  error = false
  error_msg: string = ''

  panelOpenState = false
  isChangeImage = false

  form: FormGroup

  //VARIABLES: SELECT UNIT SAT
  units!: SatUnit[]


  public satUnitCtrl: FormControl = new FormControl();
  public satUnitFilterCtrl: FormControl = new FormControl();
  public filteredSatUnit: ReplaySubject<SatUnit[]> = new ReplaySubject<SatUnit[]>(1);





  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalFamilyW: string = ''
  rawMaterial!: RawMaterial
  idRawMaterial: string = ''
  modalSubFamilyW: string = ''
  path: string = 'dashboard/raw-materials'
  pathImageDefault: string = './assets/img/no-image.png'

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;


  protected _onDestroy = new Subject<void>();


  constructor(private _route: ActivatedRoute, private _familyRawMaterialService: FamilyRawMaterialService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _uploadService: UploadService, private dialog: MatDialog, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _rawMaterialService: RawMaterialService, private _satService: SatService) {
    this._helpService.helpCreateProduct()
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
      id: [''],
      id_tradename: [''],
      image: [''],
      id_sat_unit: [''],
      id_company: [''],
      tradename: ['', Validators.required],
      code: [''],
      description: ['', Validators.required],
      price_without_iva: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      family_product: ['', Validators.required],
      sub_family_product: ['', Validators.required],
      id_family_product: ['0'],
      id_sub_family_product: ['0'],
      initial_inventory: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      minimum_inventory: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
    })
    this.idRawMaterial = this._route.snapshot.paramMap.get('id') || '0'


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


  loadData() {
    this._rawMaterialService.getData(this.idRawMaterial.toString()).subscribe({
      next: (resp) => {
        this.rawMaterial = resp
        console.log(resp)
      },

      complete: () => {
        this.setFields()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },

    })
  }

  setFields() {
    this.form.controls['id'].setValue(this.rawMaterial.id)
    this.form.controls['description'].setValue(this.rawMaterial.description)
    this.form.controls['code'].setValue(this.rawMaterial.code)
    this.form.controls['sub_family_product'].setValue(this.rawMaterial.sub_family_product)
    this.form.controls['id_sub_family_product'].setValue(this.rawMaterial.id_sub_family_product)
    this.form.controls['id_sat_unit'].setValue(this.rawMaterial.id_sat_unit)
    this.form.controls['family_product'].setValue(this.rawMaterial.family_product)
    this.form.controls['id_family_product'].setValue(this.rawMaterial.id_family_product)
    this.form.controls['tradename'].setValue(this.rawMaterial.tradename)
    this.form.controls['id_tradename'].setValue(this.rawMaterial.id_tradename)
    this.form.controls['price_without_iva'].setValue(this.rawMaterial.price_without_iva.toString())
    this.form.controls['initial_inventory'].setValue(this.rawMaterial.initial_inventory)
    this.form.controls['image'].setValue(this.rawMaterial.image)
    this.form.controls['minimum_inventory'].setValue(this.rawMaterial.minimum_inventory)
    if (this.rawMaterial.image != '') {
      this.imageTemp = this._rawMaterialService.getImage(this._userService.user.rfc, this.rawMaterial.image)
    } else {
      this.imageTemp = './assets/img/no-image.png'
    }
    this.satUnitCtrl.setValue(this.units[this.rawMaterial.id_sat_unit - 1])
    this.loading = false

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

  updateData() {

    if (this.satUnitCtrl.value != undefined) {
      this.loading = true
      if (this.isChangeImage) {
        this._uploadService.uploadImage(this.image, this._userService.user.rfc, 'ProductsMP', '')
          .then(img => {
            if (img != false) {
              this.form.controls['image'].setValue(img)
              this.form.controls['id_company'].setValue(this._userService.user.id_company)
              this._rawMaterialService.update(this.form.value).subscribe({
                next: (resp) => {
                  Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
                  this._router.navigateByUrl('dashboard/raw-materials')

                },
                error: (err) => {


                  this.loading = false
                  Swal.fire({ title: 'ERROR', text: err, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
                },
                complete: () => {

                  this.loading = false
                },

              })

            } else {
              Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
            }

          }).catch(err => {
            console.log(err);
            Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO SUBIR LA IMAGEN', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });
          })
      } else {

        this.form.controls['id_company'].setValue(this._userService.user.id_company)
        this._rawMaterialService.update(this.form.value).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            this._router.navigateByUrl('dashboard/raw-materials')
          },
          error: (err) => {
            this.loading = false
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
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

        this.loadComponentSelectUnitSat()
        this.loadData()

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
