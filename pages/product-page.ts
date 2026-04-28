import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { step } from '../utilities/logging';
import { ProductLocators } from '../locators/product-locators';
import { Product } from '../models/product';
import { Constants } from '../utilities/constants';
import { ActionType } from '../models/action-type';


export class ProductPage extends ProductLocators {
  commonPage: CommonPage;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
  }

  /**
   * Increases the product quantity by clicking the increase quantity button a specified number of times
   * @param product
   */
  @step('Increasing the product quantity by a specified number of times')
  async increaseQuantity(product: Product): Promise<void> {
    for (let index = 1; index < product.quantity; index++) {
      await this.btnIncreaseQuantity.click();
    }
  }

  /**
   * Main orchestrator to perform various actions on a product.
   * Handles scrolling, ID extraction, hovering, and dynamic button selection.
   * @param product - The product object.
   * @param action - Action type to execute.
   */
  @step('Perform action on product')
  async performActionOnProduct(product: Product, action: ActionType): Promise<void> {
    const productName = product.name;
    // Locate the product thumbnail and ensure it's in the viewport
    const targetProduct = this.productThumbnaiByName(productName);

    // Select the appropriate locator based on the requested action
    let btnAction;
    switch (action) {
      case ActionType.ADD_TO_CART:
        btnAction = this.btnAddCart(productName);
        break;
      case ActionType.WISHLIST:
        btnAction = this.btnAddWishlist(productName);
        break;
      case ActionType.COMPARE:
        // btnAction = targetProduct.getByTitle('Compare this Product');
        btnAction = this.btnCompare(productName);
        break;
      case ActionType.QUICK_VIEW:
        btnAction = this.btnQuickView(productName);
        break;
      default:
        throw new Error(`Unsupported action: "${action}"`);
    }
    await targetProduct.hover();

    // Wait for the button to be interactable and click it
    await btnAction.waitFor({
      state: 'visible',
      timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE
    });

    await btnAction.hover();
    await btnAction.click({ force: true });

    // Wait for background processes to settle (Network Idle)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add one or more products to Compare, verify them, and close the Toast message.
   * @param products - List of Product objects that need to be added
   */
  @step('Add multiple products to compare and verify toast')
  async addProductsToCompare(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.performActionOnProduct(product, ActionType.COMPARE);
      // Verify toast message displays the correct product name.
      await this.verifyProductInToast(product.name);
    }
  }

  /**
   * Scrapes all visible products on the page and converts them into Product objects.
   * Useful for dynamic data-driven testing.
   */
  @step('Verifying that the success alert displays the expected message after adding a product to the cart')
  async verifyAddToCartSuccessMessage(expectedMessage: string): Promise<void> {
    await expect(this.divSuccessAlert).toContainText(expectedMessage);
  }

  /**
   * Clicks the view cart link in the success alert to navigate to the cart page
   */
  @step('Clicking the view cart link in the success alert to navigate to the cart page')
  async clickViewCartLink(): Promise<void> {
    await this.commonPage.roleLinkName('View Cart', false).click();
  }

  /**
   * Close toast message by name
   * @param name - Name of the toast message
   */
  @step('Close toast message by name')
  async closeToast(name: string): Promise<void> {
    try {
      await this.btnCloseToast(name).click({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
      await this.waitForToastDisappear();
    } catch {
      console.warn(`Toast "${name}" did not appear or close button is missing.`);
    }
  }

  /**
   * Wait for toast message to disappear
   */
  @step('Wait for toast message to disappear')
  async waitForToastDisappear(): Promise<void> {
    try {
      await this.toastBody.first().waitFor({
        state: 'hidden', timeout: Constants.TIMEOUTS.WAIT_ELEMENT_INVISIBLE
      });
    } catch {
      console.warn('Toast did not disappear within expected time');
    }
  }

  @step('Click to navigate to compare page')
  async clickNavigateToComparePage(productName: string): Promise<void> {
    await this.btnNavigateToComparePage(productName).waitFor({ state: 'visible' });
    await this.btnNavigateToComparePage(productName).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Validates the success message displayed in the toast notification.
   * @param expectedMessage - The message expected to be in the toast.
   */
  @step('Verify Toast Message')
  async verifyProductInToast(productName: string): Promise<void> {
    const toast = this.toastMessage(productName);
    await toast.waitFor({ state: 'visible' });
    await expect(toast).toBeVisible();
  }
}
