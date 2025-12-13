import type { Meta, StoryObj } from '@storybook/angular';
import { UserProfileFormComponent } from './user-profile-form.component';

const meta: Meta<UserProfileFormComponent> = {
  title: 'Rich/UserProfileForm',
  component: UserProfileFormComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    name: { control: 'text' },
    email: { control: 'text' },
    newsletter: { control: 'boolean' },
  },
  args: {
    title: 'Customer Profile',
    name: 'Juliette Martin',
    email: 'juliette@company.dev',
    newsletter: true,
    submitProfile: (payload: { name: string; email: string; newsletter: boolean }) => {
      console.info('submitProfile', payload);
    },
  },
};

export default meta;
type Story = StoryObj<UserProfileFormComponent>;

export const Default: Story = {};

export const WithoutNewsletter: Story = {
  args: {
    newsletter: false,
    title: 'Quick Profile',
  },
};
