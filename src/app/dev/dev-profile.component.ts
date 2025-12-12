import { Component, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface UserProfile {
  fullName: string;
  email: string;
  preferences: {
    newsletter: boolean;
    preferredRating: number;
  };
}

@Component({
  standalone: true,
  selector: 'app-dev-profile',
  imports: [CommonModule, JsonPipe, FormsModule, RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav class="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div class="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">👤</span>
            </div>
            <h1 class="text-2xl font-bold text-white">User Profile Endpoint</h1>
          </div>
          <button
            type="button"
            mat-button
            routerLink="/dev"
            class="text-gray-200 hover:text-white transition"
          >
            ← Back to Dev
          </button>
        </div>
      </nav>

      <div class="mx-auto max-w-3xl px-6 py-16 space-y-8">
        <div class="space-y-2">
          <h2 class="text-4xl font-bold text-white">GET /api/me/</h2>
          <p class="text-sm text-gray-300">Reloads the mocked user profile, including preferences.</p>
        </div>
        <div class="space-y-4">
          <button
            type="button"
            (click)="loadProfile()"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Fetch Profile
          </button>
          @if (profile(); as current)
            <pre class="rounded-2xl bg-slate-950/70 p-4 text-sm text-emerald-200 overflow-x-auto">{{ current | json }}</pre>
          @else
            <p class="text-gray-400 text-sm">Click "Fetch Profile" to load the current user.</p>
          }
        </div>

        <div class="space-y-2">
          <h2 class="text-4xl font-bold text-white">PATCH /api/me/</h2>
          <p class="text-sm text-gray-300">Send a partial update (preferences, full name, etc.).</p>
        </div>
        <form class="grid gap-4" (submit)="$event.preventDefault(); updateProfile()">
          <input
            type="text"
            [(ngModel)]="updatePayload.fullName"
            name="fullName"
            placeholder="Full Name"
            class="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
          />
          <div class="grid grid-cols-2 gap-4">
            <label class="flex flex-col space-y-1 text-sm text-gray-300">
              Newsletter
              <select
                [(ngModel)]="updatePayload.preferences.newsletter"
                name="newsletter"
                class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option [value]="true">Enabled</option>
                <option [value]="false">Disabled</option>
              </select>
            </label>
            <label class="flex flex-col space-y-1 text-sm text-gray-300">
              Preferred Rating
              <input
                type="number"
                [(ngModel)]="updatePayload.preferences.preferredRating"
                name="preferredRating"
                min="1"
                max="5"
                step="1"
                class="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </label>
          </div>
          <button
            type="submit"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Apply Update
          </button>
        </form>
        @if (updateResp(); as resp)
          <pre class="rounded-2xl bg-slate-950/70 p-4 text-sm text-emerald-200 overflow-x-auto">{{ resp | json }}</pre>
        }
        @if (error())
          <div class="rounded-2xl bg-red-500/20 border border-red-500/50 p-4 text-sm text-red-200">
            {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `:host ::ng-deep .mat-mdc-button { text-transform: none !important; }`
  ]
})
export class DevProfileComponent {
  readonly profile = signal<UserProfile | null>(null);
  readonly updateResp = signal<UserProfile | null>(null);
  readonly error = signal<string | null>(null);

  updatePayload: Partial<UserProfile> = {
    fullName: '',
    preferences: {
      newsletter: true,
      preferredRating: 4,
    },
  };

  async loadProfile(): Promise<void> {
    this.error.set(null);
    const res = await fetch('/api/me/');
    if (!res.ok) {
      this.error.set(`${res.status} ${res.statusText}`);
      return;
    }
    const json = (await res.json()) as UserProfile;
    this.profile.set(json);
  }

  async updateProfile(): Promise<void> {
    this.error.set(null);
    this.updateResp.set(null);
    const res = await fetch('/api/me/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.updatePayload),
    });
    if (!res.ok) {
      this.error.set(`${res.status} ${res.statusText}`);
      return;
    }
    this.updateResp.set((await res.json()) as UserProfile);
  }
}
