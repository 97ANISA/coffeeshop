// Tambah produk ke keranjang
function tambahKeKeranjang(button) {
  const produkElement = button.parentElement;
  const namaProduk = produkElement.querySelector('h3').textContent;

  // Ambil keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  // Cari produk di keranjang
  const index = keranjang.findIndex(item => item.nama === namaProduk);

  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ nama: namaProduk, jumlah: 1 });
  }

  // Simpan kembali ke localStorage
  localStorage.setItem('keranjang', JSON.stringify(keranjang));

  // Update tampilan jumlah
  updateJumlahKeranjang();
  updateListKeranjang();
}

// Update jumlah keranjang di atas
function updateJumlahKeranjang() {
  const keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
  const total = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
  document.getElementById('jumlahKeranjang').textContent = total;
}

// Tampilkan isi keranjang di bawah
function updateListKeranjang() {
  const list = document.getElementById('listKeranjang');
  const keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  if (!list) return; // Cegah error kalau elemen gak ada

  list.innerHTML = ''; // Kosongkan dulu

  keranjang.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nama} - ${item.jumlah}`;
    list.appendChild(li);
  });
}

// Saat halaman dibuka
window.onload = () => {
  updateJumlahKeranjang();
  updateListKeranjang();
};
let keranjang = [];

function tambahKeKeranjang(button) {
  // cari nama produk (h3 di dalam div produk)
  let produk = button.parentElement.querySelector("h3").innerText;

  // tambahkan ke array keranjang
  keranjang.push(produk);

  // update tampilan keranjang
  updateKeranjang();
}

function updateKeranjang() {
  let listKeranjang = document.getElementById("listKeranjang");
  listKeranjang.innerHTML = "";

  keranjang.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = item;

    // tombol hapus
    let btnHapus = document.createElement("button");
    btnHapus.textContent = "❌";
    btnHapus.style.marginLeft = "10px";
    btnHapus.onclick = () => {
      keranjang.splice(index, 1); // hapus dari array
      updateKeranjang(); // refresh tampilan
    };

    li.appendChild(btnHapus);
    listKeranjang.appendChild(li);
  });
}
let keranjang = [];

function tambahKeKeranjang(button) {
  let produkDiv = button.parentElement;
  let namaProduk = produkDiv.querySelector("h3").innerText;
  let hargaProduk = parseInt(produkDiv.querySelector(".harga").innerText);

  // simpan sebagai objek {nama, harga}
  keranjang.push({ nama: namaProduk, harga: hargaProduk });

  updateKeranjang();
}

function updateKeranjang() {
  let listKeranjang = document.getElementById("listKeranjang");
  let totalHarga = 0;
  listKeranjang.innerHTML = "";

  keranjang.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.nama} - Rp${item.harga.toLocaleString()}`;

    totalHarga += item.harga;

    // tombol hapus
    let btnHapus = document.createElement("button");
    btnHapus.textContent = "❌";
    btnHapus.style.marginLeft = "10px";
    btnHapus.onclick = () => {
      keranjang.splice(index, 1);
      updateKeranjang();
    };

    li.appendChild(btnHapus);
    listKeranjang.appendChild(li);
  });

  // tampilkan total harga
  document.getElementById("totalHarga").innerText = 
    "Total: Rp" + totalHarga.toLocaleString();
}
const gratisOngkirCheckbox = document.getElementById('gratisOngkir');
const ongkirDefault = 10000;

function renderCheckout() {
  checkoutList.innerHTML = '';
  let subtotal = 0;

  keranjang.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nama}`;

    const spanHarga = document.createElement('span');
    spanHarga.textContent = `Rp ${item.harga.toLocaleString('id-ID')}`;

    li.appendChild(spanHarga);
    checkoutList.appendChild(li);

    subtotal += item.harga;
  });

  let ongkir = gratisOngkirCheckbox.checked ? 0 : ongkirDefault;
  let total = subtotal + ongkir;

  totalHargaElem.textContent = `Total: Rp ${total.toLocaleString('id-ID')} (Ongkir: Rp ${ongkir.toLocaleString('id-ID')})`;
}

// Saat toggle checkbox, render ulang harga
gratisOngkirCheckbox.addEventListener('change', renderCheckout);

// Panggil render awal
renderCheckout();

form.addEventListener('submit', async e => {
  e.preventDefault();

  const nama = form.nama.value.trim();
  const alamat = form.alamat.value.trim();

  if (!nama || !alamat) {
    showMessage('Mohon isi nama dan alamat dengan benar.', 'error');
    return;
  }

  if (keranjang.length === 0) {
    showMessage('Keranjang kosong, silakan tambah produk terlebih dahulu.', 'error');
    return;
  }

  loading.style.display = 'block';
  form.querySelector('button').disabled = true;

  const ongkir = gratisOngkirCheckbox.checked ? 0 : ongkirDefault;
  const dataCheckout = {
    nama,
    alamat,
    produk: keranjang,
    subtotal: keranjang.reduce((sum, item) => sum + item.harga, 0),
    ongkir,
    total: keranjang.reduce((sum, item) => sum + item.harga, 0) + ongkir
  };

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataCheckout)
    });

    if (!response.ok) throw new Error('Gagal mengirim data. Silakan coba lagi.');

    const result = await response.json();

    showMessage('Pesanan berhasil dikirim! Terima kasih.', 'success');

    keranjang = [];
    localStorage.removeItem('keranjang');
    renderCheckout();
    form.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    loading.style.display = 'none';
    form.querySelector('button').disabled = false;
  }
});
