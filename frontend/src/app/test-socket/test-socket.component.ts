import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-socket',
  templateUrl: './test-socket.component.html',
})
export class TestSocketComponent implements OnInit, OnDestroy {
  welcomeMessage: string = '';
  private welcomeSub!: Subscription;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    const userId = 'testUser123'; // Remplace avec un userId réel
    this.socketService.connect();

    this.welcomeSub = this.socketService.onWelcome().subscribe((message) => {
      this.welcomeMessage = message;
    });
  }

  ngOnDestroy(): void {
    this.welcomeSub?.unsubscribe();
    this.socketService.disconnect();
  }
}
