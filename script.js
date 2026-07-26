// ========================================================
// LINK KONEKSI DATABASE GOOGLE SCRIPT (API URL)
// Masukkan URL Deployment Web App Anda di bawah ini:
// ========================================================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxQVFWzJg8WqGIHV41YxJazeXaJ0m8NJ65lxFyspj0IkZbn3lWh186UVmzovFemJJ9c/exec';


// Cek jika sudah login sebelumnya, langsung arahkan ke halaman masing-masing
window.onload = function() {
  const user = JSON.parse(localStorage.getItem('userCBT'));
  if (user) {
    window.location.href = `${user.role}.html`;
  }
};

// Fungsi saat tombol Masuk ditekan
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const roleVal = document.getElementById('role').value;
  const userVal = document.getElementById('username').value;
  const passVal = document.getElementById('password').value;
  const btnSubmit = document.getElementById('btnSubmit');
  const alertMsg = document.getElementById('alert-msg');

  // Ubah tampilan tombol saat memproses data ke database
  btnSubmit.innerHTML = "Memproses...";
  btnSubmit.disabled = true;
  alertMsg.classList.add('hidden'); // Sembunyikan error sebelumnya
  
  try {
    // 2. Siapkan data Payload untuk dikirim ke Backend Google Script
    const payload = { 
      action: 'login', 
      role: roleVal, 
      username: userVal, 
      password: passVal 
    };

    // 3. Proses pengiriman data via Fetch API
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    // 4. Menerima balasan dari Google Script
    const result = await response.json();
    
    // Kembalikan status tombol
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;

    // 5. Cek apakah login berhasil berdasarkan balasan database
    if (result.status === 'success') {
      
      // Simpan data asli dari database ke LocalStorage agar diingat sistem
      const userData = { 
        role: roleVal, 
        nama: result.nama, // Nama asli dari Google Sheets
        id: result.id      // ID/NIS asli dari Google Sheets
      };
      localStorage.setItem('userCBT', JSON.stringify(userData));

      // Munculkan notifikasi sukses sejenak sebelum pindah halaman
      alertMsg.innerText = `Berhasil masuk! Mengalihkan...`;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-green-500 block";

      // Arahkan ke file HTML sesuai role (admin.html, guru.html, atau siswa.html)
      setTimeout(() => {
        window.location.href = `${roleVal}.html`; 
      }, 500);

    } else {
      // Munculkan pesan error dari database (misal: "Password salah!")
      alertMsg.innerText = result.pesan;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
    }

  } catch (error) {
    // Jika gagal koneksi (URL salah atau tidak ada internet)
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;
    alertMsg.innerText = "Error: Cek koneksi atau URL Apps Script belum diisi!";
    alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
    console.error("Detail Error:", error);
  }
});
