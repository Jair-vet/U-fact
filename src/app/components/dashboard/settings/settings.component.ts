import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Bank } from 'src/app/models/bank.model';
import { TaxRegimen } from 'src/app/models/sat.model';

import { SatService } from 'src/app/services/sat.service';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { InstallCsdComponent } from './components/install-csd/install-csd.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from 'src/app/services/client.service';
import { Municipality, State, Suburb } from 'src/app/models/location.model';
import { User } from 'src/app/models/user.model';
import { HelpService } from 'src/app/services/help.service';
import { AddUserComponent } from './components/add-user/add-user.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  style = document.documentElement.style;
  public image!: any;

  public loading: boolean = false

  public isChangeImage: boolean = false
  public color: String = localStorage.getItem('color') || '#000';
  public imageTemp: any = './assets/img/noimage.png';

  tax_regimes!: TaxRegimen[]
  public taxRegimesCtrl: FormControl = new FormControl();
  public taxRegimesFilterCtrl: FormControl = new FormControl();
  public filteredTaxRegimes: ReplaySubject<TaxRegimen[]> = new ReplaySubject<TaxRegimen[]>(1);


  states!: State[]
  public statesCtrl: FormControl = new FormControl();
  public statesFilterCtrl: FormControl = new FormControl();
  public filteredStates: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);


  municipalities!: Municipality[]
  public municipalitiesCtrl: FormControl = new FormControl();
  public municipalitiesFilterCtrl: FormControl = new FormControl();
  public filteredMunicipalities: ReplaySubject<Municipality[]> = new ReplaySubject<Municipality[]>(1);


  suburbs!: Suburb[]
  public suburbsCtrl: FormControl = new FormControl();
  public suburbsFilterCtrl: FormControl = new FormControl();
  public filteredSuburbs: ReplaySubject<Suburb[]> = new ReplaySubject<Suburb[]>(1);
  selectedFile: any = null;

  banks!: Bank[]
  public banksCtrl: FormControl = new FormControl();
  public banksFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  public display: boolean = true;
  protected _onDestroy = new Subject<void>();

  waitValidatePostalCode: BooleanInput = false
  tradenameOnlyRead: BooleanInput = true
  rfcOnlyRead: BooleanInput = true
  noImage: boolean = true
  minRFC: number = 10
  maxRFC: number = 10
  form: FormGroup
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  nameCertificate: string = '';
  nameKey: string = '';
  textButtonSave: string = ''
  textButtonAddUser: string = ''
  modalWidth: string = ''

  public user!: User
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  constructor(private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _userService: UserService,
    private _uploadService: UploadService, private _satService: SatService, private dialog: MatDialog, private _clientService: ClientService) {

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
          this.colSmall = 6
          this.modalWidth = '100%'
          this.textButtonSave = ''
          this.textButtonAddUser = ''
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 4
          this.modalWidth = '100%'
          this.textButtonSave = ''
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 4
          this.modalWidth = '100%'
          this.textButtonSave = 'GUARDAR'
          this.textButtonAddUser = 'AGREGAR USUARIO'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalWidth = '50%'
          this.textButtonSave = 'GUARDAR'
          this.textButtonAddUser = 'AGREGAR USUARIO'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.modalWidth = '50%'
          this.textButtonSave = 'GUARDAR'
          this.textButtonAddUser = 'AGREGAR USUARIO'
        }
      }
    });
    this.form = this._formBuider.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      email_support: ['', Validators.email],
      tradename: ['', Validators.required],
      rfc: ['', Validators.required],
      serie: [''],
      postal_code: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      num_ext: ['', [Validators.required]],
      num_int: ['', []],
      address: ['', Validators.required],
      interbank_code: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      account: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      phone: ['', [Validators.pattern("^[0-9]*$")]],

    })
    this.user = _userService.user

  }
  openDialogInstallCSD(): void {
    const dialogInstallCSD = this.dialog.open(InstallCsdComponent, {
      disableClose: true,
      width: this.modalWidth,
      minWidth: this.modalWidth,
      height: 'auto',


    });


  }
  openDialogAddUser(): void {
    const dialogAddUser = this.dialog.open(AddUserComponent, {
      disableClose: true,
      width: this.modalWidth,
      minWidth: this.modalWidth,
      height: 'auto',


    });


  }

  converterHexARGB(hex: string, number: number): string {
    // Convierte el valor hexadecimal a RGB
    const r = parseInt(hex.slice(1, 3), 16) + number;
    const g = parseInt(hex.slice(3, 5), 16) + number;
    const b = parseInt(hex.slice(5, 7), 16) + number;

    return `rgb(${r}, ${g}, ${b})`;
  }

  updateColor(event: any) {
    let colorSecondary = this.converterHexARGB(event.target.value, 80);
    let colorAux = this.converterHexARGB(event.target.value, 120);
    this.style.setProperty('--primary', event.target.value)
    this.style.setProperty('--secondary', colorSecondary)
    this.style.setProperty('--aux', colorAux)
    localStorage.setItem('color', event?.target.value)
    localStorage.setItem('colorSecondary', colorSecondary)
    localStorage.setItem('colorAux', colorAux)

  }
  isValidSelect() {

    console.log(this.taxRegimesCtrl.value)
    if (this.taxRegimesCtrl.value.id) {


      if (this.taxRegimesCtrl.value.fisica == 'SI' && this.taxRegimesCtrl.value.moral == 'SI') {
        this.minRFC = 12
        this.maxRFC = 13
      }
      else if (this.taxRegimesCtrl.value.fisica == 'SI') {
        this.minRFC = 13
        this.maxRFC = 13
      } else {
        this.minRFC = 12
        this.maxRFC = 12
      }
    } else {

    }

  }
  changeImage(event: any): any {
    const file = event.target.files[0];
    const formData = new FormData();

    this.image = file;
    if (this.image.name.split('.').pop() != 'png' && this.image.name.split('.').pop() != 'jpg') {
      this.image = null
    } else {
      if (!file) {

        this.isChangeImage = false
        if (this._userService.user.logo == '') {
          this.noImage = true

        } else {
          this.imageTemp = this._userService.user.getlogo
          this.noImage = false
        }
      } else {
        var ext = this.image.name.match(/\.(.+)$/)[1];
        var name_image = this.randomString(this.image.name.length) + "." + ext;
        formData.append('image', this.image, name_image);
        this.image = formData.get('image')
        this.isChangeImage = true
        this.noImage = false
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
          this.imageTemp = reader.result;
        }

      }
    }




  }

  randomString(length: number) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }



  validatePostalCode() {
    console.log(this.form.value.postal_code)
    if (this.form.value.postal_code.length == 5) {
      this.waitValidatePostalCode = true
      this._clientService.validatePostalCode(this.form.value.postal_code).subscribe({
        next: (resp) => {
          this.states = resp.state
          this.municipalities = resp.municipality
          this.suburbs = resp.suburb
        },
        error: (err) => {
          this.waitValidatePostalCode = false
          Swal.fire({ title: 'Error', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.waitValidatePostalCode = false

          this.loadComponentSelectStates()
          this.loadComponentSelectMunicipalities()
          this.loadComponentSelectSuburbs()
        },
      })

    } else {

    }
  }

  saveData() {
    this.loading = true

    if (this.isChangeImage) {

      const before = this._userService.user.logo.slice(8)

      this._uploadService.uploadImage(this.image, this._userService.user.rfc, 'Company', before).then(img => {
        if (img != false) {
          this._userService.updateCompany(this.form.value.name, this.taxRegimesCtrl.value.id, this.form.value.tradename, this.form.value.address, this.form.value.postal_code, this.banksCtrl.value.id, this.form.value.interbank_code, this.form.value.account, img, this.form.value.serie, this.statesCtrl.value.state, this.municipalitiesCtrl.value.municipality, this.suburbsCtrl.value.suburb, this.form.value.num_ext, this.form.value.num_int, this.form.value.email, this.form.value.phone, this.form.value.email_support == '' ? this.form.value.email : this.form.value.email_support, this._userService.user.id_company.toString()).subscribe({
            next: (resp) => {
              this._userService.user.logo = img
              this.setUser()
              Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
            error: (err) => {

              Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
            complete: () => {
              this.loading = false
            },
          })
        } else {
          this.loading = false
          Swal.fire({ title: 'ERROR', text: 'NO SE HA PODIDO ACTUALIZAR EL LOGO DE LA EMPRESA', icon: 'error', confirmButtonColor: '#58B1F7' });
        }
      })
    } else {
      this._userService.updateCompany(this.form.value.name, this.taxRegimesCtrl.value.id, this.form.value.tradename, this.form.value.address, this.form.value.postal_code, this.banksCtrl.value.id, this.form.value.interbank_code, this.form.value.account, this._userService.user.logo, this.form.value.serie, this.statesCtrl.value.state, this.municipalitiesCtrl.value.municipality, this.suburbsCtrl.value.suburb, this.form.value.num_ext, this.form.value.num_int, this.form.value.email, this.form.value.phone, this.form.value.email_support == '' ? this.form.value.email : this.form.value.email_support, this._userService.user.id_company.toString()).subscribe({
        next: (resp) => {
          this.setUser()
          Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
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

  }





  setUser() {

    this._userService.user.name_company = this.form.value.name
    this._userService.user.tradename = this.form.value.tradename
    this._userService.user.serie = this.form.value.serie
    this._userService.user.rfc = this.form.value.rfc
    this._userService.user.account = this.form.value.account

    this._userService.user.id_regime = this.taxRegimesCtrl.value.id
    this._userService.user.bank = this.banksCtrl.value.id
    this._userService.user.interbank_code = this.form.value.interbank_code

    this._userService.user.address = this.form.value.address
    this._userService.user.postal_code = this.form.value.postal_code
    this._userService.user.state = this.statesCtrl.value.state
    this._userService.user.municipality = this.municipalitiesCtrl.value.municipality
    this._userService.user.suburb = this.suburbsCtrl.value.suburb
    this._userService.user.num_ext = this.form.value.num_ext
    this._userService.user.num_int = this.form.value.num_int

    this._userService.user.email_company = this.form.value.email
    this._userService.user.phone = this.form.value.phone
    this._userService.user.support_email = this.form.value.email_support

  }



  loadTaxRegimes() {

    this.loading = true
    console.log('TAX')
    this._satService.getTaxRegimen(this.user.rfc.toString().length).subscribe({
      next: (resp) => {
        console.log(resp)
        this.tax_regimes = resp
      },
      complete: () => {
        this.loadComponentSelectTaxRegimes()
        this.loadDataPostalCode()


      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }

  loadDataPostalCode() {


    this._clientService.validatePostalCode(this._userService.user.postal_code).subscribe({
      next: (resp) => {
        this.states = resp.state
        this.municipalities = resp.municipality
        this.suburbs = resp.suburb
      },
      complete: () => {
        this.loadComponentSelectStates()
        this.loadComponentSelectMunicipalities()
        this.loadComponentSelectSuburbs()
        this.loadBanks()


      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }

  loadBanks() {

    this._satService.getBanks().subscribe({
      next: (resp) => {
        this.banks = resp
      },
      complete: () => {
        this.loadComponentSelectBanks()
        this.setFields()

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  //REGIMES
  loadComponentSelectTaxRegimes() {
    this.filteredTaxRegimes.next(this.tax_regimes.slice());
    this.taxRegimesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTaxRegimes();
      });
  }

  protected filterTaxRegimes() {
    if (!this.tax_regimes) {
      return;
    }
    let search = this.taxRegimesFilterCtrl.value;
    if (!search) {
      this.filteredTaxRegimes.next(this.tax_regimes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTaxRegimes.next(
      this.tax_regimes.filter(tax_regimes => tax_regimes.description.toLowerCase().indexOf(search) > -1)
    );
  }

  //STATES
  loadComponentSelectStates() {
    this.filteredStates.next(this.states.slice());
    this.statesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStates();
      });
  }

  protected filterStates() {
    if (!this.states) {
      return;
    }
    let search = this.statesFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStates.next(
      this.states.filter(states => states.state.toLowerCase().indexOf(search) > -1)
    );
  }


  //MUNICIPALITES
  loadComponentSelectMunicipalities() {
    this.filteredMunicipalities.next(this.municipalities.slice());
    this.municipalitiesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMunicipalities();
      });
  }

  protected filterMunicipalities() {
    if (!this.municipalities) {
      return;
    }
    let search = this.municipalitiesFilterCtrl.value;
    if (!search) {
      this.filteredMunicipalities.next(this.municipalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMunicipalities.next(
      this.municipalities.filter(municipalities => municipalities.municipality.toLowerCase().indexOf(search) > -1)
    );
  }


  //SUBURB
  loadComponentSelectSuburbs() {
    this.filteredSuburbs.next(this.suburbs.slice());
    this.municipalitiesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMunicipalities();
      });
  }

  protected filterSuburbs() {
    if (!this.suburbs) {
      return;
    }
    let search = this.suburbsFilterCtrl.value;
    if (!search) {
      this.filteredSuburbs.next(this.suburbs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSuburbs.next(
      this.suburbs.filter(suburbs => suburbs.suburb.toLowerCase().indexOf(search) > -1)
    );
  }

  //BANKS

  loadComponentSelectBanks() {
    this.filteredBanks.next(this.banks.slice());
    this.banksFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    let search = this.banksFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(
      this.banks.filter(banks => banks.name.toLowerCase().indexOf(search) > -1)
    );
  }

  setFields() {
    if (this._userService.user.getlogo == '') {
      this.noImage = true
    } else {
      this.imageTemp = this._userService.user.getlogo
      this.noImage = false
    }


    this.statesCtrl.setValue(this.states.filter(x => x.state == this._userService.user.state)[0])
    this.municipalitiesCtrl.setValue(this.municipalities.filter(x => x.municipality == this._userService.user.municipality)[0])

    this.suburbsCtrl.setValue(this.suburbs.filter(x => x.suburb === this._userService.user.suburb)[0])
    this.taxRegimesCtrl.setValue(this.tax_regimes.filter(x => x.id == this._userService.user.id_regime)[0])


    this.banksCtrl.setValue(this.banks[this._userService.user.bank - 1])
    this.isValidSelect()
    this.form.controls['rfc'].setValue(this._userService.user.rfc)
    this.form.controls['serie'].setValue(this._userService.user.serie)
    this.form.controls['tradename'].setValue(this._userService.user.tradename)
    this.form.controls['name'].setValue(this._userService.user.name_company)
    this.form.controls['account'].setValue(this._userService.user.account)
    this.form.controls['interbank_code'].setValue(this._userService.user.interbank_code)

    this.form.controls['postal_code'].setValue(this._userService.user.postal_code)
    this.form.controls['address'].setValue(this._userService.user.address)
    this.form.controls['num_ext'].setValue(this._userService.user.num_ext)
    this.form.controls['num_int'].setValue(this._userService.user.num_int)

    this.form.controls['email'].setValue(this._userService.user.email_company)
    this.form.controls['phone'].setValue(this._userService.user.phone)
    this.form.controls['email_support'].setValue(this._userService.user.support_email)



    this.loading = false
  }
  clearFields() {

    this.form.controls['account'].setValue('')
    this.form.controls['interbank_code'].setValue('')
  }

  ngOnInit(): void {

    this.loadTaxRegimes()


  }
}
