import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user-profile-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-lg">
      <header>
        <p class="text-xs uppercase tracking-[0.3em] text-indigo-200">Profile</p>
        <h2 class="text-3xl font-bold text-white">{{ title }}</h2>
        <p class="text-sm text-gray-300">Mettez à jour vos informations personnelles.</p>
      </header>

      <form
        [formGroup]="profileForm"
        (ngSubmit)="submitProfile.emit(getPayload())"
        class="space-y-5"
      >
        <label class="block space-y-1 text-sm text-gray-200">
          <span>Name</span>
          <input
            formControlName="name"
            class="w-full px-4 py-3 bg-slate-950/30 border border-white/20 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>

        <label class="block space-y-1 text-sm text-gray-200">
          <span>Email</span>
          <input
            formControlName="email"
            type="email"
            class="w-full px-4 py-3 bg-slate-950/30 border border-white/20 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>

        <label class="flex items-center gap-3 mt-2 text-sm text-gray-200">
          <input type="checkbox" formControlName="newsletter" class="h-4 w-4 rounded border-white/40" />
          Receive newsletter & updates
        </label>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-3 rounded-2xl hover:opacity-90 transition"
        >
          Save Profile
        </button>
      </form>
    </section>
  `,
})
export class UserProfileFormComponent implements OnChanges {
  @Input() title = 'User Profile';
  @Input() name = 'Jane Doe';
  @Input() email = 'jane.doe@example.com';
  @Input() newsletter = true;
  @Output() submitProfile = new EventEmitter<{ name: string; email: string; newsletter: boolean }>();

  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      newsletter: [this.newsletter],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.profileForm) {
      this.profileForm.patchValue({
        name: this.name,
        email: this.email,
        newsletter: this.newsletter,
      });
    }
  }

  getPayload(): { name: string; email: string; newsletter: boolean } {
    const { name, email, newsletter } = this.profileForm.value as {
      name: string | null;
      email: string | null;
      newsletter: boolean | null;
    };

    return {
      name: name ?? '',
      email: email ?? '',
      newsletter: newsletter ?? false,
    };
  }
}
