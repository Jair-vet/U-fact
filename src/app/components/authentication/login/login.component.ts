import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup
  hide = true
  loading = false
  bounceDivState = 'initial';

  constructor(private _formBuider: FormBuilder, private _router: Router, private _userService: UserService) {
    this.form = this._formBuider.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false, Validators.required]

    })
    this.form.controls['email'].setValue(localStorage.getItem('email') || '')
    this.bounceDivState = 'active';
  }

  ngOnInit(): void {
  }
  saveEmail() {
    localStorage.setItem('email', this.form.value.email);
  }

  login() {
    this.loading = true

    this._userService.login(this.form.value).subscribe({
      error: (err) => {
        Swal.fire({ title: 'ERROR', text: err.error.msg, icon: 'error', heightAuto: false })
        this.loading = false
      },
      complete: () => {
        if (this.form.value.remember) {
          this.saveEmail()
        }
        this._router.navigateByUrl('/dashboard/clients')

      },

    })

  }

}
