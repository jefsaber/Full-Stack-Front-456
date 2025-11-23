import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutSummaryComponent } from './checkout/step1-summary.component';
import { CheckoutAddressComponent } from './checkout/step2-address.component';
import { CheckoutConfirmComponent } from './checkout/step3-confirm.component';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, CheckoutSummaryComponent, CheckoutAddressComponent, CheckoutConfirmComponent],
  template: `
    <div class="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
      <!-- Background Gradient Blobs -->
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-tl from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>

      <div class="mx-auto max-w-2xl relative z-10">
        <!-- Header -->
        <div class="sticky top-0 z-20 mb-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 -mx-6 px-6 py-4 rounded-b-2xl">
          <h1 class="text-3xl font-bold text-white">Checkout</h1>
          <p class="text-gray-400 text-sm">Step {{ currentStep }} of 3</p>
        </div>

        <!-- Step Content -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          @switch (currentStep) {
            @case (1) {
              <app-checkout-summary (nextStep)="goToStep(2)"></app-checkout-summary>
            }
            @case (2) {
              <app-checkout-address
                (nextStep)="goToStep(3)"
                #addressComponent
                (previousStep)="goToStep(1)"
              ></app-checkout-address>
            }
            @case (3) {
              <app-checkout-confirm
                [addressData]="getAddressData()"
                (previousStep)="goToStep(2)"
              ></app-checkout-confirm>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CheckoutPageComponent {
  @ViewChild(CheckoutAddressComponent) addressComponent?: CheckoutAddressComponent;

  currentStep = 1;

  goToStep(step: number): void {
    this.currentStep = step;
    window.scrollTo(0, 0);
  }

  getAddressData(): any {
    return this.addressComponent?.addressForm.value || null;
  }
}
