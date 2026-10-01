<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin';

    protected $description = 'Membuat akun admin melalui prompt interaktif tanpa password bawaan';

    public function handle(): int
    {
        $data = [
            'name' => $this->ask('Nama admin'),
            'email' => $this->ask('Email admin'),
            'password' => $this->secret('Password (minimal 12 karakter)'),
            'password_confirmation' => $this->secret('Konfirmasi password'),
        ];
        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12', 'max:255', 'confirmed'],
        ]);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }
        $user = new User;
        $user->fill(collect($data)->only(['name', 'email', 'password'])->all());
        $user->forceFill(['is_admin' => true, 'email_verified_at' => now()])->save();
        $this->info('Akun admin berhasil dibuat.');

        return self::SUCCESS;
    }
}
