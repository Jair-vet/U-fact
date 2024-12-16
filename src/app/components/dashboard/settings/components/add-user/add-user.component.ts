import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  installCSD: boolean = false
  serie: string = ''
  date: string = ''
  form: FormGroup
  public showPassword: boolean = false;
  loading: boolean = false
  constructor(private _userService: UserService, private _formBuider: FormBuilder) {



    this.form = this._formBuider.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required],

    })

  }
  async addUser() {

  }

  ngOnInit(): void {
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


}
