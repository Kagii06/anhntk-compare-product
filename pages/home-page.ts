import { Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { step } from '../utilities/logging';
import { HomeLocators } from '../locators/home-locators';

export class HomePage extends HomeLocators {

  commonPage: CommonPage;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
  }

  /**
   * Navigate to product category page
   * @param menuName Category name
   */
  @step('Select Menu')
  async selectMenu(menuName: string): Promise<void> {
    await this.commonPage.click(this.shopByCategoryMenu);
    await this.commonPage.waitForVisible(this.itemTopCategory(menuName));
    await this.commonPage.click(this.itemTopCategory(menuName));
  }
}
