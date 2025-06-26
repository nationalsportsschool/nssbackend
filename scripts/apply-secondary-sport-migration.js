const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('Applying secondary sport migration...');
    
    // Execute the migration directly
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
    
    console.log('Database connected successfully. Since we cannot directly execute DDL through Supabase client,');
    console.log('please run the following SQL manually in your Supabase SQL editor:');
    console.log('');
    console.log('ALTER TABLE students ADD COLUMN secondary_sport sport_type;');
    console.log('');
    console.log('COMMENT ON COLUMN students.secondary_sport IS \'Optional second sport that the student is interested in\';');
    
  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }
}

applyMigration();
