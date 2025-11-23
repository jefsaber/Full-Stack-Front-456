import { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsPageComponent } from './product-details-page.component';

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/Product Details',
  component: ProductDetailsPageComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div class="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
        <div class="mx-auto max-w-4xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex items-center justify-center h-96">
              <div class="text-center">
                <p class="text-8xl mb-4">📦</p>
                <p class="text-gray-300">Product Image</p>
              </div>
            </div>
            <div class="space-y-6">
              <div>
                <h2 class="text-4xl font-bold text-white mb-3">Premium Laptop</h2>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">★★★★★</div>
                  <span class="text-gray-300">4.8 (45 reviews)</span>
                </div>
              </div>
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <p class="text-gray-400 text-sm mb-2">Price</p>
                <p class="text-5xl font-bold text-emerald-400">€1,299.99</p>
              </div>
              <div>
                <button class="w-full bg-linear-to-r from-emerald-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const OutOfStock: Story = {
  render: () => ({
    template: `
      <div class="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
        <div class="mx-auto max-w-4xl">
          <div class="bg-red-500/10 border border-red-500/50 rounded-2xl p-6">
            <p class="text-red-400 font-medium">Out of stock - Check back soon</p>
          </div>
        </div>
      </div>
    `,
  }),
};
