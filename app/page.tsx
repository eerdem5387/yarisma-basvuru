'use client'

import { useState, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { basvuruSchema, type BasvuruFormData } from '@/lib/validations'
import { motion } from 'framer-motion'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const okullar = [
  // ARDEŞEN
  'RİZE - ARDEŞEN - Alparslan Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Anadolu İmam Hatip Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Fırtına Vadisi İrfan Tufan Karaoğlu Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen İmam Hatip Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Lokman Hekim Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - ARDEŞEN NECİP FAZIL KISAKÜREK İMAM HATİP ORTAOKULU',
  'RİZE - ARDEŞEN - Ardeşen Piri Reis Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Şehit Ömer Halisdemir Fen Lisesi',
  'RİZE - ARDEŞEN - Işıklı 60 Yıl Ortaokulu',
  'RİZE - ARDEŞEN - Köprüköy Ortaokulu',
  'RİZE - ARDEŞEN - RABİA HATUN KIZ ANADOLU İMAM HATİP LİSESİ',
  'RİZE - ARDEŞEN - Seslıkaya Ziya Okutan Ortaokulu',
  'RİZE - ARDEŞEN - Türk Telekom Kanuni Anadolu Lisesi',
  'RİZE - ARDEŞEN - Yavuz Selim Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Cumhuriyet İlkokulu',
  'RİZE - ARDEŞEN - Ardeşen Merkez Fatih İlkokulu',
  'RİZE - ARDEŞEN - Seslıkaya Ziya Okutan İlkokulu',
  'RİZE - ARDEŞEN - Fikri Keçeli İlkokulu',
  'RİZE - ARDEŞEN - Ardeşen Fatih İlkokulu',
  'RİZE - ARDEŞEN - Atatürk Anaokulu',
  'RİZE - ARDEŞEN - Borsa İstanbul İlkokulu',
  'RİZE - ARDEŞEN - Cumhuriyet İlkokulu',
  'RİZE - ARDEŞEN - Gazi Mustafa Kemal İlkokulu',
  'RİZE - ARDEŞEN - Işıklı 60 Yıl İlkokulu',
  'RİZE - ARDEŞEN - Köprüköy İlkokulu',
  'RİZE - ARDEŞEN - Mesut Karaoğlu İlkokulu',
  // ÇAMLIHEMŞİN
  'RİZE - ÇAMLIHEMŞİN - Atatürk Ortaokulu',
  'RİZE - ÇAMLIHEMŞİN - Çamlıhemşin Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAMLIHEMŞİN - Çamlıhemşin Çok Programlı Anadolu Lisesi',
  'RİZE - ÇAMLIHEMŞİN - DİKKAYA ORTAOKULU',
  'RİZE - ÇAMLIHEMŞİN - İstanbul Ticaret Odası Şehit Binbaşı Ömer Aktuğ Ortaokulu',
  'RİZE - ÇAMLIHEMŞİN - ATATÜRK İLKOKULU',
  'RİZE - ÇAMLIHEMŞİN - DİKKAYA İLKOKULU',
  'RİZE - ÇAMLIHEMŞİN - Düzmahalle İlkokulu',
  'RİZE - ÇAMLIHEMŞİN - İstanbul Ticaret Odası Şehit Binbaşı Ömer Aktuğ İlkokulu',
  // ÇAYELİ
  'RİZE - ÇAYELİ - Ahmet Hamdi-Nurzan İshakoğlu Anadolu Lisesi',
  'RİZE - ÇAYELİ - Beyazsu Ortaokulu',
  'RİZE - ÇAYELİ - Büyükköy Ortaokulu',
  'RİZE - ÇAYELİ - Çayeli Ahmet Hamdi İshakoğlu Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAYELİ - Çayeli Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Barbaros Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Fen Lisesi',
  'RİZE - ÇAYELİ - Çayeli Hacı Ahmet Hamdi İshakoğlu Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Halk Eğitimi Merkezi',
  'RİZE - ÇAYELİ - Çayeli Kız Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAYELİ - Çayeli Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Hüseyin Rüştü Altunbaş Ortaokulu',
  'RİZE - ÇAYELİ - Kaptanpaşa İzzet Akcal Yatılı Bölge Ortaokulu',
  'RİZE - ÇAYELİ - Madenli Ortaokulu',
  'RİZE - ÇAYELİ - Merkez Atatürk Ortaokulu',
  'RİZE - ÇAYELİ - Şehit Muhammet Ambar İmam Hatip Ortaokulu',
  'RİZE - ÇAYELİ - Yamantürk Ortaokulu',
  'RİZE - ÇAYELİ - Çayeli Yamaç İlkokulu',
  'RİZE - ÇAYELİ - Hasan Yılmaz İlkokulu',
  'RİZE - ÇAYELİ - Çayeli Beyazsu İlkokulu',
  'RİZE - ÇAYELİ - 9 Mart İlkokulu',
  'RİZE - ÇAYELİ - Tunca Şehit Cumalı Ayçiçek İlkokulu',
  'RİZE - ÇAYELİ - Fikri Keçeli İlkokulu',
  'RİZE - ÇAYELİ - Beyazsu İlkokulu',
  'RİZE - ÇAYELİ - Büyükköy İlkokulu',
  'RİZE - ÇAYELİ - İshakoğlu İlkokulu',
  'RİZE - ÇAYELİ - Kaptanoğlu İlkokulu',
  'RİZE - ÇAYELİ - Kaptanpaşa İzzet Akçal İlkokulu',
  'RİZE - ÇAYELİ - Madenli ilkokulu',
  // DEREPAZARI
  'RİZE - DEREPAZARI - Adem Özdemir Anadolu Lisesi',
  'RİZE - DEREPAZARI - Ali Rıza Yılmaz Ortaokulu',
  'RİZE - DEREPAZARI - DEREPAZARI İMAM HATİP ORTAOKULU',
  'RİZE - DEREPAZARI - Derepazarı Merkez İlkokulu',
  'RİZE - DEREPAZARI - Fıçıcılar İlkokulu',
  // FINDIKLI
  'RİZE - FINDIKLI - Aksu Atatürk Ortaokulu',
  'RİZE - FINDIKLI - Arılı Ortaokulu',
  'RİZE - FINDIKLI - Çağlayan Osman Hacıalioğlu Ortaokulu',
  'RİZE - FINDIKLI - Fındıklı 15 Temmuz Şehitleri Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - FINDIKLI - Fındıklı TOBB Anadolu İmam Hatip Lisesi',
  'RİZE - FINDIKLI - İbn-i Sina Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - FINDIKLI - Muammer Çiçekoğlu Ortaokulu',
  'RİZE - FINDIKLI - 11 Mart İlkokulu',
  'RİZE - FINDIKLI - Aksu Atatürk İlkokulu',
  'RİZE - FINDIKLI - Arılı İlkokulu',
  'RİZE - FINDIKLI - Çağlayan Osman Hacıalioğlu İlkokulu',
  'RİZE - FINDIKLI - FINDIKLI İLKOKULU',
  'RİZE - FINDIKLI - Sümer İlkokulu',
  // GÜNEYSU
  'RİZE - GÜNEYSU - Osman Erkan Kız Anadolu İmam Hatip Lisesi',
  'RİZE - GÜNEYSU - Borsa İstanbul Ortaokulu',
  'RİZE - GÜNEYSU - Güneysu Şehit Kemal Mutlu Fen Lisesi',
  'RİZE - GÜNEYSU - Güneysu Spor Lisesi',
  'RİZE - GÜNEYSU - Kaptan Ahmet Erdoğan Anadolu İmam Hatip Lisesi',
  'RİZE - GÜNEYSU - Güneysu İmam Hatip Ortaokulu',
  'RİZE - GÜNEYSU - Güneysu Anadolu Lisesi',
  'RİZE - GÜNEYSU - Adacami İlkokulu',
  'RİZE - GÜNEYSU - ÖZEL BİLGE İLKOKULU',
  'RİZE - GÜNEYSU - ÖZEL GÜNEYSU OKULLARI İLKOKULU',
  'RİZE - GÜNEYSU - ÖZEL GÜNEYSU OKULLARI ORTAOKULU',
  'RİZE - GÜNEYSU - Güneysu İlkokulu',
  'RİZE - GÜNEYSU - Kıbledağı Şehit Metin Çetin İlkokulu',
  'RİZE - GÜNEYSU - Ulucami İlkokulu',
  // HEMŞİN
  'RİZE - HEMŞİN - MERKEZ ORTAOKULU',
  'RİZE - HEMŞİN - Hemşin Çok Programlı Anadolu Lisesi',
  'RİZE - HEMŞİN - MERKEZ İLKOKULU',
  // İKİZDERE
  'RİZE - İKİZDERE - İkizdere Anadolu İmam Hatip Lisesi',
  'RİZE - İKİZDERE - ATATÜRK ORTAOKULU',
  'RİZE - İKİZDERE - Fazliye Hüseyin Turanlı Çok Programlı Anadolu Lisesi',
  'RİZE - İKİZDERE - ATATÜRK İLKOKULU',
  // İYİDERE
  'RİZE - İYİDERE - Merkez Ortaokulu',
  'RİZE - İYİDERE - Çiftlik Ortaokulu',
  'RİZE - İYİDERE - Hazar Çaysan Ortaokulu',
  'RİZE - İYİDERE - İyidere Anadolu Lisesi',
  'RİZE - İYİDERE - İyidere İmam Hatip Ortaokulu',
  'RİZE - İYİDERE - İYİDERE MESLEKİ VE TEKNİK ANADOLU LİSESİ',
  'RİZE - İYİDERE - Büyükçiftlik İlkokulu',
  'RİZE - İYİDERE - Hazar Çaysan İlkokulu',
  'RİZE - İYİDERE - Merkez İlkokulu',
  // KALKANDERE
  'RİZE - KALKANDERE - Kalkandere Anadolu İmam Hatip Lisesi',
  'RİZE - KALKANDERE - Şehit Fikret Metin Öztürk Çok Programlı Anadolu Lisesi',
  'RİZE - KALKANDERE - ORMANLI ORTAOKULU',
  'RİZE - KALKANDERE - YOLBAŞI ORTAOKULU',
  'RİZE - KALKANDERE - ÇAYIRLI ORTAOKULU',
  'RİZE - KALKANDERE - ATATÜRK ORTAOKULU',
  'RİZE - KALKANDERE - DAĞDİBİ ORTAOKULU',
  'RİZE - KALKANDERE - ATATÜRK İLKOKULU',
  'RİZE - KALKANDERE - ÇAYIRLI İLKOKULU',
  'RİZE - KALKANDERE - DAĞDİBİ İLKOKULU',
  'RİZE - KALKANDERE - ORMANLI İLKOKULU',
  'RİZE - KALKANDERE - YOLBAŞI İLKOKULU',
  // MERKEZ
  'RİZE - MERKEZ - Ambarlık Ortaokulu',
  'RİZE - MERKEZ - Gülbahar Hatun Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Ekrem Orhon Turizm Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Elmalı Ortaokulu',
  'RİZE - MERKEZ - Kendirli Şehit Azim ÖZDEMİR Ortaokulu',
  'RİZE - MERKEZ - Merkez Atatürk Ortaokulu',
  'RİZE - MERKEZ - Rize Türkiye Odalar ve Borsalar Birliği Fen Lisesi',
  'RİZE - MERKEZ - Rize Sosyal Bilimler Lisesi',
  'RİZE - MERKEZ - Tevfik İleri Anadolu Lisesi',
  'RİZE - MERKEZ - Tevfik İleri Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Merkez Ticaret Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Taşlıdere Gazi Ortaokulu',
  'RİZE - MERKEZ - Ömer Halaç İşitme Engelliler Ortaokulu',
  'RİZE - MERKEZ - Veliköy Uzun Mustafa Kopuz Ortaokulu',
  'RİZE - MERKEZ - Kasarcılar Ortaokulu',
  'RİZE - MERKEZ - Hasan Kemal Yardımcı Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Kömürcüler Ortaokulu',
  'RİZE - MERKEZ - Çaykur Ortaokulu',
  'RİZE - MERKEZ - Reşadiye Zihni Derin Ortaokulu',
  'RİZE - MERKEZ - Şehit Nedim ÇALIK Ortaokulu',
  'RİZE - MERKEZ - Fatih Anadolu Lisesi',
  'RİZE - MERKEZ - Mehmet Akif Ersoy Ortaokulu',
  'RİZE - MERKEZ - Ali Metin Kazancı Rize Lisesi',
  'RİZE - MERKEZ - Şehit Murat Çalışkaner İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Karasu Ortaokulu',
  'RİZE - MERKEZ - Çay Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - 100. Yıl Cumhuriyet Ortaokulu',
  'RİZE - MERKEZ - Rize İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Kendirli Şehit Soner Fazlıoğlu Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Ortapazar Ortaokulu',
  'RİZE - MERKEZ - Hüseyin Yardımcı Ortaokulu',
  'RİZE - MERKEZ - Rize Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Dörtyol Şehit Halil Sadıkoğlu Ortaokulu',
  'RİZE - MERKEZ - Pazarköy Hafız Ali Usta Ortaokulu',
  'RİZE - MERKEZ - Mahmut Celalettin ÖKTEN İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Hasan Sağır İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Şehit Onur Kılıç Kız Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Şehit Erhan Dural Kız Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - FATİH ORTAOKULU',
  'RİZE - MERKEZ - BOĞAZ ORTAOKULU',
  'RİZE - MERKEZ - Küçükçayır Ortaokulu',
  'RİZE - MERKEZ - Gündoğdu 29 Ekim Ortaokulu',
  'RİZE - MERKEZ - Ömer Halaç Özel Eğitim Meslek Lisesi',
  'RİZE - MERKEZ - Nuri Pakdil İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - AMBARLIK İLKOKULU',
  'RİZE - MERKEZ - ZİYA GÖKALP İLKOKULU',
  'RİZE - MERKEZ - METİN BOSTANCIOGLU İLKOKULU',
  'RİZE - MERKEZ - PETROL OFİSİ İLKOKULU',
  'RİZE - MERKEZ - MEHMETÇİK İLKOKULU',
  'RİZE - MERKEZ - VAKIFBANK İLKOKULU',
  'RİZE - MERKEZ - Kurtuluş İlkokulu',
  'RİZE - MERKEZ - Türkiye Odalar ve Borsalar Birliği İlkokulu',
  'RİZE - MERKEZ - Doğuşçay İlkokulu',
  'RİZE - MERKEZ - Çay İlkokulu',
  'RİZE - MERKEZ - ÖZEL RİZE ANADOLU İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ANADOLU ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ FEN LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ FEN LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ ORTAOKULU',
  'RİZE - MERKEZ - Çiftekavak Polis Amca İlkokulu',
  'RİZE - MERKEZ - Denizciler İlkokulu',
  'RİZE - MERKEZ - Dörtyol Şehit Halil Sadıkoğlu İlkokulu',
  'RİZE - MERKEZ - Elmalı İlkokulu',
  'RİZE - MERKEZ - Gündoğdu 29 Ekim İlkokulu',
  'RİZE - MERKEZ - Hüseyin Yardımcı İlkokulu',
  'RİZE - MERKEZ - İstiklal İlkokulu',
  'RİZE - MERKEZ - Karasu İlkokulu',
  'RİZE - MERKEZ - Kasarcılar İlkokulu',
  'RİZE - MERKEZ - Kendirli Şehit Azim ÖZDEMİR İlkokulu',
  'RİZE - MERKEZ - Küçükçayır İlkokulu',
  'RİZE - MERKEZ - Muradiye İlkokulu',
  'RİZE - MERKEZ - Ömer Halaç İşitme Engelliler İlkokulu',
  'RİZE - MERKEZ - Pazarköy Hafız Ali Usta İlkokulu',
  'RİZE - MERKEZ - Pehlivantaşı İlkokulu',
  'RİZE - MERKEZ - Şehit Nedim ÇALIK İlkokulu',
  'RİZE - MERKEZ - Şevket Yardımcı İlkokulu',
  'RİZE - MERKEZ - Taşköprü Atatürk İlkokulu',
  'RİZE - MERKEZ - Taşlıdere Gazi İlkokulu',
  'RİZE - MERKEZ - Vakıflar İlkokulu',
  'RİZE - MERKEZ - Veliköy Uzun Mustafa Kopuz İlkokulu',
  // PAZAR
  'RİZE - PAZAR - FUAT ERGENÇ ORTAOKULU',
  'RİZE - PAZAR - Pazar Anadolu İmam Hatip Lisesi',
  'RİZE - PAZAR - Pazar Kız Kulesi Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Necat Sağbaş Anadolu Lisesi',
  'RİZE - PAZAR - Pazar Fen Lisesi',
  'RİZE - PAZAR - Pazar 10 Mart Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Pazar Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Ahmet Tahtakılıç Ortaokulu',
  'RİZE - PAZAR - HAMİDİYE ORTAOKULU',
  'RİZE - PAZAR - VALİ ERDAL ATA ORTAOKULU',
  'RİZE - PAZAR - TOPLU KONUT İDARESİ BAŞKANLIĞI ORTAOKULU',
  'RİZE - PAZAR - Haberal Vakfı Yaşar ve MedineHaberal Ortaokulu',
  'RİZE - PAZAR - AKTEPE ORTAOKULU',
  'RİZE - PAZAR - ATATÜRK ANADOLU LİSESİ',
  'RİZE - PAZAR - Pazar Şehit Murat Naiboğlu Sivil Havacılık Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Ahmet Mesut Yılmaz İlkokulu',
  'RİZE - PAZAR - AKTEPE İLKOKULU',
  'RİZE - PAZAR - ÖZEL RİZE PAZAR MEKTEBİM İLKOKULU',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM FEN LİSESİ',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM İLKOKULU',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM ORTAOKULU',
  'RİZE - PAZAR - ÖZEL PAZAR AÇI ANADOLU LİSESİ',
  'RİZE - PAZAR - FUAT ERGENÇ İLKOKULU',
  'RİZE - PAZAR - HAMİDİYE İLKOKULU',
  'RİZE - PAZAR - HÜSEYİN SARIOĞLU İLKOKULU',
  'RİZE - PAZAR - TOPLU KONUT İDARESİ BAŞKANLIĞI İLKOKULU',
  'RİZE - PAZAR - VALİ ERDAL ATA İLKOKULU',
  'RİZE - PAZAR - Veysel Vardal İlkokulu',
]

const siniflar = [
  '9. Sınıf',
  '10. Sınıf',
  '11. Sınıf',
  '12. Sınıf',
]

const meslekler = [
  'Acil Tıp Teknisyeni',
  'Anaokulu Öğretmeni',
  'Anestezi Teknikeri',
  'Araştırmacı',
  'Asker',
  'Aşçı',
  'Avukat',
  'Bankacı',
  'Beden Eğitimi Öğretmeni',
  'Bilgisayar Mühendisi',
  'Biyomedikal Mühendisi',
  'Bütçe Uzmanı',
  'Çevre Mühendisliği',
  'Çiftçi',
  'Diş Hekimi',
  'Diş Teknisyeni',
  'Diyetisyen',
  'Doktor',
  'Ebe',
  'Eczacı',
  'Eğitmen',
  'Ekspresyonist',
  'Elektrik Elektronik Mühendisi',
  'Elektrik Teknisyeni',
  'Emekli',
  'Emlakçı',
  'Endüstri Mühendisi',
  'Endüstriyel Tasarımcı',
  'Ev Hanımı',
  'Felsefe Öğretmeni',
  'Finans Danışmanı',
  'Fizyoterapist',
  'Fotoğrafçı',
  'Garson',
  'Gazeteci',
  'Gıda Mühendisi',
  'Grafik Tasarımcı',
  'Gümrük Müşaviri',
  'Güvenlik Danışmanı',
  'Güvenlik Görevlisi',
  'Hakim',
  'Harita Mühendisi',
  'Havacılık ve Uzay Mühendisliği',
  'Hemşire',
  'Hostes',
  'Hukukçu (Genel)',
  'İç Mimar',
  'İhracat Uzmanı',
  'İletişim Tasarımcısı',
  'İnsan Kaynakları Uzmanı',
  'İnşaat Mühendisi',
  'İnşaat Teknikeri',
  'İşçi',
  'Jeoloji Mühendisi',
  'Kaptan',
  'Kimya Mühendisi',
  'Kuaför/Berber',
  'Lojistik Uzmanı',
  'Maden Mühendisi',
  'Makine Mühendisi',
  'Makine Teknikeri',
  'Mali Müşavir',
  'Matematik Öğretmeni',
  'Metalurji ve Malzeme Mühendisi',
  'Mimar',
  'Mobilya Ustası',
  'Muhasebeci',
  'Muhasebe Uzmanı',
  'Müfettiş',
  'Müteahhit',
  'Müzisyen',
  'Noter',
  'Öğretmen',
  'Pazarlama Uzmanı',
  'Pilot',
  'Polis',
  'Psikiyatrist',
  'Psikolog',
  'Radyoloji Teknikeri',
  'Reklamcı',
  'Sanat Tarihçisi',
  'Sanat Yönetmeni',
  'Sanatçı',
  'Sekreter/Yönetici Asistanı',
  'Serbest Meslek',
  'Serbest Meslek Altın ve Kuyumculuk',
  'Serbest Meslek Çay İmalatı',
  'Serbest Meslek Elektrikli Ev Aletleri',
  'Serbest Meslek İnşaat',
  'Serbest Meslek Konfeksiyon ve Giyim',
  'Serbest Meslek Mobilya İmalatı ve Satış',
  'Serbest Meslek Otomotiv',
  'Serbest Meslek Sigorta Hizmetleri',
  'Serbest Meslek Tesisatçı',
  'Sistem Analisti',
  'Sınıf Öğretmeni',
  'Sosyal Medya Uzmanı',
  'Sosyolog',
  'Spor Antrenörü',
  'Sporcu',
  'Şef (Restoran)',
  'Şoför',
  'Tarih Öğretmeni',
  'Teknisyen',
  'Tercüman',
  'Terzi',
  'Tiyatro Oyuncusu',
  'Turizm Rehberi',
  'Türk Dili ve Edebiyatı Öğretmeni',
  'Uçak Mühendisi',
  'Veri Bilimcisi',
  'Veteriner',
  'Veteriner Hekimi',
  'Web Geliştiricisi',
  'Yazılımcı',
  'Yazılım Mühendisi',
  'Yönetici',
  'Ziraat Mühendisi',
]

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<{ message: string; details?: Array<{ path: string[]; message: string }> } | null>(null)
  const [babaMeslekSearch, setBabaMeslekSearch] = useState('')
  const [anneMeslekSearch, setAnneMeslekSearch] = useState('')
  const [kvkkOnay, setKvkkOnay] = useState(false)
  const [aydinlatmaMetniOnay, setAydinlatmaMetniOnay] = useState(false)
  const [veliIzinOnay, setVeliIzinOnay] = useState(false)
  const [telifHaklariOnay, setTelifHaklariOnay] = useState(false)
  const [acikRizaOnay, setAcikRizaOnay] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const bilgilendirmeRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BasvuruFormData>({
    resolver: zodResolver(basvuruSchema),
  })

  const selectedOkul = watch('okul')
  const selectedBabaMeslek = watch('babaMeslek')
  const selectedAnneMeslek = watch('anneMeslek')

  // Filtrelenmiş baba meslek listesi
  const filteredBabaMeslekler = useMemo(() => {
    if (!babaMeslekSearch) return meslekler
    return meslekler.filter(meslek =>
      meslek.toLowerCase().includes(babaMeslekSearch.toLowerCase())
    )
  }, [babaMeslekSearch])

  // Filtrelenmiş anne meslek listesi
  const filteredAnneMeslekler = useMemo(() => {
    if (!anneMeslekSearch) return meslekler
    return meslekler.filter(meslek =>
      meslek.toLowerCase().includes(anneMeslekSearch.toLowerCase())
    )
  }, [anneMeslekSearch])

  const handleDownloadPDF = async () => {
    if (!bilgilendirmeRef.current) return

    try {
      // PDF için özel bir container oluştur (gradient'ler olmadan)
      const pdfContainer = document.createElement('div')
      pdfContainer.style.position = 'absolute'
      pdfContainer.style.left = '-9999px'
      pdfContainer.style.top = '0'
      pdfContainer.style.width = bilgilendirmeRef.current.offsetWidth + 'px'
      pdfContainer.style.backgroundColor = '#ffffff'
      pdfContainer.style.padding = '20px'
      document.body.appendChild(pdfContainer)

      // Orijinal içeriği kopyala
      const clone = bilgilendirmeRef.current.cloneNode(true) as HTMLElement
      pdfContainer.appendChild(clone)
      
      // Container'ı DOM'a ekledikten sonra computed style'ları alabiliriz
      // Tüm elementlerin computed style'larını al ve inline style olarak ayarla
      const convertToInlineStyles = (element: HTMLElement) => {
        try {
          const computedStyle = window.getComputedStyle(element)
          
          // Background color'ı kontrol et ve düz renge çevir
          const bgImage = computedStyle.backgroundImage
          const bgColor = computedStyle.backgroundColor
          
          if (bgImage && typeof bgImage === 'string' && bgImage.includes('gradient')) {
            // Gradient varsa, class'a göre düz renk belirle
            const className = typeof element.className === 'string' ? element.className : ''
            let solidColor = '#ffffff'
            
            if (className.includes('from-blue-50') || className.includes('to-indigo-50')) {
              solidColor = '#eff6ff'
            } else if (className.includes('from-green-50') || className.includes('to-emerald-50')) {
              solidColor = '#f0fdf4'
            } else if (className.includes('from-purple-50') || className.includes('to-pink-50')) {
              solidColor = '#faf5ff'
            } else if (className.includes('from-yellow-50') || className.includes('to-orange-50')) {
              solidColor = '#fefce8'
            } else if (className.includes('from-yellow-50') || className.includes('to-amber-50')) {
              solidColor = '#fffbeb'
            } else if (className.includes('from-gray-50') || className.includes('to-slate-50')) {
              solidColor = '#f9fafb'
            } else if (className.includes('from-orange-50') || className.includes('to-amber-50')) {
              solidColor = '#fff7ed'
            }
            
            element.style.backgroundImage = 'none'
            element.style.backgroundColor = solidColor
          } else if (bgColor && typeof bgColor === 'string' && (bgColor.includes('lab') || bgColor.includes('rgb') && bgColor.includes('calc'))) {
            // lab() veya calc() içeren renkleri düz renge çevir
            const className = typeof element.className === 'string' ? element.className : ''
            let solidColor = '#ffffff'
            
            if (className.includes('blue')) {
              solidColor = '#eff6ff'
            } else if (className.includes('green')) {
              solidColor = '#f0fdf4'
            } else if (className.includes('purple')) {
              solidColor = '#faf5ff'
            } else if (className.includes('yellow')) {
              solidColor = '#fefce8'
            } else if (className.includes('gray') || className.includes('slate')) {
              solidColor = '#f9fafb'
            } else if (className.includes('orange')) {
              solidColor = '#fff7ed'
            }
            
            element.style.backgroundColor = solidColor
          }
          
          // Border color'ı kontrol et
          const borderColor = computedStyle.borderColor
          if (borderColor && typeof borderColor === 'string' && (borderColor.includes('lab') || (borderColor.includes('rgb') && borderColor.includes('calc')))) {
            const className = typeof element.className === 'string' ? element.className : ''
            let solidBorderColor = '#e5e7eb'
            
            if (className.includes('border-blue')) {
              solidBorderColor = '#bfdbfe'
            } else if (className.includes('border-green')) {
              solidBorderColor = '#bbf7d0'
            } else if (className.includes('border-purple')) {
              solidBorderColor = '#e9d5ff'
            } else if (className.includes('border-yellow')) {
              solidBorderColor = '#fef08a'
            } else if (className.includes('border-gray')) {
              solidBorderColor = '#e5e7eb'
            } else if (className.includes('border-orange')) {
              solidBorderColor = '#fed7aa'
            }
            
            element.style.borderColor = solidBorderColor
          }
          
          // Text color'ı kontrol et
          const textColor = computedStyle.color
          if (textColor && typeof textColor === 'string' && (textColor.includes('lab') || (textColor.includes('rgb') && textColor.includes('calc')))) {
            // Text rengini koru ama lab() kullanmayan bir değere çevir
            const className = typeof element.className === 'string' ? element.className : ''
            if (!className.includes('text-')) {
              element.style.color = '#111827'
            } else {
              // Class'a göre text rengi belirle
              if (className.includes('text-blue')) {
                element.style.color = '#3b82f6'
              } else if (className.includes('text-green')) {
                element.style.color = '#10b981'
              } else if (className.includes('text-purple')) {
                element.style.color = '#a855f7'
              } else if (className.includes('text-yellow')) {
                element.style.color = '#eab308'
              } else if (className.includes('text-gray')) {
                element.style.color = '#6b7280'
              } else if (className.includes('text-red')) {
                element.style.color = '#ef4444'
              } else {
                element.style.color = '#111827'
              }
            }
          }
          
          // Diğer önemli stilleri koru
          if (computedStyle.padding) element.style.padding = computedStyle.padding
          if (computedStyle.margin) element.style.margin = computedStyle.margin
          if (computedStyle.borderWidth) element.style.borderWidth = computedStyle.borderWidth
          if (computedStyle.borderStyle) element.style.borderStyle = computedStyle.borderStyle
          if (computedStyle.borderRadius) element.style.borderRadius = computedStyle.borderRadius
          if (computedStyle.fontSize) element.style.fontSize = computedStyle.fontSize
          if (computedStyle.fontWeight) element.style.fontWeight = computedStyle.fontWeight
          if (computedStyle.fontFamily) element.style.fontFamily = computedStyle.fontFamily
          if (computedStyle.textAlign) element.style.textAlign = computedStyle.textAlign
          if (computedStyle.display) element.style.display = computedStyle.display
          if (computedStyle.width && computedStyle.width !== 'auto') element.style.width = computedStyle.width
          if (computedStyle.height && computedStyle.height !== 'auto') element.style.height = computedStyle.height
          
          // Class'ları kaldır (artık inline style var)
          element.className = ''
          
          // Alt elementleri de işle
          Array.from(element.children).forEach((child) => {
            convertToInlineStyles(child as HTMLElement)
          })
        } catch (error) {
          console.warn('Style dönüştürme hatası:', error)
        }
      }
      
      // Tüm elementleri işle
      const allElements = pdfContainer.querySelectorAll('*')
      allElements.forEach((el) => {
        convertToInlineStyles(el as HTMLElement)
      })
      
      // Container'ın kendisini de işle
      convertToInlineStyles(pdfContainer)

      // HTML içeriğini canvas'a çevir
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false,
        foreignObjectRendering: false,
      })

      // Geçici container'ı kaldır
      document.body.removeChild(pdfContainer)

      // Canvas'ı görüntüye çevir
      const imgData = canvas.toDataURL('image/png', 1.0)

      // PDF oluştur
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      // Görüntüyü PDF sayfa genişliğine göre ölçekle
      const ratio = pdfWidth / imgWidth
      const imgScaledWidth = pdfWidth
      const imgScaledHeight = imgHeight * ratio

      // İlk sayfayı ekle
      let heightLeft = imgScaledHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
      heightLeft -= pdfHeight

      // Eğer içerik bir sayfadan uzunsa, yeni sayfalar ekle
      while (heightLeft > 0) {
        position = heightLeft - imgScaledHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
        heightLeft -= pdfHeight
      }

      // PDF'i indir
      pdf.save('yarisma-bilgilendirme.pdf')
    } catch (error) {
      console.error('PDF oluşturma hatası:', error)
      setSubmitError({
        message: 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      })
      setTimeout(() => {
        setSubmitError(null)
      }, 5000)
    }
  }

  const onSubmit = async (data: BasvuruFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // FormData oluştur (dosya yükleme için)
      const formData = new FormData()
      
      // Form verilerini ekle
      Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key])
      })
      
      // Dosya varsa ekle
      if (selectedFile) {
        formData.append('dosya', selectedFile)
      }

      const response = await fetch('/api/basvuru', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        // API'den gelen hata mesajı ve detayları
        throw {
          message: result.error || 'Başvuru gönderilemedi',
          details: result.details || null
        }
      }

      setSubmitSuccess(true)
      reset()
      setBabaMeslekSearch('')
      setAnneMeslekSearch('')
      setKvkkOnay(false)
      setAydinlatmaMetniOnay(false)
      setVeliIzinOnay(false)
      setTelifHaklariOnay(false)
      setAcikRizaOnay(false)
      setSelectedFile(null)

      // 5 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      // Hata objesi veya Error instance'ı kontrolü
      if (error && typeof error === 'object' && 'message' in error) {
        setSubmitError({
          message: error.message as string,
          details: 'details' in error ? (error.details as Array<{ path: string[]; message: string }>) : undefined
        })
      } else {
        setSubmitError({
          message: error instanceof Error ? error.message : 'Bir hata oluştu'
        })
      }
      
      // 5 saniye sonra hata mesajını kaldır
      setTimeout(() => {
        setSubmitError(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Yarışma Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                  Yarışma Başvuru
                </h2>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block h-16 w-px bg-gray-300"></div>
            
            {/* Başvuru Başlığı */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Yarışma Başvuru Formu
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Yarışmaya katılmak için başvuru formunu doldurunuz
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* PDF İndirme Butonu */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-200 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bilgileri PDF Olarak İndir
          </button>
        </div>

        {/* Bilgilendirme Kutucukları */}
        <div className="mb-8 space-y-6" id="bilgilendirme-kutucuklari" ref={bilgilendirmeRef}>

          {/* 1. Eserlerde Aranacak Şartlar ve Başvuru */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-300">
              Madde-4: Eserlerde Aranacak Şartlar ve Başvuru
            </h3>
            <div className="bg-white p-5 rounded-lg border border-blue-200 text-sm text-gray-700 space-y-3">
              <p className="mb-3">
                Yarışma katılım koşulları aşağıda belirtilmiştir:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Her öğrenci bir eserle yarışmaya katılabilir.</li>
                <li>Yapay zekâ destekli programlarla yazılmış, yardım alınmış, özgün olmayan çalışmalar ve şartnamede belirtilen hususlara uygun olmayan eserler değerlendirmeye alınmayacaktır.</li>
                <li>Eserler Word formatında en az bir A4 tam sayfa ve en çok iki A4 tam sayfayı geçmeyecek şekilde hazırlanacaktır.</li>
                <li>Eserler 12 punto büyüklüğünde Times New Roman yazı karakteri esas alınarak hazırlanacaktır.</li>
                <li>Eserin daha önce bir yarışmaya katılmamış ve herhangi bir platformda yayımlanmamış/basılmamış olması gerekmektedir.</li>
              </ul>
            </div>
          </div>

          {/* 2. Eserlerin Gönderilmesi */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-300">
              Madde-5: Eserlerin Gönderilmesi
            </h3>
            <div className="bg-white p-5 rounded-lg border border-green-200 text-sm text-gray-700 space-y-3">
              <p className="mb-3">
                Yarışmaya Rize ilinden katılacak eserlerin gönderim koşulları aşağıda belirtilmiştir:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Başvuru:</strong> yarisma.leventokullari.com başvuru adresine şahsen yapılacaktır.</li>
                <li>Genel şartları ve katılım şartlarını taşımayan eserler değerlendirme dışı bırakılacaktır.</li>
                <li>Genel şartları ve katılım şartlarını taşıyan eserler, değerlendirme ölçütleri tablosu doğrultusunda değerlendirilecektir.</li>
              </ul>
            </div>
          </div>

          {/* 3. Eserlerin Değerlendirilmesi ve Ödüller */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-300">
              Madde-6: Eserlerin Değerlendirilmesi ve Ödüller
            </h3>
            <div className="bg-white p-5 rounded-lg border border-purple-200 text-sm text-gray-700 space-y-3">
              <ul className="space-y-2 list-disc list-inside">
                <li>Rize'den (resmi/özel) okullardan gelecek eserlerin değerlendirilmesi, Özel Rize Levent Koleji tarafından oluşturulacak eser inceleme komisyonu tarafından yapılacaktır.</li>
                <li>Komisyonun değerlendirmesi sonucunda dereceye giren ve ödül almaya hak kazanan eser sahiplerine aşağıdaki ödüller verilecektir:</li>
              </ul>
              <div className="mt-4 space-y-2">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-gray-900">Birincilik Ödülü: <span className="text-yellow-700">1 gr altın</span></p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900">İkincilik Ödülü: <span className="text-gray-700">1 gr altın</span></p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                  <p className="font-semibold text-gray-900">Üçüncülük Ödülü: <span className="text-orange-700">Kitap Seti</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Yarışma Takvimi */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-300">
              Madde-8: Yarışma Takvimi
            </h3>
            <div className="bg-white p-5 rounded-lg border border-yellow-200 text-sm text-gray-700">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Eserlerin Özel Rize Levent Kolejine gönderilmesi</p>
                    <p className="text-gray-600">yarisma.leventokullari.com adresi üzerinden son gönderimi: <span className="font-bold text-red-600">23.01.2026</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2 mt-0.5">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sonuçların açıklanması</p>
                    <p className="text-gray-600"><span className="font-bold text-green-600">04.02.2026</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-0.5">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ödül töreni tarihi</p>
                    <p className="text-gray-600"><span className="font-bold text-purple-600">06.02.2026</span></p>
                    <p className="text-gray-600 mt-1">Tören Yeri: <span className="font-semibold">Levent Koleji Konferans Salonu</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Başvurunuz Başarıyla Alındı!</h3>
              <p className="text-gray-600 mb-6">
                Başvurunuz sisteme kaydedilmiştir. Teşekkür ederiz.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200"
              >
                Tamam
              </button>
            </motion.div>
        </div>
        )}

        {/* Error Modal */}
        {submitError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Başarısız!</h3>
                <p className="text-red-600 font-semibold mb-4">
                  {submitError.message}
                </p>
              </div>
              
              {/* Hata Detayları */}
              {submitError.details && submitError.details.length > 0 && (
                <div className="mb-6 text-left">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Hata Detayları:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <ul className="space-y-2">
                      {submitError.details.map((detail, index) => {
                        const fieldName = detail.path.join('.')
                        // Türkçe alan isimleri
                        const fieldNames: { [key: string]: string } = {
                          'ogrenciAdSoyad': 'Öğrenci Ad Soyad',
                          'ogrenciTc': 'TC Kimlik No',
                          'okul': 'Okul',
                          'ogrenciSinifi': 'Sınıf',
                          'babaAdSoyad': 'Baba Ad Soyad',
                          'babaMeslek': 'Baba Meslek',
                          'babaIsAdresi': 'Baba İş Adresi',
                          'babaCepTel': 'Baba Cep Telefonu',
                          'anneAdSoyad': 'Anne Ad Soyad',
                          'anneMeslek': 'Anne Meslek',
                          'anneIsAdresi': 'Anne İş Adresi',
                          'anneCepTel': 'Anne Cep Telefonu',
                          'email': 'E-posta',
                        }
                        const displayName = fieldNames[fieldName] || fieldName
                        return (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">{displayName}:</span> {detail.message}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setSubmitError(null)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-200"
              >
                Tamam
              </button>
            </motion.div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Öğrenci Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Öğrenci Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğrenci Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ogrenciAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('ogrenciAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                  {errors.ogrenciAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TC Kimlik No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ogrenciTc')}
                    maxLength={11}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="12345678901"
                  />
                  {errors.ogrenciTc && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciTc.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sınıf <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('ogrenciSinifi')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Seçiniz</option>
                    {siniflar.map((sinif) => (
                      <option key={sinif} value={sinif}>
                        {sinif}
                      </option>
                    ))}
                  </select>
                  {errors.ogrenciSinifi && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciSinifi.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okul <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('okul')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Seçiniz</option>
                      {okullar.map((okul) => (
                        <option key={okul} value={okul}>
                          {okul}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.okul && (
                    <p className="mt-1 text-sm text-red-600">{errors.okul.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Baba Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Baba Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baba Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('babaAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('babaAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Mehmet Yılmaz"
                  />
                  {errors.babaAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meslek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Meslek adı yazarak arayın..."
                      value={babaMeslekSearch}
                      onChange={(e) => setBabaMeslekSearch(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 mb-2"
                    />
                    <select
                      {...register('babaMeslek')}
                      value={selectedBabaMeslek || ''}
                      onChange={(e) => {
                        setValue('babaMeslek', e.target.value)
                        setBabaMeslekSearch('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      size={babaMeslekSearch ? Math.min(filteredBabaMeslekler.length + 1, 8) : 1}
                    >
                      <option value="">Seçiniz</option>
                      {filteredBabaMeslekler.map((meslek) => (
                        <option key={`baba-${meslek}`} value={meslek}>
                          {meslek}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedBabaMeslek && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✓ Seçilen: {selectedBabaMeslek}
                    </p>
                  )}
                  {errors.babaMeslek && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaMeslek.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cep Telefonu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('babaCepTel')}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => {
                      // Sadece rakamları al
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('babaCepTel', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="5XXXXXXXXX (10 hane)"
                  />
                  {errors.babaCepTel && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaCepTel.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Adresi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('babaIsAdresi')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="İş adresi bilgisi"
                  />
                  {errors.babaIsAdresi && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaIsAdresi.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Anne Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Anne Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anne Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('anneAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('anneAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Ayşe Yılmaz"
                  />
                  {errors.anneAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meslek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Meslek adı yazarak arayın..."
                      value={anneMeslekSearch}
                      onChange={(e) => setAnneMeslekSearch(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 mb-2"
                    />
                    <select
                      {...register('anneMeslek')}
                      value={selectedAnneMeslek || ''}
                      onChange={(e) => {
                        setValue('anneMeslek', e.target.value)
                        setAnneMeslekSearch('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      size={anneMeslekSearch ? Math.min(filteredAnneMeslekler.length + 1, 8) : 1}
                    >
                      <option value="">Seçiniz</option>
                      {filteredAnneMeslekler.map((meslek) => (
                        <option key={`anne-${meslek}`} value={meslek}>
                          {meslek}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedAnneMeslek && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✓ Seçilen: {selectedAnneMeslek}
                    </p>
                  )}
                  {errors.anneMeslek && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneMeslek.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cep Telefonu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('anneCepTel')}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => {
                      // Sadece rakamları al
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('anneCepTel', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="5XXXXXXXXX (10 hane)"
                  />
                  {errors.anneCepTel && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneCepTel.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Adresi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('anneIsAdresi')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="İş adresi bilgisi"
                  />
                  {errors.anneIsAdresi && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneIsAdresi.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* İletişim Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                İletişim Bilgileri
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* KVKK Onay */}
            <div className="pt-6 pb-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="kvkkOnay"
                  checked={kvkkOnay}
                  onChange={(e) => setKvkkOnay(e.target.checked)}
                  className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="kvkkOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                  <span className="text-red-500 font-semibold">*</span>{' '}
                  <Link 
                    href="/kvkk" 
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                  >
                    Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
                  </Link>
                  {' '}ni okudum, anladım ve kişisel verilerimin işlenmesine onay veriyorum.
                </label>
              </div>
              {!kvkkOnay && (
                <p className="mt-2 text-sm text-red-600">
                  Başvuruyu göndermek için KVKK aydınlatma metnini okumanız ve onaylamanız gerekmektedir.
                </p>
              )}
            </div>

            {/* Yarışma Onay Belgeleri */}
            <section className="pt-6 pb-4 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Yarışma Onay Belgeleri
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Lütfen aşağıdaki belgeleri okuyunuz ve her birini ayrı ayrı onaylayınız. Tüm onaylar tamamlanmadan başvuru yapılamaz.
              </p>

              {/* AYDINLATMA METNİ */}
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">EK-1: AYDINLATMA METNİ</h3>
                  <div className="bg-white p-4 rounded-lg border border-blue-200 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    <p className="mb-3">
                      <strong>"FÜTÜRİSTİK DÜŞÜNME"</strong> temalı kompozisyon yarışması kapsamında tarafımıza ilettiğiniz
                      size ve {watch('ogrenciAdSoyad') || 'öğrencinize'} ait tüm kişisel veriler bahse konu yarışma süresince gerekli kimlik
                      doğrulatmalarını yapmak, eser değerlendirme sürecini yürütmek, dereceye giren eserleri ilan etmek,
                      ödül töreni ile ilgili organizasyonları yapmak, eser basım, yayım, paylaşım ve iletim süreçlerini
                      gerçekleştirmek, gerekli hâllerde tarafınıza ulaşmak amacıyla kullanılacak olup hukuki
                      durumlarda ilgili makamlarca talep edilmesine bağlı olarak gerekli paylaşımların yapılması dışında
                      üçüncü kişilerle asla paylaşılmayacak ve etkinliğin tüm süreçlerinin sona ermesinin ardından resen
                      silinecektir.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="aydinlatmaMetniOnay"
                    checked={aydinlatmaMetniOnay}
                    onChange={(e) => setAydinlatmaMetniOnay(e.target.checked)}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="aydinlatmaMetniOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                    <span className="text-red-500 font-semibold">*</span> Aydınlatma Metnini okudum, anladım ve onaylıyorum.
                  </label>
                </div>
                {!aydinlatmaMetniOnay && (
                  <p className="mt-2 text-sm text-red-600">
                    Bu belgeyi onaylamadan başvuru yapılamaz.
                  </p>
                )}
              </div>

              {/* VELİ İZİN BELGESİ */}
              <div className="mb-6 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">EK-2: VELİ İZİN BELGESİ</h3>
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    <p className="mb-2"><strong>Katılımcının</strong></p>
                    <p className="mb-1">Adı ve Soyadı: <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Okulu: <strong className={watch('okul') ? 'text-indigo-700' : 'text-gray-400'}>{watch('okul') || '................................'}</strong></p>
                    <p className="mb-3">Sınıfı: <strong className={watch('ogrenciSinifi') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciSinifi') || '........'}</strong></p>
                    <p className="mb-3">
                      Velisi bulunduğum ve yukarıda açık kimliği yazılı oğlum/kızım <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciAdSoyad') || '................................'}</strong>'ın
                      Levent Koleji tarafından düzenlenen <strong>"FÜTÜRİSTİK DÜŞÜNME"</strong> temalı kompozisyon
                      yarışmasına katılmasına izin verdiğimi arz ederim.
                    </p>
                    <p className="mt-4 mb-1">Velisinin Adı ve Soyadı: <strong className={watch('babaAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('babaAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Tarih: <strong className="text-indigo-700">{new Date().toLocaleDateString('tr-TR')}</strong></p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="veliIzinOnay"
                    checked={veliIzinOnay}
                    onChange={(e) => setVeliIzinOnay(e.target.checked)}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="veliIzinOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                    <span className="text-red-500 font-semibold">*</span> Veli İzin Belgesini okudum, anladım ve onaylıyorum.
                  </label>
                </div>
                {!veliIzinOnay && (
                  <p className="mt-2 text-sm text-red-600">
                    Bu belgeyi onaylamadan başvuru yapılamaz.
                  </p>
                )}
              </div>

              {/* TELİF HAKLARI TAAHHÜTNAMESİ */}
              <div className="mb-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">EK-3: TELİF HAKLARI TAAHHÜTNAMESİ</h3>
                  <div className="bg-white p-4 rounded-lg border border-purple-200 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    <p className="mb-2"><strong>Katılımcının</strong></p>
                    <p className="mb-1">Adı ve Soyadı: <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Okulu: <strong className={watch('okul') ? 'text-indigo-700' : 'text-gray-400'}>{watch('okul') || '................................'}</strong></p>
                    <p className="mb-3">Sınıfı: <strong className={watch('ogrenciSinifi') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciSinifi') || '........'}</strong></p>
                    <p className="mb-3">
                      <strong>"FÜTÜRİSTİK DÜŞÜNME"</strong> temalı kompozisyon yarışması kapsamında tarafınıza iletilen eserin velisi
                      bulunduğum ve yukarıda açık kimliği yazılı oğlum / kızım <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciAdSoyad') || '................................'}</strong>'a
                      ait olduğunu, bahse konu eserin son halini gördüğümü ve onayladığımı, eserin başka bir yerde
                      kullanılmadığını, eserin diğer şahıslara ait olan telif haklarını ihlal etmediğini, telif hakkı tarafımızda saklı
                      kalmak koşuluyla eserin Levent Koleji tarafından yarışma faaliyetleri çerçevesinde oğlumun / kızımın
                      ismine yer verilerek basılmasına, yayımlanmasına, paylaşılmasına, kurum internet sitesi ve sosyal medya
                      hesaplarında sergilenmesine izin verdiğimi, eserin Levent Koleji arşivinde kalabileceğini, bu kapsamda
                      herhangi bir maddi talebim olmayacağını kabul, beyan ve taahhüt ederim.
                    </p>
                    <p className="mt-4 mb-1">Velisinin Adı ve Soyadı: <strong className={watch('babaAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('babaAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Tarih: <strong className="text-indigo-700">{new Date().toLocaleDateString('tr-TR')}</strong></p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="telifHaklariOnay"
                    checked={telifHaklariOnay}
                    onChange={(e) => setTelifHaklariOnay(e.target.checked)}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="telifHaklariOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                    <span className="text-red-500 font-semibold">*</span> Telif Hakları Taahhütnamesini okudum, anladım ve onaylıyorum.
                  </label>
                </div>
                {!telifHaklariOnay && (
                  <p className="mt-2 text-sm text-red-600">
                    Bu belgeyi onaylamadan başvuru yapılamaz.
                  </p>
                )}
              </div>

              {/* AÇIK RIZA ONAYI */}
              <div className="mb-6 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">EK-4: AÇIK RIZA ONAYI</h3>
                  <div className="bg-white p-4 rounded-lg border border-yellow-200 text-sm text-gray-700 max-h-60 overflow-y-auto">
                    <p className="mb-3">
                      6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında iş bu şartnamede yer alan EK-1 Aydınlatma
                      Metni ile tarafıma gerekli bilgilendirme yapılmıştır. Bu doğrultuda, işlendiği belirtilen bana ve
                      <strong className={watch('okul') ? 'text-indigo-700' : 'text-gray-400'}> {watch('okul') || '................................'}</strong>&apos;nda öğrenim gören velisi bulunduğum
                      <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}> {watch('ogrenciAdSoyad') || '................................'}</strong> adlı öğrenciye ait tüm kişisel verilerin <strong>&quot;FÜTÜRİSTİK DÜŞÜNME&quot;</strong> temalı
                      kompozisyon yarışması kapsamındaki faaliyet / etkinliklerin kamuoyu ile paylaşımı ve tanıtımı amacıyla,
                      Levent Koleji web siteleri ile sosyal medya hesaplarında paylaşılmasına
                    </p>
                    <p className="mb-2"><strong>Onay veriyorum……</strong></p>
                    <p className="mb-1">Velisinin Adı Soyadı: <strong className={watch('babaAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('babaAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Cep: <strong className={watch('babaCepTel') ? 'text-indigo-700' : 'text-gray-400'}>{watch('babaCepTel') || '................................'}</strong></p>
                    <p className="mb-2"><strong>Öğrencinin</strong></p>
                    <p className="mb-1">Adı Soyadı: <strong className={watch('ogrenciAdSoyad') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciAdSoyad') || '................................'}</strong></p>
                    <p className="mb-1">Okulu: <strong className={watch('okul') ? 'text-indigo-700' : 'text-gray-400'}>{watch('okul') || '................................'}</strong></p>
                    <p className="mb-1">Sınıfı: <strong className={watch('ogrenciSinifi') ? 'text-indigo-700' : 'text-gray-400'}>{watch('ogrenciSinifi') || '........'}</strong></p>
                    <p className="mt-2">Tarih: <strong className="text-indigo-700">{new Date().toLocaleDateString('tr-TR')}</strong></p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acikRizaOnay"
                    checked={acikRizaOnay}
                    onChange={(e) => setAcikRizaOnay(e.target.checked)}
                    className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="acikRizaOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                    <span className="text-red-500 font-semibold">*</span> Açık Rıza Onayını okudum, anladım ve onaylıyorum.
                  </label>
                </div>
                {!acikRizaOnay && (
                  <p className="mt-2 text-sm text-red-600">
                    Bu belgeyi onaylamadan başvuru yapılamaz.
                  </p>
                )}
              </div>

              {/* Kompozisyon Dosyası Yükleme */}
              <div className="mb-6 p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    "FÜTÜRİSTİK DÜŞÜNME" Temalı Kompozisyon Dosyası <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Lütfen kompozisyon dosyanızı yükleyiniz. (PDF, Word veya PowerPoint formatı, maksimum 1MB)
                  </p>
                  <div className="mt-4">
                    <label
                      htmlFor="dosya-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-white hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Dosya seçmek için tıklayın</span> veya sürükleyip bırakın
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPTX (MAX. 1MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // Dosya boyutu kontrolü (1MB)
                            if (file.size > 1 * 1024 * 1024) {
                              setSubmitError({ message: 'Dosya boyutu 1MB\'dan büyük olamaz.' })
                              e.target.value = ''
                              return
                            }
                            // Dosya tipi kontrolü
                            const allowedTypes = [
                              'application/pdf',
                              'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                            ]
                            const allowedExtensions = ['.pdf', '.doc', '.docx', '.pptx']
                            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
                            
                            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                              setSubmitError({ message: 'Sadece PDF, Word (.doc, .docx) veya PowerPoint (.pptx) dosyaları yüklenebilir.' })
                              e.target.value = ''
                              return
                            }
                            setSelectedFile(file)
                            setSubmitError(null)
                          }
                        }}
                        className="hidden"
                        id="dosya-upload"
                      />
                    </label>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null)
                              const input = document.getElementById('dosya-upload') as HTMLInputElement
                              if (input) input.value = ''
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !kvkkOnay || !aydinlatmaMetniOnay || !veliIzinOnay || !telifHaklariOnay || !acikRizaOnay || !selectedFile}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Başvurunuz Gönderiliyor...
                  </span>
                ) : (
                  'Başvuruyu Gönder'
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              <span className="text-red-500">*</span> ile işaretli alanlar zorunludur.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 Yarışma Başvuru Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </main>
    </div>
  )
}
