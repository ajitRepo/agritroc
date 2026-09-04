const fs = require('fs');
const path = require('path');

// Simple .env parser without external dependencies
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Process env takes priority (e.g. Render Dashboard)
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

// 1. Load .env.local first (dev overrides), then .env
loadEnvFile(path.join(__dirname, '..', '.env.local'));
loadEnvFile(path.join(__dirname, '..', '.env'));

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';
const directUrl = process.env.DIRECT_URL;

const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

if (isPostgres) {
  console.log('🚀 [Production Mode] PostgreSQL / Supabase detected');
  if (directUrl) {
    schema = schema.replace(
      /datasource db \{[\s\S]*?\}/,
      `datasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}`
    );
  } else {
    schema = schema.replace(
      /datasource db \{[\s\S]*?\}/,
      `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`
    );
  }
  fs.writeFileSync(schemaPath, schema);
  console.log('✓ prisma/schema.prisma set to provider = "postgresql"');
} else {
  console.log('💻 [Development Mode] Local SQLite database detected');
  schema = schema.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}`
  );
  fs.writeFileSync(schemaPath, schema);
  console.log('✓ prisma/schema.prisma set to provider = "sqlite"');
}
