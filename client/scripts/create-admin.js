// سكربت إنشاء أول مستخدم إداري
// الاستخدام:  node scripts/create-admin.js <username> <password> [fullName]
// مثال:        node scripts/create-admin.js admin MyStrongPass123 "ياسر العروي"

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const [username, password, fullName] = process.argv.slice(2);

  if (!username || !password) {
    console.error('\n❌ الاستخدام:  node scripts/create-admin.js <username> <password> [fullName]\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\n❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل\n');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      console.log(`\n⚠️  المستخدم "${username}" موجود بالفعل. سيتم تحديث كلمة المرور.\n`);
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.adminUser.update({
        where: { username },
        data: { passwordHash, fullName: fullName || existing.fullName },
      });
      console.log(`✅ تم تحديث كلمة مرور "${username}"\n`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.adminUser.create({
        data: { username, passwordHash, fullName: fullName || username },
      });
      console.log(`\n✅ تم إنشاء المستخدم الإداري:`);
      console.log(`   ID:       ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Name:     ${user.fullName}`);
      console.log(`\n🔐 سجّل الدخول من /login\n`);
    }
  } catch (err) {
    console.error('\n❌ خطأ:', err.message, '\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
