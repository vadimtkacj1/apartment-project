const nodemailer = require('nodemailer');

// Test SMTP connection with detailed logging
async function testSMTP() {
  console.log('\n🔍 Testing SMTP Configuration...\n');

  const config = {
    host: process.env.EMAIL_SERVER_HOST || 'smtp.titan.email',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    },
    requireTLS: true,
    tls: {
      minVersion: 'TLSv1.2'
    },
    debug: true,
    logger: true
  };

  // Validate required environment variables
  if (!config.auth.user || !config.auth.pass) {
    console.error('❌ Error: EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD environment variables are required');
    console.error('\nMake sure your .env file contains the SMTP credentials.\n');
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.auth.user}`);
  console.log(`  Pass: ${config.auth.pass.replace(/./g, '*')}`);
  console.log(`  TLS: ${config.requireTLS}\n`);

  const transporter = nodemailer.createTransport(config);

  try {
    console.log('📡 Verifying connection...\n');
    await transporter.verify();
    console.log('\n✅ SUCCESS! SMTP connection verified.\n');

    console.log('📧 Attempting to send test email...\n');
    const info = await transporter.sendMail({
      from: `"Ram Nekasim" <${config.auth.user}>`,
      to: 'vadim.tkach1378@gmail.com',
      subject: 'SMTP Test - Success!',
      text: 'If you receive this, SMTP is working correctly.',
      html: '<p>If you receive this, <strong>SMTP is working correctly</strong>.</p>'
    });

    console.log('\n✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);

  } catch (error) {
    console.error('\n❌ SMTP Test Failed:\n');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);

    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Possible causes:');
      console.error('   1. Password is incorrect');
      console.error('   2. Two-factor authentication is enabled (need app-specific password)');
      console.error('   3. SMTP access is disabled in Titan Email settings');
      console.error('   4. Account is locked or suspended\n');
      console.error('   → Log in to https://webmail.titan.email to verify');
    }

    console.error('\n');
    process.exit(1);
  }
}

testSMTP();
