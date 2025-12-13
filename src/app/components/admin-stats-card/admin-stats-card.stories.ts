import type { Meta, StoryObj } from '@storybook/angular';
import { AdminStatsCardComponent } from './admin-stats-card.component';

const meta: Meta<AdminStatsCardComponent> = {
  title: 'Rich/AdminStatsCard',
  component: AdminStatsCardComponent,
  tags: ['autodocs'],
  argTypes: {
    orders: { control: { type: 'number', min: 0 } },
    conversion: { control: { type: 'number', min: 0, max: 10, step: 0.1 } },
    revenue: { control: { type: 'number', min: 0 } },
    description: { control: 'text' },
  },
  args: {
    title: 'Dashboard Pulse',
    orders: 192,
    conversion: 4.5,
    revenue: 34000,
    description: 'Live snapshot for the marketing team.',
    refreshStats: () => console.info('refreshStats'),
  },
};

export default meta;
type Story = StoryObj<AdminStatsCardComponent>;

export const Overview: Story = {};

export const TrafficSpike: Story = {
  args: {
    orders: 320,
    conversion: 6.1,
    revenue: 56000,
    description: 'Holiday push with record volume.',
  },
};

export const SlowerDay: Story = {
  args: {
    orders: 85,
    conversion: 2.8,
    revenue: 12500,
    description: 'Low-traffic weekend snapshot.',
  },
};
