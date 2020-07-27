import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeatsReservationPage } from './seats-reservation.page';

describe('SeatsReservationPage', () => {
  let component: SeatsReservationPage;
  let fixture: ComponentFixture<SeatsReservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatsReservationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeatsReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
