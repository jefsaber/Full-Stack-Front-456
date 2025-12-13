import type { Meta, StoryObj } from '@storybook/angular';
import { PromoSummaryComponent } from './promo-summary.component';

const meta: Meta<PromoSummaryComponent> = {
  title: 'Rich/PromoSummary',
  component: PromoSummaryComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    discount: { control: { type: 'range', min: 5, max: 50 } },
    validUntil: { control: 'date' },
    status: { control: { type: 'radio', options: ['active', 'expired'] } },
  },
  args: {
    title: 'Weekend Flash',
    description: '30% off on totes, mugs and desk essentials.',
    discount: 30,
    validUntil: '2025-12-31',
    status: 'active',
    applyPromo: () => console.info('applyPromo'),
    dismissPromo: () => console.info('dismissPromo'),
  },
};

export default meta;
type Story = StoryObj<PromoSummaryComponent>;

export const Active: Story = {};

export const Expired: Story = {
  args: {
    status: 'expired',
  },
};

export const DeepDiscount: Story = {
  args: {
    discount: 45,
    title: 'Holiday Clearance',
    status: 'active',
  },
};
