#!/usr/bin/env node

/**
 * SMTP Connection Test Script
 * Проверяет подключение к почтовому серверу
 *
 * Использование:
 *   node scripts/test-smtp.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log('\n🔍 Проверка SMTP настроек...\n');

  const config = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
  };

  // Показываем конфигурацию (без полного пароля)
  console.log('📋 Конфигурация:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' + config.password.slice(-4) : 'НЕ УКАЗАН'}`);
  console.log('');

  // Проверка наличия всех параметров
  if (!config.host || !config.port || !config.user || !config.password) {
    console.error('❌ Отсутствуют обязательные параметры в .env файле!');
    console.log('\nДобавьте в .env:');
    console.log('  EMAIL_SERVER_HOST=mail.privateemail.com');
    console.log('  EMAIL_SERVER_PORT=587');
    console.log('  EMAIL_SERVER_USER=info@ram-haim.co.il');
    console.log('  EMAIL_SERVER_PASSWORD=ваш_пароль');
    process.exit(1);
  }

  // Тест 1: Подключение с TLS (порт 587)
  console.log('🔄 Тест 1: Подключение через порт 587 (STARTTLS)...');
  try {
    const transporter587 = nodemailer.createTransport({
      host: config.host,
      port: 587,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      debug: true
    });

    await transporter587.verify();
    console.log('✅ Порт 587 работает!\n');

    // Пробуем отправить тестовое письмо
    console.log('📧 Отправка тестового письма...');
    await transporter587.sendMail({
      from: `"Test" <${config.user}>`,
      to: config.user,
      subject: 'Test Email - SMTP Working',
      text: 'Если вы получили это письмо, SMTP настроен правильно!',
      html: '<p>Если вы получили это письмо, <strong>SMTP настроен правильно!</strong></p>'
    });
    console.log('✅ Тестовое письмо отправлено на', config.user);
    console.log('');
    return true;

  } catch (error) {
    console.error('❌ Порт 587 не работает:', error.message);
    console.log('');
  }

  // Тест 2: Подключение с SSL (порт 465)
  console.log('🔄 Тест 2: Подключение через порт 465 (SSL)...');
  try {
    const transporter465 = nodemailer.createTransport({
      host: config.host,
      port: 465,
      secure: true,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true
    });

    await transporter465.verify();
    console.log('✅ Порт 465 работает!\n');

    console.log('💡 Рекомендация: Обновите .env файл:');
    console.log('   EMAIL_SERVER_PORT=465');
    console.log('');

    // Пробуем отправить тестовое письмо
    console.log('📧 Отправка тестового письма...');
    await transporter465.sendMail({
      from: `"Test" <${config.user}>`,
      to: config.user,
      subject: 'Test Email - SMTP Working',
      text: 'Если вы получили это письмо, SMTP настроен правильно!',
      html: '<p>Если вы получили это письмо, <strong>SMTP настроен правильно!</strong></p>'
    });
    console.log('✅ Тестовое письмо отправлено на', config.user);
    console.log('');
    return true;

  } catch (error) {
    console.error('❌ Порт 465 не работает:', error.message);
    console.log('');
  }

  // Оба теста провалились
  console.log('\n❌ Не удалось подключиться к SMTP серверу!\n');
  console.log('🔧 Возможные решения:\n');
  console.log('1. Проверьте пароль в панели управления Private Email:');
  console.log('   https://privateemail.com/');
  console.log('');
  console.log('2. Убедитесь, что используете правильные настройки:');
  console.log('   • Host: mail.privateemail.com');
  console.log('   • Port: 587 (STARTTLS) или 465 (SSL)');
  console.log('   • Email: info@ram-haim.co.il');
  console.log('   • Password: ваш реальный пароль от почты');
  console.log('');
  console.log('3. Возможно нужно создать App Password в настройках почты');
  console.log('');
  console.log('4. Проверьте, не заблокирован ли порт файерволом');
  console.log('');

  return false;
}

// Запуск теста
testSMTP()
  .then(success => {
    if (success) {
      console.log('🎉 Все работает! Форма контактов должна работать нормально.\n');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Критическая ошибка:', error.message);
    process.exit(1);
  });
