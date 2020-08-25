import { e2e } from '../index';
import { selectOption } from './selectOption';

export interface DashboardTimeRangeConfig {
  from: string;
  to: string;
  zone?: string;
}

export const setDashboardTimeRange = ({ from, to, zone }: DashboardTimeRangeConfig) =>
  e2e.pages.Dashboard.Toolbar.navBar().within(() => {
    e2e()
      .get('[aria-label="TimePicker Open Button"]')
      .click();

    if (zone) {
      e2e()
        .contains('button', 'Change time zone')
        .click();
      selectOption(e2e.pages.Dashboard.Settings.General.timezone(), zone, false);
    }

    // For smaller screens
    e2e()
      .get('[aria-label="TimePicker absolute time range"]')
      .click();

    e2e()
      .get('[aria-label="TimePicker from field"]')
      .clear()
      .type(from);
    e2e()
      .get('[aria-label="TimePicker to field"]')
      .clear()
      .type(to);
    e2e()
      .get('[aria-label="TimePicker submit button"]')
      .click();
  });
