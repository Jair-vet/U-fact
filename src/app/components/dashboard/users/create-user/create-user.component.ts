
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Rol } from 'src/app/models/rol.model';
import { HelpService } from 'src/app/services/help.service';
import { RolService } from 'src/app/services/rol.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
const clearFields = environment.clearFields
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  loading = true
  error = false
  error_msg = ''
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  public imageName = ''
  pathImageDefault: string = './assets/img/no-image.png'
  isChangeImage = false


  displayedColumnsContacts: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  dataContacts!: MatTableDataSource<any>;
  form: FormGroup




  rols!: Rol[]
  public rolsCtrl: FormControl = new FormControl();
  public rolsFilterCtrl: FormControl = new FormControl();
  public filteredRols: ReplaySubject<Rol[]> = new ReplaySubject<Rol[]>(1);


  colBig!: number;
  colMedium!: number;
  colSmall!: number;


  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();


  constructor(private _rolService: RolService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService) {
    this._helpService.helpCreateClient()
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
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
      }
    });

    this.form = this._formBuider.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      id_rol: [''],
      id_company: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],

    })
  }


  cancel() {
    this._router.navigateByUrl('dashboard/users')
  }

  createUser() {
    this.loading = true
    this.form.controls['id_rol'].setValue(this.rolsCtrl.value.id)
    this.form.controls['id_company'].setValue(this._userService.user.id_company)

    this._userService.create(this.form.value, this.image).subscribe({
      next: (resp) => {

        Swal.fire({
          title: 'AGREGAR USUARIO',
          text: '¿DESEAS SEGUIR AGREGANDO USUARIOS O REGRESAR AL LISTADO?',
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
            this._router.navigateByUrl('dashboard/users')
          } else {
            this.loading = false
            this.clearFields()
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          }
        })
      },
      error: (err) => {
        console.log(err)
        this.loading = false
        Swal.fire({
          title: 'ERROR', text: err.error.message, icon: 'error', heightAuto: false
        }
        )
      },

    })
  }

  clearFields() {
    if (clearFields) {
      this.imageTemp = './assets/img/no-image.png'
      this.image = null
      this.imageName = ''
      this.form.reset({
        name: '',
        username: '',
        password: '',
        id_rol: '',
        id_company: '',
        email: '',
        telephone: '',
      })
      this.rolsCtrl.reset()
    }
  }

  changeImage(event: any): any {
    const file = event.target.files[0];
    this.image = file;

    if (!file) {
      this.imageTemp = this.pathImageDefault;
      this.isChangeImage = false
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.isChangeImage = true
    reader.onloadend = () => {
      this.imageTemp = reader.result;
      this.imageName = this.image.name
    }
  }

  loadRols() {
    this._rolService.getRols().subscribe({
      next: (resp) => {
        this.rols = resp
      },
      complete: () => {
        this.loadComponentSelectRols()
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        this.loading = false
      },

    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  loadComponentSelectRols() {
    this.filteredRols.next(this.rols.slice());
    this.rolsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRols();
      });
  }

  protected setInitialValue() {
    this.filteredRols
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Rol, b: Rol) => a && b && a.id === b.id;
      });
  }

  protected filterRols() {
    if (!this.rols) {
      return;
    }
    let search = this.rolsFilterCtrl.value;
    if (!search) {
      this.filteredRols.next(this.rols.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRols.next(
      this.rols.filter(rols => rols.rol.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnInit(): void {
    this.error = this._userService.checkPermissionAdmin().error
    this.error_msg = this._userService.checkPermissionAdmin().message
    if (!this.error) {
      this.loadRols()
    } else {
      this.loading = false
    }
  }
}
