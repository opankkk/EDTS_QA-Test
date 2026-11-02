const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.klikindomaret.com/';

// tunggu sampai halaman lolos verifikasi cloudflare
async function tungguCloudflareLewat(page) {
  let lolos = false;
  try {
    await expect(async () => {
      const judul = await page.title();
      const isChallenge =
        judul.includes('Just a moment') || judul.includes('Tunggu sebentar');
      expect(isChallenge).toBe(false);
    }).toPass({ timeout: 90000, intervals: [5000] });
    lolos = true;
  } catch {
    lolos = false;
  }
  return lolos;
}

test('tambah produk madu ke keranjang sebagai guest user', async ({ page }) => {
  // 1. buka halaman utama
  await page.goto(BASE_URL);
  const homeLolos = await tungguCloudflareLewat(page);
  test.skip(!homeLolos, 'cloudflare blokir halaman utama');

  await expect(page.getByText('Belanja Xpress')).toBeVisible();

  // 2. klik meta kategori makanan
  const linkMakanan = page.getByRole('link', { name: 'Makanan', exact: true });
  await linkMakanan.click();
  await expect(page).toHaveURL(/category\/makanan/, { timeout: 15000 });

  // 3. klik kategori madu
  const linkMadu = page.getByRole('link', { name: 'Madu', exact: true });
  await linkMadu.click();
  await expect(page).toHaveURL(/category\/makanan\/sarapan-selai\/madu/, { timeout: 15000 });

  // 4. ambil produk madu pertama
  const produkMadu = page.locator('a[href*="/xpress/"]').filter({ hasText: /madu/i });
  await expect(produkMadu.first()).toBeVisible();
  const namaProduk = (await produkMadu.first().innerText()).trim();
  console.log('Produk yang dipilih:', namaProduk);

  // 5. buka detail produk
  await produkMadu.first().click();
  const detailLolos = await tungguCloudflareLewat(page);
  test.skip(!detailLolos, 'cloudflare blokir halaman detail produk');
  await expect(page).toHaveURL(/\/xpress\//);

  // 6. klik tombol keranjang
  const tombolKeranjang = page.getByRole('button', { name: /keranjang/i });
  await tombolKeranjang.click();

  // 7. cek notifikasi sukses
  const notifikasiSukses = page.getByText(/berhasil.*keranjang|ditambahkan/i);
  await expect(notifikasiSukses.first()).toBeVisible({ timeout: 10000 });
});
