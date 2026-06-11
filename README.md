Ran command: `cd frontend`
Ran command: `cd backend`

Agar teman-temanmu bisa join ke server Minecraft yang jalan di laptopmu tanpa harus satu jaringan Wi-Fi, kamu punya 3 pilihan utama. 

Karena di servermu terinstal **Geyser-Spigot** (supaya pemain HP/Bedrock dan PC/Java bisa main bareng), saya sangat menyarankan menggunakan **Playit.gg**.

Berikut adalah pilihan dan cara pakainya:

---

### Pilihan 1: Menggunakan Playit.gg (Sangat Direkomendasikan ⭐)
Playit.gg mirip seperti Cloudflare Tunnel tapi khusus untuk game. Gratis, tidak perlu setting router, dan memberikan IP/Domain permanen (tidak berubah-ubah saat laptop mati). Dan kerennya, bisa untuk Java (PC) dan Bedrock (HP) sekaligus.

1. Buka website [playit.gg](https://playit.gg/) dan download programnya untuk Windows.
2. Jalankan program `playit` yang sudah didownload. Nanti akan muncul link di terminalnya untuk mendaftarkan laptopmu ke akun Playit (gratis).
3. Di website Playit, tambahkan **Tunnels**:
   * **Untuk Java Edition (PC)**: Pilih type `Minecraft Java`, isi port dengan `25565`. Kamu akan dapat IP gratis seperti `namarandom.playit.gg`.
   * **Untuk Bedrock Edition (HP)**: Pilih type `Minecraft Bedrock` (UDP), isi port sesuai port Geyser kamu (defaultnya `19132`).
4. Bagikan alamat IP dari Playit tersebut ke teman-temanmu.

---

### Pilihan 2: Port Forwarding (Performa Terbaik ⚡)
Jika kamu punya akses ke admin panel router Wi-Fi rumah (Indihome/Biznet/dll) dan provider internetmu memberikan IP Publik, ini adalah cara terbaik karena koneksinya paling cepat (tanpa perantara).

1. Buka browser dan masuk ke IP routermu (biasanya `192.168.1.1` atau `192.168.18.1`).
2. Cari menu **Port Forwarding** / **Virtual Server**.
3. Tambahkan aturan baru:
   * **Internal IP**: Isi dengan IP Lokal laptopmu (bisa dicek lewat CMD `ipconfig`, misal `192.168.1.50`).
   * **Port**: `25565` (Protokol: TCP) untuk Java, dan `19132` (Protokol: UDP) untuk Geyser Bedrock.
4. Cari tahu IP Publik kamu saat ini dengan mengetik "My IP" di Google.
5. Temanmu bisa join menggunakan: `IP_Publik_Kamu:25565` (untuk PC) atau `IP_Publik_Kamu` port `19132` (untuk HP).

---

### Pilihan 3: Menggunakan Ngrok (Paling Cepat untuk Tes)
Jika hanya ingin main sebentar untuk tes:
1. Buka terminal/CMD dan ketik:
   ```bash
   ngrok tcp 25565
   ```
2. Kamu akan langsung diberikan alamat seperti `0.tcp.ngrok.io:12345`.
3. Berikan alamat tersebut ke temanmu. Kelemahannya, setiap kali ngrok dimatikan dan dinyalakan lagi, alamat IP-nya akan selalu berubah secara acak.

---

**Saran saya:** Coba pakai **Playit.gg** dulu karena paling stabil untuk Minecraft, gratis, dan IP-nya tidak berubah-ubah. 

Mau saya bantu pandu atau ada langkah dari Playit.gg/Ngrok yang ingin kamu tanyakan?