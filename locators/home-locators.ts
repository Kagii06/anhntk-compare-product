import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class HomeLocators extends CommonLocators {

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  shopByCategoryMenu!: Locator;
  itemTopCategory!: (itemName: string) => Locator;

  locatorInitialization(): void {
    super.locatorInitialization();
    this.shopByCategoryMenu = this.page.locator('//a[text()=" Shop by Category"]');
    this.itemTopCategory = (itemName: string): Locator => {
      return this.page.locator(`//span[contains(text(),"${itemName}")]`);
    };
  }
}
