import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Rol } from 'src/app/models/rol.model';
import { User } from 'src/app/models/user.model';
import { HelpService } from 'src/app/services/help.service';
import { RolService } from 'src/app/services/rol.service';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  loading = true
  error = false
  error_msg: string = ''
  idUser: string = '0'
  displayedColumnsContacts: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  dataContacts!: MatTableDataSource<any>;
  form: FormGroup
  rols!: Rol[]
  user!: User
  public rolsCtrl: FormControl = new FormControl();
  public rolsFilterCtrl: FormControl = new FormControl();
  public filteredRols: ReplaySubject<Rol[]> = new ReplaySubject<Rol[]>(1);
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  public imageName = ''
  pathImageDefault: string = './assets/img/no-image.png'
  isChangeImage = false

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();


  constructor(private _route: ActivatedRoute, private _rolService: RolService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService) {
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
      id: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: [''],
      id_rol: [''],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],

    })
    this.idUser = this._route.snapshot.paramMap.get('id') || '0'
  }


  loadData() {
    this._userService.getData(this.idUser.toString()).subscribe({
      next: (resp) => {
        this.user = resp
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
    this.form.controls['id'].setValue(this.user.id)
    this.form.controls['name'].setValue(this.user.name)
    this.form.controls['username'].setValue(this.user.username)
    this.form.controls['telephone'].setValue(this.user.telephone)
    this.form.controls['email'].setValue(this.user.email)
    this.rolsCtrl.setValue(this.rols.filter(x => x.id == this.user.id_rol)[0])
    if (this.user.path_key != '') {
      this.imageTemp = `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Users/${this.user.path_key}`
    } else {
      this.imageTemp = './assets/img/no-image.png'
    }

    this.loading = false
  }
  cancel() {
    this._router.navigateByUrl('dashboard/users')
  }


  update() {
    this.loading = true
    this.form.controls['id_rol'].setValue(this.rolsCtrl.value.id)

    console.log(this.form.value)
    this._userService.update(this.form.value, this.image).subscribe({
      next: (resp) => {
        Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        this._router.navigateByUrl('dashboard/users')
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
        this.loadData()
        this.loadComponentSelectRols()

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
    this.loadRols()
  }
}
