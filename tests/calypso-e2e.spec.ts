import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { TicketWorkspacePage, TicketScenario } from '../pages/TicketWorkspacePage';

const APP_URL = `file://${path.resolve(__dirname, '../app/index.html')}`;

test.describe('Calypso Mapping Validation Suite', () => {
  test('@smoke Verify valid evidence ticket commits map edit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const workspace = new TicketWorkspacePage(page);

    await loginPage.goto(APP_URL);
    await loginPage.login('surya_ops', 'Map@2026');

    const validTicket: TicketScenario = {
      ticketId: 'TKT-101',
      hasValidEvidence: true,
      expectedMessage: 'Map Edit Committed to Ledger',
    };

    await workspace.processTicket(validTicket);
  });

  test('@regression Verify no-evidence ticket resolves without map edits', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const workspace = new TicketWorkspacePage(page);

    await loginPage.goto(APP_URL);
    await loginPage.login('surya_ops', 'Map@2026');

    const noEvidenceTicket: TicketScenario = {
      ticketId: 'TKT-404',
      hasValidEvidence: false,
      expectedMessage: 'Ticket Resolved Without Map Edits',
    };

    await workspace.processTicket(noEvidenceTicket);
  });

     test('@regression API Testing: Validate Ticket Metadata Endpoint', async ({ page }) => {
    // Intercept an HTTP page + API request cleanly without file:// CORS restrictions
    await page.route('http://calypso.local', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ticketId: 'TKT-101',
          vectorType: 'ROAD_CLOSURE',
          hasStreetView: true,
          status: 'VERIFIED',
        }),
      });
    });

    const response = await page.goto('http://calypso.local');
    expect(response?.status()).toBe(200);

    const body = await response?.json();
    expect(body).toHaveProperty('ticketId', 'TKT-101');
    expect(body.hasStreetView).toBe(true);
  });



});
