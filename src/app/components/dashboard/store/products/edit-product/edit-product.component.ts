import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { SatUnit } from 'src/app/models/sat.model';
import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { CatalogFamiliesProductsComponent } from '../components/catalog-families/catalog-families.component';
import { CatalogSubFamiliesProductsComponent } from '../components/catalog-sub-families/catalog-sub-families.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';
import { FamilyRawMaterial } from 'src/app/models/family-raw-material.model';
import { FamilyProductService } from 'src/app/services/family-product.service';
import { ProductService } from 'src/app/services/product.service';
import { CatalogSatComponent } from '../../components/catalog-sat/catalog-sat.component';
import { BooleanInput } from '@angular/cdk/coercion';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  loading = true;
  error = false;
  error_msg: string = '';
  panelOpenState = false;
  isChangeImage = false;
  form: FormGroup;
  units!: SatUnit[];
  public satUnitCtrl: FormControl = new FormControl();
  public satUnitFilterCtrl: FormControl = new FormControl();
  public filteredSatUnit: ReplaySubject<SatUnit[]> = new ReplaySubject<
    SatUnit[]
  >(1);
  isDisabled: BooleanInput = false;
  is_comercial: boolean = false;
  dataFromClipBoard!: any;
  dataComputerTableAux!: any;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalFamilyW: string = '';
  product!: Product;
  modalSubFamilyW: string = '';
  idProduct!: string;
  path: string = 'dashboard/products';
  pathImageDefault: string = './assets/img/no-image.png';
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _familyProductService: FamilyProductService,
    private _helpService: HelpService,
    private breakpointObserver: BreakpointObserver,
    private _uploadService: UploadService,
    private dialog: MatDialog,
    private _formBuider: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _productService: ProductService,
    private _satService: SatService
  ) {
    this._helpService.helpCreateProduct();
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
            this.modalFamilyW = '100%';
            this.modalSubFamilyW = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.colSmall = 6;
            this.colXBig = 12;
            this.modalFamilyW = '100%';
            this.modalSubFamilyW = '100%';
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 4;
            this.colSmall = 4;
            this.colXBig = 12;
            this.modalFamilyW = '50%';
            this.modalSubFamilyW = '50%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;

            this.colXBig = 10;
            this.modalFamilyW = '50%';
            this.modalSubFamilyW = '50%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;
            this.colXBig = 10;
            this.modalFamilyW = '50%';
            this.modalSubFamilyW = '50%';
          }
        }
      });

    this.form = this._formBuider.group({
      id: ['', Validators.required],
      image: [''],
      id_sat_unit: [''],
      id_company: [''],
      id_code_prod_service: [''],
      code_prod_service: ['', Validators.required],
      part_number: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      price_without_iva: ['0', Validators.required],
      family_product: ['', Validators.required],
      sub_family_product: ['', Validators.required],
      id_family_product: ['0'],
      is_dollars: [false, Validators.required],
      tariff_fraction: [''],
      id_sub_family_product: ['0'],
    });

    this.idProduct = this._route.snapshot.paramMap.get('id') || '0';
  }

  openCatalogFamilyProducts(): void {
    const dialogRef = this.dialog.open(CatalogFamiliesProductsComponent, {
      disableClose: true,
      width: '100%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != '') {
        this._familyProductService.familyProduct = result;
        this.form.controls['family_product'].setValue(
          this._familyProductService.familyProduct.family_product
        );
        this.form.controls['id_family_product'].setValue(
          this._familyProductService.familyProduct.id
        );
      } else {
        if (this._familyProductService.familyProduct == undefined) {
          this._familyProductService.familyProduct = new FamilyRawMaterial(
            '',
            this._userService.user.id_company,
            0
          );
          this.form.controls['family_product'].setValue('');
          this.form.controls['id_family_product'].setValue('0');
        } else {
          this.form.controls['family_product'].setValue(
            this._familyProductService.familyProduct.family_product
          );
          this.form.controls['id_family_product'].setValue(
            this._familyProductService.familyProduct.id
          );
        }
      }
    });
  }

  openCatalogSubFamilyProducts(): void {
    const dialogRef = this.dialog.open(CatalogSubFamiliesProductsComponent, {
      disableClose: true,
      width: '100%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
        this.form.controls['sub_family_product'].setValue(
          result.sub_family_product
        );
        this.form.controls['id_sub_family_product'].setValue(result.id);
      }
    });
  }

  openCatalogSAT(): void {
    const dialogRef = this.dialog.open(CatalogSatComponent, {
      disableClose: true,
      width: '100%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
        this.form.controls['code_prod_service'].setValue(result.code);
        this.form.controls['id_code_prod_service'].setValue(result.id);
      }
    });
  }

  changeDollars() {
    if (this.form.value.is_dollars) {
      // Set validators when is_dollars is true
      this.form.controls['unit_custom'].setValidators(Validators.required);
      this.form.controls['tariff_fraction'].setValidators(Validators.required);
    } else {
      // Set different validators or clear them when is_dollars is false
      this.form.controls['unit_custom'].clearValidators();
      this.form.controls['tariff_fraction'].clearValidators();
    }
    // Update the validity of the controls
    this.form.controls['unit_custom'].updateValueAndValidity();
    this.form.controls['tariff_fraction'].updateValueAndValidity();
  }

  loadData() {
    this._productService.getData(this.idProduct.toString()).subscribe({
      next: (resp) => {
        this.product = resp;
        console.log(resp);
      },

      complete: () => {
        this.setFields();
      },
      error: (err) => {
        this.error = true;
        this.error_msg = err.error.message;
        this.loading = false;
      },
    });
  }

  setFields() {
    this.form.controls['id'].setValue(this.product.id);
    this.form.controls['description'].setValue(this.product.description);
    this.form.controls['code'].setValue(this.product.code);
    this.form.controls['sub_family_product'].setValue(
      this.product.sub_family_product
    );
    this.form.controls['id_sub_family_product'].setValue(
      this.product.id_sub_family_product
    );
    this.form.controls['id_sat_unit'].setValue(this.product.id_sat_unit);
    this.form.controls['family_product'].setValue(this.product.family_product);
    this.form.controls['id_family_product'].setValue(
      this.product.id_family_product
    );
    this.form.controls['code_prod_service'].setValue(
      this.product.code_prod_service
    );
    this.form.controls['id_code_prod_service'].setValue(
      this.product.id_code_prod_service
    );
    this.form.controls['price_without_iva'].setValue(
      this.product.price_without_iva.toString()
    );
    this.form.controls['image'].setValue(this.product.image);
    this.form.controls['part_number'].setValue(this.product.part_number);
    this.form.controls['is_dollars'].setValue(this.product.is_dollars);
    this.form.controls['tariff_fraction'].setValue(this.product.tariff_fraction)
    if (this.product.image != '') {
      this.imageTemp = this._productService.getImage(
        this._userService.user.rfc,
        this.product.image
      );
    } else {
      this.imageTemp = './assets/img/no-image.png';
    }
    this.satUnitCtrl.setValue(this.units[this.product.id_sat_unit - 1]);
    this.loading = false;
  }

  cancel() {
    this._router.navigateByUrl(this.path);
  }


  setUnitSat() {
    this.form.controls['id_sat_unit'].setValue(this.satUnitCtrl.value.id);
  }

  changeImage(event: any): any {
    const file = event.target.files[0];
    this.image = file;
    if (
      this.image.name.split('.').pop() != 'png' &&
      this.image.name.split('.').pop() != 'jpg'
    ) {
      this.image = null;
    } else {
      if (!file) {
        this.imageTemp = this.pathImageDefault;
        this.isChangeImage = false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.isChangeImage = true;
      reader.onloadend = () => {
        this.imageTemp = reader.result;
      };
    }
  }

  updateProduct() {
    if (
      this.satUnitCtrl.value != undefined ||
      this.dataComputerTableAux.length > 0
    ) {
      this.loading = true;

      if (this.isChangeImage) {
        this._uploadService
          .uploadImage(this.image, this._userService.user.rfc, 'Products', '')
          .then((img) => {
            if (img != false) {
              this.form.controls['image'].setValue(img);
              this.form.controls['id_company'].setValue(
                this._userService.user.id_company
              );
              this._productService
                .update(this.form.value, this.dataFromClipBoard)
                .subscribe({
                  next: (resp) => {
                    Swal.fire({
                      title: 'OK',
                      text: resp,
                      icon: 'success',
                      confirmButtonColor: '#58B1F7',
                      heightAuto: false,
                    });
                    this._router.navigateByUrl(this.path);
                  },
                  error: (err) => {
                    this.loading = false;
                    Swal.fire({
                      title: 'ERROR',
                      text: err.error.message,
                      icon: 'error',
                      confirmButtonColor: '#58B1F7',
                      heightAuto: false,
                    });
                  },
                  complete: () => {
                    this.loading = false;
                  },
                });
            } else {
              this.loading = false;
              Swal.fire({
                title: 'ERROR',
                text: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN',
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
            Swal.fire({
              title: 'ERROR',
              text: 'NO SE HA PODIDO SUBIR LA IMAGEN',
              icon: 'error',
              confirmButtonColor: '#58B1F7',
              heightAuto: false,
            });
          });
      } else {
        this.form.controls['id_company'].setValue(
          this._userService.user.id_company
        );
        this._productService
          .update(this.form.value, this.dataFromClipBoard)
          .subscribe({
            next: (resp) => {
              Swal.fire({
                title: 'OK',
                text: resp,
                icon: 'success',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
              this._router.navigateByUrl(this.path);
            },
            error: (err) => {
              console.log(err.error);
              this.loading = false;
              Swal.fire({
                title: 'ERROR',
                text: err.error.message,
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
            complete: () => {
              this.loading = false;
              console.log('completado');
            },
          });
      }
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'LA TABLA INFORMATICA NO HA SIDO LLENADA O FALTAN CAMPOS POR INGRESAR',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  loadUnits() {
    this.loading = true;
    this._satService.getUnitSat().subscribe({
      next: (resp) => {
        this.units = resp;
      },
      complete: () => {
        this.loadComponentSelectUnitSat();
        this.loadData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredSatUnit
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SatUnit, b: SatUnit) =>
          a && b && a.id === b.id;
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
      this.units.filter(
        (units) => units.name.toLowerCase().indexOf(search) > -1
      )
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
    this.loadUnits();
  }
}
