import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-stats-card',
  imports: [CommonModule],
  template: `
    <section class="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)] space-y-4 max-w-sm">
      <header class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-gray-400">Realtime</p>
          <h3 class="text-2xl font-bold text-white">{{ title }}</h3>
        </div>
        <button
          type="button"
          class="px-3 py-1 text-xs uppercase tracking-[0.4em] rounded-full border border-white/20 text-white/70"
          (click)="refreshStats.emit()"
        >
          Refresh
        </button>
      </header>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <p class="text-xs uppercase text-gray-400">Orders</p>
          <p class="text-3xl font-semibold text-emerald-300">{{ orders }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs uppercase text-gray-400">Conversion</p>
          <p class="text-3xl font-semibold text-sky-300">{{ conversion }}%</p>
        </div>
        <div class="space-y-1 col-span-2">
          <p class="text-xs uppercase text-gray-400">Revenue</p>
          <p class="text-3xl font-semibold text-rose-300">€{{ revenue | number: '1.0-0' }}</p>
        </div>
      </div>
      <p class="text-sm text-gray-300">{{ description }}</p>
    </section>
  `,
})
export class AdminStatsCardComponent {
  @Input() title = 'Overview';
  @Input() orders = 128;
  @Input() conversion = 4.2;
  @Input() revenue = 28000;
  @Input() description = 'Realtime snapshot of site health.';
  @Output() refreshStats = new EventEmitter<void>();
}
