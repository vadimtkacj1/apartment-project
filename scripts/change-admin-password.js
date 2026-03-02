/**
 * Скрипт для изменения пароля администратора
 *
 * Использование:
 * node scripts/change-admin-password.js <username> <новый-пароль>
 *
 * Пример:
 * node scripts/change-admin-password.js admin MyNewSecurePassword123!
 */

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use DATABASE_URL from environment, fallback to default
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function changePassword() {
  try {
    // Получаем аргументы командной строки
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.error('❌ Ошибка: Необходимо указать username и новый пароль');
      console.log('\nИспользование:');
      console.log('  node scripts/change-admin-password.js <username> <новый-пароль>');
      console.log('\nПример:');
      console.log('  node scripts/change-admin-password.js admin MyNewSecurePassword123!');
      process.exit(1);
    }

    const username = args[0];
    const newPassword = args[1];

    // Проверка сложности пароля
    if (newPassword.length < 8) {
      console.error('❌ Пароль должен содержать минимум 8 символов');
      process.exit(1);
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error(`❌ Пользователь "${username}" не найден`);
      process.exit(1);
    }

    // Хешируем новый пароль
    console.log('🔄 Хеширование нового пароля...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль в базе данных
    console.log('🔄 Обновление пароля в базе данных...');
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    });

    console.log(`✅ Пароль для пользователя "${username}" успешно изменен!`);
    console.log(`✅ Новый пароль: ${newPassword}`);
    console.log('\n⚠️  ВНИМАНИЕ: Сохраните новый пароль в безопасном месте!');

  } catch (error) {
    console.error('❌ Ошибка при изменении пароля:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

changePassword();
