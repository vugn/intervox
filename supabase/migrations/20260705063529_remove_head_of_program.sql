-- 1. Pindahkan pengguna head_of_program menjadi administrator
UPDATE users 
SET role = 'administrator' 
WHERE role = 'head_of_program';

-- 2. Hapus constraint lama
ALTER TABLE users DROP CONSTRAINT users_role_check;

-- 3. Tambahkan constraint baru tanpa head_of_program
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'administrator', 'lecturer'));
