import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-wishlist-button',
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggleWishlist.emit()"
      class="px-5 py-2 rounded-full font-semibold transition inline-flex items-center gap-2 border-2"
      [class.border-pink-400]="active"
      [class.border-white/40]="!active"
      [class.text-pink-200]="active"
      [class.text-white]="!active"
      [class.bg-pink-500/10]="active"
    >
      <span [class.text-xl]="size === 'large'">{{ active ? '💖' : '🤍' }}</span>
      <span>{{ active ? activeLabel : label }}</span>
    </button>
  `,
})
export class WishlistButtonComponent {
  @Input() active = false;
  @Input() label = 'Save for later';
  @Input() activeLabel = 'Wishlisted';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() toggleWishlist = new EventEmitter<void>();
}
