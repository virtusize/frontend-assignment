import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userName: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  setUserName(name: string) {
    this.userName = name;
  }
  getUserName(): string {
    return this.userName;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`https://glowing-fishstick-g6vjrxjwjwpfvxpp-4090.app.github.dev/users?email=${email}`)
      .pipe(
        map(users => {
          const user = users[0];
          if (user && user.password === password) {
            this.userName = user.name;
            return user;
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        catchError(err => throwError(() => new Error('Login failed')))
      );
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
