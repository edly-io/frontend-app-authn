import { PARISH_REGIONS } from '../constants';

// Guard against drift: TPDCO_PARISH_REGIONS in edly-features-app (edly_features_app/constants.py) must hold exactly
// this map (its test_tpdco_registration.py pins the same literal). Change both repos together.
describe('PARISH_REGIONS', () => {
  it('matches the backend parish -> region map', () => {
    expect(PARISH_REGIONS).toEqual({
      Kingston: 'Kingston',
      'St Andrew': 'Kingston',
      'St Catherine': 'Kingston',
      'St Thomas': 'Kingston',
      Portland: 'Portland',
      'St Mary': 'Ocho Rios',
      'St Ann': 'Ocho Rios',
      Trelawny: 'Falmouth',
      'St James': 'Montego Bay',
      Hanover: 'Negril',
      Westmoreland: 'Negril',
      Clarendon: 'South Coast',
      Manchester: 'South Coast',
      'St Elizabeth': 'South Coast',
    });
  });
});
