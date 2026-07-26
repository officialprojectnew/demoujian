// ========================================================
// LINK KONEKSI DATABASE GOOGLE SCRIPT (API URL)
// Masukkan URL Deployment Web App Anda di bawah ini:
// ========================================================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxQVFWzJg8WqGIHV41YxJazeXaJ0m8NJ65lxFyspj0IkZbn3lWh186UVmzovFemJJ9c/exec';


window.onload = function() {
  const user = JSON.parse(localStorage.getItem('userCBT'));
  if (user) window.location.href = `${user.role}.html`;
};

document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const userVal = document.getElementById('username').value;
  const passVal = document.getElementById('password').value;
  const btnSubmit = document.getElementById('btnSubmit');
  const alertMsg = document.getElementById('alert-msg');

  btnSubmit.innerHTML = "Memproses...";
  btnSubmit.disabled = true;
  alertMsg.classList.add('hidden');
  
  try {
    // Kita hanya mengirim username dan password saja
    const payload = { action: 'login', username: userVal, password: passVal };

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;

    if (result.status === 'success') {
      // Backend akan membalas dengan role yang sesuai (admin/guru/siswa)
      const userData = { role: result.role, nama: result.nama, id: result.id };
      localStorage.setItem('userCBT', JSON.stringify(userData));

      alertMsg.innerText = `Berhasil masuk sebagai ${result.role}!`;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-green-500 block";

      // Arahkan otomatis berdasarkan role yang didapat
      setTimeout(() => {
        window.location.href = `${result.role}.html`; 
      }, 500);
    } else {
      alertMsg.innerText = result.pesan;
      alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
    }
  } catch (error) {
    btnSubmit.innerHTML = "Masuk";
    btnSubmit.disabled = false;
    alertMsg.innerText = "Error: Cek koneksi / URL Google Script";
    alertMsg.className = "text-center mt-3 text-sm font-semibold text-red-500 block";
  }
});
