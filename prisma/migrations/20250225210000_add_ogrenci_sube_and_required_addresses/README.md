# Migration: add_ogrenci_sube_and_required_addresses

This migration adds the new `ogrenciSube` column to the `Basvuru` table and
makes both `babaIsAdresi` and `anneIsAdresi` required fields with an empty
string (`''`) default value. Existing rows are updated to ensure they satisfy
the new NOT NULL constraint before it is enforced.


