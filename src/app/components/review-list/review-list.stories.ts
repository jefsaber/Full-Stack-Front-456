import type { Meta, StoryObj } from '@storybook/angular';
import { ReviewListComponent, Review } from './review-list.component';

const reviewSamples: Review[] = [
  {
    id: 1,
    author: 'Constance Lopez',
    rating: 5,
    comment: 'Livraison rapide, produit conforme au descriptif.',
    createdAt: '2025-04-17T10:00:00Z',
  },
  {
    id: 2,
    author: 'Marc-Antoine',
    rating: 3,
    comment: 'Bon rapport qualité/prix mais le packaging est fragile.',
    createdAt: '2025-04-10T14:30:00Z',
  },
  {
    id: 3,
    author: 'Jun Lee',
    rating: 4,
    comment: 'Service client réactif, je recommande.',
    createdAt: '2025-04-12T18:45:00Z',
  },
];

const meta: Meta<ReviewListComponent> = {
  title: 'Rich/ReviewList',
  component: ReviewListComponent,
  tags: ['autodocs'],
  argTypes: {
    reviews: { control: false },
    highlightRating: { control: { type: 'range', min: 1, max: 5, step: 0.5 } },
  },
  args: {
    reviews: reviewSamples,
    highlightRating: 4,
    reviewSelected: (review: Review) => console.info('reviewSelected', review),
  },
};

export default meta;
type Story = StoryObj<ReviewListComponent>;

export const Default: Story = {};

export const HighlightTopScores: Story = {
  args: {
    highlightRating: 4.5,
  },
};

export const EmptyState: Story = {
  args: {
    reviews: [],
  },
};
