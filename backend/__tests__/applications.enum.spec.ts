import {
    ApplicationDepartmentType,
    ApplicationDegreeProgramType,
  } from 'src/modules/applications/applications.enum';
  
  describe('ApplicationDepartmentType', () => {
    it('contains all expected department codes', () => {
      expect(Object.values(ApplicationDepartmentType)).toEqual([
        'BME',
        'CBE',
        'CEE',
        'ECE',
        'ISE',
        'ME',
      ]);
    });
  });
  
  describe('ApplicationDegreeProgramType', () => {
    it('contains all expected degree program codes', () => {
      expect(Object.values(ApplicationDegreeProgramType)).toEqual([
        'MS',
        'MSMT',
        'PHD',
      ]);
    });
  });
  