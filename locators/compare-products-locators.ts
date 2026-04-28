import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class CompareProductsLocators extends CommonLocators {

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  table!: Locator;
  btnRemove!: (id?: string) => Locator;
  btnAddToCart!: Locator;
  lblEmptyMessage!: Locator;
  lblRowName!: (rowName: string) => Locator;

  locatorInitialization(): void {
    super.locatorInitialization();
    this.table = this.page.locator('//table[contains(@class, "table-bordered")]').first();
    this.lblEmptyMessage = this.page.locator('//div[@id="content"]//p');
    this.btnAddToCart = this.page.locator('//td//button[contains(@onclick, "cart")]');
    this.lblRowName = (rowName: string) => this.table.locator(`//tbody//tr[.//td[1][contains(text(), '${rowName}')]]`);
    this.btnRemove = (id?: string) => {
      const xpath = id
        ? `//a[text()="Remove" and contains(@href, "remove=${id}")]`
        : '//a[text()="Remove"]';
      return this.page.locator(xpath);
    };
  }
}
