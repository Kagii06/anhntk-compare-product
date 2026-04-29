import { expect, Page } from '@playwright/test';
import { step } from '../utilities/logging';
import { CompareProductsLocators } from '../locators/compare-products-locators';
import { Product } from '../models/product';
import { CommonPage } from './common-page';

export class CompareProductsPage extends CompareProductsLocators {
  commonPage: CommonPage;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
  }

  /**
   * Clicks the "Remove" button for the specified product.
   * @param productName The name of the product for which to click the button.
   */
  @step('Click Remove Product Button')
  async clickRemoveProductButton(productName: string): Promise<void> {
    await this.commonPage.click(this.btnRemove(productName));
  }

  /**
   * Remove one or multiple products from the compare table
   * @param productIds List of product IDs to be removed
   */
  @step('Remove products from compare table')
  async removeProductsFromCompare(products: Product[]): Promise<void> {
    for (const product of products) {
      // Click the remove button for the specific product ID
      await this.clickRemoveProductButton(product.id);

      // Verify the product is removed before moving to the next one
      await this.commonPage.waitForHidden(this.btnRemove(product.id));
    }
  }

  /**
   *  Retrieves the names of all products in the comparison list.
   * @returns 
   */
  @step('Get Product Names')
  async getProductNames(): Promise<string[]> {
    return this.getRowValuesInternal('Product');
  }

  /**
   * Helper method to retrieve values from a specific row in the compare table.
   * @param rowLabel The label of the row to retrieve values from (e.g., "Product", "Price", "Stock").
   * @returns An array of strings containing the values from the specified row.
   */
  private async getRowValuesInternal(rowLabel: string): Promise<string[]> {
    await expect(this.table).toBeVisible();
    const allTexts = await this.lblRowName(rowLabel).locator('td').allInnerTexts();
    return allTexts
      .map(text => text.trim())
      .filter(text => text !== rowLabel && text !== '');
  }

  /**
   * Verify that the specified products are successfully added and displayed in the comparison table.
   * @param expectedProducts - An array of Product objects instead of a string.
   */
  @step('Verify Product Details in Compare Table')
  async verifyProductsDetails(expectedProducts: Product[]): Promise<void> {
    // Get a list of existing product names on the UI.
    const actualProductNamesOnUI = await this.getProductNames();

    // Iterate through the list of expected Product objects.
    for (const product of expectedProducts) {
      expect(
        actualProductNamesOnUI,
        `Expected product "${product.name}" to be in the compare table`
      ).toContain(product.name);
    }
  }

  /**
   * Methods to check for duplicate products in the comparison table.
   */
  @step('Verify that there are no duplicate products in the comparison table.')
  async verifyNoDuplicateProducts(): Promise<void> {
    const productNames = await this.getProductNames();
    const uniqueProductNames = [...new Set(productNames)];
    expect(productNames).toEqual(uniqueProductNames);
  }

  /**
   * Verify that there are no products listed on the comparison page.
   * @param expectMessage: The message indicates the comparison table is empty.
   */
  @step('Verify that there are no products listed on the comparison page')
  async verifyNoProductOnComparionPage(expectMessage: string): Promise<void> {
    await this.commonPage.waitUntilContainsText(this.lblEmptyMessage, expectMessage);
    await this.commonPage.toBeHidden(this.table);
  }
}
