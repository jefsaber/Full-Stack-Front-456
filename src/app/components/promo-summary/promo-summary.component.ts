import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-promo-summary',
  imports: [CommonModule],
  template: `
    <article class="p-6 rounded-3xl bg-gradient-to-br from-purple-900/70 to-emerald-700/40 border border-white/10 shadow-2xl space-y-4 max-w-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-pink-200">Promotion</p>
          <h3 class="text-3xl font-bold text-white">{{ title }}</h3>
        </div>
        <span
          class="px-3 py-1 rounded-full text-sm font-semibold"
          [class.bg-emerald-500/20]="status === 'active'"
          [class.text-emerald-300]="status === 'active'"
          [class.bg-gray-700/40]="status === 'expired'"
          [class.text-gray-300]="status === 'expired'"
        >
          {{ status | uppercase }}
        </span>
      </div>
      <p class="text-sm text-gray-200 leading-relaxed">{{ description }}</p>
      <div class="flex items-baseline gap-3">
        <p class="text-4xl font-bold text-emerald-300">-{{ discount }}%</p>
        <p class="text-xs uppercase tracking-[0.3em] text-gray-200">valid until {{ validUntil }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="applyPromo.emit()"
          [disabled]="status !== 'active'"
          class="px-4 py-2 rounded-2xl text-sm font-semibold transition"
          [class.bg-emerald-500]="status === 'active'"
          [class.bg-gray-600]="status !== 'active'"
          [class.text-white]="status === 'active'"
          [class.text-gray-200]="status !== 'active'"
        >
          Apply Promo
        </button>
        <button
          type="button"
          class="text-sm text-white/70 underline"
          (click)="dismissPromo.emit()"
        >
          Dismiss
        </button>
      </div>
    </article>
  `,
})
export class PromoSummaryComponent {
  @Input() title = 'Flash Friday';
  @Input() description = 'Profitez dune réduction immédiate sur toute la boutique.';
  @Input() discount = 20;
  @Input() validUntil = '2025-12-31';
  @Input() status: 'active' | 'expired' = 'active';
  @Output() applyPromo = new EventEmitter<void>();
  @Output() dismissPromo = new EventEmitter<void>();
}
