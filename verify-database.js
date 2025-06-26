// Database Verification Script
// Run this after executing schema.sql and seed.sql in Supabase

const testEndpoints = [
  'http://localhost:5000/api/test/connection',
  'http://localhost:5000/api/students',
  'http://localhost:5000/api/coaches', 
  'http://localhost:5000/api/payments',
  'http://localhost:5000/api/attendance/students',
  'http://localhost:5000/api/drills'
];

async function verifyDatabase() {
  console.log('🔍 Verifying NSS Database Integration...\n');
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ ${endpoint} - Working`);
        if (Array.isArray(data.data)) {
          console.log(`   📊 Records: ${data.data.length}`);
        }
      } else {
        console.log(`❌ ${endpoint} - Failed: ${data.message}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Next: Test frontend at http://localhost:5173');
}

verifyDatabase();
