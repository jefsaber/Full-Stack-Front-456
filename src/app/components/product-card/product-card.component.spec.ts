import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { By } from '@angular/platform-browser';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering product information', () => {
    beforeEach(() => {
      component.name = 'Test Product';
      component.price = 29.99;
      component.created_at = '2024-01-15T10:30:00';
      component.avgRating = 4.5;
      fixture.detectChanges();
    });

    it('should display the product name', () => {
      const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
      expect(titleElement.nativeElement.textContent).toContain('Test Product');
    });

    it('should display the product price with dollar sign', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('$29.99');
    });

    it('should display the average rating', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('4.5/5');
    });

    it('should display a star rating indicator', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('★');
    });

    it('should display the creation date', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Created:');
    });
  });

  describe('input binding', () => {
    it('should accept name input', () => {
      component.name = 'Widget';
      expect(component.name).toBe('Widget');
    });

    it('should accept price input', () => {
      component.price = 99.99;
      expect(component.price).toBe(99.99);
    });

    it('should accept avgRating input', () => {
      component.avgRating = 3.5;
      expect(component.avgRating).toBe(3.5);
    });

    it('should accept optional imageUrl input', () => {
      component.imageUrl = 'https://example.com/image.jpg';
      expect(component.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should handle undefined imageUrl', () => {
      expect(component.imageUrl).toBeUndefined();
    });
  });

  describe('display formatting', () => {
    it('should format high prices correctly', () => {
      component.name = 'Expensive Item';
      component.price = 1299.99;
      component.created_at = '2024-01-01';
      component.avgRating = 5;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('$1299.99');
    });

    it('should format low ratings correctly', () => {
      component.name = 'Low Rated Item';
      component.price = 10;
      component.created_at = '2024-01-01';
      component.avgRating = 1;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('1/5');
    });

    it('should format zero price correctly', () => {
      component.name = 'Free Item';
      component.price = 0;
      component.created_at = '2024-01-01';
      component.avgRating = 4;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('$0');
    });
  });
});
