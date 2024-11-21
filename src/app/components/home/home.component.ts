import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  navItems = [
    { icon: '🏠', label: 'Home', active: true },
    { icon: '📚', label: 'Books', active: false },
    { icon: '🔍', label: 'Search', active: false },
    { icon: '💳', label: 'Payments', active: false },
    { icon: '👤', label: 'Profile', active: false }
  ];

  setActive(label: string) {
    this.navItems = this.navItems.map(item => ({
      ...item,
      active: item.label === label
    }));
  }
}