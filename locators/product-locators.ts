import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class ProductLocators extends CommonLocators {

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  btnIncreaseQuantity!: Locator;
  inputQuantity!: Locator;
  divSuccessAlert!: Locator;
  searchInput!: Locator;
  firstProductImage!: Locator;
  btnBuyNow!: Locator;
  productThumbnail!: Locator;
  productThumb!: Locator;
  productThumbnaiByName!: (name: string) => Locator;
  productThumbnailTop!: (name: string) => Locator;
  imgProduct!: (productName: string) => Locator;
  iconCompare!: (productName: string) => Locator;
  lblProductName!: Locator;
  lblProuctPrice!: Locator;
  btnCompare!: (productName: string) => Locator;
  btnCompareById!: (id: string) => Locator;
  btnAddWishlist!: (productName: string) => Locator;
  btnQuickView!: (productName: string) => Locator;
  btnAddCart!: (productName: string) => Locator;
  btnNavigateToComparePage!: (productName: string) => Locator;
  //toast
  toastMessage!: (productName: string) => Locator;
  btnCloseToast!: (name: string) => Locator;
  toastBody!: Locator;

  locatorInitialization(): void {
    super.locatorInitialization();
    this.btnIncreaseQuantity = this.page.locator(
      '(//button[@aria-label="Increase quantity"])[2]',
    );
    this.inputQuantity = this.page.locator('(//input[@name="quantity"])[1]');
    this.divSuccessAlert = this.page.getByRole('alert');
    this.productThumbnail = this.page.locator('//div[@class="product-thumb"]');
    this.productThumbnaiByName = (productName: string): Locator => this.page.locator(`//h4/a[contains(text(),"${productName}")]/ancestor::div[contains(@class, "product-thumb")]`);
    this.lblProductName = this.page.locator('//h4[@class="title"]');
    this.lblProuctPrice = this.page.locator('//div[@class="price"]');
    this.iconCompare = (productName: string): Locator => this.productThumbnaiByName(productName).getByTitle('Compare this Product');
    this.btnAddWishlist = (productName: string): Locator => this.productThumbnaiByName(productName).locator('//button[contains(@class,"btn-wishlist")]');
    this.btnQuickView = (productName: string): Locator => this.productThumbnaiByName(productName).locator('//button[contains(@class,"btn-quickview")]');
    this.btnAddCart = (productName: string): Locator => this.productThumbnaiByName(productName).locator('//button[contains(@class,"btn-cart")]');
    this.btnCompare = (productName: string): Locator => this.productThumbnaiByName(productName).getByTitle('Compare this Product');
    this.btnNavigateToComparePage = (productName: string): Locator => {
      return this.page.locator(`//div[contains(@class,"toast")]//p//a[contains(text(),"${productName}")]/ancestor::div[3]//a[contains(text(),"Product Compare")]`);
    }
    this.toastMessage = (productName: string): Locator => {
      return this.page.locator(`//div[contains(@class,"toast")]//p//a[contains(text(),"${productName}")]`);
    }
    this.btnCloseToast = (name: string): Locator => {
      return this.page.locator(`//div[contains(@class,"toast")]//p//a[contains(text(),"${name}")]/ancestor::div//span[text()="×"]`);
    }
    this.toastBody = this.page.locator('//div[@class="toast-body"]');
  }
}
