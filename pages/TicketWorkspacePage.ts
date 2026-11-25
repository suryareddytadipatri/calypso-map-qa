import { Page, Locator, expect } from '@playwright/test';

export interface TicketScenario {
  ticketId: string;
  hasValidEvidence: boolean;
  expectedMessage: string;
}

export class TicketWorkspacePage {
  readonly page: Page;
  readonly ticketInput: Locator;
  readonly loadBtn: Locator;
  readonly evidenceStatus: Locator;
  readonly actionDropdown: Locator;
  readonly commitBtn: Locator;
  readonly statusMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ticketInput = page.getByLabel('Ticket ID');
    this.loadBtn = page.getByRole('button', { name: 'Load Ticket' });
    this.evidenceStatus = page.locator('#evidence-status');
    this.actionDropdown = page.getByLabel('Resolution Action');
    this.commitBtn = page.getByRole('button', { name: 'Commit Resolution' });
    this.statusMsg = page.locator('#status-msg');
  }

  async processTicket(scenario: TicketScenario) {
    await this.ticketInput.fill(scenario.ticketId);
    await this.loadBtn.click();

    if (!scenario.hasValidEvidence) {
      await expect(this.actionDropdown).toBeDisabled();
      await expect(this.actionDropdown).toHaveValue('NO_EDIT');
    } else {
      await expect(this.actionDropdown).toBeEnabled();
    }

    await this.commitBtn.click();
    await expect(this.statusMsg).toHaveText(scenario.expectedMessage);
  }
}
