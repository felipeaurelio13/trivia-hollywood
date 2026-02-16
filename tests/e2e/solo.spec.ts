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

test('pregunta completa visible, feedback útil y CTA accesible en juego', async ({ page }) => {
  await page.goto('/solo');
  await page.getByRole('button', { name: /Comenzar partida/i }).click();

  const questionHeading = page.locator('h1').first();
  await expect(questionHeading).toBeVisible();
  await expect(questionHeading).not.toHaveClass(/line-clamp/);

  const firstOption = page.getByRole('button', { name: /Opción 1:/i });
  await expect(firstOption).toContainText('A');

  const nextButton = page.getByRole('button', { name: /Siguiente pregunta|Ver resultados/i });
  await expect(nextButton).toBeVisible();
  await expect(nextButton).toBeDisabled();

  await firstOption.click();

  const explanationTitle = page.getByText('Dato curioso', { exact: true });
  await expect(explanationTitle).toBeVisible();
  await expect(nextButton).toBeEnabled();
});
