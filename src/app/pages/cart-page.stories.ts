import { Meta, StoryObj } from '@storybook/angular';
import { CartPageComponent } from './cart-page.component';
import { CartItem } from '../state/cart/cart.actions';

const mockItems: CartItem[] = [
  { id: 1, name: 'Premium Laptop', price: 1299.99, quantity: 1, avgRating: 4.8 },
  { id: 2, name: 'Wireless Mouse', price: 29.99, quantity: 2, avgRating: 4.3 },
  { id: 3, name: 'USB-C Cable', price: 12.99, quantity: 3, avgRating: 4.5 },
];

const meta: Meta<CartPageComponent> = {
  title: 'Shop/Cart Page',
  component: CartPageComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CartPageComponent>;

export const WithItems: Story = {};

export const EmptyCart: Story = {};

