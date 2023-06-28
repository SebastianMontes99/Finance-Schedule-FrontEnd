import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === null) {
      localStorage.setItem('isLoggedIn', 'false');
      this.isLoggedIn$.next(false);
    } else {
      this.isLoggedIn$.next(loggedIn === 'true');
    }
  }

  setLoggedIn(value: boolean) {
    localStorage.setItem('isLoggedIn', value.toString());
    this.isLoggedIn$.next(value);
  }

  clearLocalStorage() {
    localStorage.clear();
    this.isLoggedIn$.next(false);
  }
}
