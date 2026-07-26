// ========================================================
// LINK KONEKSI DATABASE GOOGLE SCRIPT (API URL)
// Masukkan URL Deployment Web App Anda di bawah ini:
// ========================================================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxQVFWzJg8WqGIHV41YxJazeXaJ0m8NJ65lxFyspj0IkZbn3lWh186UVmzovFemJJ9c/exec';


// Event Listener saat form login disubmit
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Mencegah halaman reload

  // Mengambil elemen dari index.html
  const roleVal = document.getElementById('role').value;
  const userVal = document.getElementById('username').value;
  const passVal = document.getElementById('password').value;
  
  const btnSubmit = document.getElementById('btnSubmit');
  const alertMsg = document.getElementById('alert-msg');

  // Ubah status tombol
  btnSubmit.innerHTML = "Memproses...";
  btnSubmit.disabled = true;
  alertMsg.classList.add('hidden');

  // Siapkan data yang mau dikirim ke Backend
  const payload = {
    action: 'login',
    role: roleVal,
    username: userVal,
    password: passVal
  };

  try {
    // Proses kirim data ke Google Apps Script menggunakan Fetch API
    const response = await fetch(GAS_URL, {
      method: 'POST',
      // Menggunakan text/plain agar Google Script tidak memblokir masalah CORS preflight
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    // Menerima balasan (response) dari Google Script
    const result = await response.json();

    // Mengembalikan status tombol
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;

    // Logika setelah menerima respon
    if (result.status === 'success') {
      alertMsg.innerText = `Selamat Datang, ${result.nama}!`;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-green-500 block";
      
      // Lanjut ke logika memunculkan Dashboard
      // Misalnya: setTimeout(() => loadDashboard(roleVal), 1000);

    } else {
      alertMsg.innerText = result.pesan;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
    }

  } catch (error) {
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;
    alertMsg.innerText = "Terjadi kesalahan jaringan!";
    alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
    console.error("Error:", error);
  }
});
