# Sistem Tagging OSS Perizinan Berusaha

## Overview
Sistem tagging otomatis untuk admin dashboard livechat OSS perizinan berusaha yang membantu admin mengkategorikan dan mengelola percakapan berdasarkan jenis perizinan, status, dan prioritas.

## Kategori Tag

### 1. Jenis Perizinan
- **NIB** - Nomor Induk Berusaha
- **Izin Lokasi** - Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang
- **SIUP** - Surat Izin Usaha Perdagangan
- **TDP** - Tanda Daftar Perusahaan
- **NPWP** - Nomor Pokok Wajib Pajak
- **Izin Lingkungan** - AMDAL, UKL-UPL
- **Izin Gangguan** - HO (Hinder Ordonantie)
- **Izin Bangunan** - IMB, PBG
- **Izin Tenaga Kerja** - IMTA, ITAS
- **Izin Khusus** - Sektor spesifik (kesehatan, pendidikan, dll)

### 2. Status Permohonan
- **Pending** - Menunggu review
- **Review** - Sedang diproses
- **Approved** - Disetujui
- **Rejected** - Ditolak
- **Need Document** - Perlu dokumen tambahan
- **Revision** - Perlu revisi
- **Completed** - Selesai

### 3. Prioritas
- **High** - Prioritas tinggi
- **Medium** - Prioritas sedang
- **Low** - Prioritas rendah
- **VIP** - Pelanggan VIP
- **Urgent** - Mendesak

### 4. Kategori Bisnis
- **UMKM** - Usaha Mikro Kecil Menengah
- **Korporat** - Perusahaan besar
- **Startup** - Perusahaan rintisan
- **Ekspor-Impor** - Perusahaan ekspor impor
- **Manufaktur** - Industri manufaktur
- **Jasa** - Perusahaan jasa
- **Perdagangan** - Perdagangan
- **Pariwisata** - Industri pariwisata

### 5. Wilayah/Daerah
- **Jakarta** - DKI Jakarta
- **Jawa Barat** - Provinsi Jawa Barat
- **Jawa Tengah** - Provinsi Jawa Tengah
- **Jawa Timur** - Provinsi Jawa Timur
- **Sumatera** - Wilayah Sumatera
- **Kalimantan** - Wilayah Kalimantan
- **Sulawesi** - Wilayah Sulawesi
- **Papua** - Wilayah Papua

## Sistem Tagging Otomatis

### Trigger Otomatis
Tag akan ditambahkan secara otomatis berdasarkan:

1. **Kata Kunci dalam Pesan**
   - Deteksi kata kunci seperti "NIB", "izin lokasi", "SIUP", dll
   - Analisis konteks percakapan

2. **Jenis Dokumen yang Diupload**
   - KTP → Tag: Need Document
   - Akta Pendirian → Tag: Korporat
   - NPWP → Tag: NPWP

3. **Status dari Sistem Backend**
   - Integrasi dengan sistem OSS
   - Update otomatis berdasarkan perubahan status

### Aturan Tagging
- Maksimal 5 tag per percakapan
- Tag prioritas akan menimpa tag prioritas sebelumnya
- Tag status akan update otomatis sesuai perkembangan

## Warna Tag

### Jenis Perizinan
- **NIB**: `bg-blue-100 text-blue-800`
- **Izin Lokasi**: `bg-green-100 text-green-800`
- **SIUP**: `bg-purple-100 text-purple-800`
- **TDP**: `bg-indigo-100 text-indigo-800`
- **NPWP**: `bg-yellow-100 text-yellow-800`
- **Izin Lingkungan**: `bg-emerald-100 text-emerald-800`
- **Izin Gangguan**: `bg-orange-100 text-orange-800`
- **Izin Bangunan**: `bg-cyan-100 text-cyan-800`
- **Izin Tenaga Kerja**: `bg-pink-100 text-pink-800`
- **Izin Khusus**: `bg-violet-100 text-violet-800`

### Status Permohonan
- **Pending**: `bg-yellow-100 text-yellow-800`
- **Review**: `bg-blue-100 text-blue-800`
- **Approved**: `bg-green-100 text-green-800`
- **Rejected**: `bg-red-100 text-red-800`
- **Need Document**: `bg-orange-100 text-orange-800`
- **Revision**: `bg-amber-100 text-amber-800`
- **Completed**: `bg-emerald-100 text-emerald-800`

### Prioritas
- **High**: `bg-red-100 text-red-800`
- **Medium**: `bg-yellow-100 text-yellow-800`
- **Low**: `bg-gray-100 text-gray-800`
- **VIP**: `bg-purple-100 text-purple-800`
- **Urgent**: `bg-red-200 text-red-900`

### Kategori Bisnis
- **UMKM**: `bg-green-100 text-green-800`
- **Korporat**: `bg-blue-100 text-blue-800`
- **Startup**: `bg-purple-100 text-purple-800`
- **Ekspor-Impor**: `bg-indigo-100 text-indigo-800`
- **Manufaktur**: `bg-orange-100 text-orange-800`
- **Jasa**: `bg-cyan-100 text-cyan-800`
- **Perdagangan**: `bg-emerald-100 text-emerald-800`
- **Pariwisata**: `bg-pink-100 text-pink-800`

## Implementasi

### 1. TagManager Component
```tsx
interface Tag {
  id: string;
  name: string;
  category: 'perizinan' | 'status' | 'prioritas' | 'bisnis' | 'wilayah';
  color: string;
  auto: boolean; // true jika otomatis, false jika manual
}
```

### 2. Auto-tagging Service
```tsx
class AutoTaggingService {
  analyzeMessage(message: string): Tag[]
  updateTagsFromStatus(conversationId: string, status: string): void
  addManualTag(conversationId: string, tag: Tag): void
  removeTag(conversationId: string, tagId: string): void
}
```

### 3. Tag Display Component
```tsx
<TagDisplay 
  tags={conversation.tags}
  onAddTag={handleAddTag}
  onRemoveTag={handleRemoveTag}
  showAddButton={true}
/>
```

## Contoh Penggunaan

### Scenario 1: Permohonan NIB
- User: "Saya mau mengurus NIB untuk usaha kecil saya"
- Tag otomatis: `NIB`, `UMKM`, `Pending`

### Scenario 2: Penolakan Izin
- Status berubah dari sistem: "Rejected"
- Tag otomatis: `Rejected`, `Need Document`

### Scenario 3: Pelanggan VIP
- Admin menambah tag manual: `VIP`, `High`
- Tag akan muncul dengan warna khusus

## Benefit

1. **Efisiensi**: Admin dapat dengan cepat memahami konteks percakapan
2. **Prioritas**: Sistem prioritas membantu mengatur urutan penanganan
3. **Pelaporan**: Data tag dapat digunakan untuk analytics dan reporting
4. **Konsistensi**: Standardisasi kategori dan penanganan
5. **Otomatis**: Mengurangi manual work dari admin
