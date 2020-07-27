import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripStopsPage } from './trip-stops.page';

describe('TripStopsPage', () => {
  let component: TripStopsPage;
  let fixture: ComponentFixture<TripStopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripStopsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripStopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
