import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCartBreakdown } from '../../state/cart/cart.selectors';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const EXPRESS_SURCHARGE = 9.99;

@Component({
  standalone: true,
  selector: 'app-checkout-address',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold">
            ✓
          </div>
          <div class="flex-1 h-1 bg-emerald-600 mx-4"></div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold">
            ✓
          </div>
          <div class="flex-1 h-1 bg-blue-600 mx-4"></div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full font-bold">
            3
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-6">Delivery Address</h2>

      <form [formGroup]="addressForm" class="space-y-4">
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-300 block mb-2">First Name</label>
            <input
              type="text"
              formControlName="firstName"
              placeholder="John"
              class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
            />
            @if (addressForm.get('firstName')?.invalid && addressForm.get('firstName')?.touched) {
              <p class="text-red-400 text-xs mt-1">First name is required</p>
            }
          </div>
          <div>
            <label class="text-sm text-gray-300 block mb-2">Last Name</label>
            <input
              type="text"
              formControlName="lastName"
              placeholder="Doe"
              class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
            />
            @if (addressForm.get('lastName')?.invalid && addressForm.get('lastName')?.touched) {
              <p class="text-red-400 text-xs mt-1">Last name is required</p>
            }
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm text-gray-300 block mb-2">Email</label>
          <input
            type="email"
            formControlName="email"
            placeholder="john@example.com"
            class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
          />
          @if (addressForm.get('email')?.invalid && addressForm.get('email')?.touched) {
            @if (addressForm.get('email')?.errors?.['required']) {
              <p class="text-red-400 text-xs mt-1">Email is required</p>
            }
            @if (addressForm.get('email')?.errors?.['email']) {
              <p class="text-red-400 text-xs mt-1">Please enter a valid email</p>
            }
          }
        </div>

        <!-- Address -->
        <div>
          <label class="text-sm text-gray-300 block mb-2">Street Address</label>
          <input
            type="text"
            formControlName="street"
            placeholder="123 Main Street"
            class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
          />
          @if (addressForm.get('street')?.invalid && addressForm.get('street')?.touched) {
            <p class="text-red-400 text-xs mt-1">Street address is required</p>
          }
        </div>

        <!-- City, Zip, Country -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-sm text-gray-300 block mb-2">City</label>
            <input
              type="text"
              formControlName="city"
              placeholder="New York"
              class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
            />
            @if (addressForm.get('city')?.invalid && addressForm.get('city')?.touched) {
              <p class="text-red-400 text-xs mt-1">City is required</p>
            }
          </div>
          <div>
            <label class="text-sm text-gray-300 block mb-2">ZIP Code</label>
            <input
              type="text"
              formControlName="zipCode"
              placeholder="10001"
              class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
            />
            @if (addressForm.get('zipCode')?.invalid && addressForm.get('zipCode')?.touched) {
              <p class="text-red-400 text-xs mt-1">ZIP code is required</p>
            }
          </div>
          <div>
            <label class="text-sm text-gray-300 block mb-2">Country</label>
            <select
              formControlName="country"
              class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:border-blue-400 outline-none transition"
            >
              <option value="" class="bg-slate-800">Select Country</option>
              <option value="DE" class="bg-slate-800">Germany</option>
              <option value="FR" class="bg-slate-800">France</option>
              <option value="IT" class="bg-slate-800">Italy</option>
              <option value="ES" class="bg-slate-800">Spain</option>
              <option value="NL" class="bg-slate-800">Netherlands</option>
            </select>
            @if (addressForm.get('country')?.invalid && addressForm.get('country')?.touched) {
              <p class="text-red-400 text-xs mt-1">Country is required</p>
            }
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="text-sm text-gray-300 block mb-2">Phone Number</label>
          <input
            type="tel"
            formControlName="phone"
            placeholder="+49 123 456 789"
            class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:border-blue-400 outline-none transition"
          />
          @if (addressForm.get('phone')?.invalid && addressForm.get('phone')?.touched) {
            <p class="text-red-400 text-xs mt-1">Phone number is required</p>
          }
        </div>

        <!-- Delivery Options -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <label class="text-sm text-gray-300 block mb-3">Delivery Option</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                formControlName="deliveryOption"
                value="standard"
                class="w-4 h-4"
              />
              <span class="text-white">Standard (2-3 days) - Free</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                formControlName="deliveryOption"
                value="express"
                class="w-4 h-4"
              />
              <span class="text-white">Express (1 day) - €9.99</span>
            </label>
          </div>
        </div>

        <!-- Order Total Preview -->
        <div class="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-300">Total to Pay:</span>
            <span class="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              €{{ (totalWithShipping$ | async)?.toFixed(2) }}
            </span>
          </div>
        </div>
      </form>

      <!-- Navigation -->
      <div class="flex gap-4">
        <button
          type="button"
          (click)="onPreviousStep()"
          class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg font-semibold transition"
        >
          ← Back to Summary
        </button>
        <button
          type="button"
          (click)="onNextStep()"
          class="flex-1 bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold transition"
        >
          Review Order →
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class CheckoutAddressComponent implements OnInit, OnChanges {
  @Output() nextStep = new EventEmitter<any>();
  @Output() previousStep = new EventEmitter<void>();
  @Input() initialAddress: any;

  addressForm: FormGroup;
  totalWithShipping$: Observable<number>;
  private deliveryOptionSubject = new BehaviorSubject<string>('standard');

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      deliveryOption: ['standard', Validators.required],
    });

    const deliveryControl = this.addressForm.get('deliveryOption');
    deliveryControl!.valueChanges.subscribe((value) => {
      this.deliveryOptionSubject.next(value);
    });

    this.totalWithShipping$ = combineLatest([
      this.store.select(selectCartBreakdown),
      this.deliveryOptionSubject.asObservable(),
    ]).pipe(
      map(([breakdown, option]) => breakdown.grandTotal + (option === 'express' ? EXPRESS_SURCHARGE : 0))
    );
  }

  ngOnInit(): void {
    this.patchInitialValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialAddress'] && changes['initialAddress'].currentValue) {
      this.patchInitialValues();
    }
  }

  private patchInitialValues(): void {
    if (this.initialAddress) {
      this.addressForm.patchValue(this.initialAddress);
      this.deliveryOptionSubject.next(this.addressForm.get('deliveryOption')?.value || 'standard');
    }
  }

  onPreviousStep(): void {
    this.previousStep.emit();
  }

  onNextStep(): void {
    if (this.addressForm.valid) {
      this.nextStep.emit(this.addressForm.value);
    } else {
      alert('Please fill in all required fields');
    }
  }
}
