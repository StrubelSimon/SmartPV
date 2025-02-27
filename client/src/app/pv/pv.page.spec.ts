import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { PVPage } from './pv.page';

describe('Tab2Page', () => {
  let component: PVPage;
  let fixture: ComponentFixture<PVPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PVPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PVPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
