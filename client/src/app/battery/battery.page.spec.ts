import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BatteryPage } from './battery.page';

describe('Tab1Page', () => {
  let component: BatteryPage;
  let fixture: ComponentFixture<BatteryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatteryPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BatteryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
