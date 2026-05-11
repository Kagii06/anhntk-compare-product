# Allure Report — Test Execution Visualization

> A lightweight, multi-language test reporting tool that transforms raw execution data into an interactive, drill-down HTML dashboard. It is the default, in-repo test reporter for this project, providing step-level tracing, screenshot attachment, and trend history without requiring a dedicated server.
>
> **Versions verified (2026-05):** allure-playwright v3.7.2, allure v3.7.0, @playwright/test v1.59.1

## When to reach for Allure

Use when:
- You need a visual, drill-down report of test failures (including steps, screenshots, and traces).
- You want to share a standalone HTML report with stakeholders.
- You need historical trend analysis of test passes/fails per suite without setting up a heavy dashboard like ReportPortal.
- You want to group tests by Behaviors (Epics, Features, Stories) or Suites.

Avoid when:
- You need cross-project, cross-team aggregated metrics with RBAC (reach for ReportPortal instead).
- You need deep performance analysis (use the QA Metrics Dashboard's perf panel).

## Install / setup

The tools are already present in `package.json`. To install manually or upgrade:

```bash
# Install the core CLI and Playwright adapter
npm i -D allure-playwright@3.7.2 allure@3.7.0
```

## The 3-step happy path

1. **Run tests with the Allure reporter.** The `playwright.config.ts` should be configured to use `allure-playwright`, or you can run it via CLI:
   ```bash
   npx playwright test --reporter=allure-playwright
   ```
   This generates raw data in the `allure-results/` directory.

2. **Generate the static HTML report.** (Optional if you just want to serve it directly, but necessary to save the report).
   ```bash
   npm run allure-generate
   ```
   This processes `allure-results/` and outputs a standalone site in `allure-report/`.

3. **Serve the report locally.**
   ```bash
   npm run report
   ```
   This command (defined in `package.json`) automatically generates the report and opens it in your default web browser.

## Configuration / conventions in this repo

- **Output Directories:** Raw results go to `allure-results/`, and the generated HTML goes to `allure-report/`. Both should be in `.gitignore`.
- **NPM Scripts:** Always use the wrapped scripts: `npm run report` to view the report.
- **CI Artifacts:** In GitHub Actions or GitLab CI, the `allure-report/` directory is typically archived as a build artifact or pushed to GitHub Pages for persistent viewing.
- **Decorators:** Use Playwright's `test.info().annotations` or the Allure API to attach Epics, Features, and Severity to tests for better categorization.

## Worked example

Here is how to add Allure metadata to a Playwright test to categorize it into Epics and attach steps:

```typescript
import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('User can add item to cart', async ({ page }) => {
  await allure.epic('Shopping Cart');
  await allure.feature('Add to Cart');
  await allure.story('Logged-in user adds item from product page');
  await allure.severity('critical');

  await allure.step('Navigate to product page', async () => {
    await page.goto('/product/123');
  });

  await allure.step('Click Add to Cart', async () => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
  });

  await allure.step('Verify success message', async () => {
    await expect(page.locator('.toast-success')).toBeVisible();
  });
});
```

## Anti-patterns this guideline rules out

- ❌ **Committing `allure-results` or `allure-report` to Git:** These are build artifacts. They bloat the repo and cause merge conflicts. They must be `.gitignore`d.
- ❌ **Using `allure` globally:** Always use the local project dependency via `npm run` or `npx` to avoid version mismatches across the team.
- ❌ **Ignoring steps:** Writing a 50-line test without `allure.step` wrappers makes the report useless for debugging. Break actions into logical steps.

## Related

- [`report-portal.md`](./report-portal.md) — For cross-team, persistent dashboards.
- [`documents/ci/github-actions.md`](../ci/github-actions.md) — CI integration guidelines.
