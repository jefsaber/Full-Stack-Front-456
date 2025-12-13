import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  standalone: true,
  selector: 'app-review-list',
  imports: [CommonModule],
  template: `
    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-white">User Reviews</h3>
        <span class="text-sm text-gray-300">{{ reviews.length }} items</span>
      </div>

      <div *ngFor="let review of reviews" class="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-white">{{ review.author }}</p>
          <button
            type="button"
            class="text-xs text-sky-400 underline"
            (click)="reviewSelected.emit(review)"
          >
            Inspect
          </button>
        </div>
        <p class="text-sm text-gray-400">{{ review.createdAt | date: 'mediumDate' }}</p>
        <div class="flex items-center gap-1">
          <ng-container *ngFor="let star of [1, 2, 3, 4, 5]; track star">
            <span [class]="star <= review.rating ? 'text-yellow-400' : 'text-white/30'">★</span>
          </ng-container>
          <span class="text-sm text-gray-300">{{ review.rating }}/5</span>
        </div>
        <p
          class="text-gray-200 text-sm leading-relaxed"
          [class.text-emerald-300]="review.rating >= highlightRating"
        >
          {{ review.comment }}
        </p>
      </div>
    </section>
  `,
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
  @Input() highlightRating = 4;
  @Output() reviewSelected = new EventEmitter<Review>();
}
