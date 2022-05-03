import { Component } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  RouterEvent,
} from '@angular/router';
import { AuthService } from './user/auth.service';
import { slideInAnimation } from './app.animation';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation],
})
export class AppComponent {
  pageTitle = 'Acme Product Management';

  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  get isMessageDisplayed() : boolean {
    return this.messageService.isMessageDisplayed;
  }

  constructor(private authService: AuthService, private router: Router, private messageService : MessageService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.checkRouterEvent(event);
    });
  }

  logOut(): void {
    this.authService.logout();
    console.log('Log out');
    this.router.navigateByUrl('/welcome');
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }

  displayMessage():void {
    this.router.navigate([{outlets : {popup : ['messages']}}]);
    this.messageService.isMessageDisplayed=true;
  }

  hideMessage():void {
    this.router.navigate([{outlets : {popup : null}}]);
    this.messageService.isMessageDisplayed=false;
  }
}
