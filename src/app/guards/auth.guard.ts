import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { tap } from 'rxjs/operators'
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) { }
  canActivate() {
    return this._userService.validateToken().pipe(tap(isAuth => {
      console.log(isAuth)
      if (!isAuth) {
        this._router.navigateByUrl('/login')
      }
    }));

  }

}
