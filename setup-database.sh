#!/bin/bash

# NSS Database Setup Script
# This script will set up the Supabase database with the NSS schema and seed data

echo "🚀 Setting up NSS Database..."

# Database connection details
DB_URL="https://yjbiotmgzycfwhnvndiv.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYmlvdG1nenljZndobnZuZGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0NTkxNSwiZXhwIjoyMDY2MzIxOTE1fQ.S0ksaKSGHT7SKe4eWvuqv3_l24RbtMKI0DFmfbhm9Fk"

echo "📋 To set up your NSS database, please follow these steps:"
echo ""
echo "1. Go to your Supabase Dashboard: https://supabase.com/dashboard"
echo "2. Navigate to your project: https://supabase.com/dashboard/project/yjbiotmgzycfwhnvndiv"
echo "3. Go to SQL Editor"
echo "4. Copy and paste the schema.sql file content"
echo "5. Run the SQL to create tables"
echo "6. Copy and paste the seed.sql file content"
echo "7. Run the SQL to populate with sample data"
echo ""
echo "📁 Files to execute:"
echo "   - database/schema.sql (creates tables and structure)"
echo "   - database/seed.sql (adds sample data)"
echo ""
echo "✅ Once complete, your NSS backend will be connected to real Supabase data!"

# Test connection (requires curl)
echo ""
echo "🔍 Testing API connection..."
curl -s -o /dev/null -w "Health Check: %{http_code}\n" http://localhost:5000/api/health

echo ""
echo "🎯 Next steps after database setup:"
echo "1. Test API endpoints:"
echo "   curl http://localhost:5000/api/students"
echo "   curl http://localhost:5000/api/payment/logs"
echo "   curl http://localhost:5000/api/attendance/students"
echo ""
echo "2. Update frontend to use real API instead of mockData"
echo "3. Verify all data flows correctly"
