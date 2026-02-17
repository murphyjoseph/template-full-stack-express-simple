import { test, expect } from '@playwright/test';

test.describe('Items CRUD', () => {
  test('can create and delete items', async ({ page }) => {
    // Navigate to items page directly
    await page.goto('/items');
    await expect(page.getByRole('heading', { name: 'Items' })).toBeVisible();

    // Create an item
    const itemTitle = `Test Item ${Date.now()}`;
    const input = page.getByPlaceholder('New item title...');
    await input.fill(itemTitle);
    await page.getByRole('button', { name: 'Add' }).click();

    // Wait for the item to appear (use a text locator that's more flexible)
    await expect(page.locator(`text=${itemTitle}`)).toBeVisible({
      timeout: 10000,
    });

    // Delete the item
    const deleteButton = page
      .locator('div')
      .filter({ hasText: itemTitle })
      .getByRole('button', { name: 'Delete' })
      .first();
    await deleteButton.click();

    // Verify item disappears
    await expect(page.locator(`text=${itemTitle}`)).not.toBeVisible({
      timeout: 10000,
    });
  });
});
