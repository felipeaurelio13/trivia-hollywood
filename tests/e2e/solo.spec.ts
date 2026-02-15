import { test, expect } from '@playwright/test';

test('flujo base home -> solo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Hollywood \+ Oscar/i })).toBeVisible();
  await page.getByRole('link', { name: /Solo/i }).click();
  await expect(page.getByRole('heading', { name: /Modo Solo/i })).toBeVisible();
});
