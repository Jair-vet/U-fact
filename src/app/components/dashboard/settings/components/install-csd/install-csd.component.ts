import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-install-csd',
  templateUrl: './install-csd.component.html',
  styleUrls: ['./install-csd.component.scss']
})
export class InstallCsdComponent implements OnInit {
  selectedFileCERAux: any = null;
  selectedFileCER: any = null;
  selectedFileCERname: string = ''
  selectedFileKEYname: string = ''
  selectedFileKEY: any = null;
  selectedFileKEYAux: any = null;
  textButtonKEY: string = ''
  textButtonCER: string = ''
  changeCERT: boolean = false
  changeKEY: boolean = false
  installCSD: boolean = false
  serie: string = ''
  date: string = ''
  form: FormGroup
  public showPassword: boolean = false;
  loading: boolean = false
  constructor(private breakpointObserver: BreakpointObserver, private _userService: UserService, private _formBuider: FormBuilder, private _uploadService: UploadService) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {

          this.textButtonCER = ''
          this.textButtonKEY = ''
        }
        if (result.breakpoints[Breakpoints.Small]) {

          this.textButtonCER = ''
          this.textButtonKEY = ''
        }
        if (result.breakpoints[Breakpoints.Medium]) {

          this.textButtonCER = ''
          this.textButtonKEY = ''
        }
        if (result.breakpoints[Breakpoints.Large]) {

          this.textButtonCER = 'ARCHIVO .cer'
          this.textButtonKEY = 'ARCHIVO .key'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.textButtonCER = 'ARCHIVO .cer'
          this.textButtonKEY = 'ARCHIVO .key'
        }
      }
    });

    this.form = this._formBuider.group({
      file_cer: [''],
      file_key: [''],
      password_csd: ['', Validators.required],

    })

    this.form.controls['file_cer'].setValue(this._userService.user.getCertificate)
    this.form.controls['file_key'].setValue(this._userService.user.getKey)
    this.form.controls['password_csd'].setValue(this._userService.user.password)
    this.selectedFileCERname = this._userService.user.certificate
    this.selectedFileKEYname = this._userService.user.key_company
  }
  async installCERT() {
    this.loading = true
    this._userService.user.password = this.form.value.password_csd
    console.log(this.changeCERT, this.changeKEY,)


    if (this.changeCERT) {

      let before = ''
      if (this._userService.user.certificate != '') {

        before = this._userService.user.certificate.slice(12)
      }
      await this._uploadService.uploadImage(this.selectedFileCERAux, this._userService.user.rfc, 'Certificate', before).then(cert => {
        if (cert != false) {
          this.selectedFileCERname = cert
          this._userService.user.certificate = this.selectedFileCERname
          this.installCSD = true

        } else {
          this.installCSD = false

          Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR AL SUBIR CERTIFICADO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      })


    }


    if (this.changeKEY) {


      let before = ''
      if (this._userService.user.key_company != '') {

        before = this._userService.user.key_company.slice(4)
      }
      await this._uploadService.uploadImage(this.selectedFileKEYAux, this._userService.user.rfc, 'Key', before).then(key => {
        if (key != false) {
          this.selectedFileKEYname = key
          this._userService.user.key_company = this.selectedFileKEYname
          this.installCSD = true

        } else {
          this.installCSD = false

          Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR AL SUBIR EL KEY', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      })

    }
    if (this.changeKEY && this.changeCERT) {

      this._uploadService.getDataCertificate(this.selectedFileCERAux, this.selectedFileKEYAux, this._userService.user.password).subscribe({
        next: (resp) => {
          this._userService.user.serial = resp.serie
          this._userService.user.valid_to = resp.date
          this.continue()
        },
        error: (err) => {
          console.log(err)
          this.loading = false
          Swal.fire({ title: 'Error', text: 'HA OCURRIDO UN ERROR AL OBTENER DATOS DEL CERTIFICADO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
      })



    }

  }

  continue() {
    this.changeKEY = false
    this.changeCERT = false
    this._userService.installCERT(this._userService.user.certificate, this._userService.user.key_company, this._userService.user.password, this._userService.user.serial, this._userService.user.valid_to, this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.form.controls['file_cer'].setValue(this._userService.user.getCertificate)
        this.form.controls['file_key'].setValue(this._userService.user.getKey)
        Swal.fire({ title: 'Ok', text: resp.message, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        if (resp.ok) {
          this._userService.user.serial = resp.data.serial
          this._userService.user.valid_to = resp.data.valid_to
        }
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


  ngOnInit(): void {
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onFileSelectedCER(event: any) {
    this.selectedFileCER = event.target.files[0] ?? null;
    if (this.selectedFileCER.name.split('.').pop() == 'cer') {
      if (this.selectedFileCER != null) {
        this.selectedFileCERAux = this.selectedFileCER
        this.selectedFileCERname = this.selectedFileCER.name
        this.changeCERT = true
      } else if (this.selectedFileCERAux != null) {
        this.selectedFileCER = this.selectedFileCERAux
        this.selectedFileCERname = this.selectedFileCER.name
      }
    } else {
      this.selectedFileCER = null
    }
  }


  onFileSelectedKEY(event: any) {
    this.selectedFileKEY = event.target.files[0] ?? null
    if (this.selectedFileKEY.name.split('.').pop() == 'key') {
      if (this.selectedFileKEY != null) {
        this.selectedFileKEYAux = this.selectedFileKEY
        this.selectedFileKEYname = this.selectedFileKEY.name
        this.changeKEY = true
      } else if (this.selectedFileKEYAux != null) {

        this.selectedFileKEY = this.selectedFileKEYAux
        this.selectedFileKEYname = this.selectedFileKEY.name
        console.log(this.selectedFileKEYAux)
      }
    } else {
      this.selectedFileKEY = null
    }

  }
}
