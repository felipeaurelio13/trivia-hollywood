import { test, expect } from '@playwright/test';

test('flujo base home -> solo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Hollywood \+ Oscar/i })).toBeVisible();
  await page.getByRole('link', { name: /Jugar modo Solo/i }).click();
  await expect(page.getByRole('heading', { name: /Modo Solo/i })).toBeVisible();
});

test('accesibilidad visual 70+ en home', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toHaveCSS('font-size', '18px');

  const soloButton = page.getByRole('link', { name: /Jugar modo Solo/i });
  await expect(soloButton).toBeVisible();
  await expect(soloButton).toHaveCSS('min-height', '56px');

  const skipLink = page.getByRole('link', { name: /Saltar al contenido principal/i });
  await expect(skipLink).toBeAttached();
});
