import type { Meta, StoryObj } from '@storybook/angular';
import { WishlistButtonComponent } from './wishlist-button.component';

const meta: Meta<WishlistButtonComponent> = {
  title: 'Rich/WishlistButton',
  component: WishlistButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['small', 'medium', 'large'] } },
    label: { control: 'text' },
    activeLabel: { control: 'text' },
  },
  args: {
    active: false,
    size: 'medium',
    label: 'Save for later',
    activeLabel: 'Wishlisted',
    toggleWishlist: () => console.info('toggleWishlist'),
  },
};

export default meta;
type Story = StoryObj<WishlistButtonComponent>;

export const Default: Story = {};

export const ActiveState: Story = {
  args: {
    active: true,
    size: 'large',
  },
};

export const Compact: Story = {
  args: {
    size: 'small',
    label: 'Add to heart',
  },
};
