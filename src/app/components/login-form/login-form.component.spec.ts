import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize with default demo credentials', () => {
      expect(component.loginForm.get('username')?.value).toBe('demo');
      expect(component.loginForm.get('password')?.value).toBe('demo');
    });

    it('should have a valid form with default values', () => {
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should be invalid when username is empty', () => {
      component.loginForm.get('username')?.setValue('');
      expect(component.loginForm.get('username')?.hasError('required')).toBe(true);
      expect(component.loginForm.valid).toBe(false);
    });

    it('should be invalid when password is empty', () => {
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
      expect(component.loginForm.valid).toBe(false);
    });

    it('should be valid when both fields are filled', () => {
      component.loginForm.get('username')?.setValue('testuser');
      component.loginForm.get('password')?.setValue('testpass');
      expect(component.loginForm.valid).toBe(true);
    });

    it('should show username error message when touched and empty', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('username')?.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.text-red-500');
      expect(errorElement?.textContent).toContain('Username is required');
    });

    it('should show password error message when touched and empty', () => {
      component.loginForm.get('password')?.setValue('');
      component.loginForm.get('password')?.markAsTouched();
      fixture.detectChanges();

      const errorMessages = fixture.nativeElement.querySelectorAll('.text-red-500');
      const passwordError = Array.from(errorMessages).find(
        (el: any) => el.textContent.includes('Password is required')
      );
      expect(passwordError).toBeTruthy();
    });
  });

  describe('form submission', () => {
    it('should emit submit event with form values on valid submit', () => {
      const submitSpy = spyOn(component.submit, 'emit');

      component.loginForm.get('username')?.setValue('myuser');
      component.loginForm.get('password')?.setValue('mypass');

      component.onSubmit();

      expect(submitSpy).toHaveBeenCalledWith({
        username: 'myuser',
        password: 'mypass',
      });
    });

    it('should not emit submit event when form is invalid', () => {
      const submitSpy = spyOn(component.submit, 'emit');

      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(submitSpy).not.toHaveBeenCalled();
    });

    it('should submit form when button is clicked and form is valid', () => {
      const submitSpy = spyOn(component.submit, 'emit');

      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pass');
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      expect(submitSpy).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should disable submit button when loading', () => {
      component.loading = () => true;
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(true);
    });

    it('should show "Signing in..." text when loading', () => {
      component.loading = () => true;
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.textContent).toContain('Signing in');
    });

    it('should show "Sign In" text when not loading', () => {
      component.loading = () => false;
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.textContent).toContain('Sign In');
    });
  });

  describe('error state', () => {
    it('should display error message when error input is set', () => {
      component.error = () => 'Invalid credentials';
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.bg-red-50');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv.textContent).toContain('Invalid credentials');
    });

    it('should not display error message when error is null', () => {
      component.error = () => null;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.bg-red-50');
      expect(errorDiv).toBeFalsy();
    });
  });

  describe('submit button state', () => {
    it('should disable button when form is invalid', () => {
      component.loginForm.get('username')?.setValue('');
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable button when form is valid and not loading', () => {
      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pass');
      component.loading = () => false;
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(false);
    });
  });
});
